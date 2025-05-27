document.addEventListener('DOMContentLoaded', () => {
    // ============== العناصر الأساسية ==============
    const form = document.getElementById('passportForm');
    const steps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.progress-step');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentStep = 0;

    // ============== تحديث الواجهة ==============
    function updateForm() {
        steps.forEach((step, index) => {
            step.style.display = index === currentStep ? 'block' : 'none';
            step.classList.toggle('active', index === currentStep);
        });
        
        progressSteps.forEach((step, index) => {
            step.classList.toggle('active', index <= currentStep);
        });
        
        prevBtn.style.display = currentStep === 0 ? 'none' : 'block';
        nextBtn.textContent = currentStep === steps.length - 1 ? 'إرسال' : 'التالي';
    }

    // ============== التنقل بين الخطوات ==============
    nextBtn.addEventListener('click', () => {
        if (validateStep(currentStep)) {
            if (currentStep < steps.length - 1) {
                currentStep++;
                updateForm();
            } else {
                form.dispatchEvent(new Event('submit'));
            }
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentStep > 0) {
            currentStep--;
            updateForm();
        }
    });

    // ============== التحقق من الصحة ==============
    function validateStep(stepIndex) {
        let isValid = true;
        const inputs = steps[stepIndex].querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            if (input.type === 'file') {
                if (input.required && !input.files.length) {
                    showErrorTooltip(input, 'مطلوب رفع الملف');
                    isValid = false;
                }
            } else if (!input.checkValidity()) {
                input.reportValidity();
                isValid = false;
            }
        });
        
        return isValid;
    }

    // ============== رفع الملفات ==============
    document.querySelectorAll('.file-input-wrapper').forEach(wrapper => {
        const input = wrapper.querySelector('input[type="file"]');
        const button = wrapper.querySelector('button');

        button.addEventListener('click', (e) => {
            e.preventDefault();
            input.click();
        });

        input.addEventListener('change', () => {
            const fileName = input.files[0]?.name || 'لم يتم اختيار ملف';
            wrapper.querySelector('.file-name')?.remove();
            button.insertAdjacentHTML('afterend', `<span class="file-name">${fileName}</span>`);
        });
    });

    // ============== التحقق من الحروف الإنجليزية ==============
    const nameInput = document.getElementById('fullName');
    nameInput.addEventListener('keydown', validateEnglish);
    nameInput.addEventListener('input', sanitizeEnglish);

    function validateEnglish(e) {
        const allowed = /^[A-Za-z\s]$/;
        if (!allowed.test(e.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            e.preventDefault();
            showErrorTooltip(e.target, 'يسمح فقط بالحروف الإنجليزية');
        }
    }

    function sanitizeEnglish(e) {
        e.target.value = e.target.value
            .replace(/[^A-Za-z\s]/g, '')
            .replace(/\s{2,}/g, ' ')
            .trimStart();
    }

    // ============== عرض البيانات المراجعة ==============
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        
        document.getElementById('personalSummary').innerHTML = `
            <p>الاسم: ${formData.get('fullName')}</p>
            <p>تاريخ الميلاد: ${formData.get('birthDate')}</p>
            <p>مكان الولادة: ${formData.get('birthPlace')}</p>
        `;

        document.getElementById('documentsSummary').innerHTML = 
            Array.from(formData.getAll('documents'))
                .map(file => `<p>${file.name}</p>`)
                .join('');
    });

    // ============== أدوات مساعدة ==============
    function showErrorTooltip(element, message) {
        const tooltip = document.createElement('div');
        tooltip.className = 'error-tooltip';
        tooltip.textContent = message;
        
        element.parentElement.appendChild(tooltip);
        setTimeout(() => tooltip.remove(), 2000);
    }

    updateForm();
});
// ===== هامبرغر مينيو =====
    const hamburger = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('.navbar');
    
    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
    
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
});
