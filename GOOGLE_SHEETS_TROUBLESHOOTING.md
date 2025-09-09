# استكشاف أخطاء إرسال البيانات إلى Google Sheets وإصلاحها

## المشكلة الشائعة

عند الضغط على زر "إرسال لجوجل شيتس"، يظهر رسالة "حدث خطأ" بدلاً من إرسال البيانات بنجاح.

## الأسباب المحتملة والإصلاحات

### 1. مشكلة في إعداد Google Apps Script

**الخطأ:** يتم إعادة توجيه المستخدم إلى صفحة تسجيل الدخول بدلاً من تنفيذ النص البرمجي.

**الحل:**
1. افتح Google Sheet الخاص بك
2. انتقل إلى `Extensions` > `Apps Script`
3. انقر على زر "Deploy" (النشر) في الزاوية العلوية اليمنى
4. اختر "Manage deployments" (إدارة النشر)
5. انقر على رمز القلم لتعديل النشر الحالي
6. في قسم "Who has access" (من لديه حق الوصول)، اختر أحد الخيارات التالية:
   - **للاستخدام الشخصي:** "Anyone with Google" (أي شخص لديه حساب Google)
   - **للاستخدام العام:** "Anyone" (أي شخص)
7. انقر على "Deploy" (نشر) وانتظر حتى يكتمل النشر

### 2. مشكلة في هيكل العمود

**الخطأ:** البيانات لا تظهر في Google Sheet بالشكل الصحيح.

**الحل:**
تأكد من أن Google Sheet الخاص بك يحتوي على الأعمدة التالية بالترتيب المحدد:
```
Date | Time | Inspector | Location | Count absence
```

### 3. مشكلة في صلاحيات الوصول

**الخطأ:** رسالة خطأ تشير إلى عدم وجود صلاحيات كافية.

**الحل:**
1. في Google Apps Script، تأكد من أن النص البرمجي يحتوي على التعليمة التالية في دالة `doPost`:
   ```javascript
   const CORS_HEADERS = {
     "Access-Control-Allow-Origin": "*",
     "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
     "Access-Control-Allow-Headers": "Content-Type",
     "Content-Type": "application/json"
   };
   ```
2. تأكد من أن النص البرمجي يُرجع الاستجابة بالطريقة الصحيحة:
   ```javascript
   return ContentService
     .createTextOutput(JSON.stringify({
       success: true,
       message: 'Data added to spreadsheet successfully'
     }))
     .setMimeType(ContentService.MimeType.JSON)
     .setHeaders(CORS_HEADERS);
   ```

### 4. مشكلة في الاتصال بالإنترنت

**الخطأ:** رسالة تشير إلى فشل الاتصال.

**الحل:**
1. تحقق من اتصال الإنترنت
2. حاول مرة أخرى بعد بضع دقائق
3. تأكد من عدم وجود جدار ناري يحظر الاتصال

## خطوات الاختبار

### 1. اختبار URL Google Apps Script مباشرة

افتح المتصفح وانتقل إلى الرابط التالي:
```
https://script.google.com/macros/s/AKfycbxSMXxfqxfQ4_x00ydjA_I9vAXre5HLT6jEafVk6uFCMM-9niITztvHdXh5VKvu06Q/exec
```

يجب أن ترى استجابة JSON مثل:
```json
{
  "success": true,
  "message": "Google Apps Script is running",
  "timestamp": "2023-10-15T10:30:00.000Z"
}
```

إذا تم إعادة توجيهك إلى صفحة تسجيل الدخول، فهذا يعني أن مشكلة الوصول لم تتم حلها بعد.

### 2. اختبار إرسال بيانات تجريبية

استخدم ملف [test-google-sheets-integration.html](file:///Users/tarekzhran/Documents/report/test-google-sheets-integration.html) المرفق لاختبار إرسال البيانات:
1. افتح الملف في المتصفح
2. انقر على "إرسال البيانات التجريبية" لإرسال بيانات تجريبية

## معلومات إضافية

### متطلبات هيكل Google Sheet

تأكد من أن Google Sheet الخاص بك يحتوي على هيكل العمود التالي:

| Date | Time | Inspector | Location | Count absence |
|------|------|-----------|----------|---------------|
|      |      |           |          |               |

### متطلبات النص البرمجي Google Apps Script

يجب أن يحتوي النص البرمجي على الوظائف التالية:
1. `doGet()` - للرد على طلبات GET
2. `doPost()` - للرد على طلبات POST
3. `doOptions()` - للتعامل مع طلبات CORS OPTIONS

## إذا استمرت المشكلة

إذا استمرت المشكلة بعد تجربة جميع الحلول أعلاه:

1. **تحقق من سجلات Google Apps Script:**
   - في محرر Google Apps Script، انتقل إلى "View" > "Logs"
   - أو انظر إلى علامة التبويب "Executions" لرؤية الأخطاء الأخيرة

2. **تحقق من وحدة تحكم المتصفح:**
   - افتح أدوات المطور (F12)
   - انتقل إلى علامة التبويب "Console"
   - ابحث عن أي رسائل خطأ

3. **اتصل بالدعم:**
   - إذا كنت لا تزال تواجه مشكلة، يرجى تقديم:
     - لقطة شاشة للخطأ
     - محتوى وحدة تحكم المتصفح
     - معلومات حول إعدادات Google Apps Script

## إعداد Google Apps Script خطوة بخطوة

### الخطوة 1: فتح Google Apps Script

1. افتح Google Sheet الخاص بك
2. انتقل إلى `Extensions` > `Apps Script`

### الخطوة 2: إضافة الكود

احذف أي كود موجود ولصق الكود التالي:

```javascript
/**
 * Google Apps Script for Medical Inspection Reports
 * This script handles POST requests from the web application
 */

// CORS headers for web requests
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json"
};

/**
 * Handle POST requests to add data to the spreadsheet
 */
function doPost(e) {
  try {
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    
    // Get the active spreadsheet and sheet
    const sheet = SpreadsheetApp.getActiveSheet();
    
    // Add headers if the sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Date', 'Time', 'Inspector', 'Location', 'Count absence']);
    }
    
    // Prepare the data row in the correct order
    const rowData = [
      data.date || '',
      data.time || '',
      data.inspector || '',
      data.location || '',
      data.countAbsence || 0
    ];
    
    // Add the data to the sheet
    sheet.appendRow(rowData);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Data added to spreadsheet successfully'
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(CORS_HEADERS);
      
  } catch (error) {
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: 'Error adding data to spreadsheet',
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(CORS_HEADERS);
  }
}

/**
 * Handle GET requests for health check
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      success: true,
      message: 'Google Apps Script is running',
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders(CORS_HEADERS);
}

/**
 * Handle OPTIONS requests for CORS preflight
 */
function doOptions(e) {
  return ContentService
    .createTextOutput('')
    .setHeaders(CORS_HEADERS);
}
```

### الخطوة 3: النشر كتطبيق ويب

1. انقر على زر "Deploy" (نشر) في الزاوية العلوية اليمنى
2. اختر "New deployment" (نشر جديد)
3. في قسم "Select type" (اختر النوع)، اختر "Web app" (تطبيق ويب)
4. اضبط الخيارات التالية:
   - **Description** (الوصف): Medical Inspection Reports API
   - **Execute as** (التنفيذ باسم): Me (أنا)
   - **Who has access** (من لديه حق الوصول): Anyone (أي شخص)
5. انقر على "Deploy" (نشر)
6. في مربع الحوار الذي يظهر، انقر على "Authorize access" (تفويض الوصول)
7. اختر حساب Google الخاص بك إذا طُلب منك ذلك
8. راجع واقبل الأذونات

### الخطوة 4: اختبار النشر

1. بعد النشر، ستحصل على URL جديد
2. انسخ هذا URL واستخدمه في التطبيق
3. افتح الملف [test-google-sheets-integration.html](file:///Users/tarekzhran/Documents/report/test-google-sheets-integration.html) لاختبار الإرسال