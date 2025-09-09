/**
 * Main application logic for the Medical Inspection Reports System
 * 
 * This module handles all the core functionality of the application including
 * form handling, report generation, data management, and user interactions.
 * 
 * @author Tarek Zhran
 * @version 1.0.0
 */

// Import utility functions
import {
    MONTHS,
    DAYS,
    formatDate,
    formatTime,
    escapeHtml,
    generateReportId,
    showLoading,
    hideLoading,
    showStatus
} from './utils.js';

// =============================================================================
// Application State
// =============================================================================

/**
 * Application state management
 * @namespace AppState
 */
const AppState = {
    sentReports: new Set(),
    absenceCount: 0,
    isReportGenerated: false,
    
    /**
     * Database of predefined values
     * @property {Array<string>} inspectors - List of inspector names
     * @property {Array<string>} locations - List of locations
     * @property {Array<string>} employees - List of employee names
     * @property {Array<string>} positions - List of job positions
     */
    database: {
        inspectors: [
            'الطارق زهران',
            'أحمد محمد علي السيد',
            'فاطمة حسن محمد أحمد',
            'محمد عبد الرحمن الطيب',
            'نور الدين أحمد عبد الله',
            'سعاد محمود حسين',
            'عبد الله عبد الغني الجبالي',
            'مريم السيد محمد',
            'حسام الدين محمد علي',
            'ليلى عبد العزيز إبراهيم',
            'خالد أحمد محمود',
            'نادية حسين عبد الرحمن',
            'طارق السيد أحمد',
            'منى عبد الحميد محمد'
        ],
        locations: [
            'مستشفى سمنود المركزي',
            'مستشفى صدر المحلة الكبرى',
            'مستشفى طنطا العام',
            'مستشفى كفر الزيات المركزي',
            'مستشفى المحلة الكبرى العام',
            'مستشفى بسيون المركزي',
            'مستشفى زفتى العام',
            'مستشفى قطور المركزي',
            'مستشفى السنطة المركزي',
            'مركز صحي طنطا الشامل',
            'مركز صحي المحلة الكبرى',
            'مركز صحي كفر الزيات',
            'مركز صحي سمنود',
            'مركز صحي بسيون',
            'مركز صحي زفتى'
        ],
        employees: [
            'إبراهيم حمزة زايد',
            'جهاد أنور عبد الستار',
            'إيمان مجد رمضان',
            'إسلام مسعد السيد',
            'محمود شلبي الخولي',
            'محمد عبد الوهاب أحمد',
            'أحمد علي حسن محمد',
            'فاطمة محمد سالم',
            'عمر عبد الله الطيب',
            'نادية حسين عبد الرحمن',
            'سامي محمود إبراهيم',
            'ليلى أحمد عبد العزيز',
            'محمد صلاح الدين',
            'هنا عبد العزيز محمد',
            'يوسف إبراهيم أحمد',
            'سارة محمد علي',
            'حسام عبد الحميد',
            'مروة أحمد سالم',
            'عبد الرحمن محمود',
            'زينب حسن محمد',
            'أسامة عبد الله',
            'رانيا السيد أحمد'
        ],
        positions: [
            'استشاري صدر',
            'علاج طبيعي',
            'فنية تمريض',
            'أخصائية تمريض',
            'أخصائي شئون',
            'فني تغذية',
            'مهندس صيانة',
            'أخصائي مختبر',
            'فني أشعة',
            'طبيب عام',
            'أخصائي نفسي',
            'فني صيدلة',
            'أخصائي اجتماعي',
            'فني معمل',
            'سكرتير طبي'
        ]
    }
};

// =============================================================================
// Data Collection Functions
// =============================================================================

/**
 * Collects absence data from form fields
 * @returns {Array<Object>} Array of absence records
 * @throws {Error} If there's an error collecting data
 */
function collectAbsenceData() {
    try {
        const absencesList = [];
        const rows = document.querySelectorAll('#absenceRows .absence-row');
        
        if (!rows || rows.length === 0) {
            console.warn('No absence rows found');
            return absencesList;
        }
        
        rows.forEach((row, index) => {
            try {
                const nameInput = row.querySelector('input[type="text"]');
                const positionSelect = row.querySelector('select');
                
                if (nameInput && nameInput.value && nameInput.value.trim()) {
                    const name = nameInput.value.trim();
                    const position = positionSelect ? positionSelect.value : '';
                    
                    if (name.length > 0) {
                        absencesList.push({
                            id: index + 1,
                            name: name,
                            position: position
                        });
                    }
                }
            } catch (rowError) {
                console.error(`Error processing absence row ${index}:`, rowError);
            }
        });
        
        return absencesList;
    } catch (error) {
        console.error('Error collecting absence data:', error);
        showStatus('حدث خطأ في جمع بيانات الغياب. يرجى المحاولة مرة أخرى.', 'error');
        return [];
    }
}

/**
 * Collects main form data
 * @returns {Object} Form data object
 * @throws {Error} If there's an error collecting data
 */
function collectFormData() {
    try {
        const inspectorName = document.getElementById('inspectorName');
        const location = document.getElementById('location');
        const date = document.getElementById('date');
        const time = document.getElementById('time');
        
        const data = {
            inspectorName: inspectorName ? inspectorName.value.trim() : '',
            location: location ? location.value.trim() : '',
            date: date ? date.value : '',
            time: time ? time.value : '',
            absences: collectAbsenceData()
        };
        
        // Log the collected data for debugging
        console.log('Collected form data:', data);
        
        return data;
    } catch (error) {
        console.error('Error collecting form data:', error);
        showStatus('حدث خطأ في جمع بيانات النموذج. يرجى المحاولة مرة أخرى.', 'error');
        return {
            inspectorName: '',
            location: '',
            date: '',
            time: '',
            absences: []
        };
    }
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
                    <th scope="col" style="width: 10%">م</th>
                    <th scope="col" style="width: 23%">الوظيفة</th>
                    <th scope="col" style="width: 30%">الاسم</th>
                    <th scope="col" style="width: 12%">عدد الحالات</th>
                    <th scope="col" style="width: 25%">ملاحظات</th>
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
            
            tableHTML += `
            <tr>
                <td><strong>${index + 1}</strong></td>
                <td>${escapeHtml(position)}</td>
                <td>${escapeHtml(name)}</td>
                <td>1</td>
                <td>${index === 0 ? 'مرفق كشف يبدأ برقم 1' : 
                     index === absences.length - 1 ? `مرفق كشف ينتهي برقم ${absences.length}` : 
                     'مرفق كشف برقم'}</td>
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
            <div class="ministry-name">مديرية الشئون الصحية بالغربية</div>
            <div class="department-name">إدارة المراجعة الداخلية والحوكمة</div>
            <div class="report-title">تقرير مرور</div>
            <div class="report-subtitle">للعرض علي السيد الدكتور/ وكيل الوزارة</div>
        </div>
        
        <div class="report-info-section">
            <table class="info-table" role="table" aria-label="معلومات التقرير">
                <tr>
                    <td class="highlight"><strong>اسم القائم بالمرور:</strong><br>${escapeHtml(data.inspectorName || '')}</td>
                    <td class="highlight"><strong>الجهة:</strong><br>${escapeHtml(data.location || '')}</td>
                    <td><strong>مفتش بإدارة الحوكمة بالمديرية</strong></td>
                </tr>
            </table>
            <table class="info-table" role="table" aria-label="تاريخ ووقت المرور">
                <tr>
                    <td class="highlight"><strong>الساعة:</strong><br>${formatTime(data.time)}</td>
                    <td class="highlight"><strong>تاريخ المرور:</strong><br>${formattedDate}</td>
                    <td></td>
                </tr>
            </table>
        </div>
        
        <div class="result-section">
            <div class="result-title">نتيجة المرور:</div>
            <div class="result-box">
                <strong>بالمرور علي ${escapeHtml(data.location || '')}</strong><br>
                <strong>لعمل انضباط إداري للعاملين تبين لنا:</strong>
                ${hasAbsences ? 'وجود حالات غياب بدون إذن وهم كالآتي:-' : 'عدم وجود حالات غياب عن الشئونية في ذات يوم المرور'}
                <div style="text-align: center; margin: 6mm 0;">
                    <span class="cases-count-box">
                        <strong>عدد الحالات:- ${hasAbsences ? data.absences.length : 'لا يوجد'}</strong>
                    </span>
                </div>
            </div>
            ${absenceTableHTML}
        </div>
        
        <div class="opinion-section">
            <div class="result-title">الرأي:</div>
            <div class="opinion-box">
                ${hasAbsences ? 
                    'إحالة التقرير لإدارة الشئون القانونية بالمديرية لإعمال شئونها حيال حالات الغياب عن العمل بدون إذن كما هو موضح بصدر التقرير.' :
                    'حفظ التقرير لعدم وجود حالات غياب عن الشئونية'}
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
                <div class="signature-title">-mfتش مالي وإداري</div>
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
            
            if (printBtn) printBtn.style.display = 'inline-flex';
            if (sendBtn) sendBtn.style.display = 'inline-flex';

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
 * Sets up employee autocomplete with position auto-fill
 * @param {string} nameInputId - ID of the employee name input
 * @param {string} positionInputId - ID of the position select
 * @throws {Error} If there's an error setting up employee autocomplete
 */
function setupEmployeeAutoComplete(nameInputId, positionInputId) {
    try {
        if (!nameInputId || !positionInputId) {
            console.error('Invalid parameters for employee autocomplete setup');
            return;
        }
        
        const nameInput = document.getElementById(nameInputId);
        const positionInput = document.getElementById(positionInputId);
        
        if (!nameInput || !positionInput) {
            console.error('Elements not found for employee autocomplete setup');
            return;
        }
        
        const suggestionsDiv = document.createElement('div');
        suggestionsDiv.className = 'suggestions';
        suggestionsDiv.id = nameInputId + 'Suggestions';
        suggestionsDiv.setAttribute('role', 'listbox');
        
        if (nameInput.parentElement) {
            nameInput.parentElement.appendChild(suggestionsDiv);
        }
        
        setupAutoComplete(nameInputId, nameInputId + 'Suggestions', AppState.database.employees);
        
        nameInput.addEventListener('input', function() {
            try {
                if (this.value && this.value.trim()) {
                    if (AppState.database.positions && AppState.database.positions.length > 0 && !positionInput.value) {
                        const randomPosition = AppState.database.positions[Math.floor(Math.random() * AppState.database.positions.length)];
                        positionInput.value = randomPosition;
                    }
                }
            } catch (error) {
                console.error('Error in employee name input handler:', error);
            }
        });
    } catch (error) {
        console.error('Error setting up employee autocomplete:', error);
        showStatus('حدث خطأ في إعداد نظام إكمال بيانات الموظف. يرجى المحاولة مرة أخرى.', 'error');
    }
}

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
        
        const rowDiv = document.createElement('div');
        rowDiv.className = 'absence-row slide-up';
        rowDiv.setAttribute('role', 'group');
        rowDiv.setAttribute('aria-label', `صف الغياب ${AppState.absenceCount}`);
        rowDiv.innerHTML = `
        <div class="form-group">
            <label for="employeeName${AppState.absenceCount}"><i class="fas fa-user"></i> الاسم</label>
            <div style="position: relative;">
                <input type="text" id="employeeName${AppState.absenceCount}" placeholder="ادخل اسم الموظف" aria-describedby="employeeName${AppState.absenceCount}-help">
                <i class="fas fa-search input-icon"></i>
            </div>
            <div id="employeeName${AppState.absenceCount}-help" class="sr-only">أدخل اسم الموظف</div>
        </div>
        <div class="form-group">
            <label for="employeePosition${AppState.absenceCount}"><i class="fas fa-briefcase"></i> الوظيفة</label>
            <select id="employeePosition${AppState.absenceCount}" aria-describedby="employeePosition${AppState.absenceCount}-help">
                <option value="">اختر الوظيفة</option>
                ${AppState.database.positions ? AppState.database.positions.map(pos => {
                    if (typeof pos === 'string') {
                        return `<option value="${escapeHtml(pos)}">${escapeHtml(pos)}</option>`;
                    }
                    return '';
                }).join('') : ''}
            </select>
            <div id="employeePosition${AppState.absenceCount}-help" class="sr-only">اختر وظيفة الموظف</div>
        </div>
        <div class="form-group">
            <label style="opacity: 0;" for="removeBtn${AppState.absenceCount}">حذف</label>
            <button type="button" id="removeBtn${AppState.absenceCount}" class="btn btn-danger" onclick="removeAbsenceRow(this)" title="حذف هذه الحالة" aria-label="حذف حالة الغياب">
                <i class="fas fa-trash-alt"></i>
            </button>
        </div>
    `;
        
        absenceRows.appendChild(rowDiv);
        setupEmployeeAutoComplete(`employeeName${AppState.absenceCount}`, `employeePosition${AppState.absenceCount}`);
        
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
    try {
        if (!btn) {
            console.error('Delete button not provided');
            showStatus('حدث خطأ في حذف صف الغياب. يرجى المحاولة مرة أخرى.', 'error');
            return;
        }
        
        const row = btn.closest('.absence-row');
        
        if (row) {
            // Animation for removal
            row.style.transform = 'translateX(100%)';
            row.style.opacity = '0';
            
            setTimeout(() => {
                if (row.parentNode) {
                    row.remove();
                    updateRowNumbers();
                    showStatus('تم حذف حالة الغياب بنجاح', 'success');
                }
            }, 300);
        }
    } catch (error) {
        console.error('Error removing absence row:', error);
        showStatus('حدث خطأ في حذف صف الغياب. يرجى المحاولة مرة أخرى.', 'error');
    }
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
        
        AppState.absenceCount = rows.length;
        
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
    try {
        const inspectorName = document.getElementById('inspectorName');
        const location = document.getElementById('location');
        const date = document.getElementById('date');
        const time = document.getElementById('time');
        
        if (!inspectorName || !location || !date || !time) {
            showStatus('حدث خطأ في النظام. يرجى إعادة تحميل الصفحة.', 'error');
            return false;
        }
        
        const inspectorNameValue = inspectorName.value.trim();
        const locationValue = location.value.trim();
        const dateValue = date.value;
        const timeValue = time.value;
        
        // Validate inspector name
        if (!inspectorNameValue) {
            showStatus('⚠️ يرجى إدخال اسم القائم بالمرور', 'error');
            inspectorName.focus();
            return false;
        }
        
        // Validate location
        if (!locationValue) {
            showStatus('⚠️ يرجى إدخال اسم الجهة', 'error');
            location.focus();
            return false;
        }
        
        // Validate date
        if (!dateValue) {
            showStatus('⚠️ يرجى إدخال تاريخ المرور', 'error');
            date.focus();
            return false;
        }
        
        // Validate time
        if (!timeValue) {
            showStatus('⚠️ يرجى إدخال وقت المرور', 'error');
            time.focus();
            return false;
        }
        
        // Validate date range
        const selectedDate = new Date(dateValue);
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
        
        // Validate absence rows if any exist
        const absenceRows = document.querySelectorAll('#absenceRows .absence-row');
        if (absenceRows.length > 0) {
            let hasValidAbsence = false;
            for (const row of absenceRows) {
                const nameInput = row.querySelector('input[type="text"]');
                if (nameInput && nameInput.value && nameInput.value.trim()) {
                    hasValidAbsence = true;
                    break;
                }
            }
            
            // If there are rows but none have valid data, show warning
            if (!hasValidAbsence) {
                if (!confirm('لا توجد حالات غياب مدخلة. هل تريد المتابعة بدون حالات غياب؟')) {
                    return false;
                }
            }
        }
        
        return true;
    } catch (error) {
        console.error('Error validating form:', error);
        showStatus('حدث خطأ في التحقق من صحة البيانات. يرجى المحاولة مرة أخرى.', 'error');
        return false;
    }
}

/**
 * Clears the entire form
 */
function clearForm() {
    if (confirm('هل أنت متأكد من رغبتك في مسح جميع البيانات؟')) {
        try {
            const reportForm = document.getElementById('reportForm');
            const absenceRows = document.getElementById('absenceRows');
            const reportPreview = document.getElementById('reportPreview');
            const printBtn = document.getElementById('printBtn');
            const sendBtn = document.getElementById('sendBtn');
            
            if (reportForm) {
                reportForm.reset();
            }
            
            if (absenceRows) {
                absenceRows.innerHTML = '';
            }
            
            if (reportPreview) {
                reportPreview.style.display = 'none';
            }
            
            if (printBtn) {
                printBtn.style.display = 'none';
            }
            if (sendBtn) {
                sendBtn.style.display = 'none';
            }
            
            AppState.absenceCount = 0;
            AppState.isReportGenerated = false;
            
            const now = new Date();
            const dateStr = now.toISOString().split('T')[0];
            const timeStr = now.toTimeString().slice(0, 5);
            
            const dateElement = document.getElementById('date');
            const timeElement = document.getElementById('time');
            
            if (dateElement) {
                dateElement.value = dateStr;
            }
            if (timeElement) {
                timeElement.value = timeStr;
            }
            
            // Add one empty absence row
            addAbsenceRow();
            
            showStatus('تم مسح النموذج بنجاح! ✨', 'success');
            console.log('Form cleared successfully');
        } catch (error) {
            console.error('Error clearing form:', error);
            showStatus('حدث خطأ في مسح النموذج. يرجى المحاولة مرة أخرى.', 'error');
        }
    }
}

// =============================================================================
// Data Export Functions
// =============================================================================

/**
 * Simulates sending data to Google Sheets
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
        
        await simulateGoogleSheetsAPI(data);
        
        AppState.sentReports.add(reportId);
        
        showStatus('تم إرسال البيانات بنجاح لجوجل شيتس! ✅', 'success');
        console.log('Data sent to Google Sheets:', data);
    } catch (error) {
        console.error('Error sending to Google Sheets:', error);
        showStatus('حدث خطأ في إرسال البيانات. يرجى المحاولة مرة أخرى.', 'error');
    } finally {
        showLoading(false);
    }
}

/**
 * Simulates the Google Sheets API
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
                
                const sheetData = {
                    timestamp: new Date().toLocaleString('ar-EG'),
                    inspectorName: data.inspectorName || '',
                    location: data.location || '',
                    date: data.date || '',
                    time: data.time || '',
                    absenceCount: Array.isArray(data.absences) ? data.absences.length : 0,
                    totalAbsences: Array.isArray(data.absences) ? data.absences.length : 0,
                    workLeaveCount: 0
                };
                
                console.log('🔄 بيانات مرسلة لجوجل شيتس:', sheetData);
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
function initializeApp() {
    try {
        console.log('🚀 Initializing Medical Inspection Reports System...');
        
        const now = new Date();
        const dateStr = now.toISOString().split('T')[0];
        const timeStr = now.toTimeString().slice(0, 5);
        
        const dateElement = document.getElementById('date');
        const timeElement = document.getElementById('time');
        
        if (dateElement) {
            dateElement.value = dateStr;
        }
        if (timeElement) {
            timeElement.value = timeStr;
        }
        
        // Set up autocomplete for inspectors
        if (AppState.database.inspectors) {
            setupAutoComplete('inspectorName', 'inspectorSuggestions', AppState.database.inspectors);
        }
        
        // Set up autocomplete for locations
        if (AppState.database.locations) {
            setupAutoComplete('location', 'locationSuggestions', AppState.database.locations);
        }
        
        // Add initial absence row
        addAbsenceRow();
        
        // Set up form submission handler
        const reportForm = document.getElementById('reportForm');
        if (reportForm) {
            reportForm.addEventListener('submit', function(e) {
                e.preventDefault();
                generateReport();
            });
        }
        
        // Set up keyboard shortcuts
        document.addEventListener('keydown', function(e) {
            try {
                // Ctrl+P for print
                if (e.ctrlKey && e.key === 'p') {
                    e.preventDefault();
                    const printBtn = document.getElementById('printBtn');
                    if (printBtn && printBtn.style.display !== 'none') {
                        printReport();
                    }
                }
                // Ctrl+S for generate report
                else if (e.ctrlKey && e.key === 's') {
                    e.preventDefault();
                    generateReport();
                }
                // Ctrl+N for clear form
                else if (e.ctrlKey && e.key === 'n') {
                    e.preventDefault();
                    clearForm();
                }
                // F5 for refresh with confirmation
                else if (e.key === 'F5') {
                    e.preventDefault();
                    if (confirm('هل تريد إعادة تحميل الصفحة؟ سيتم فقدان البيانات الحالية.')) {
                        location.reload();
                    }
                }
            } catch (error) {
                console.error('Error in keyboard shortcut handler:', error);
            }
        });
        
        // Set up click handler to close suggestions when clicking outside
        document.addEventListener('click', function(e) {
            try {
                if (!e.target.closest('.form-group')) {
                    const suggestions = document.querySelectorAll('.suggestions');
                    suggestions.forEach(s => {
                        if (s && s.style) {
                            s.style.display = 'none';
                        }
                    });
                }
            } catch (error) {
                console.error('Error in click handler:', error);
            }
        });
        
        // Add loaded class for animations
        setTimeout(() => {
            const body = document.body;
            if (body) {
                body.classList.add('loaded');
            }
        }, 100);
        
        console.log('✅ Medical Inspection Reports System initialized successfully');
        showStatus('تم تحميل النظام بنجاح! 🚀', 'success');
    } catch (error) {
        console.error('Error initializing application:', error);
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
window.sendToGoogleSheets = sendToGoogleSheets;
window.clearForm = clearForm;
window.addAbsenceRow = addAbsenceRow;
window.removeAbsenceRow = removeAbsenceRow;
window.selectSuggestion = selectSuggestion;

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);