/**
 * Medical Inspection Reports System
 * @author Tarek Zhran
 * @version 1.0.0
 */

import {
    formatDate,
    formatTime,
    escapeHtml,
    generateReportId,
    showLoading,
    hideLoading,
    showStatus
} from './utils.js';

import {
    loadDatabase,
    getInspectors,
    getLocations,
    getEmployees,
    getPositions
} from './database.js';

const AppState = {
    absenceCount: 0,
    isReportGenerated: false,
    sentReports: new Set()
};

// =============================================================================
// Data Collection Functions
// =============================================================================

function collectAbsenceData() {
    const absencesList = [];
    const rows = document.querySelectorAll('#absenceRows .absence-row');
    
    rows.forEach((row, index) => {
        const nameInput = row.querySelector('input[type="text"]');
        const positionInput = row.querySelector('input[id^="employeePosition"]');
        const startNumber = row.querySelector('input[id^="startNumber"]');
        const endNumber = row.querySelector('input[id^="endNumber"]');
        
        if (nameInput?.value.trim()) {
            absencesList.push({
                id: index + 1,
                name: nameInput.value.trim(),
                position: positionInput?.value.trim() || '',
                startNumber: startNumber?.value || '',
                endNumber: endNumber?.value || ''
            });
        }
    });
    
    return absencesList;
}

function collectFormData() {
    return {
        inspectorName: document.getElementById('inspectorName')?.value.trim() || '',
        location: document.getElementById('location')?.value.trim() || '',
        date: document.getElementById('date')?.value || '',
        time: document.getElementById('time')?.value || '',
        absences: collectAbsenceData()
    };
}

// =============================================================================
// Report Generation Functions
// =============================================================================





/**
 * Generates the absence table HTML
 * @param {Array<Object>} absences - Array of absence records
 * @returns {string} HTML for the absence table
 * @throws {Error} If there's an error generating the table
 */
function generateAbsenceTable(absences) {
    try {
        if (!Array.isArray(absences)) {
            throw new Error('Invalid absences data: expected array');
        }
        
        let tableHTML = `
        <table class="absence-table" id="absenceTable" dir="rtl" role="table" aria-label="جدول الغياب">
            <thead>
                <tr>
                    <th scope="col" style="width: 23%">الوظيفة</th>
                    <th scope="col" style="width: 30%">الاسم</th>
                    <th scope="col" style="width: 25%">ملاحظات</th>
                    <th scope="col" style="width: 12%">عدد الحالات</th>
                    <th scope="col" style="width: 10%">م</th>
                </tr>
            </thead>
            <tbody>`;

        absences.forEach((absence, index) => {
            if (!absence || typeof absence !== 'object') {
                console.warn('Invalid absence record at index', index);
                return;
            }
            
            const position = absence.position || '';
            const name = absence.name || '';
            const startNumber = absence.startNumber || '';
            const endNumber = absence.endNumber || '';
            const casesCount = startNumber && endNumber ? (parseInt(endNumber) - parseInt(startNumber) + 1) : 0;
            
            tableHTML += `
            <tr>
                <td>${escapeHtml(position)}</td>
                <td>${escapeHtml(name)}</td>
                <td>مرفق كشف من ${startNumber || '_'} إلى ${endNumber || '_'}</td>
                <td>${casesCount || 0}</td>
                <td><strong>${index + 1}</strong></td>
            </tr>
        `;
        });

        // Fill remaining rows to maintain consistent table structure
        const totalRows = Math.max(6, absences.length);
        for (let i = absences.length + 1; i <= totalRows; i++) {
            tableHTML += `
            <tr>
                <td><strong>${i}</strong></td>
                <td></td>
                <td></td>
                <td></td>
                <td>مرفق كشف برقم</td>
            </tr>
        `;
        }

        tableHTML += '</tbody></table>';
        return tableHTML;
    } catch (error) {
        console.error('Error generating absence table:', error);
        showStatus('حدث خطأ في إنشاء جدول الغياب. يرجى المحاولة مرة أخرى.', 'error');
        return '<p class="error-message">حدث خطأ في إنشاء جدول الغياب</p>';
    }
}

/**
 * Generates the complete report HTML
 * @param {Object} data - Report data
 * @returns {string} Complete report HTML
 * @throws {Error} If there's an error generating the report
 */
function generateReportHTML(data) {
    try {
        if (!data || typeof data !== 'object') {
            throw new Error('Invalid report data: expected object');
        }
        
        const formattedDate = formatDate(data.date);
        const hasAbsences = Array.isArray(data.absences) && data.absences.length > 0;
        const absenceTableHTML = generateAbsenceTable(data.absences || []);

        return `
        <div class="report-header" role="banner">
            <div class="header-right">
                <div class="ministry-name">مديرية الشئون الصحية بالغربية</div>
                <div class="department-name">إدارة المراجعة الداخلية والحوكمة</div>
            </div>
            <div class="header-center">
                <div class="report-title">تقرير مرور</div>
                <div class="report-subtitle">للعرض على السيد الدكتور/ وكيل الوزارة</div>
            </div>
        </div>
        
        <div class="report-info-section">
            <div class="info-grid">
                <div class="info-item">
                    <label>اسم القائم بالمرور / </label>
                    <span>${escapeHtml(data.inspectorName || '')} (مفتش مالي وإداري)</span>
                </div>
                <div class="info-item">
                    <label>الجهة / </label>
                    <span>${escapeHtml(data.location || '')}</span>
                </div>
                <div class="info-item">
                    <label>تاريخ المرور / </label>
                    <span>${formattedDate}</span>
                </div>
                <div class="info-item">
                    <label>وقت المرور / </label>
                    <span>${formatTime(data.time)}</span>
                </div>
            </div>
        </div>
        
        <div class="result-section">
            <div class="result-title">نتيجة المرور</div>
            <div class="result-box">
                <div class="result-content">
                    <p>بالمرور على ${escapeHtml(data.location || '')} لعمل انضباط إداري للعاملين تبين لنا:</p>
                    <p class="result-finding">${hasAbsences ? 'وجود حالات غياب بدون إذن وهم كالآتي:-' : 'عدم وجود حالات غياب '}</p>
                    ${hasAbsences ? `
                    <div class="cases-count">
                        <span class="count-label">عدد الحالات:</span>
                        <span class="count-value">${data.absences.length}</span>
                    </div>
                    ` : ''}
                </div>
            </div>
            ${hasAbsences ? `
            <div class="absence-table-container">
                <table class="absence-table" role="table" aria-label="جدول حالات الغياب">
                    <thead>
                        <tr>
                            <th>م</th>
                            <th>الاسم</th>
                            <th>الوظيفة</th>
                            <th>الملاحظات</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.absences.map((absence, index) => `
                            <tr>
                                <td class="index-cell">${index + 1}</td>
                                <td class="name-cell">${escapeHtml(absence.name || '')}</td>
                                <td class="position-cell">${escapeHtml(absence.position || '')}</td>
                                <td class="notes-cell">${escapeHtml(absence.notes || '')}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            ` : ''}
        
        <div class="opinion-section">
            <div class="result-title">الرأي:</div>
            <div class="opinion-box">
                ${hasAbsences ? 
                    'إحالة التقرير لإدارة الشئون القانونية بالمديرية لإعمال شئونها حيال حالات الغياب عن العمل بدون إذن كما هو موضح بصدر التقرير.' :
                    'حفظ التقرير لعدم وجود حالات غياب  '}
            </div>
            <div class="closing-statement">
                <strong>والأمر معروض ومفوض لسيادتكم،،</strong><br>
                <strong>وتفضلوا سيادتكم بقبول وافر التقدير والاحترام،</strong>
            </div>
        </div>
        
        <div class="signatures-section">
            <div class="signature-box">
                <div class="signature-title">مدير الإدارة</div>
                <div class="signature-name">أ/عبدالله الجبالي</div>
            </div>
            <div class="signature-box">
                <div class="signature-title">-مفتش مالي وإداري</div>
                <div class="signature-name">${escapeHtml(data.inspectorName || '')}</div>
            </div>
        </div>
    `;
    } catch (error) {
        console.error('Error generating report HTML:', error);
        showStatus('حدث خطأ في إنشاء التقرير. يرجى المحاولة مرة أخرى.', 'error');
        throw new Error('حدث خطأ في إنشاء التقرير');
    }
}

/**
 * Main function to generate the report
 */
function generateReport() {
    showLoading();
    
    // إضافة نظام تسجيل للأخطاء
    const errorLogger = {
        log: function(error, context) {
            console.error(`[${new Date().toISOString()}] Error in ${context}:`, error);
            // يمكن إضافة إرسال الأخطاء لخدمة تتبع الأخطاء هنا
        }
    };
    
    setTimeout(() => {
        try {
            const data = collectFormData();
            
            if (!validateForm()) {
                hideLoading();
                return;
            }

            const reportHTML = generateReportHTML(data);
            const reportContainer = document.getElementById('reportContent');
            const reportPreview = document.getElementById('reportPreview');

            if (!reportContainer || !reportPreview) {
                throw new Error('Report elements not found in DOM');
            }

            reportContainer.innerHTML = reportHTML;
            reportPreview.style.display = 'block';
            reportPreview.classList.add('fade-in');

            const printBtn = document.getElementById('printBtn');
            const sendBtn = document.getElementById('sendBtn');
            const exportPdfBtn = document.getElementById('exportPdfBtn');
            
            ['printBtn', 'exportPdfBtn'].forEach(id => {
                const btn = document.getElementById(id);
                if (btn) {
                    btn.style.display = 'inline-flex';
                    btn.disabled = false;
                }
            });

            AppState.isReportGenerated = true;
            hideLoading();
            showStatus('تم إنشاء التقرير بنجاح', 'success');
            
            // Scroll to the report
            reportPreview.scrollIntoView({ behavior: 'smooth' });
            
            // Log successful report generation
            console.log('Report generated successfully:', {
                inspector: data.inspectorName,
                location: data.location,
                date: data.date,
                time: data.time,
                absenceCount: data.absences.length
            });
        } catch (error) {
            console.error('Error generating report:', error);
            hideLoading();
            showStatus('حدث خطأ في إنشاء التقرير. يرجى المحاولة مرة أخرى.', 'error');
        }
    }, 1000);
}

// =============================================================================
// Export Functions
// =============================================================================

/**
 * Exports the report as PDF
 */
function exportReportAsPDF() {
    if (!AppState.isReportGenerated) {
        showStatus('⚠️ يرجى إنشاء التقرير أولاً قبل التصدير', 'error');
        return;
    }
    
    showLoading(true, 'جاري تصدير التقرير كملف PDF...');
    setTimeout(() => {
        hideLoading();
        showStatus('لتصدير التقرير كملف PDF، استخدم خيار "حفظ كـ PDF" في نافذة الطباعة', 'success');
        printReport();
    }, 1000);
}

function printReport() {
    if (!AppState.isReportGenerated) {
        showStatus('⚠️ يرجى إنشاء التقرير أولاً قبل الطباعة', 'error');
        return;
    }
    
    const elementsToHide = document.querySelectorAll('.app-header, .form-container, .actions, .status-message');
    elementsToHide.forEach(el => el?.classList.add('no-print'));
    
    window.print();
    
    setTimeout(() => {
        elementsToHide.forEach(el => el?.classList.remove('no-print'));
    }, 1000);
    
    showStatus('جاري طباعة التقرير...', 'success');
}

// =============================================================================
// UI Functions
// =============================================================================

/**
 * Sets up autocomplete functionality for input fields
 * @param {string} inputId - ID of the input element
 * @param {string} suggestionsId - ID of the suggestions container
 * @param {Array} dataArray - Array of data for autocomplete
 * @throws {Error} If there's an error setting up autocomplete
 */
function setupAutoComplete(inputId, suggestionsId, dataArray) {
    try {
        if (!inputId || !suggestionsId || !Array.isArray(dataArray)) {
            console.error('Invalid parameters for autocomplete setup');
            return;
        }
        
        const input = document.getElementById(inputId);
        const suggestionsDiv = document.getElementById(suggestionsId);
        
        // استخدام debounce لتحسين أداء البحث
        const debounceTimeout = 300;
        let debounceTimer;
        
        if (!input || !suggestionsDiv) {
            console.error('Elements not found for autocomplete setup');
            return;
        }
        
        // Add ARIA attributes for accessibility
        input.setAttribute('aria-autocomplete', 'list');
        input.setAttribute('aria-expanded', 'false');
        input.setAttribute('aria-owns', suggestionsId);
        
        input.addEventListener('input', function() {
            try {
                const value = this.value.trim().toLowerCase();
                
                // Update ARIA attributes
                input.setAttribute('aria-expanded', value.length > 0 ? 'true' : 'false');
                
                if (value.length === 0) {
                    suggestionsDiv.style.display = 'none';
                    return;
                }
                
                const filtered = dataArray.filter(item => {
                    if (typeof item !== 'string') return false;
                    const lowerItem = item.toLowerCase();
                    return lowerItem.includes(value) || 
                           item.split(' ').some(word => {
                               if (typeof word !== 'string') return false;
                               return word.toLowerCase().startsWith(value);
                           });
                });
                
                if (filtered.length === 0) {
                    suggestionsDiv.style.display = 'none';
                    return;
                }
                
                suggestionsDiv.innerHTML = filtered.slice(0, 8).map((item, index) => {
                    if (typeof item !== 'string') return '';
                    return `<div class="suggestion-item" role="option" id="${suggestionsId}-item-${index}" onclick="selectSuggestion('${inputId}', '${escapeHtml(item).replace(/'/g, "\\'")}')">${escapeHtml(item)}</div>`;
                }).join('');
                
                suggestionsDiv.style.display = 'block';
            } catch (error) {
                console.error('Error in autocomplete input handler:', error);
                suggestionsDiv.style.display = 'none';
            }
        });
        
        input.addEventListener('blur', function() {
            setTimeout(() => {
                if (suggestionsDiv) {
                    suggestionsDiv.style.display = 'none';
                    input.setAttribute('aria-expanded', 'false');
                }
            }, 200);
        });
        
        input.addEventListener('keydown', function(e) {
            try {
                const suggestions = suggestionsDiv.querySelectorAll('.suggestion-item');
                
                if (suggestions.length === 0) return;
                
                let activeIndex = -1;
                
                suggestions.forEach((item, index) => {
                    if (item.classList.contains('active')) {
                        activeIndex = index;
                    }
                });
                
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    activeIndex = (activeIndex + 1) % suggestions.length;
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    activeIndex = activeIndex <= 0 ? suggestions.length - 1 : activeIndex - 1;
                } else if (e.key === 'Enter' && activeIndex >= 0) {
                    e.preventDefault();
                    if (suggestions[activeIndex]) {
                        suggestions[activeIndex].click();
                    }
                    return;
                } else if (e.key === 'Escape') {
                    suggestionsDiv.style.display = 'none';
                    input.setAttribute('aria-expanded', 'false');
                    return;
                }
                
                suggestions.forEach((item, index) => {
                    if (item) {
                        item.classList.toggle('active', index === activeIndex);
                        item.setAttribute('aria-selected', index === activeIndex);
                    }
                });
            } catch (error) {
                console.error('Error in autocomplete keydown handler:', error);
            }
        });
    } catch (error) {
        console.error('Error setting up autocomplete:', error);
        showStatus('حدث خطأ في إعداد نظام الإكمال التلقائي. يرجى المحاولة مرة أخرى.', 'error');
    }
}

/**
 * Selects a suggestion from the autocomplete list
 * @param {string} inputId - ID of the input element
 * @param {string} value - Value to set in the input
 * @throws {Error} If there's an error selecting the suggestion
 */
function selectSuggestion(inputId, value) {
    try {
        if (!inputId || value === undefined) {
            console.error('Invalid parameters for suggestion selection');
            return;
        }
        
        const input = document.getElementById(inputId);
        const suggestionsDiv = document.getElementById(inputId + 'Suggestions');
        
        if (input) {
            input.value = value;
            // Trigger input event for validation
            input.dispatchEvent(new Event('input'));
        }
        
        if (suggestionsDiv) {
            suggestionsDiv.style.display = 'none';
            
            // Visual feedback for selection
            input.style.borderColor = '#48bb78';
            setTimeout(() => {
                if (input) {
                    input.style.borderColor = '#667eea';
                }
            }, 500);
        }
    } catch (error) {
        console.error('Error selecting suggestion:', error);
        showStatus('حدث خطأ في اختيار الاقتراح. يرجى المحاولة مرة أخرى.', 'error');
    }
}

/**
 * Sets up employee name input without autocomplete
 * @param {string} nameInputId - ID of the employee name input
 * @param {string} positionInputId - ID of the position select
 * @throws {Error} If there's an error setting up employee input
 */
function setupEmployeeInput(nameInputId, positionInputId) {
    const nameInput = document.getElementById(nameInputId);
    const positionInput = document.getElementById(positionInputId);
    
    if (!nameInput || !positionInput) return;
    
    nameInput.addEventListener('input', function() {
        const name = this.value.trim();
        if (name && database?.employees && !database.employees.includes(name)) {
            database.employees.push(name);
        }
    });
    
    positionInput.addEventListener('input', function() {
        const position = this.value.trim();
        if (position && database?.positions && !database.positions.includes(position)) {
            database.positions.push(position);
        }
    });

nameInput.addEventListener('input', function() {
    try {
        const name = this.value.trim();
        if (name && database && Array.isArray(database.employees)) {
            if (!database.employees.includes(name)) {
                database.employees.push(name);
            }
        }
    } catch (error) {
        console.error('Error in employee name input handler:', error);
    }
});

/**
 * Adds a new absence row to the form
 */
function addAbsenceRow() {
    try {
        AppState.absenceCount++;
        const absenceRows = document.getElementById('absenceRows');
        
        if (!absenceRows) {
            console.error('Absence rows container not found');
            showStatus('حدث خطأ في إضافة صف الغياب. يرجى إعادة تحميل الصفحة.', 'error');
            return;
        }
        
        // استخدام DocumentFragment لتحسين الأداء
        const fragment = document.createDocumentFragment();
        
        const rowDiv = document.createElement('div');
        rowDiv.className = 'absence-row slide-up';
        rowDiv.setAttribute('role', 'group');
        rowDiv.setAttribute('aria-label', `صف الغياب ${AppState.absenceCount}`);
        rowDiv.innerHTML = `
        <div class="form-group">
            <label for="employeeName${AppState.absenceCount}"><i class="fas fa-user"></i> الاسم</label>
            <div style="position: relative;">
                <input type="text" id="employeeName${AppState.absenceCount}" placeholder="ادخل اسم الموظف" aria-describedby="employeeName${AppState.absenceCount}-help">
                <i class="fas fa-user input-icon"></i>
            </div>
            <div id="employeeName${AppState.absenceCount}-help" class="sr-only">أدخل اسم الموظف</div>
        </div>
        <div class="form-group">
            <label for="employeePosition${AppState.absenceCount}"><i class="fas fa-briefcase"></i> الوظيفة</label>
            <input type="text" id="employeePosition${AppState.absenceCount}" placeholder="أدخل الوظيفة" aria-describedby="employeePosition${AppState.absenceCount}-help">
            <div id="employeePosition${AppState.absenceCount}-help" class="sr-only">اختر وظيفة الموظف</div>
        </div>
                    <div class="form-group numbers-group">
                <div class="number-inputs">
                    <div class="number-input">
                        <label for="startNumber${AppState.absenceCount}"><i class="fas fa-sort-numeric-down"></i> من رقم</label>
                        <input type="number" 
                            id="startNumber${AppState.absenceCount}" 
                            min="1"
                            placeholder="رقم البداية"
                            aria-describedby="startNumber${AppState.absenceCount}-help"
                            onchange="updateCasesCount(${AppState.absenceCount})"
                        >
                    </div>
                    <div class="number-input">
                        <label for="endNumber${AppState.absenceCount}"><i class="fas fa-sort-numeric-up"></i> إلى رقم</label>
                        <input type="number" 
                            id="endNumber${AppState.absenceCount}" 
                            min="1"
                            placeholder="رقم النهاية"
                            aria-describedby="endNumber${AppState.absenceCount}-help"
                            onchange="updateCasesCount(${AppState.absenceCount})"
                        >
                    </div>
                </div>
                <div id="casesCount${AppState.absenceCount}" class="cases-count">
                    عدد الحالات: <span>0</span>
                </div>
            </div>
            <div class="form-group">
                <label style="opacity: 0;" for="removeBtn${AppState.absenceCount}">حذف</label>
                <button type="button" id="removeBtn${AppState.absenceCount}" class="btn btn-danger" onclick="removeAbsenceRow(this)" title="حذف هذه الحالة" aria-label="حذف حالة الغياب">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
    `;
        
        absenceRows.appendChild(rowDiv);
        setupEmployeeInput(`employeeName${AppState.absenceCount}`, `employeePosition${AppState.absenceCount}`);
        
        // Focus on the new input field
        setTimeout(() => {
            const newInput = document.getElementById(`employeeName${AppState.absenceCount}`);
            if (newInput) {
                newInput.focus();
            }
            rowDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
        
        console.log(`Added absence row ${AppState.absenceCount}`);
    } catch (error) {
        console.error('Error adding absence row:', error);
        AppState.absenceCount--;
        showStatus('حدث خطأ في إضافة صف الغياب. يرجى المحاولة مرة أخرى.', 'error');
    }
}

/**
 * Removes an absence row from the form
 * @param {HTMLElement} btn - The delete button that was clicked
 * @throws {Error} If there's an error removing the row
 */
function removeAbsenceRow(btn) {
    const row = btn.closest('.absence-row');
    if (!row) return;
    
    row.style.transform = 'translateX(100%)';
    row.style.opacity = '0';
    
    setTimeout(() => {
        row.remove();
        updateRowNumbers();
        showStatus('تم حذف حالة الغياب بنجاح', 'success');
    }, 300);
}

/**
 * Updates row numbers after adding/removing rows
 */
function updateRowNumbers() {
    try {
        const rows = document.querySelectorAll('.absence-row');
        
        if (!rows || rows.length === 0) {
            AppState.absenceCount = 0;
            return;
        }
        
        // تحديث عداد الغياب
        AppState.absenceCount = rows.length;
        
        // إضافة المناصب والأسماء المدخلة حديثاً إلى قاعدة البيانات
        const newPositions = new Set();
        const newEmployees = new Set();
        
        rows.forEach(row => {
            const positionSelect = row.querySelector('select');
            const nameInput = row.querySelector('input[type="text"]');
            
            if (nameInput && nameInput.value.trim()) {
                newEmployees.add(nameInput.value.trim());
            }
            if (positionSelect && positionSelect.value.trim()) {
                newPositions.add(positionSelect.value.trim());
            }
        });
        
        // تحديث قاعدة البيانات
        if (database) {
            database.positions = Array.from(new Set([...database.positions, ...newPositions]));
            database.employees = Array.from(new Set([...database.employees, ...newEmployees]));
        }
        
        rows.forEach((row, index) => {
            try {
                const inputs = row.querySelectorAll('input, select, button');
                
                if (!inputs || inputs.length === 0) {
                    return;
                }
                
                inputs.forEach(input => {
                    try {
                        if (!input || !input.id) {
                            return;
                        }
                        
                        const oldId = input.id;
                        const newId = oldId.replace(/\d+$/, index + 1);
                        input.id = newId;
                        
                        // Update labels and aria attributes
                        if (input.tagName === 'INPUT' || input.tagName === 'SELECT') {
                            const label = row.querySelector(`label[for="${oldId}"]`);
                            if (label) {
                                label.setAttribute('for', newId);
                            }
                            
                            const helpText = document.getElementById(`${oldId}-help`);
                            if (helpText) {
                                helpText.id = `${newId}-help`;
                            }
                        }
                        
                        // Update onclick handlers for buttons
                        if (input.tagName === 'BUTTON' && input.onclick) {
                            input.setAttribute('onclick', `removeAbsenceRow(this)`);
                        }
                    } catch (error) {
                        console.error('Error updating input ID:', error);
                    }
                });
                
                // Update row aria-label
                row.setAttribute('aria-label', `صف الغياب ${index + 1}`);
            } catch (error) {
                console.error('Error updating row:', error);
            }
        });
    } catch (error) {
        console.error('Error updating row numbers:', error);
    }
}

/**
 * Prints the generated report
 */
function printReport() {
    try {
        // Validate that a report has been generated
        if (!AppState.isReportGenerated) {
            showStatus('⚠️ يرجى إنشاء التقرير أولاً قبل الطباعة', 'error');
            return;
        }
        
        // Hide UI elements that shouldn't be printed
        const elementsToHide = document.querySelectorAll('.app-header, .form-container, .actions, .status-message');
        
        if (elementsToHide) {
            elementsToHide.forEach(el => {
                if (el && el.style) {
                    el.classList.add('no-print');
                }
            });
        }
        
        // Print the document
        window.print();
        
        // Restore UI elements after print
        setTimeout(() => {
            if (elementsToHide) {
                elementsToHide.forEach(el => {
                    if (el && el.style) {
                        el.classList.remove('no-print');
                    }
                });
            }
        }, 1000);
        
        showStatus('جاري طباعة التقرير...', 'success');
        console.log('Report printed successfully');
    } catch (error) {
        console.error('Error printing report:', error);
        showStatus('حدث خطأ في الطباعة. يرجى المحاولة مرة أخرى.', 'error');
    }
}

// =============================================================================
// Form Validation
// =============================================================================

/**
 * Validates the main form
 * @returns {boolean} True if form is valid, false otherwise
 */
function validateForm() {
    const inspectorName = document.getElementById('inspectorName');
    const location = document.getElementById('location');
    const date = document.getElementById('date');
    const time = document.getElementById('time');
    
    if (!inspectorName?.value.trim()) {
        showStatus('⚠️ يرجى إدخال اسم القائم بالمرور', 'error');
        inspectorName?.focus();
        return false;
    }
    
    if (!location?.value.trim()) {
        showStatus('⚠️ يرجى إدخال اسم الجهة', 'error');
        location?.focus();
        return false;
    }
    
    if (!date?.value) {
        showStatus('⚠️ يرجى إدخال تاريخ المرور', 'error');
        date?.focus();
        return false;
    }
    
    if (!time?.value) {
        showStatus('⚠️ يرجى إدخال وقت المرور', 'error');
        time?.focus();
        return false;
    }
    
    const selectedDate = new Date(date.value);
    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);
    
    if (selectedDate > today) {
        showStatus('⚠️ لا يمكن أن يكون تاريخ المرور في المستقبل', 'error');
        date.focus();
        return false;
    }
    
    if (selectedDate < oneYearAgo) {
        showStatus('⚠️ تاريخ المرور قديم جداً', 'error');
        date.focus();
        return false;
    }
    
    const absenceRows = document.querySelectorAll('#absenceRows .absence-row');
    if (absenceRows.length > 0) {
        const hasValidAbsence = Array.from(absenceRows).some(row => 
            row.querySelector('input[type="text"]')?.value.trim()
        );
        
        if (!hasValidAbsence && !confirm('لا توجد حالات غياب مدخلة. هل تريد المتابعة بدون حالات غياب؟')) {
            return false;
        }
    }
    
    return true;
}

/**
 * Clears the entire form
 */
function clearForm() {
    if (!confirm('هل أنت متأكد من رغبتك في مسح جميع البيانات؟')) return;
    
    document.getElementById('reportForm')?.reset();
    document.getElementById('absenceRows').innerHTML = '';
    document.getElementById('reportPreview').style.display = 'none';
    
    ['printBtn', 'sendBtn', 'exportPdfBtn'].forEach(id => {
        document.getElementById(id).style.display = 'none';
    });
    
    AppState.absenceCount = 0;
    AppState.isReportGenerated = false;
    
    const now = new Date();
    document.getElementById('date').value = now.toISOString().split('T')[0];
    document.getElementById('time').value = now.toTimeString().slice(0, 5);
    
    addAbsenceRow();
    showStatus('تم مسح النموذج بنجاح! ✨', 'success');
}

// =============================================================================
// Data Export Functions
// =============================================================================

/**
 * Sends data to Google Sheets
 */
async function sendToGoogleSheets() {
    try {
        // Validate that a report has been generated
        if (!AppState.isReportGenerated) {
            showStatus('⚠️ يرجى إنشاء التقرير أولاً قبل الإرسال', 'error');
            return;
        }
        
        const data = collectFormData();
        const reportId = generateReportId(data);
        
        if (AppState.sentReports.has(reportId)) {
            showStatus('تم إرسال هذا التقرير مسبقاً. لا يمكن الإرسال مرة أخرى لتجنب التكرار.', 'error');
            return;
        }
        
        showLoading(true, 'جاري إرسال البيانات...');
        
        // Send data to Google Sheets with the correct structure
        await sendToRealGoogleSheets(data);
        
        AppState.sentReports.add(reportId);
        
        showStatus('تم إرسال البيانات بنجاح لجوجل شيتس! ✅', 'success');
        console.log('Data sent to Google Sheets:', data);
    } catch (error) {
        console.error('Error sending to Google Sheets:', error);
        // Provide more specific error messages based on the error type
        if (error.message.includes('Google Apps Script web app is not properly configured')) {
            showStatus('خطأ في إعداد Google Apps Script. يرجى مراجعة ملف GOOGLE_SHEETS_TROUBLESHOOTING.md للحصول على تعليمات الإصلاح.', 'error');
        } else if (error.message.includes('Failed to fetch')) {
            showStatus('فشل في الاتصال بـ Google Sheets. يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى.', 'error');
        } else if (error.message.includes('Invalid response')) {
            showStatus('استجابة غير صحيحة من Google Sheets. يرجى التحقق من إعدادات Google Apps Script.', 'error');
        } else {
            showStatus('حدث خطأ في إرسال البيانات: ' + error.message, 'error');
        }
    } finally {
        showLoading(false);
    }
}

/**
 * Sends data to a real Google Sheet using Google Apps Script
 * @param {Object} data - Data to send
 * @returns {Promise} Promise that resolves after sending data
 */
async function sendToRealGoogleSheets(data) {
    // Using your provided Google Apps Script web app URL
    const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxSMXxfqxfQ4_x00ydjA_I9vAXre5HLT6jEafVk6uFCMM-9niITztvHdXh5VKvu06Q/exec';
    
    try {
        console.log('Sending data to Google Sheets:', data);
        
        const response = await fetch(WEB_APP_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                // Format data according to your Google Sheet structure:
                date: data.date || '',
                time: data.time || '',
                inspector: data.inspectorName || '',
                location: data.location || '',
                countAbsence: Array.isArray(data.absences) ? data.absences.length : 0
            })
        });
        
        console.log('Response status:', response.status);
        console.log('Response headers:', [...response.headers.entries()]);
        
        // Check if we're being redirected to a login page
        const redirectUrl = response.headers.get('location');
        if (response.status === 302 && redirectUrl && redirectUrl.includes('accounts.google.com')) {
            throw new Error('Google Apps Script web app is not properly configured for public access. Please check the deployment settings in Google Apps Script and ensure "Anyone" or "Anyone with Google" has access.');
        }
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response from Google Sheets:', errorText);
            throw new Error(`Failed to send data to Google Sheets: ${response.status} ${response.statusText}. ${errorText}`);
        }
        
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const responseText = await response.text();
            console.error('Non-JSON response from Google Sheets:', responseText);
            throw new Error('Invalid response from Google Sheets. Please check your Google Apps Script configuration.');
        }
        
        const result = await response.json();
        console.log('Success response from Google Sheets:', result);
        
        if (!result.success) {
            throw new Error(result.message || 'Failed to send data to Google Sheets');
        }
        
        return result;
    } catch (error) {
        console.error('Error in sendToRealGoogleSheets:', error);
        
        // Provide more specific error messages
        if (error.message.includes('Google Apps Script web app is not properly configured')) {
            throw new Error('خطأ في إعداد Google Apps Script: ' + error.message);
        } else if (error.message.includes('Failed to fetch')) {
            throw new Error('فشل في الاتصال بـ Google Sheets. يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى.');
        } else {
            throw error;
        }
    }
}

/**
 * Simulates the Google Sheets API with the correct column structure
 * @param {Object} data - Data to send
 * @returns {Promise} Promise that resolves after a delay
 */
async function simulateGoogleSheetsAPI(data) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                if (!data || typeof data !== 'object') {
                    throw new Error('Invalid data');
                }
                
                // Format data according to your Google Sheet structure:
                // Date | Time | Inspector | Location | Count absence
                const sheetData = {
                    date: data.date || '',
                    time: data.time || '',
                    inspector: data.inspectorName || '',
                    location: data.location || '',
                    countAbsence: Array.isArray(data.absences) ? data.absences.length : 0
                };
                
                console.log('🔄 بيانات مرسلة لجوجل شيتس بالتنسيق المطلوب:', sheetData);
                resolve(sheetData);
            } catch (error) {
                console.error('Error in Google Sheets simulation:', error);
                reject(error);
            }
        }, 2000);
    });
}

// =============================================================================
// Application Initialization
// =============================================================================

/**
 * Initializes the application when the DOM is loaded
 */
async function initializeApp() {
    showLoading(true, 'جاري تحميل النظام...');
    
    try {
        await loadDatabase();
        
        // تعيين التاريخ والوقت الحالي
        const now = new Date();
        document.getElementById('date')?.value = now.toISOString().split('T')[0];
        document.getElementById('time')?.value = now.toTimeString().slice(0, 5);
        
        // إضافة مستمعي الأحداث للأزرار
        document.getElementById('generateReportBtn')?.addEventListener('click', generateReport);
        document.getElementById('printBtn')?.addEventListener('click', printReport);
        document.getElementById('exportPdfBtn')?.addEventListener('click', exportReportAsPDF);
        document.getElementById('clearFormBtn')?.addEventListener('click', clearForm);
        document.getElementById('addAbsenceBtn')?.addEventListener('click', addAbsenceRow);
        
        // إعداد النموذج
        setupAutoComplete('inspectorName', 'inspectorSuggestions', getInspectors());
        setupAutoComplete('location', 'locationSuggestions', getLocations());
        addAbsenceRow();
        
        // إعداد مستمعي الأحداث للنموذج والأزرار
        document.getElementById('reportForm')?.addEventListener('submit', e => {
            e.preventDefault();
            generateReport();
        });
        
        // تعيين مستمعي الأحداث للأزرار
        const buttons = {
            'printBtn': printReport,
            'exportPdfBtn': exportReportAsPDF,
            'clearFormBtn': clearForm,
            'addAbsenceBtn': addAbsenceRow
        };
        
        Object.entries(buttons).forEach(([id, handler]) => {
            document.getElementById(id)?.addEventListener('click', handler);
        });
        
        // اختصارات لوحة المفاتيح
        document.addEventListener('keydown', e => {
            if (e.ctrlKey && e.key === 'p' && document.getElementById('printBtn')?.style.display !== 'none') {
                e.preventDefault();
                printReport();
            } else if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                generateReport();
            } else if (e.ctrlKey && e.key === 'n') {
                e.preventDefault();
                clearForm();
            }
        });
        
        // إخفاء الاقتراحات عند النقر خارجها
        document.addEventListener('click', e => {
            if (!e.target.closest('.form-group')) {
                document.querySelectorAll('.suggestions').forEach(s => s.style.display = 'none');
            }
        });
        
        document.body?.classList.add('loaded');
        hideLoading();
        showStatus('تم تحميل النظام بنجاح! 🚀', 'success');
    } catch (error) {
        console.error('Error:', error);
        hideLoading();
        showStatus('حدث خطأ في تهيئة التطبيق. يرجى إعادة تحميل الصفحة.', 'error');
    }
}

// =============================================================================
// Global Error Handling
// =============================================================================

window.addEventListener('error', function(e) {
    try {
        console.error('❌ Application error:', e.error);
        showStatus('حدث خطأ غير متوقع. يرجى إعادة تحميل الصفحة.', 'error');
    } catch (error) {
        console.error('Error in global error handler:', error);
    }
});

// =============================================================================
// Export Functions for Global Access
// =============================================================================

// Make certain functions globally accessible for inline event handlers
window.generateReport = generateReport;
window.printReport = printReport;
window.exportReportAsPDF = exportReportAsPDF;
window.sendToGoogleSheets = sendToGoogleSheets;
window.clearForm = clearForm;
window.addAbsenceRow = addAbsenceRow;
window.removeAbsenceRow = removeAbsenceRow;
window.selectSuggestion = selectSuggestion;

/**
 * Updates the cases count based on start and end numbers
 * @param {number} rowIndex - The index of the absence row
 */
function updateCasesCount(rowIndex) {
    const startInput = document.getElementById(`startNumber${rowIndex}`);
    const endInput = document.getElementById(`endNumber${rowIndex}`);
    const casesCountElement = document.getElementById(`casesCount${rowIndex}`);
    
    if (!startInput || !endInput || !casesCountElement) return;
    
    const start = parseInt(startInput.value) || 0;
    const end = parseInt(endInput.value) || 0;
    
    if (start && end) {
        if (end < start) {
            showStatus('رقم النهاية يجب أن يكون أكبر من أو يساوي رقم البداية', 'error');
            endInput.value = '';
            casesCountElement.querySelector('span').textContent = '0';
            return;
        }
        casesCountElement.querySelector('span').textContent = end - start + 1;
    } else {
        casesCountElement.querySelector('span').textContent = '0';
    }
}

// جعل الوظائف متاحة عالمياً للأزرار
window.generateReport = generateReport;
window.printReport = printReport;
window.exportReportAsPDF = exportReportAsPDF;
window.clearForm = clearForm;
window.addAbsenceRow = addAbsenceRow;
window.removeAbsenceRow = removeAbsenceRow;
window.updateCasesCount = updateCasesCount;
window.selectSuggestion = selectSuggestion;

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);
}