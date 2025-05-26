const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// حفظ الشكاوى
app.post('/submit-complaint', (req, res) => {
    const complaint = {
        ...req.body,
        date: new Date().toISOString()
    };

    fs.readFile('data/submissions.json', (err, data) => {
        const submissions = JSON.parse(data || '[]');
        submissions.push(complaint);
        
        fs.writeFile('data/submissions.json', JSON.stringify(submissions), (err) => {
            if (err) return res.status(500).send('Error saving complaint');
            res.send('Complaint submitted successfully');
        });
    });
});
document.addEventListener('DOMContentLoaded', () => {
    // ============== إدارة الخطوات والنموذج ==============
    const form = document.getElementById('passportForm');
    const steps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.progress-step');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentStep = 0;

    function updateForm() {
        steps.forEach((step, index) => {
            step.classList.toggle('active', index === currentStep);
            step.style.display = index === currentStep ? 'block' : 'none';
        });
        
        progressSteps.forEach((step, index) => {
            step.classList.toggle('active', index <= currentStep);
        });
        
        prevBtn.style.display = currentStep === 0 ? 'none' : 'block';
        nextBtn.textContent = currentStep === steps.length - 1 ? 'إرسال' : 'التالي';
    }

    nextBtn.addEventListener('click', () => {
        if (currentStep < steps.length - 1 && validateStep(currentStep)) {
            currentStep++;
            updateForm();
        } else if (currentStep === steps.length - 1) {
            form.requestSubmit();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentStep > 0) {
            currentStep--;
            updateForm();
        }
    });

    // ============== إدارة رفع الملفات ==============
    document.querySelectorAll('.file-input-wrapper').forEach(wrapper => {
        const input = wrapper.querySelector('input[type="file"]');
        const button = wrapper.querySelector('button');
        const label = wrapper.closest('.upload-item').querySelector('label');

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

    // ============== معالجة الإرسال ==============
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        
        // عرض البيانات المراجعة
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

    // ============== التحقق من الحروف الإنجليزية ==============
    document.querySelectorAll('[data-english-only]').forEach(input => {
        input.addEventListener('keydown', validateEnglish);
        input.addEventListener('input', () => sanitizeEnglish(input));
    });

    function validateEnglish(e) {
        const allowed = /^[A-Za-z\s]$/;
        if (!allowed.test(e.key) && !e.ctrlKey) {
            e.preventDefault();
            showErrorTooltip(e.target, 'يسمح فقط بالحروف الإنجليزية');
        }
    }

    function sanitizeEnglish(input) {
        input.value = input.value
            .replace(/[^A-Za-z\s]/g, '')
            .replace(/\s{2,}/g, ' ')
            .trimStart();
    }

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