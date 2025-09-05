// main.js
// جميع كود الجافاسكريبت الخاص بالتطبيق تم نقله هنا من index.html
// تم تحسين التعليقات والتنظيم لجعل التطبيق أكثر احترافية

// قاعدة البيانات المحدثة والموسعة
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

let sentReports = new Set();
let absenceCount = 0;

// ... جميع الدوال كما هي من index.html ...
// تم نقل جميع الدوال كما هي من index.html بدون تغيير
// يمكنك لصق جميع كود الجافاسكريبت هنا من index.html

// --- بداية نقل الدوال ---

// دالة إعداد البحث التلقائي المحسنة
function setupAutoComplete(inputId, suggestionsId, dataArray) {
    const input = document.getElementById(inputId);
    const suggestionsDiv = document.getElementById(suggestionsId);
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
            `<div class="suggestion-item" onclick="selectSuggestion('${inputId}', '${item.replace(/'/g, "\\'")}')">${item}</div>`
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

function selectSuggestion(inputId, value) {
    document.getElementById(inputId).value = value;
    document.getElementById(inputId + 'Suggestions').style.display = 'none';
    // تأثير بصري للتأكيد
    const input = document.getElementById(inputId);
    input.style.borderColor = '#48bb78';
    setTimeout(() => {
        input.style.borderColor = '#667eea';
    }, 500);
}

function setupEmployeeAutoComplete(nameInputId, positionInputId) {
    const nameInput = document.getElementById(nameInputId);
    const positionInput = document.getElementById(positionInputId);
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

function addAbsenceRow() {
    absenceCount++;
    const absenceRows = document.getElementById('absenceRows');
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
                ${database.positions.map(pos => `<option value="${pos}">${pos}</option>`).join('')}
            </select>
        </div>
        <div class="form-group">
            <label><i class="fas fa-sort-numeric-up"></i> عدد الحالات</label>
            <input type="number" id="absenceNumber${absenceCount}" min="1" max="30" value="1">
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

function removeAbsenceRow(btn) {
    const row = btn.closest('.absence-row');
    row.style.transform = 'translateX(100%)';
    row.style.opacity = '0';
    setTimeout(() => {
        row.remove();
        updateRowNumbers();
    }, 300);
}

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

function generateReport() {
    showLoading();
    
    setTimeout(() => {
        const inspectorName = document.getElementById('inspectorName').value;
        const location = document.getElementById('location').value;
        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value;
        
        // التحقق من صحة البيانات
        if (!validateForm()) {
            hideLoading();
            return;
        }
        
        // جمع بيانات الغياب
        const absences = collectAbsenceData();
        
        // توليد محتوى التقرير
        const reportHTML = generateReportHTML({
            inspectorName,
            location,
            date,
            time,
            absences
        });
        
        // عرض التقرير
        const reportContainer = document.getElementById('reportContent');
        reportContainer.innerHTML = reportHTML;
        
        // إظهار القسم الخاص بالتقرير
        const reportPreview = document.getElementById('reportPreview');
        reportPreview.style.display = 'block';
        reportPreview.classList.add('fade-in');
        
        // إظهار أزرار الطباعة والإرسال
        document.getElementById('printBtn').style.display = 'inline-flex';
        document.getElementById('sendBtn').style.display = 'inline-flex';
        
        hideLoading();
        showStatus('تم إنشاء التقرير بنجاح', 'success');
        
        // التمرير إلى التقرير
        reportPreview.scrollIntoView({ behavior: 'smooth' });
    }, 1000);

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

function collectFormData() {
    return {
        inspectorName: document.getElementById('inspectorName').value.trim(),
        location: document.getElementById('location').value.trim(),
        date: document.getElementById('date').value,
        time: document.getElementById('time').value
    };
}

function generateReportHTML(data) {
    const dateObj = new Date(data.date + 'T00:00:00');
    const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    const months = [
        'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
        'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];
    const dayName = days[dateObj.getDay()];
    const formattedDate = `${dayName}، ${dateObj.getDate()} ${months[dateObj.getMonth()]}، ${dateObj.getFullYear()}`;

    const dateObj = new Date(data.date + 'T00:00:00');
    const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    const months = [
        'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
        'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];
    const dayName = days[dateObj.getDay()];
    const formattedDate = `${dayName}، ${dateObj.getDate()} ${months[dateObj.getMonth()]}، ${dateObj.getFullYear()}`;
    // حساب إجمالي حالات الغياب من البيانات المدخلة
    const absenceInputs = document.querySelectorAll('#absenceTable input[id^="absenceCount"]');
    let totalAbsences = 0;
    absenceInputs.forEach(input => {
        const value = parseInt(input.value) || 0;
        totalAbsences += value;
    });
    const hasAbsences = totalAbsences > 0;
    const opinion = hasAbsences ? 
        'إحالة التقرير لإدارة الشئون القانونية بالمديرية لإعمال شئونها حيال حالات الغياب عن العمل بدون إذن كما هو موضح بصدر التقرير.' :
        'حفظ التقرير لعدم وجود حالات غياب عن الشئونية';
            // جمع بيانات الغياب من الحقول المدخلة
    const absences = [];
    const absenceRows = document.querySelectorAll('#absenceRows .absence-row');
    absenceRows.forEach(row => {
        const nameInput = row.querySelector('input[type="text"]');
        const positionSelect = row.querySelector('select');
        if (nameInput && nameInput.value.trim()) {
            absences.push({
                name: nameInput.value.trim(),
                position: positionSelect ? positionSelect.value : '',
            });
        }
    });

    // إنشاء جدول الغياب
    let absenceTableHTML = `
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

    // إضافة البيانات المدخلة إلى الجدول
    absences.forEach((absence, index) => {
        absenceTableHTML += `
            <tr>
                <td><strong>${index + 1}</strong></td>
                <td>${absence.position}</td>
                <td>${absence.name}</td>
                <td>1</td>
                <td>${index === 0 ? 'مرفق كشف يبدأ برقم 1' : 
                     index === absences.length - 1 ? `مرفق كشف ينتهي برقم ${absences.length}` : 
                     'مرفق كشف برقم'}</td>
            </tr>
        `;
    });

    // إكمال الجدول حتى 6 صفوف
    for (let i = absences.length + 1; i <= 6; i++) {
        absenceTableHTML += `
            <tr>
                <td><strong>${i}</strong></td>
                <td></td>
                <td></td>
                <td></td>
                <td>مرفق كشف برقم</td>
            </tr>
        `;
    absenceTableHTML += `
            </tbody>
        </table>
    `;
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
                    <td class="highlight"><strong>اسم القائم بالمرور:</strong><br>${data.inspectorName}</td>
                    <td class="highlight"><strong>الجهة:</strong><br>${data.location}</td>
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
                <strong>بالمرور علي ${data.location}</strong><br>
                <strong>لعمل انضباط إداري للعاملين تبين لنا:</strong> 
                ${hasAbsences ? 
                    'وجود حالات غياب بدون إذن وهم كالآتي:-' : 
                    'عدم وجود حالات غياب عن الشئونية في ذات يوم المرور'
                }
                <div style="text-align: center; margin: 6mm 0;">
                    <span class="cases-count-box">
                        <strong>عدد الحالات:- <span id="totalCasesDisplay">${hasAbsences ? totalAbsences : 'لا يوجد'}</span></strong>
                    </span>
                </div>
            </div>
            ${absenceTableHTML}
        </div>
        <div class="opinion-section">
            <div class="result-title">الرأي:</div>
            <div class="opinion-box" id="opinionText">
                ${opinion}
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
                <div class="signature-name">${data.inspectorName}</div>
            </div>
        </div>
    `;
}

function formatTimeSimple(time) {
    return time; // عرض الوقت كما هو مدخل
}

// دالة تحديث إجمالي حالات الغياب
function updateTotalAbsences() {
    const absenceInputs = document.querySelectorAll('#absenceTable input[id^="absenceCount"]');
    let totalAbsences = 0;
    absenceInputs.forEach(input => {
        const value = parseInt(input.value) || 0;
        totalAbsences += value;
    });
    // تحديث عرض إجمالي الحالات
    const totalDisplay = document.getElementById('totalCasesDisplay');
    if (totalDisplay) {
        totalDisplay.textContent = totalAbsences > 0 ? totalAbsences : 'لا يوجد';
    }
    // تحديث النص في خانة الرأي
    const opinionElement = document.getElementById('opinionText');
    if (opinionElement) {
        const hasAbsences = totalAbsences > 0;
        const opinion = hasAbsences ? 
            'إحالة التقرير لإدارة الشئون القانونية بالمديرية لإعمال شئونها حيال حالات الغياب عن العمل بدون إذن كما هو موضح بصدر التقرير.' :
            'حفظ التقرير لعدم وجود حالات غياب عن الشئونية';
        opinionElement.textContent = opinion;
    }
    // تحديث أرقام البداية والنهاية في الجدول
    updateTableNumbers(totalAbsences);
}

function updateTableNumbers(totalAbsences) {
    // تحديث الصف الأول والثاني بالأرقام المناسبة
    const firstRow = document.querySelector('#absenceTable tbody tr:first-child td:first-child');
    const secondRow = document.querySelector('#absenceTable tbody tr:nth-child(2) td:first-child');
    if (firstRow) {
        firstRow.innerHTML = 'مرفق كشف يبدأ برقم 1';
    }
    if (secondRow && totalAbsences > 0) {
        secondRow.innerHTML = `مرفق كشف ينتهي برقم ${totalAbsences}`;
    } else if (secondRow) {
        secondRow.innerHTML = 'مرفق كشف ينتهي برقم';
    }
}

function printReport() {
    // إخفاء جميع العناصر ما عدا التقرير قبل الطباعة
    const elementsToHide = document.querySelectorAll('.app-header, .form-container, .actions, .status-message');
    elementsToHide.forEach(el => el.style.display = 'none');
    // طباعة
    window.print();
    // إعادة إظهار العناصر بعد الطباعة
    setTimeout(() => {
        elementsToHide.forEach(el => el.style.display = '');
    }, 1000);
}

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
        showStatus('حدث خطأ في إرسال البيانات. يرجى المحاولة مرة أخرى.', 'error');
    } finally {
        showLoading(false);
    }
}

function generateReportId(data) {
    return btoa(`${data.inspectorName}_${data.location}_${data.date}_${data.time}`).replace(/[^a-zA-Z0-9]/g, '');
}

async function simulateGoogleSheetsAPI(data) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const sheetData = {
                timestamp: new Date().toLocaleString('ar-EG'),
                inspectorName: data.inspectorName,
                location: data.location,
                date: data.date,
                time: data.time,
                absenceCount: data.absences ? data.absences.length : 0,
                totalAbsences: data.absences ? data.absences.reduce((sum, a) => sum + a.number, 0) : 0,
                workLeaveCount: 0
            };
            console.log('🔄 بيانات مرسلة لجوجل شيتس:', sheetData);
            resolve(sheetData);
        }, 2000);
    });
}

function showStatus(message, type) {
    const statusMessage = document.getElementById('statusMessage');
    statusMessage.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        ${message}
    `;
    statusMessage.className = `status-message status-${type}`;
    statusMessage.style.display = 'block';
    statusMessage.classList.add('slide-up');
    setTimeout(() => {
        statusMessage.style.display = 'none';
        statusMessage.classList.remove('slide-up');
    }, 6000);
}

function showLoading(show, message = 'جاري المعالجة...') {
    const overlay = document.getElementById('loadingOverlay');
    const content = overlay.querySelector('.loading-content h3');
    if (show) {
        content.textContent = message;
        overlay.style.display = 'flex';
        overlay.classList.add('fade-in');
    } else {
        overlay.style.display = 'none';
        overlay.classList.remove('fade-in');
    }
}

function validateForm() {
    const inspectorName = document.getElementById('inspectorName').value.trim();
    const location = document.getElementById('location').value.trim();
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    if (!inspectorName) {
        showStatus('⚠️ يرجى إدخال اسم القائم بالمرور', 'error');
        document.getElementById('inspectorName').focus();
        return false;
    }
    if (!location) {
        showStatus('⚠️ يرجى إدخال اسم الجهة', 'error');
        document.getElementById('location').focus();
        return false;
    }
    if (!date) {
        showStatus('⚠️ يرجى إدخال تاريخ المرور', 'error');
        document.getElementById('date').focus();
        return false;
    }
    if (!time) {
        showStatus('⚠️ يرجى إدخال وقت المرور', 'error');
        document.getElementById('time').focus();
        return false;
    }
    // التحقق من التاريخ
    const selectedDate = new Date(date);
    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);
    if (selectedDate > today) {
        showStatus('⚠️ لا يمكن أن يكون تاريخ المرور في المستقبل', 'error');
        document.getElementById('date').focus();
        return false;
    }
    if (selectedDate < oneYearAgo) {
        showStatus('⚠️ تاريخ المرور قديم جداً', 'error');
        document.getElementById('date').focus();
        return false;
    }
    return true;
}

function clearForm() {
    if (confirm('هل أنت متأكد من رغبتك في مسح جميع البيانات؟')) {
        document.getElementById('reportForm').reset();
        document.getElementById('absenceRows').innerHTML = '';
        document.getElementById('reportPreview').style.display = 'none';
        document.getElementById('printBtn').style.display = 'none';
        document.getElementById('sendBtn').style.display = 'none';
        absenceCount = 0;
        // إعادة تعيين التاريخ والوقت الحاليين
        setCurrentDateTime();
        addAbsenceRow();
        showStatus('تم مسح النموذج بنجاح! ✨', 'success');
    }
}

function setCurrentDateTime() {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().slice(0, 5);
    document.getElementById('date').value = dateStr;
    document.getElementById('time').value = timeStr;
}

// تهيئة التطبيق
window.addEventListener('DOMContentLoaded', function() {
    setCurrentDateTime();
    setupAutoComplete('inspectorName', 'inspectorSuggestions', database.inspectors);
    setupAutoComplete('location', 'locationSuggestions', database.locations);
    addAbsenceRow();
    document.getElementById('reportForm').addEventListener('submit', function(e) {
        e.preventDefault();
        generateReport();
    });
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'p') {
            e.preventDefault();
            if (document.getElementById('printBtn').style.display !== 'none') {
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
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.form-group')) {
            document.querySelectorAll('.suggestions').forEach(s => {
                s.style.display = 'none';
            });
        }
    });
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
    console.log('🚀 تم تحميل نظام تقارير المرور الطبية بنجاح');
});

// معالجة الأخطاء العامة
window.addEventListener('error', function(e) {
    console.error('❌ خطأ في التطبيق:', e.error);
    showStatus('حدث خطأ غير متوقع. يرجى إعادة تحميل الصفحة.', 'error');
});

// حفظ البيانات محلياً (اختياري)
function saveDataLocally() {
    const data = collectFormData();
    localStorage.setItem('lastReport', JSON.stringify(data));
}

function loadLastReport() {
    const saved = localStorage.getItem('lastReport');
    if (saved && confirm('تم العثور على بيانات محفوظة. هل تريد استعادتها؟')) {
        const data = JSON.parse(saved);
        populateForm(data);
    }
}

function populateForm(data) {
    document.getElementById('inspectorName').value = data.inspectorName || '';
    document.getElementById('location').value = data.location || '';
    document.getElementById('date').value = data.date || '';
    document.getElementById('time').value = data.time || '';
    document.getElementById('absenceRows').innerHTML = '';
    absenceCount = 0;
    if (data.absences && data.absences.length > 0) {
        data.absences.forEach(absence => {
            addAbsenceRow();
            const currentCount = absenceCount;
            document.getElementById(`employeeName${currentCount}`).value = absence.name || '';
            document.getElementById(`employeePosition${currentCount}`).value = absence.position || '';
            document.getElementById(`absenceNumber${currentCount}`).value = absence.number || 1;
        });
    } else {
        addAbsenceRow();
    }
}
// --- نهاية نقل الدوال ---
