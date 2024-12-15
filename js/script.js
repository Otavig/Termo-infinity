document.addEventListener('DOMContentLoaded', () => {
    const inputContainer = document.getElementById('inputContainer');
    const totalRows = 6;
    const lettersPerRow = 5;

    let selectedCell = null;
    let currentRow = 0;
    let currentCellIndex = 0;

    const validWords = ["CASAs", "PÃOS", "CAFEs", "LIVROs", "VIDROs", "MELÃOS"];

    // Cria as linhas e células dinamicamente
    for (let i = 0; i < totalRows; i++) {
        const row = document.createElement('div');
        row.classList.add('row');
        row.setAttribute('data-row', i);

        for (let j = 0; j < lettersPerRow; j++) {
            const cell = document.createElement('div');
            cell.setAttribute('data-row', i);
            cell.setAttribute('data-cell', j);
            cell.classList.add('cell');
            if (i !== 0) cell.classList.add('locked'); // Bloqueia células que não são da primeira fileira

            cell.addEventListener('click', () => selectCell(cell));
            row.appendChild(cell);
        }
        inputContainer.appendChild(row);
    }

    // Função para selecionar um quadrado
    function selectCell(cell) {
        if (cell.classList.contains('locked')) return; // Impede seleção de células bloqueadas

        if (selectedCell) {
            selectedCell.classList.remove('selected');
        }
        selectedCell = cell;
        selectedCell.classList.add('selected');
        currentRow = parseInt(cell.getAttribute('data-row'));
        currentCellIndex = parseInt(cell.getAttribute('data-cell'));
    }

    // Captura o evento de tecla para editar o quadrado selecionado
    document.addEventListener('keydown', (e) => {
        if (!selectedCell || selectedCell.classList.contains('locked')) return;

        if (e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
            selectedCell.textContent = e.key.toUpperCase();
            moveToNextCell();
        } else if (e.key === 'Backspace') {
            selectedCell.textContent = '';
            moveToPreviousCell();
        } else if (e.key === 'Enter') {
            const currentWord = getCurrentWord(currentRow);
            if (currentWord.length === lettersPerRow) {
                if (isValidWord(currentWord)) {
                    unlockNextRow();
                } else {
                    const suggestions = suggestWord(currentWord);
                    alert(`Palavra inválida. Você quis dizer: ${suggestions.join(', ')}?`);
                }
            } else {
                alert('Caracteres insuficientes');
            }
        }
    });

    // Move para a próxima célula
    function moveToNextCell() {
        if (currentCellIndex < lettersPerRow - 1) {
            currentCellIndex++;
        } else {
            return;
        }

        updateSelectedCell(currentRow, currentCellIndex);
    }

    // Move para a célula anterior
    function moveToPreviousCell() {
        if (currentCellIndex > 0) {
            currentCellIndex--;
        } else {
            return;
        }

        updateSelectedCell(currentRow, currentCellIndex);
    }

    // Atualiza a célula selecionada
    function updateSelectedCell(row, cellIndex) {
        const nextCell = document.querySelector(
            `[data-row="${row}"][data-cell="${cellIndex}"]`
        );

        if (nextCell) {
            if (selectedCell) {
                selectedCell.classList.remove('selected');
            }
            selectedCell = nextCell;
            selectedCell.classList.add('selected');
        }
    }

    // Obtém a palavra formada na fileira atual
    function getCurrentWord(row) {
        const cells = document.querySelectorAll(`[data-row="${row}"]`);
        return Array.from(cells)
            .map((cell) => cell.textContent.trim())
            .join('');
    }

    // Verifica se a palavra é válida
    function isValidWord(word) {
        return validWords.includes(word);
    }

    // Sugere palavras semelhantes
    function suggestWord(word) {
        const normalizedWord = normalizeString(word);
        return validWords.filter((validWord) => {
            return normalizeString(validWord).includes(normalizedWord);
        });
    }

    // Normaliza strings removendo acentos e caracteres especiais
    function normalizeString(str) {
        return str
            .normalize('NFD')
            .replace(/\p{Diacritic}/gu, '')
            .toUpperCase();
    }

    // Desbloqueia a próxima fileira
    function unlockNextRow() {
        if (currentRow < totalRows - 1) {
            const currentCells = document.querySelectorAll(`[data-row="${currentRow}"]`);
            currentCells.forEach((cell) => cell.classList.add('locked')); // Bloqueia a fileira atual

            currentRow++;
            currentCellIndex = 0;

            const nextCells = document.querySelectorAll(`[data-row="${currentRow}"]`);
            nextCells.forEach((cell) => cell.classList.remove('locked')); // Desbloqueia a próxima fileira

            updateSelectedCell(currentRow, currentCellIndex); // Move para a primeira célula da próxima fileira
        } else {
            alert('Usou todas as tentativas');
            colorUnusedCells();
        }
    }

    // Aplica a cor às células não utilizadas
    function colorUnusedCells() {
        const allCells = document.querySelectorAll('.cell');
        allCells.forEach((cell) => {
            if (cell.textContent.trim() === '') {
                cell.style.backgroundColor = 'var(--color-bloqueado)';
            }
        });
    }
});
