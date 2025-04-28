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