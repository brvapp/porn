// faqData.js

const faqData = [
  {
    question: "Como faço para enviar uma pergunta?",
    answer: "Você pode enviar suas perguntas através do formulário de contato em nossa página."
  },
  {
    question: "Qual é o prazo de entrega?",
    answer: "O prazo de entrega varia dependendo da sua localização. Entre em contato conosco para obter informações específicas."
  },
  // Adicione mais perguntas e respostas conforme necessário
];

module.exports = faqData;

document.addEventListener("DOMContentLoaded", () => {
  const toggleButtons = document.querySelectorAll('.toggle-answer');

  toggleButtons.forEach(button => {
    button.addEventListener('click', () => {
      const answer = button.nextElementSibling;
      answer.style.display = answer.style.display === 'none' ? 'block' : 'none';
    });
  });
});