const gameBoard = document.getElementById('game-board');
const rows = 6; // Número de tentativas
const cols = 5; // Número de letras por tentativa

// Função para criar o tabuleiro do jogo
function createGameBoard() {
for (let i = 0; i < rows; i++) {
const row = document.createElement('div');
row.classList.add('row');

for (let j = 0; j < cols; j++) {
const letterDiv = document.createElement('div');
letterDiv.classList.add('letter', 'empty');
letterDiv.setAttribute('tabindex', '0');
letterDiv.setAttribute('role', 'text');
letterDiv.setAttribute('aria-label', '');
letterDiv.setAttribute('aria-live', 'polite');
letterDiv.setAttribute('aria-roledescription', 'letra');
letterDiv.setAttribute('termo-row', i + 1);
letterDiv.setAttribute('termo-pos', j + 1);
row.appendChild(letterDiv);
}

gameBoard.appendChild(row);
}
}