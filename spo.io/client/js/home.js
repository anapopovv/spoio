function openTab(tabId) {
    // Esconder todo o conteúdo das abas
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => content.classList.remove('active'));

    // Remover a classe "active" de todos os botões
    const tabButtons = document.querySelectorAll('.tab-buttons button');
    tabButtons.forEach(button => button.classList.remove('active'));

    // Mostrar o conteúdo da aba clicada
    document.getElementById(tabId).classList.add('active');

    // Adicionar a classe "active" ao botão da aba ativa
    event.currentTarget.classList.add('active');
  }

