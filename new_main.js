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
        // التحقق من صحة تنسيق التاريخ
        if (!dateString || typeof dateString !== 'string') {
            throw new Error('تنسيق تاريخ غير صحيح');
        }
        
        const dateObj = new Date(dateString + 'T00:00:00');
        
        // التحقق من صحة التاريخ
        if (isNaN(dateObj.getTime())) {
            throw new Error('تاريخ غير صحيح');
        }
        
        const dayName = DAYS[dateObj.getDay()];
        return `${dayName}، ${dateObj.getDate()} ${MONTHS[dateObj.getMonth()]}، ${dateObj.getFullYear()}`;
    } catch (error) {
        console.error('خطأ في تنسيق التاريخ:', error);
        return dateString || 'تاريخ غير محدد';
    }
}

/**
 * تنسيق الوقت ببساطة
 * @param {string} time - الوقت بتنسيق HH:MM
 * @returns {string} الوقت المنسق
 */
function formatTimeSimple(time) {
    if (!time || typeof time !== 'string') {
        return '00:00';
    }
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
    try {
        const absencesList = [];
        const rows = document.querySelectorAll('#absenceRows .absence-row');
        
        // التحقق من وجود العناصر
        if (!rows || rows.length === 0) {
            return absencesList;
        }
        
        rows.forEach((row) => {
            const nameInput = row.querySelector('input[type="text"]');
            const positionSelect = row.querySelector('select');
            
            // التحقق من صحة العناصر
            if (nameInput && nameInput.value && nameInput.value.trim()) {
                const name = nameInput.value.trim();
                const position = positionSelect ? positionSelect.value : '';
                
                // التحقق من صحة البيانات
                if (name.length > 0) {
                    absencesList.push({
                        name: name,
                        position: position
                    });
                }
            }
        });
        
        return absencesList;
    } catch (error) {
        console.error('خطأ في جمع بيانات الغياب:', error);
        return [];
    }
}

/**
 * جمع بيانات النموذج الرئيسية
 * @returns {Object} بيانات النموذج
 */
function collectFormData() {
    try {
        const inspectorName = document.getElementById('inspectorName');
        const location = document.getElementById('location');
        const date = document.getElementById('date');
        const time = document.getElementById('time');
        
        return {
            inspectorName: inspectorName ? inspectorName.value.trim() : '',
            location: location ? location.value.trim() : '',
            date: date ? date.value : '',
            time: time ? time.value : ''
        };
    } catch (error) {
        console.error('خطأ في جمع بيانات النموذج:', error);
        return {
            inspectorName: '',
            location: '',
            date: '',
            time: ''
        };
    }
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
    try {
        // التحقق من صحة المدخلات
        if (!Array.isArray(absences)) {
            throw new Error('بيانات الغياب غير صحيحة');
        }
        
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
            // التحقق من صحة بيانات الغياب
            if (!absence || typeof absence !== 'object') {
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
    } catch (error) {
        console.error('خطأ في إنشاء جدول الغياب:', error);
        return '<p>حدث خطأ في إنشاء جدول الغياب</p>';
    }
}

// =============================================================================
// دوال إنشاء التقرير
// =============================================================================

/**
 * إنشاء التقرير
 */
function generateReport() {
    showLoading();
    
    // استخدام setTimeout لتحسين تجربة المستخدم
    setTimeout(() => {
        try {
            const data = {
                inspectorName: document.getElementById('inspectorName') ? document.getElementById('inspectorName').value.trim() : '',
                location: document.getElementById('location') ? document.getElementById('location').value.trim() : '',
                date: document.getElementById('date') ? document.getElementById('date').value : '',
                time: document.getElementById('time') ? document.getElementById('time').value : '',
                absences: collectAbsenceData()
            };
            
            // التحقق من صحة البيانات
            if (!validateForm()) {
                hideLoading();
                return;
            }

            const reportHTML = generateReportHTML(data);
            const reportContainer = document.getElementById('reportContent');
            const reportPreview = document.getElementById('reportPreview');

            // التحقق من وجود العناصر
            if (!reportContainer || !reportPreview) {
                throw new Error('عناصر التقرير غير موجودة');
            }

            reportContainer.innerHTML = reportHTML;
            reportPreview.style.display = 'block';
            reportPreview.classList.add('fade-in');

            // إظهار أزرار الطباعة والإرسال
            const printBtn = document.getElementById('printBtn');
            const sendBtn = document.getElementById('sendBtn');
            
            if (printBtn) printBtn.style.display = 'inline-flex';
            if (sendBtn) sendBtn.style.display = 'inline-flex';

            hideLoading();
            showStatus('تم إنشاء التقرير بنجاح', 'success');
            
            // التمرير إلى التقرير
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
    try {
        // التحقق من صحة البيانات
        if (!data || typeof data !== 'object') {
            throw new Error('بيانات التقرير غير صحيحة');
        }
        
        const formattedDate = formatDate(data.date);
        const hasAbsences = Array.isArray(data.absences) && data.absences.length > 0;
        const absenceTableHTML = generateAbsenceTable(data.absences || []);

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
                    <td class="highlight"><strong>اسم القائم بالمرور:</strong><br>${escapeHtml(data.inspectorName || '')}</td>
                    <td class="highlight"><strong>الجهة:</strong><br>${escapeHtml(data.location || '')}</td>
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
                <div class="signature-title">مفتش مالي وإداري</div>
                <div class="signature-name">${escapeHtml(data.inspectorName || '')}</div>
            </div>
        </div>
    `;
    } catch (error) {
        console.error('خطأ في إنشاء HTML التقرير:', error);
        throw new Error('حدث خطأ في إنشاء التقرير');
    }
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
    try {
        // التحقق من صحة المدخلات
        if (!inputId || !suggestionsId || !Array.isArray(dataArray)) {
            console.error('معلمات البحث التلقائي غير صحيحة');
            return;
        }
        
        const input = document.getElementById(inputId);
        const suggestionsDiv = document.getElementById(suggestionsId);
        
        // التحقق من وجود العناصر
        if (!input || !suggestionsDiv) {
            console.error('لم يتم العثور على عناصر البحث التلقائي');
            return;
        }
        
        // إضافة مستمع لحدث الإدخال
        input.addEventListener('input', function() {
            try {
                const value = this.value.trim().toLowerCase();
                
                // إخفاء الاقتراحات إذا كان النص فارغًا
                if (value.length === 0) {
                    suggestionsDiv.style.display = 'none';
                    return;
                }
                
                // تصفية البيانات بناءً على النص المدخل
                const filtered = dataArray.filter(item => {
                    if (typeof item !== 'string') return false;
                    const lowerItem = item.toLowerCase();
                    return lowerItem.includes(value) || 
                           item.split(' ').some(word => {
                               if (typeof word !== 'string') return false;
                               return word.toLowerCase().startsWith(value);
                           });
                });
                
                // إخفاء الاقتراحات إذا لم توجد نتائج
                if (filtered.length === 0) {
                    suggestionsDiv.style.display = 'none';
                    return;
                }
                
                // إنشاء عناصر الاقتراحات
                suggestionsDiv.innerHTML = filtered.slice(0, 8).map(item => {
                    if (typeof item !== 'string') return '';
                    return `<div class="suggestion-item" onclick="selectSuggestion('${inputId}', '${escapeHtml(item).replace(/'/g, "\\'")}')">${escapeHtml(item)}</div>`;
                }).join('');
                
                suggestionsDiv.style.display = 'block';
            } catch (error) {
                console.error('خطأ في معالجة إدخال البحث التلقائي:', error);
                suggestionsDiv.style.display = 'none';
            }
        });
        
        // إضافة مستمع لحدث فقدان التركيز
        input.addEventListener('blur', function() {
            // استخدام setTimeout لتجنب إغلاق الاقتراحات عند النقر عليها
            setTimeout(() => {
                if (suggestionsDiv) {
                    suggestionsDiv.style.display = 'none';
                }
            }, 200);
        });
        
        // إضافة مستمع لأحداث لوحة المفاتيح
        input.addEventListener('keydown', function(e) {
            try {
                const suggestions = suggestionsDiv.querySelectorAll('.suggestion-item');
                
                // التحقق من وجود اقتراحات
                if (suggestions.length === 0) return;
                
                let activeIndex = -1;
                
                // العثور على الاقتراح النشط
                suggestions.forEach((item, index) => {
                    if (item.classList.contains('active')) {
                        activeIndex = index;
                    }
                });
                
                // معالجة مفاتيح الأسهم
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
                }
                
                // تحديث حالة الاقتراحات
                suggestions.forEach((item, index) => {
                    if (item) {
                        item.classList.toggle('active', index === activeIndex);
                    }
                });
            } catch (error) {
                console.error('خطأ في معالجة مفاتيح البحث التلقائي:', error);
            }
        });
    } catch (error) {
        console.error('خطأ في إعداد البحث التلقائي:', error);
    }
}

/**
 * اختيار اقتراح من قائمة البحث التلقائي
 * @param {string} inputId - معرف حقل الإدخال
 * @param {string} value - القيمة المختارة
 */
function selectSuggestion(inputId, value) {
    try {
        // التحقق من صحة المدخلات
        if (!inputId || value === undefined) {
            console.error('معلمات اختيار الاقتراح غير صحيحة');
            return;
        }
        
        const input = document.getElementById(inputId);
        const suggestionsDiv = document.getElementById(inputId + 'Suggestions');
        
        // التحقق من وجود العناصر
        if (input) {
            input.value = value;
        }
        
        if (suggestionsDiv) {
            suggestionsDiv.style.display = 'none';
            
            // تأثير بصري للتأكيد
            input.style.borderColor = '#48bb78';
            setTimeout(() => {
                if (input) {
                    input.style.borderColor = '#667eea';
                }
            }, 500);
        }
    } catch (error) {
        console.error('خطأ في اختيار الاقتراح:', error);
    }
}

/**
 * إعداد البحث التلقائي للموظفين
 * @param {string} nameInputId - معرف حقل اسم الموظف
 * @param {string} positionInputId - معرف حقل الوظيفة
 */
function setupEmployeeAutoComplete(nameInputId, positionInputId) {
    try {
        // التحقق من صحة المدخلات
        if (!nameInputId || !positionInputId) {
            console.error('معلمات البحث التلقائي للموظفين غير صحيحة');
            return;
        }
        
        const nameInput = document.getElementById(nameInputId);
        const positionInput = document.getElementById(positionInputId);
        
        // التحقق من وجود العناصر
        if (!nameInput || !positionInput) {
            console.error('لم يتم العثور على عناصر البحث التلقائي للموظفين');
            return;
        }
        
        // إنشاء عنصر لقائمة الاقتراحات
        const suggestionsDiv = document.createElement('div');
        suggestionsDiv.className = 'suggestions';
        suggestionsDiv.id = nameInputId + 'Suggestions';
        
        // إضافة عنصر الاقتراحات إلى الحاوية
        if (nameInput.parentElement) {
            nameInput.parentElement.appendChild(suggestionsDiv);
        }
        
        // إعداد البحث التلقائي
        setupAutoComplete(nameInputId, nameInputId + 'Suggestions', database.employees);
        
        // إضافة مستمع لحدث الإدخال
        nameInput.addEventListener('input', function() {
            try {
                if (this.value && this.value.trim()) {
                    // اختيار وظيفة عشوائية عند إدخال اسم
                    if (database.positions && database.positions.length > 0 && !positionInput.value) {
                        const randomPosition = database.positions[Math.floor(Math.random() * database.positions.length)];
                        positionInput.value = randomPosition;
                    }
                }
            } catch (error) {
                console.error('خطأ في معالجة إدخال اسم الموظف:', error);
            }
        });
    } catch (error) {
        console.error('خطأ في إعداد البحث التلقائي للموظفين:', error);
    }
}

/**
 * إضافة صف حالة غياب جديد
 */
function addAbsenceRow() {
    try {
        absenceCount++;
        const absenceRows = document.getElementById('absenceRows');
        
        // التحقق من وجود عنصر absenceRows
        if (!absenceRows) {
            console.error('لم يتم العثور على عنصر absenceRows');
            return;
        }
        
        // إنشاء عنصر الصف الجديد
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
                ${database.positions ? database.positions.map(pos => {
                    if (typeof pos === 'string') {
                        return `<option value="${escapeHtml(pos)}">${escapeHtml(pos)}</option>`;
                    }
                    return '';
                }).join('') : ''}
            </select>
        </div>
        <div class="form-group">
            <label style="opacity: 0;">حذف</label>
            <button type="button" class="btn btn-danger" onclick="removeAbsenceRow(this)" title="حذف هذه الحالة">
                <i class="fas fa-trash-alt"></i>
            </button>
        </div>
    `;
        
        // إضافة الصف إلى الحاوية
        absenceRows.appendChild(rowDiv);
        
        // إعداد البحث التلقائي للموظف الجديد
        setupEmployeeAutoComplete(`employeeName${absenceCount}`, `employeePosition${absenceCount}`);
        
        // التمرير إلى الصف الجديد
        setTimeout(() => {
            rowDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    } catch (error) {
        console.error('خطأ في إضافة صف حالة غياب:', error);
        absenceCount--; // التراجع عن زيادة العداد في حالة الخطأ
    }
}

/**
 * حذف صف حالة غياب
 * @param {HTMLElement} btn - زر الحذف
 */
function removeAbsenceRow(btn) {
    try {
        // التحقق من صحة المدخلات
        if (!btn) {
            console.error('زر الحذف غير محدد');
            return;
        }
        
        const row = btn.closest('.absence-row');
        
        // التحقق من وجود الصف
        if (row) {
            // إضافة تأثيرات الحذف
            row.style.transform = 'translateX(100%)';
            row.style.opacity = '0';
            
            // إزالة الصف بعد انتهاء التأثير
            setTimeout(() => {
                if (row.parentNode) {
                    row.remove();
                }
                updateRowNumbers();
            }, 300);
        }
    } catch (error) {
        console.error('خطأ في حذف صف حالة غياب:', error);
    }
}

/**
 * تحديث أرقام الصفوف
 */
function updateRowNumbers() {
    try {
        const rows = document.querySelectorAll('.absence-row');
        
        // التحقق من وجود الصفوف
        if (!rows || rows.length === 0) {
            return;
        }
        
        rows.forEach((row, index) => {
            try {
                const inputs = row.querySelectorAll('input, select');
                
                // التحقق من وجود الحقول
                if (!inputs || inputs.length === 0) {
                    return;
                }
                
                inputs.forEach(input => {
                    try {
                        // التحقق من وجود الحقل
                        if (!input || !input.id) {
                            return;
                        }
                        
                        const oldId = input.id;
                        const newId = oldId.replace(/\d+$/, index + 1);
                        input.id = newId;
                    } catch (error) {
                        console.error('خطأ في تحديث معرف الحقل:', error);
                    }
                });
            } catch (error) {
                console.error('خطأ في تحديث صف:', error);
            }
        });
    } catch (error) {
        console.error('خطأ في تحديث أرقام الصفوف:', error);
    }
}

/**
 * طباعة التقرير
 */
function printReport() {
    try {
        // إخفاء جميع العناصر ما عدا التقرير قبل الطباعة
        const elementsToHide = document.querySelectorAll('.app-header, .form-container, .actions, .status-message');
        
        // التحقق من وجود العناصر
        if (elementsToHide) {
            elementsToHide.forEach(el => {
                if (el && el.style) {
                    el.style.display = 'none';
                }
            });
        }
        
        // طباعة
        window.print();
        
        // إعادة إظهار العناصر بعد الطباعة
        setTimeout(() => {
            if (elementsToHide) {
                elementsToHide.forEach(el => {
                    if (el && el.style) {
                        el.style.display = '';
                    }
                });
            }
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
    try {
        const data = collectFormData();
        const reportId = generateReportId(data);
        
        // التحقق من أن التقرير لم يُرسل مسبقًا
        if (sentReports.has(reportId)) {
            showStatus('تم إرسال هذا التقرير مسبقاً. لا يمكن الإرسال مرة أخرى لتجنب التكرار.', 'error');
            return;
        }
        
        showLoading(true, 'جاري إرسال البيانات...');
        
        // محاكاة إرسال البيانات
        await simulateGoogleSheetsAPI(data);
        
        // إضافة التقرير إلى مجموعة التقارير المرسلة
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
    try {
        // التحقق من صحة البيانات
        if (!data || typeof data !== 'object') {
            return 'unknown_report';
        }
        
        const inspectorName = data.inspectorName || '';
        const location = data.location || '';
        const date = data.date || '';
        const time = data.time || '';
        
        const reportString = `${inspectorName}_${location}_${date}_${time}`;
        
        // استخدام btoa للتشفير Base64 إذا كان متوفرًا
        if (typeof btoa === 'function') {
            return btoa(reportString).replace(/[^a-zA-Z0-9]/g, '');
        } else {
            // بديل بسيط إذا لم يكن btoa متوفرًا
            return reportString.replace(/[^a-zA-Z0-9]/g, '');
        }
    } catch (error) {
        console.error('خطأ في توليد معرف التقرير:', error);
        return 'error_report_id';
    }
}

/**
 * محاكاة API Google Sheets
 * @param {Object} data - بيانات التقرير
 * @returns {Promise} وعد بإرسال البيانات
 */
async function simulateGoogleSheetsAPI(data) {
    return new Promise((resolve, reject) => {
        // استخدام setTimeout لمحاكاة وقت الإرسال
        setTimeout(() => {
            try {
                // التحقق من صحة البيانات
                if (!data || typeof data !== 'object') {
                    throw new Error('بيانات غير صحيحة');
                }
                
                const sheetData = {
                    timestamp: new Date().toLocaleString('ar-EG'),
                    inspectorName: data.inspectorName || '',
                    location: data.location || '',
                    date: data.date || '',
                    time: data.time || '',
                    absenceCount: 0,
                    totalAbsences: 0,
                    workLeaveCount: 0
                };
                
                console.log('🔄 بيانات مرسلة لجوجل شيتس:', sheetData);
                resolve(sheetData);
            } catch (error) {
                console.error('خطأ في محاكاة API Google Sheets:', error);
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
    try {
        // التحقق من صحة المدخلات
        if (!message || !type) {
            console.error('معلمات رسالة الحالة غير صحيحة');
            return;
        }
        
        const statusMessage = document.getElementById('statusMessage');
        
        // التحقق من وجود عنصر رسالة الحالة
        if (statusMessage) {
            statusMessage.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            ${escapeHtml(message)}
        `;
            statusMessage.className = `status-message status-${type}`;
            statusMessage.style.display = 'block';
            statusMessage.classList.add('slide-up');
            
            // إخفاء الرسالة تلقائيًا بعد 6 ثوانٍ
            setTimeout(() => {
                if (statusMessage) {
                    statusMessage.style.display = 'none';
                    statusMessage.classList.remove('slide-up');
                }
            }, 6000);
        }
    } catch (error) {
        console.error('خطأ في عرض رسالة الحالة:', error);
    }
}

/**
 * عرض شاشة التحميل
 * @param {boolean} show - هل تعرض الشاشة أم تخفيها
 * @param {string} message - نص الرسالة
 */
function showLoading(show = true, message = 'جاري المعالجة...') {
    try {
        const overlay = document.getElementById('loadingOverlay');
        
        // التحقق من وجود عنصر شاشة التحميل
        if (overlay) {
            const content = overlay.querySelector('.loading-content h3');
            
            // تحديث نص الرسالة
            if (content) {
                content.textContent = message;
            }
            
            // عرض أو إخفاء شاشة التحميل
            if (show) {
                overlay.style.display = 'flex';
                overlay.classList.add('fade-in');
            } else {
                overlay.style.display = 'none';
                overlay.classList.remove('fade-in');
            }
        }
    } catch (error) {
        console.error('خطأ في عرض شاشة التحميل:', error);
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
    try {
        const inspectorName = document.getElementById('inspectorName');
        const location = document.getElementById('location');
        const date = document.getElementById('date');
        const time = document.getElementById('time');
        
        // التحقق من وجود جميع الحقول
        if (!inspectorName || !location || !date || !time) {
            showStatus('حدث خطأ في النظام. يرجى إعادة تحميل الصفحة.', 'error');
            return false;
        }
        
        const inspectorNameValue = inspectorName.value.trim();
        const locationValue = location.value.trim();
        const dateValue = date.value;
        const timeValue = time.value;
        
        // التحقق من اسم القائم بالمرور
        if (!inspectorNameValue) {
            showStatus('⚠️ يرجى إدخال اسم القائم بالمرور', 'error');
            inspectorName.focus();
            return false;
        }
        
        // التحقق من الجهة
        if (!locationValue) {
            showStatus('⚠️ يرجى إدخال اسم الجهة', 'error');
            location.focus();
            return false;
        }
        
        // التحقق من التاريخ
        if (!dateValue) {
            showStatus('⚠️ يرجى إدخال تاريخ المرور', 'error');
            date.focus();
            return false;
        }
        
        // التحقق من الوقت
        if (!timeValue) {
            showStatus('⚠️ يرجى إدخال وقت المرور', 'error');
            time.focus();
            return false;
        }
        
        // التحقق من صحة التاريخ
        const selectedDate = new Date(dateValue);
        const today = new Date();
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(today.getFullYear() - 1);
        
        // التحقق من أن التاريخ ليس في المستقبل
        if (selectedDate > today) {
            showStatus('⚠️ لا يمكن أن يكون تاريخ المرور في المستقبل', 'error');
            date.focus();
            return false;
        }
        
        // التحقق من أن التاريخ ليس قديمًا جدًا
        if (selectedDate < oneYearAgo) {
            showStatus('⚠️ تاريخ المرور قديم جداً', 'error');
            date.focus();
            return false;
        }
        
        return true;
    } catch (error) {
        console.error('خطأ في التحقق من صحة النموذج:', error);
        showStatus('حدث خطأ في التحقق من صحة البيانات. يرجى المحاولة مرة أخرى.', 'error');
        return false;
    }
}

/**
 * مسح النموذج
 */
function clearForm() {
    // طلب التأكيد من المستخدم
    if (confirm('هل أنت متأكد من رغبتك في مسح جميع البيانات؟')) {
        try {
            const reportForm = document.getElementById('reportForm');
            const absenceRows = document.getElementById('absenceRows');
            const reportPreview = document.getElementById('reportPreview');
            const printBtn = document.getElementById('printBtn');
            const sendBtn = document.getElementById('sendBtn');
            
            // إعادة تعيين النموذج
            if (reportForm) {
                reportForm.reset();
            }
            
            // مسح صفوف الغياب
            if (absenceRows) {
                absenceRows.innerHTML = '';
            }
            
            // إخفاء معاينة التقرير
            if (reportPreview) {
                reportPreview.style.display = 'none';
            }
            
            // إخفاء أزرار الطباعة والإرسال
            if (printBtn) {
                printBtn.style.display = 'none';
            }
            if (sendBtn) {
                sendBtn.style.display = 'none';
            }
            
            // إعادة تعيين العداد
            absenceCount = 0;
            
            // إعادة تعيين التاريخ والوقت الحاليين
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
            
            // إضافة صف غياب أولي
            addAbsenceRow();
            
            showStatus('تم مسح النموذج بنجاح! ✨', 'success');
        } catch (error) {
            console.error('خطأ في مسح النموذج:', error);
            showStatus('حدث خطأ في مسح النموذج. يرجى المحاولة مرة أخرى.', 'error');
        }
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
    // التحقق من صحة المدخلات
    if (text === null || text === undefined) {
        return '';
    }
    
    if (typeof text !== 'string') {
        return String(text);
    }
    
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    
    return text.replace(/[&<>"']/g, function(m) { 
        return map[m] || m; 
    });
}

// =============================================================================
// معالجة الأخطاء العامة
// =============================================================================

window.addEventListener('error', function(e) {
    try {
        console.error('❌ خطأ في التطبيق:', e.error);
        showStatus('حدث خطأ غير متوقع. يرجى إعادة تحميل الصفحة.', 'error');
    } catch (error) {
        console.error('خطأ في معالجة خطأ التطبيق:', error);
    }
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
        
        const dateElement = document.getElementById('date');
        const timeElement = document.getElementById('time');
        
        if (dateElement) {
            dateElement.value = dateStr;
        }
        if (timeElement) {
            timeElement.value = timeStr;
        }
        
        // إعداد البحث التلقائي
        if (database.inspectors) {
            setupAutoComplete('inspectorName', 'inspectorSuggestions', database.inspectors);
        }
        if (database.locations) {
            setupAutoComplete('location', 'locationSuggestions', database.locations);
        }
        
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
            try {
                if (e.ctrlKey && e.key === 'p') {
                    e.preventDefault();
                    const printBtn = document.getElementById('printBtn');
                    if (printBtn && printBtn.style.display !== 'none') {
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
            } catch (error) {
                console.error('خطأ في معالجة اختصارات لوحة المفاتيح:', error);
            }
        });
        
        // إخفاء الاقتراحات عند النقر خارجها
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
                console.error('خطأ في إخفاء الاقتراحات:', error);
            }
        });
        
        // إضافة فئة للجسم بعد تحميل الصفحة
        setTimeout(() => {
            const body = document.body;
            if (body) {
                body.classList.add('loaded');
            }
        }, 100);
        
        console.log('🚀 تم تحميل نظام تقارير المرور الطبية بنجاح');
    } catch (error) {
        console.error('خطأ في تهيئة التطبيق:', error);
        showStatus('حدث خطأ في تهيئة التطبيق. يرجى إعادة تحميل الصفحة.', 'error');
    }
});