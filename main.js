// بيانات الإكمال التلقائي
const inspectorNames = [
    'د. أحمد محمد',
    'د. محمد علي',
    'د. فاطمة أحمد',
    'د. سارة خالد',
    'د. عمر يوسف'
];

const locations = [
    'مستشفى الملك فهد',
    'مستشفى الملك خالد',
    'مركز صحي الربوة',
    'مركز صحي النزهة',
    'مركز صحي الروضة'
];

// متغيرات عامة
let absenceCount = 0;

// وظائف المساعدة
function showLoading() {
    document.getElementById('loadingOverlay').style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loadingOverlay').style.display = 'none';
}

function showMessage(message, type) {
    const statusMessage = document.getElementById('statusMessage');
    statusMessage.textContent = message;
    statusMessage.className = `status-message status-${type} fade-in`;
    statusMessage.style.display = 'block';
    
    setTimeout(() => {
        statusMessage.style.display = 'none';
    }, 5000);
}

// إضافة صف غياب جديد
function addAbsenceRow() {
    const absenceRows = document.getElementById('absenceRows');
    const rowId = `absence-${absenceCount++}`;
    
    const row = document.createElement('div');
    row.className = 'absence-row slide-up';
    row.id = rowId;
    
    row.innerHTML = `
        <div class="form-group">
            <input type="text" id="${rowId}-name" class="form-control" placeholder="اسم الموظف" required>
        </div>
        <div class="form-group">
            <input type="text" id="${rowId}-position" class="form-control" placeholder="الوظيفة" required>
        </div>
        <div class="form-group">
            <input type="text" id="${rowId}-notes" class="form-control" placeholder="ملاحظات">
        </div>
        <button type="button" class="btn btn-danger" onclick="removeAbsenceRow('${rowId}')">
            <i class="fas fa-trash"></i>
            حذف
        </button>
    `;
    
    absenceRows.appendChild(row);
}

// حذف صف غياب
function removeAbsenceRow(rowId) {
    const row = document.getElementById(rowId);
    row.style.animation = 'fadeOut 0.3s ease-in-out';
    setTimeout(() => {
        row.remove();
    }, 300);
}

// جمع بيانات الغياب
function collectAbsenceData() {
    const absencesList = [];
    const rows = document.querySelectorAll('#absenceRows .absence-row');
    
    rows.forEach((row, index) => {
        const nameInput = row.querySelector('input[id$="-name"]');
        const positionInput = row.querySelector('input[id$="-position"]');
        const notesInput = row.querySelector('input[id$="-notes"]');
        
        if (nameInput && nameInput.value.trim()) {
            absencesList.push({
                name: nameInput.value.trim(),
                position: positionInput ? positionInput.value.trim() : '',
                notes: notesInput ? notesInput.value.trim() : '',
                number: index + 1
            });
        }
    });
    
    return absencesList;
}

// توليد التقرير
function generateReport() {
    showLoading();
    
    setTimeout(() => {
        const inspectorName = document.getElementById('inspectorName').value;
        const location = document.getElementById('location').value;
        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value;
        
        if (!validateForm()) {
            hideLoading();
            return;
        }
        
        const absencesList = collectAbsenceData();
        const reportHTML = generateReportHTML({
            inspectorName,
            location,
            date,
            time,
            absences: absencesList
        });
        
        const reportPreview = document.getElementById('reportPreview');
        const reportContent = document.getElementById('reportContent');
        
        reportContent.innerHTML = reportHTML;
        reportPreview.style.display = 'block';
        reportPreview.classList.add('slide-up');
        
        document.getElementById('printBtn').style.display = 'inline-flex';
        document.getElementById('sendBtn').style.display = 'inline-flex';
        
        hideLoading();
        showMessage('تم إنشاء التقرير بنجاح', 'success');
        
        reportPreview.scrollIntoView({ behavior: 'smooth' });
    }, 1000);
}

// توليد محتوى التقرير
function generateReportHTML(data) {
    const dateObj = new Date(data.date + 'T00:00:00');
    const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    const months = [
        'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
        'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];
    
    const dayName = days[dateObj.getDay()];
    const formattedDate = `${dayName}، ${dateObj.getDate()} ${months[dateObj.getMonth()]}، ${dateObj.getFullYear()}`;
    
    // إنشاء جدول الغياب
    let absenceTableHTML = `
        <table class="absence-table" dir="rtl">
            <thead>
                <tr>
                    <th>م</th>
                    <th>الوظيفة</th>
                    <th>الاسم</th>
                    <th>ملاحظات</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    // إضافة بيانات الغياب للجدول
    data.absences.forEach((absence, index) => {
        absenceTableHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${absence.position}</td>
                <td>${absence.name}</td>
                <td>${absence.notes || ''}</td>
            </tr>
        `;
    });
    
    // إكمال الجدول حتى 6 صفوف
    for (let i = data.absences.length + 1; i <= 6; i++) {
        absenceTableHTML += `
            <tr>
                <td>${i}</td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
        `;
    }
    
    absenceTableHTML += '</tbody></table>';
    
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
                    <td class="highlight"><strong>الساعة:</strong><br>${data.time}</td>
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
                ${data.absences.length > 0 ? 'وجود حالات غياب بدون إذن وهم كالآتي:-' : 'عدم وجود حالات غياب عن الشئونية في ذات يوم المرور'}
            </div>
            
            ${absenceTableHTML}
        </div>
        
        <div class="opinion-section">
            <div class="result-title">الرأي:</div>
            <div class="opinion-box">
                ${data.absences.length > 0 ? 
                    'إحالة التقرير لإدارة الشئون القانونية بالمديرية لإعمال شئونها حيال حالات الغياب عن العمل بدون إذن كما هو موضح بصدر التقرير.' :
                    'حفظ التقرير لعدم وجود حالات غياب عن الشئونية'}
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

// تهيئة الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // إعداد التاريخ والوقت الحاليين
    const now = new Date();
    document.getElementById('date').valueAsDate = now;
    document.getElementById('time').value = now.toTimeString().slice(0,5);
    
    // إضافة صف غياب افتراضي
    addAbsenceRow();
});