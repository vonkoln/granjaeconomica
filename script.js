let isSubmitting = false;
let phoneInputField;
let phoneInput;

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('formulario');
    const nomeInput = form?.querySelector('#nome');
    const emailInput = form?.querySelector('#email');
    phoneInputField = form?.querySelector('#telefone');
    const mensagemInput = form?.querySelector('#mensagem');
    const submitButton = form?.querySelector('button[type="submit"]');

    // Inicializa intl-tel-input no campo telefone
    phoneInput = window.intlTelInput(phoneInputField, {
        initialCountry: "auto",
        geoIpLookup: getIp,
        utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
    });

    // Sticky Header
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Navegação Suave
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });

    // Botão Voltar ao Topo
    const backToTopButton = document.getElementById('backToTop');
    window.addEventListener('scroll', function () {
        backToTopButton.style.display = window.scrollY > 300 ? 'block' : 'none';
    });
    backToTopButton.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Animações ScrollReveal
    if (typeof ScrollReveal !== "undefined") {
        ScrollReveal().reveal('.section, .hero', {
            duration: 1000,
            origin: 'bottom',
            distance: '50px',
            easing: 'ease-out',
            reset: false
        });
    }

    // Envio do Formulário
    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            if (isSubmitting) {
                showToast('Aguarde o envio anterior terminar.', 'error');
                return;
            }

            const nome = nomeInput?.value.trim();
            const email = emailInput?.value.trim();
            const telefone = phoneInput.getNumber(); // E.164 format
            const mensagem = mensagemInput?.value.trim();

            if (!nome || !email || !telefone || !mensagem) {
                showToast('Preencha todos os campos.', 'error');
                return;
            }

            if (!validateEmail(email)) {
                showToast('Digite um email válido.', 'error');
                return;
            }

            if (!phoneInput.isValidNumber()) {
                showToast('Digite um telefone válido.', 'error');
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
                    sendFormToGoogleSheets(nome, email, telefone, mensagem, token);
                });
            });
        });
    }
});

// Função para envio para Google Sheets
async function sendFormToGoogleSheets(nome, email, telefone, mensagem, token) {
    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbyzaGqzAIMbB5RxPoJyz2W-Z3Hdxk5xYTB6jRZ0IkV-v0s88LlfgwTxlyEJ3m0zQ1RH/exec', {
            method: 'POST',
            body: JSON.stringify({ nome, email, telefone, mensagem, token }),
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            throw new Error('Erro no envio do formulário.');
        }

        showToast(`Obrigado ${nome}, seus dados foram encaminhados com sucesso!`, 'success');
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

// Scroll suave para seções
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Validação de email
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Toasts de alerta
function showToast(message, type) {
    document.querySelectorAll('.toast').forEach(t => t.remove());

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

// Função para buscar IP e detectar país automaticamente
function getIp(callback) {
    fetch('https://ipinfo.io/json?token=<your_token_here>', { headers: { 'Accept': 'application/json' }})
    .then((resp) => resp.json())
    .catch(() => {
        return { country: 'BR' };
    })
    .then((resp) => callback(resp.country));
}
