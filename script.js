let isSubmitting = false;

document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('#trabalhe form');
    const nomeInput = form?.querySelector('#nome');
    const emailInput = form?.querySelector('#email');
    const mensagemInput = form?.querySelector('#mensagem');
    const submitButton = form?.querySelector('button[type="submit"]');

    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });

    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            if (isSubmitting) {
                showToast('Aguarde o envio anterior terminar.', 'error');
                return;
            }

            const nome = nomeInput?.value.trim();
            const email = emailInput?.value.trim();
            const mensagem = mensagemInput?.value.trim();

            if (!nome || !email || !mensagem) {
                showToast('Preencha todos os campos.', 'error');
                return;
            }

            if (!validateEmail(email)) {
                showToast('Digite um email válido.', 'error');
                return;
            }

            if (!submitButton) return;

            isSubmitting = true;
            const buttonText = submitButton.querySelector('.button-text');
            const spinner = submitButton.querySelector('.spinner');
            if (buttonText && spinner) {
                buttonText.style.display = 'none';
                spinner.style.display = 'inline-block';
                submitButton.disabled = true;
            }

            grecaptcha.ready(function () {
                grecaptcha.execute('AKfycbwFN15pFCEwq0-AygfV6x5t_xV9vVWj_7iyvj71gOPy8eUWGgIw0M6FqwRXYrCpbmTI', { action: 'submit' }).then(function (token) {
                    sendFormToGoogleSheets(nome, email, mensagem, token);
                });
            });
        });
    }

    const telefoneInput = document.querySelector('#telefone');
    if (telefoneInput) {
        maskPhone(telefoneInput);
    }

    const backToTopButton = document.getElementById('backToTop');
    window.addEventListener('scroll', function () {
        if (backToTopButton) {
            backToTopButton.style.display = window.scrollY > 300 ? 'block' : 'none';
        }
    });
    backToTopButton?.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    if (typeof ScrollReveal !== "undefined" && document.querySelector('.section')) {
        ScrollReveal().reveal('.section', {
            duration: 1000,
            origin: 'bottom',
            distance: '50px',
            easing: 'ease-out',
            reset: false
        });
    }
});

async function sendFormToGoogleSheets(nome, email, mensagem, token) {
    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbwFN15pFCEwq0-AygfV6x5t_xV9vVWj_7iyvj71gOPy8eUWGgIw0M6FqwRXYrCpbmTI/exec', {
            method: 'POST',
            body: JSON.stringify({ nome, email, mensagem, token }),
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            throw new Error('Erro no envio do formulário.');
        }

        showToast('Mensagem enviada com sucesso!', 'success');
        document.querySelector('#trabalhe form')?.reset();
    } catch (error) {
        showToast('Erro ao enviar, tente novamente.', 'error');
        console.error('Erro:', error);
    } finally {
        const submitButton = document.querySelector('button[type="submit"]');
        const buttonText = submitButton?.querySelector('.button-text');
        const spinner = submitButton?.querySelector('.spinner');

        if (submitButton && buttonText && spinner) {
            buttonText.style.display = 'inline-block';
            spinner.style.display = 'none';
            submitButton.disabled = false;
        }
        isSubmitting = false;
    }
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

function maskPhone(input) {
    input.addEventListener('input', function () {
        let value = input.value.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);
        input.value = value.length <= 10 ?
            value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3') :
            value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
    });
}

function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function showToast(message, type) {
    document.querySelectorAll('.toast').forEach(t => t.remove()); // Remove toasts antigos

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerText = message;
    document.body.appendChild(toast);

    setTimeout(() => { toast.classList.add('show'); }, 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
}