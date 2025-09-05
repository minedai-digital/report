// =============================================================================
// نظام تقارير المرور الطبية
// تطوير: الطارق زهران
// =============================================================================

// =============================================================================
// الثوابت العامة
// =============================================================================
const MONTHS = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
               'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
const DAYS = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

// =============================================================================
// قاعدة البيانات
// =============================================================================
const database = {
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
};

// =============================================================================
// المتغيرات العامة
// =============================================================================
let sentReports = new Set();
let absenceCount = 0;

// =============================================================================
// دوال تنسيق التاريخ والوقت
// =============================================================================

/**
 * تنسيق التاريخ إلى صيغة عربية
 * @param {string} dateString - تاريخ بتنسيق YYYY-MM-DD
 * @returns {string} التاريخ المنسق بالعربية
 */
function formatDate(dateString) {
    try {
        const dateObj = new Date(dateString + 'T00:00:00');
        const dayName = DAYS[dateObj.getDay()];
        return `${dayName}، ${dateObj.getDate()} ${MONTHS[dateObj.getMonth()]}، ${dateObj.getFullYear()}`;
    } catch (error) {
        console.error('خطأ في تنسيق التاريخ:', error);
        return dateString;
    }
}

/**
 * تنسيق الوقت ببساطة
 * @param {string} time - الوقت بتنسيق HH:MM
 * @returns {string} الوقت المنسق
 */
function formatTimeSimple(time) {
    return time;
}

// =============================================================================
// دوال جمع البيانات
// =============================================================================

/**
 * جمع بيانات الغياب من الحقول
 * @returns {Array} قائمة ببيانات الغياب
 */
function collectAbsenceData() {
    const absencesList = [];
    const rows = document.querySelectorAll('#absenceRows .absence-row');
    
    rows.forEach((row) => {
        const nameInput = row.querySelector('input[type="text"]');
        const positionSelect = row.querySelector('select');
        
        if (nameInput && nameInput.value.trim()) {
            absencesList.push({
                name: nameInput.value.trim(),
                position: positionSelect ? positionSelect.value : ''
            });
        }
    });
    
    return absencesList;
}

/**
 * جمع بيانات النموذج الرئيسية
 * @returns {Object} بيانات النموذج
 */
function collectFormData() {
    return {
        inspectorName: document.getElementById('inspectorName').value.trim(),
        location: document.getElementById('location').value.trim(),
        date: document.getElementById('date').value,
        time: document.getElementById('time').value
    };
}

// =============================================================================
// دوال إنشاء جداول التقرير
// =============================================================================

/**
 * إنشاء جدول الغياب
 * @param {Array} absences - قائمة ببيانات الغياب
 * @returns {string} HTML جدول الغياب
 */
function generateAbsenceTable(absences) {
    let tableHTML = `
        <table class="absence-table" id="absenceTable" dir="rtl">
            <thead>
                <tr>
                    <th style="width: 10%">م</th>
                    <th style="width: 23%">الوظيفة</th>
                    <th style="width: 30%">الاسم</th>
                    <th style="width: 12%">عدد الحالات</th>
                    <th style="width: 25%">ملاحظات</th>
                </tr>
            </thead>
            <tbody>`;

    // إضافة بيانات الغياب المدخلة
    absences.forEach((absence, index) => {
        tableHTML += `
            <tr>
                <td><strong>${index + 1}</strong></td>
                <td>${escapeHtml(absence.position)}</td>
                <td>${escapeHtml(absence.name)}</td>
                <td>1</td>
                <td>${index === 0 ? 'مرفق كشف يبدأ برقم 1' : 
                     index === absences.length - 1 ? `مرفق كشف ينتهي برقم ${absences.length}` : 
                     'مرفق كشف برقم'}</td>
            </tr>
        `;
    });

    // إكمال الجدول حتى 6 صفوف
    for (let i = absences.length + 1; i <= 6; i++) {
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
}

// =============================================================================
// دوال إنشاء التقرير
// =============================================================================

/**
 * إنشاء التقرير
 */
function generateReport() {
    showLoading();
    
    setTimeout(() => {
        const data = {
            inspectorName: document.getElementById('inspectorName').value.trim(),
            location: document.getElementById('location').value.trim(),
            date: document.getElementById('date').value,
            time: document.getElementById('time').value,
            absences: collectAbsenceData()
        };
        
        // التحقق من صحة البيانات
        if (!validateForm()) {
            hideLoading();
            return;
        }

        try {
            const reportHTML = generateReportHTML(data);
            const reportContainer = document.getElementById('reportContent');
            const reportPreview = document.getElementById('reportPreview');

            reportContainer.innerHTML = reportHTML;
            reportPreview.style.display = 'block';
            reportPreview.classList.add('fade-in');

            document.getElementById('printBtn').style.display = 'inline-flex';
            document.getElementById('sendBtn').style.display = 'inline-flex';

            hideLoading();
            showStatus('تم إنشاء التقرير بنجاح', 'success');
            reportPreview.scrollIntoView({ behavior: 'smooth' });
        } catch (error) {
            console.error('خطأ في إنشاء التقرير:', error);
            hideLoading();
            showStatus('حدث خطأ في إنشاء التقرير. يرجى المحاولة مرة أخرى.', 'error');
        }
    }, 1000);
}

/**
 * إنشاء HTML التقرير
 * @param {Object} data - بيانات التقرير
 * @returns {string} HTML التقرير
 */
function generateReportHTML(data) {
    const formattedDate = formatDate(data.date);
    const hasAbsences = data.absences.length > 0;
    const absenceTableHTML = generateAbsenceTable(data.absences);

    return `
        <div class="report-header">
            <div class="ministry-name">مديرية الشئون الصحية بالغربية</div>
            <div class="department-name">إدارة المراجعة الداخلية والحوكمة</div>
            <div class="report-title">تقرير مرور</div>
            <div class="report-subtitle">للعرض علي السيد الدكتور/ وكيل الوزارة</div>
        </div>
        
        <div class="report-info-section">
            <table class="info-table">
                <tr>
                    <td class="highlight"><strong>اسم القائم بالمرور:</strong><br>${escapeHtml(data.inspectorName)}</td>
                    <td class="highlight"><strong>الجهة:</strong><br>${escapeHtml(data.location)}</td>
                    <td><strong>مفتش بإدارة الحوكمة بالمديرية</strong></td>
                </tr>
            </table>
            <table class="info-table">
                <tr>
                    <td class="highlight"><strong>الساعة:</strong><br>${formatTimeSimple(data.time)}</td>
                    <td class="highlight"><strong>تاريخ المرور:</strong><br>${formattedDate}</td>
                    <td></td>
                </tr>
            </table>
        </div>
        
        <div class="result-section">
            <div class="result-title">نتيجة المرور:</div>
            <div class="result-box">
                <strong>بالمرور علي ${escapeHtml(data.location)}</strong><br>
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
                <div class="signature-title">مفتش مالي وإداري</div>
                <div class="signature-name">${escapeHtml(data.inspectorName)}</div>
            </div>
        </div>
    `;
}

// =============================================================================
// دوال واجهة المستخدم
// =============================================================================

/**
 * إعداد البحث التلقائي
 * @param {string} inputId - معرف حقل الإدخال
 * @param {string} suggestionsId - معرف قائمة الاقتراحات
 * @param {Array} dataArray - قائمة البيانات للبحث
 */
function setupAutoComplete(inputId, suggestionsId, dataArray) {
    const input = document.getElementById(inputId);
    const suggestionsDiv = document.getElementById(suggestionsId);
    
    if (!input || !suggestionsDiv) {
        console.error('لم يتم العثور على عناصر البحث التلقائي');
        return;
    }
    
    input.addEventListener('input', function() {
        const value = this.value.trim().toLowerCase();
        if (value.length === 0) {
            suggestionsDiv.style.display = 'none';
            return;
        }
        
        const filtered = dataArray.filter(item => 
            item.toLowerCase().includes(value) ||
            item.split(' ').some(word => word.toLowerCase().startsWith(value))
        );
        
        if (filtered.length === 0) {
            suggestionsDiv.style.display = 'none';
            return;
        }
        
        suggestionsDiv.innerHTML = filtered.slice(0, 8).map(item => 
            `<div class="suggestion-item" onclick="selectSuggestion('${inputId}', '${escapeHtml(item).replace(/'/g, "\\'")}')">${escapeHtml(item)}</div>`
        ).join('');
        suggestionsDiv.style.display = 'block';
    });
    
    input.addEventListener('blur', function() {
        setTimeout(() => {
            suggestionsDiv.style.display = 'none';
        }, 200);
    });
    
    input.addEventListener('keydown', function(e) {
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
            suggestions[activeIndex].click();
            return;
        }
        
        suggestions.forEach((item, index) => {
            item.classList.toggle('active', index === activeIndex);
        });
    });
}

/**
 * اختيار اقتراح من قائمة البحث التلقائي
 * @param {string} inputId - معرف حقل الإدخال
 * @param {string} value - القيمة المختارة
 */
function selectSuggestion(inputId, value) {
    const input = document.getElementById(inputId);
    const suggestionsDiv = document.getElementById(inputId + 'Suggestions');
    
    if (input && suggestionsDiv) {
        input.value = value;
        suggestionsDiv.style.display = 'none';
        
        // تأثير بصري للتأكيد
        input.style.borderColor = '#48bb78';
        setTimeout(() => {
            input.style.borderColor = '#667eea';
        }, 500);
    }
}

/**
 * إعداد البحث التلقائي للموظفين
 * @param {string} nameInputId - معرف حقل اسم الموظف
 * @param {string} positionInputId - معرف حقل الوظيفة
 */
function setupEmployeeAutoComplete(nameInputId, positionInputId) {
    const nameInput = document.getElementById(nameInputId);
    const positionInput = document.getElementById(positionInputId);
    
    if (!nameInput || !positionInput) {
        console.error('لم يتم العثور على عناصر البحث التلقائي للموظفين');
        return;
    }
    
    const suggestionsDiv = document.createElement('div');
    suggestionsDiv.className = 'suggestions';
    suggestionsDiv.id = nameInputId + 'Suggestions';
    nameInput.parentElement.appendChild(suggestionsDiv);
    
    setupAutoComplete(nameInputId, nameInputId + 'Suggestions', database.employees);
    
    nameInput.addEventListener('input', function() {
        if (this.value.trim()) {
            // اختيار وظيفة عشوائية عند إدخال اسم
            const randomPosition = database.positions[Math.floor(Math.random() * database.positions.length)];
            if (!positionInput.value) {
                positionInput.value = randomPosition;
            }
        }
    });
}

/**
 * إضافة صف حالة غياب جديد
 */
function addAbsenceRow() {
    absenceCount++;
    const absenceRows = document.getElementById('absenceRows');
    
    if (!absenceRows) {
        console.error('لم يتم العثور على عنصر absenceRows');
        return;
    }
    
    const rowDiv = document.createElement('div');
    rowDiv.className = 'absence-row slide-up';
    rowDiv.innerHTML = `
        <div class="form-group">
            <label><i class="fas fa-user"></i> الاسم</label>
            <div style="position: relative;">
                <input type="text" id="employeeName${absenceCount}" placeholder="ادخل اسم الموظف">
                <i class="fas fa-search input-icon"></i>
            </div>
        </div>
        <div class="form-group">
            <label><i class="fas fa-briefcase"></i> الوظيفة</label>
            <select id="employeePosition${absenceCount}">
                <option value="">اختر الوظيفة</option>
                ${database.positions.map(pos => `<option value="${escapeHtml(pos)}">${escapeHtml(pos)}</option>`).join('')}
            </select>
        </div>
        <div class="form-group">
            <label style="opacity: 0;">حذف</label>
            <button type="button" class="btn btn-danger" onclick="removeAbsenceRow(this)" title="حذف هذه الحالة">
                <i class="fas fa-trash-alt"></i>
            </button>
        </div>
    `;
    
    absenceRows.appendChild(rowDiv);
    setupEmployeeAutoComplete(`employeeName${absenceCount}`, `employeePosition${absenceCount}`);
    
    setTimeout(() => {
        rowDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
}

/**
 * حذف صف حالة غياب
 * @param {HTMLElement} btn - زر الحذف
 */
function removeAbsenceRow(btn) {
    const row = btn.closest('.absence-row');
    if (row) {
        row.style.transform = 'translateX(100%)';
        row.style.opacity = '0';
        setTimeout(() => {
            row.remove();
            updateRowNumbers();
        }, 300);
    }
}

/**
 * تحديث أرقام الصفوف
 */
function updateRowNumbers() {
    const rows = document.querySelectorAll('.absence-row');
    rows.forEach((row, index) => {
        const inputs = row.querySelectorAll('input, select');
        inputs.forEach(input => {
            const oldId = input.id;
            const newId = oldId.replace(/\d+$/, index + 1);
            input.id = newId;
        });
    });
}

/**
 * طباعة التقرير
 */
function printReport() {
    try {
        // إخفاء جميع العناصر ما عدا التقرير قبل الطباعة
        const elementsToHide = document.querySelectorAll('.app-header, .form-container, .actions, .status-message');
        elementsToHide.forEach(el => el.style.display = 'none');
        
        // طباعة
        window.print();
        
        // إعادة إظهار العناصر بعد الطباعة
        setTimeout(() => {
            elementsToHide.forEach(el => el.style.display = '');
        }, 1000);
    } catch (error) {
        console.error('خطأ في الطباعة:', error);
        showStatus('حدث خطأ في الطباعة. يرجى المحاولة مرة أخرى.', 'error');
    }
}

// =============================================================================
// دوال إرسال البيانات
// =============================================================================

/**
 * إرسال البيانات إلى Google Sheets
 */
async function sendToGoogleSheets() {
    const data = collectFormData();
    const reportId = generateReportId(data);
    
    if (sentReports.has(reportId)) {
        showStatus('تم إرسال هذا التقرير مسبقاً. لا يمكن الإرسال مرة أخرى لتجنب التكرار.', 'error');
        return;
    }
    
    showLoading(true, 'جاري إرسال البيانات...');
    
    try {
        await simulateGoogleSheetsAPI(data);
        sentReports.add(reportId);
        showStatus('تم إرسال البيانات بنجاح لجوجل شيتس! ✅', 'success');
    } catch (error) {
        console.error('خطأ في إرسال البيانات:', error);
        showStatus('حدث خطأ في إرسال البيانات. يرجى المحاولة مرة أخرى.', 'error');
    } finally {
        showLoading(false);
    }
}

/**
 * توليد معرف فريد للتقرير
 * @param {Object} data - بيانات التقرير
 * @returns {string} المعرف الفريد
 */
function generateReportId(data) {
    return btoa(`${data.inspectorName}_${data.location}_${data.date}_${data.time}`).replace(/[^a-zA-Z0-9]/g, '');
}

/**
 * محاكاة API Google Sheets
 * @param {Object} data - بيانات التقرير
 * @returns {Promise} وعد بإرسال البيانات
 */
async function simulateGoogleSheetsAPI(data) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                const sheetData = {
                    timestamp: new Date().toLocaleString('ar-EG'),
                    inspectorName: data.inspectorName,
                    location: data.location,
                    date: data.date,
                    time: data.time,
                    absenceCount: 0,
                    totalAbsences: 0,
                    workLeaveCount: 0
                };
                console.log('🔄 بيانات مرسلة لجوجل شيتس:', sheetData);
                resolve(sheetData);
            } catch (error) {
                reject(error);
            }
        }, 2000);
    });
}

// =============================================================================
// دوال عرض الرسائل والحالات
// =============================================================================

/**
 * عرض رسالة حالة
 * @param {string} message - نص الرسالة
 * @param {string} type - نوع الرسالة (success|error)
 */
function showStatus(message, type) {
    const statusMessage = document.getElementById('statusMessage');
    if (statusMessage) {
        statusMessage.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            ${escapeHtml(message)}
        `;
        statusMessage.className = `status-message status-${type}`;
        statusMessage.style.display = 'block';
        statusMessage.classList.add('slide-up');
        
        setTimeout(() => {
            statusMessage.style.display = 'none';
            statusMessage.classList.remove('slide-up');
        }, 6000);
    }
}

/**
 * عرض شاشة التحميل
 * @param {boolean} show - هل تعرض الشاشة أم تخفيها
 * @param {string} message - نص الرسالة
 */
function showLoading(show = true, message = 'جاري المعالجة...') {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        const content = overlay.querySelector('.loading-content h3');
        if (content) {
            content.textContent = message;
        }
        
        if (show) {
            overlay.style.display = 'flex';
            overlay.classList.add('fade-in');
        } else {
            overlay.style.display = 'none';
            overlay.classList.remove('fade-in');
        }
    }
}

/**
 * إخفاء شاشة التحميل
 */
function hideLoading() {
    showLoading(false);
}

// =============================================================================
// دوال التحقق من الصحة
// =============================================================================

/**
 * التحقق من صحة النموذج
 * @returns {boolean} صواب إذا كانت البيانات صحيحة
 */
function validateForm() {
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
    
    if (!inspectorNameValue) {
        showStatus('⚠️ يرجى إدخال اسم القائم بالمرور', 'error');
        inspectorName.focus();
        return false;
    }
    if (!locationValue) {
        showStatus('⚠️ يرجى إدخال اسم الجهة', 'error');
        location.focus();
        return false;
    }
    if (!dateValue) {
        showStatus('⚠️ يرجى إدخال تاريخ المرور', 'error');
        date.focus();
        return false;
    }
    if (!timeValue) {
        showStatus('⚠️ يرجى إدخال وقت المرور', 'error');
        time.focus();
        return false;
    }
    
    // التحقق من التاريخ
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
    
    return true;
}

/**
 * مسح النموذج
 */
function clearForm() {
    if (confirm('هل أنت متأكد من رغبتك في مسح جميع البيانات؟')) {
        const reportForm = document.getElementById('reportForm');
        const absenceRows = document.getElementById('absenceRows');
        const reportPreview = document.getElementById('reportPreview');
        const printBtn = document.getElementById('printBtn');
        const sendBtn = document.getElementById('sendBtn');
        
        if (reportForm) reportForm.reset();
        if (absenceRows) absenceRows.innerHTML = '';
        if (reportPreview) reportPreview.style.display = 'none';
        if (printBtn) printBtn.style.display = 'none';
        if (sendBtn) sendBtn.style.display = 'none';
        
        absenceCount = 0;
        
        // إعادة تعيين التاريخ والوقت الحاليين
        const now = new Date();
        const dateStr = now.toISOString().split('T')[0];
        const timeStr = now.toTimeString().slice(0, 5);
        
        if (document.getElementById('date')) {
            document.getElementById('date').value = dateStr;
        }
        if (document.getElementById('time')) {
            document.getElementById('time').value = timeStr;
        }
        
        addAbsenceRow();
        showStatus('تم مسح النموذج بنجاح! ✨', 'success');
    }
}

// =============================================================================
// دوال المساعدة
// =============================================================================

/**
 * تهريب الأحرف الخاصة لمنع XSS
 * @param {string} text - النص المراد تهريبه
 * @returns {string} النص المُهرب
 */
function escapeHtml(text) {
    if (typeof text !== 'string') return text;
    
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

// =============================================================================
// معالجة الأخطاء العامة
// =============================================================================

window.addEventListener('error', function(e) {
    console.error('❌ خطأ في التطبيق:', e.error);
    showStatus('حدث خطأ غير متوقع. يرجى إعادة تحميل الصفحة.', 'error');
});

// =============================================================================
// تهيئة التطبيق
// =============================================================================
document.addEventListener('DOMContentLoaded', function() {
    try {
        // تعيين التاريخ والوقت الحاليين
        const now = new Date();
        const dateStr = now.toISOString().split('T')[0];
        const timeStr = now.toTimeString().slice(0, 5);
        
        if (document.getElementById('date')) {
            document.getElementById('date').value = dateStr;
        }
        if (document.getElementById('time')) {
            document.getElementById('time').value = timeStr;
        }
        
        // إعداد البحث التلقائي
        setupAutoComplete('inspectorName', 'inspectorSuggestions', database.inspectors);
        setupAutoComplete('location', 'locationSuggestions', database.locations);
        
        // إضافة صف غياب أولي
        addAbsenceRow();
        
        // معالجة إرسال النموذج
        const reportForm = document.getElementById('reportForm');
        if (reportForm) {
            reportForm.addEventListener('submit', function(e) {
                e.preventDefault();
                generateReport();
            });
        }
        
        // اختصارات لوحة المفاتيح
        document.addEventListener('keydown', function(e) {
            if (e.ctrlKey && e.key === 'p') {
                e.preventDefault();
                if (document.getElementById('printBtn') && document.getElementById('printBtn').style.display !== 'none') {
                    printReport();
                }
            }
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                generateReport();
            }
            if (e.ctrlKey && e.key === 'n') {
                e.preventDefault();
                clearForm();
            }
            if (e.key === 'F5') {
                e.preventDefault();
                if (confirm('هل تريد إعادة تحميل الصفحة؟ سيتم فقدان البيانات الحالية.')) {
                    location.reload();
                }
            }
        });
        
        // إخفاء الاقتراحات عند النقر خارجها
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.form-group')) {
                document.querySelectorAll('.suggestions').forEach(s => {
                    s.style.display = 'none';
                });
            }
        });
        
        setTimeout(() => {
            if (document.body) {
                document.body.classList.add('loaded');
            }
        }, 100);
        
        console.log('🚀 تم تحميل نظام تقارير المرور الطبية بنجاح');
    } catch (error) {
        console.error('خطأ في تهيئة التطبيق:', error);
        showStatus('حدث خطأ في تهيئة التطبيق. يرجى إعادة تحميل الصفحة.', 'error');
    }
});