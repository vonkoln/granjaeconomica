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

            const nome = nomeInput.value.trim();
            const email = emailInput.value.trim();
            const mensagem = mensagemInput.value.trim();

            if (!nome || !email || !mensagem) {
                showToast('Preencha todos os campos.', 'error');
                return;
            }

            if (!validateEmail(email)) {
                showToast('Digite um email válido.', 'error');
                return;
            }

            isSubmitting = true;
            const buttonText = submitButton.querySelector('.button-text');
            const spinner = submitButton.querySelector('.spinner');
            buttonText.style.display = 'none';
            spinner.style.display = 'inline-block';
            submitButton.disabled = true;

            grecaptcha.ready(function () {
                grecaptcha.execute('6Lfo8CYrAAAAANgEgTVF3JauSUqOSia0mfGhB8cS', { action: 'submit' }).then(function (token) {
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
        if (window.scrollY > 300) {
            backToTopButton.style.display = 'block';
        } else {
            backToTopButton.style.display = 'none';
        }
    });
    backToTopButton.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    if (typeof ScrollReveal !== "undefined") {
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
        await fetch('https://script.https://script.google.com/macros/s/AKfycbxOhvdkSwtGPrXCn1wmerPs19r7s6L2vSaYVkSuVPgyBjIS2qq_TVEwp23J40bagtEI/exec.com/macros/s/1F5IY13xcB3vWZHvbXtALJaWXkVKL2ShVJPKDOIJS4_4gaVTIfs5-Pv-w/exec', {
            method: 'POST',
            body: JSON.stringify({ nome, email, mensagem, token }),
            headers: { 'Content-Type': 'application/json' }
        });
        showToast('Mensagem enviada com sucesso!', 'success');
        document.querySelector('#trabalhe form').reset();
    } catch (error) {
        showToast('Erro ao enviar, tente novamente.', 'error');
        console.error('Erro:', error);
    } finally {
        const submitButton = document.querySelector('button[type="submit"]');
        const buttonText = submitButton.querySelector('.button-text');
        const spinner = submitButton.querySelector('.spinner');
        buttonText.style.display = 'inline-block';
        spinner.style.display = 'none';
        submitButton.disabled = false;
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
        if (value.length <= 10) {
            input.value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
        } else {
            input.value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
        }
    });
}

function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function showToast(message, type) {
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
