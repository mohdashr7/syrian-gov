document.addEventListener('DOMContentLoaded', () => {
    // تبديل القائمة على الجوال
    const hamburger = document.querySelector('.hamburger-menu');
    const navbar = document.querySelector('.navbar');
    hamburger.addEventListener('click', () => {
        navbar.classList.toggle('active');
    });

    // تصفية المعالم
    const filterButtons = document.querySelectorAll('.region-btn');
    const heritageCards = document.querySelectorAll('.heritage-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // إزالة النشاط من جميع الأزرار
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // إضافة النشاط للزر المحدد
            button.classList.add('active');
            
            // تصفية البطاقات
            const selectedRegion = button.dataset.region;
            heritageCards.forEach(card => {
                if (selectedRegion === 'all' || card.dataset.region === selectedRegion) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
});
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger-menu');
    const navbar = document.querySelector('.navbar');

    hamburger.addEventListener('click', () => {
        // تبديل الأنيميشن
        hamburger.classList.toggle('active');
        // تبديل ظهور القائمة
        navbar.classList.toggle('active');
    });
});
