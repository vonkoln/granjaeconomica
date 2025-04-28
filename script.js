document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('#trabalhe form');
  const nomeInput = form?.querySelector('#nome');
  const emailInput = form?.querySelector('#email');
  const mensagemInput = form?.querySelector('#mensagem');
  const submitButton = form?.querySelector('button[type="submit"]');

  if (form) {
      form.addEventListener('submit', function(event) {
          event.preventDefault();

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

          submitButton.disabled = true;
          submitButton.textContent = 'Enviando...';

          // Aqui é onde enviamos para o Google Sheets
          fetch('https://script.google.com/macros/s/AKfycbyIaMc8-EO-3hkRTkUvpACaZVK0ztUiD8Cg0eaSsEr2IycqBISWA4rc-UzQBiaUkzKD/exec', {
              method: 'POST',
              body: JSON.stringify({
                  nome: nome,
                  email: email,
                  mensagem: mensagem
              }),
              headers: {
                  'Content-Type': 'application/json'
              }
          })
          .then(response => response.json())
          .then(data => {
              showToast('Mensagem enviada com sucesso!', 'success');
              form.reset();
          })
          .catch(error => {
              console.error('Erro:', error);
              showToast('Erro ao enviar, tente novamente.', 'error');
          })
          .finally(() => {
              submitButton.disabled = false;
              submitButton.textContent = 'Enviar';
          });
      });
  }
});

// Toast e outras funções (iguais as anteriores)
