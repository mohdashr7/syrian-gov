document.getElementById('complaintForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        fullName: document.querySelector('#complaintForm input[type="text"]').value,
        nationalId: document.querySelector('#complaintForm input[type="text"]').value,
        email: document.querySelector('#complaintForm input[type="email"]').value,
        message: document.querySelector('#complaintForm textarea').value
    };

    try {
        const response = await fetch('/submit-complaint', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            alert('تم إرسال الشكوى بنجاح');
            window.location.href = 'index.html';
        } else {
            alert('حدث خطأ أثناء الإرسال');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('فشل في الاتصال بالسيرفر');
    }
});
// دالة الترجمة
function applyTranslations(lang) {
    // تحديث سمة اللغة
    document.documentElement.lang = lang;
    
    // تطبيق الترجمات
    document.querySelectorAll('[data-translate]').forEach(el => {
        const key = el.dataset.translate;
        el.textContent = translations[lang][key] || el.textContent;
    });
    
    // حفظ اللغة المفضلة
    localStorage.setItem('preferredLang', lang);
}

// تحميل اللغة المفضلة
const preferredLang = localStorage.getItem('preferredLang') || 'ar';
applyTranslations(preferredLang);

// أحداث أزرار التبديل
document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const lang = btn.dataset.lang;
        applyTranslations(lang);
    });
});
// في ملف passport.js
function updateFormLabels() {
    const lang = document.documentElement.lang;
    document.getElementById('submitBtn').textContent = lang === 'ku' ? 'Şandin' : 'إرسال';
}