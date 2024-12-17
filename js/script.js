let modal = document.getElementById("myModal");

const telaGameOver = () => {
  limparModal();
  modal.style.display = "flex";

  const html = `   
    <span class="close">&times;</span>
    <div class="titulo">
        <h1>Game Over</h1>
        <div class="row-status">
    
        </div>
    
        <div class="emBaixo">
            <h2>Próxima palavra em</h2>
            <text style="color: white;">20:20:00</text>
        </div>
    </div>
    `;

  document.getElementById("modal-content").innerHTML = html;
  let modalClose = document.getElementsByClassName("close")[0];

  modalClose.addEventListener("click", () => {
    modal.style.display = "none";
  });
};

const telaAcerto = () => {
  limparModal();
  modal.style.display = "flex";

  const html = `   
    <span class="close">&times;</span>
    <div style="color: white;">
        <h1 class="titulo">Vitória</h1>
    
        <div class="row-status">
    
        </div>
    
        <div class="emBaixo">
            <h2>Próxima palavra em</h2>
            <text>20:20:00</text>
        </div>
    </div>
    `;

  document.getElementById("modal-content").innerHTML = html;
  let modalClose = document.getElementsByClassName("close")[0];

  modalClose.addEventListener("click", () => {
    modal.style.display = "none";
  });
};

function limparModal() {
  // Limpa o conteúdo do modal
  document.getElementById("modal-content").innerHTML = "";
}

document.addEventListener("DOMContentLoaded", async () => {
    const inputContainer = document.getElementById("inputContainer");
    const loadingIndicator = document.createElement("div"); // Criando o indicador de carregamento
    loadingIndicator.id = "loadingIndicator";
    loadingIndicator.innerText = "Procurando palavra...";
    loadingIndicator.style.position = "absolute";
    loadingIndicator.style.top = "50%";
    loadingIndicator.style.left = "50%";
    loadingIndicator.style.transform = "translate(-50%, -50%)";
    loadingIndicator.style.fontSize = "20px";
    loadingIndicator.style.color = "#fff";
    loadingIndicator.style.backgroundColor = "#000";
    loadingIndicator.style.padding = "10px";
    loadingIndicator.style.borderRadius = "5px";
    loadingIndicator.style.display = "none"; // Inicialmente oculto
    document.body.appendChild(loadingIndicator); // Adicionando à página
    
    const totalRows = 6;
    const lettersPerRow = 5;

    let selectedCell = null;
    let currentRow = 0;
    let currentCellIndex = 0;
    let validWord = null;
  
    async function getValidWord() {
        // Exibe o indicador de carregamento enquanto espera pela palavra
        loadingIndicator.style.display = "block";
      
        const response = await fetch('https://api.dicionario-aberto.net/random');
        const data = await response.json();
      
        loadingIndicator.style.display = "none"; // Esconde o indicador após a resposta
      
        if (data.word && data.word.length === 5 && data.word !== "Goyaz") {
          // Verifica se a palavra contém apenas letras sem acento
          const normalizedWord = data.word.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Remove acentos
          const isValid = /^[a-zA-Z]{5}$/.test(normalizedWord); // Verifica se é composta apenas por 5 letras
      
          if (isValid) {
            return normalizedWord.toUpperCase();  // Retorna a palavra válida de 5 letras, sem acento
          }
        }
      
        return null;  // Se não for uma palavra válida, retorna null
      }
      
  
    async function findWord() {
      while (validWord === null) {
        validWord = await getValidWord();  // Tenta obter uma palavra válida
        console.log("Tentando...");
  
        // Espera um segundo antes de tentar novamente
        if (validWord === null) {
          await new Promise(resolve => setTimeout(resolve, 10));
        }
      }
  
      console.log("Palavra válida encontrada:", validWord);
    }
  
    findWord();
    
  

  // Cria as linhas e células dinamicamente
  for (let i = 0; i < totalRows; i++) {
    const row = document.createElement("div");
    row.classList.add("row");
    row.setAttribute("data-row", i);

    for (let j = 0; j < lettersPerRow; j++) {
      const cell = document.createElement("div");
      cell.setAttribute("data-row", i);
      cell.setAttribute("data-cell", j);
      cell.classList.add("cell");
      if (i !== 0) cell.classList.add("locked"); // Bloqueia células que não são da primeira fileira

      cell.addEventListener("click", () => selectCell(cell));
      row.appendChild(cell);
    }
    inputContainer.appendChild(row);
  }

  // Função para consultar a API e verificar se a palavra existe
  async function verificarPalavraExistente(word) {
    try {
      const response = await fetch(
        `https://api.dicionario-aberto.net/word/${word.toLowerCase()}`
      );
      if (response.ok) {
        const data = await response.json();
        return data.length > 0; // Se a resposta contiver dados, a palavra existe
      } else {
        return false; // Se a resposta não for ok, a palavra não existe
      }
    } catch (error) {
      console.error("Erro ao verificar a palavra:", error);
      return false; // Se houver erro na consulta, considera que a palavra não existe
    }
  }

  // Função para selecionar um quadrado
  function selectCell(cell) {
    if (cell.classList.contains("locked")) return; // Impede seleção de células bloqueadas

    if (selectedCell) {
      selectedCell.classList.remove("selected");
    }
    selectedCell = cell;
    selectedCell.classList.add("selected");
    currentRow = parseInt(cell.getAttribute("data-row"));
    currentCellIndex = parseInt(cell.getAttribute("data-cell"));
  }

  // Captura o evento de tecla para editar o quadrado selecionado
  document.addEventListener("keydown", async (e) => {
    if (!selectedCell || selectedCell.classList.contains("locked")) return;

    if (e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
        selectedCell.textContent = e.key.toUpperCase();
        moveToNextCell();
    } else if (e.key === "Backspace") {
        selectedCell.textContent = "";
        moveToPreviousCell();
    } else if (e.key === "Enter") {
        let currentWord = getCurrentWord(currentRow);

        if (currentWord.length == lettersPerRow) {
            let validar = await verificarPalavraExistente(currentWord);

            if (validar === true) {
                if (isValidWord(currentWord)) {
                    telaAcerto();
                    // cell.classList.add("locked");
                } else {
                    unlockNextRow();
                }
            } else {
                alert("Palavra não encontrada");
            }
        } else {
            alert("Caracteres insuficientes");
        }
    } else if (e.key === "ArrowRight" || e.key === "Tab") {
        moveToNextCell(); // Move para a próxima célula na linha
    } else if (e.key === "ArrowLeft") {
        moveToPreviousCell(); // Move para a célula anterior na linha
    }
});

// Move para a próxima célula (tanto com teclas alfabéticas quanto com setas ou Tab)
function moveToNextCell() {
    if (currentCellIndex < lettersPerRow - 1) {
        currentCellIndex++;
    } else {
        return;
    }

    updateSelectedCell(currentRow, currentCellIndex);
}

// Move para a célula anterior (tanto com teclas alfabéticas quanto com setas)
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
        selectedCell.classList.remove("selected");
      }
      selectedCell = nextCell;
      selectedCell.classList.add("selected");
    }
  }

  // Obtém a palavra formada na fileira atual
  function getCurrentWord(row) {
    const cells = document.querySelectorAll(`[data-row="${row}"]`);
    return cells[0].textContent.trim();
  }

  function lockAllCells() {
    const allCells = document.querySelectorAll(".cell");
    allCells.forEach((cell) => {
      cell.classList.add("locked");
    });

    // Remove o listener do teclado
    document.removeEventListener("keydown", handleKeyDown);
  }

  const handleKeyDown = (e) => {
    if (!selectedCell || selectedCell.classList.contains("locked")) return;

    if (e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
      selectedCell.textContent = e.key.toUpperCase();
      moveToNextCell();
    } else if (e.key === "Backspace") {
      selectedCell.textContent = "";
      moveToPreviousCell();
    } else if (e.key === "Enter") {
      let currentWord = getCurrentWord(currentRow);
      console.log(currentWord);

      if (currentWord.length === lettersPerRow) {
        if (isValidWord(currentWord)) {
          return; // Acertou, já finalizou
        } else {
          unlockNextRow();
        }
      } else {
        alert("Caracteres insuficientes");
      }
    }
  };

  // Verifica se a palavra é válida e fornece feedback visual
  function isValidWord(word) {
    const correctWord = validWord.split(""); // Divide a palavra válida em um array de letras
    const wordArray = word.split(""); // Divide a palavra digitada em um array de letras

    const rowCells = document.querySelectorAll(
      `[data-row="${currentRow}"] .cell`
    );

    // Arrays auxiliares para acompanhar o estado das letras
    let correctPositions = Array(lettersPerRow).fill(false);
    let remainingLetters = [...correctWord];

    // 1ª Passada: Verifica letras nas posições corretas (verde)
    wordArray.forEach((letter, index) => {
      if (letter === correctWord[index]) {
        rowCells[index].style.backgroundColor = "#3aa394"; // Verde
        correctPositions[index] = true;
        remainingLetters[index] = null; // Remove a letra correta das comparações
      }
    });

    // 2ª Passada: Verifica letras corretas, mas fora de posição (amarelo)
    wordArray.forEach((letter, index) => {
      if (!correctPositions[index] && remainingLetters.includes(letter)) {
        rowCells[index].style.backgroundColor = "#f3c237"; // Amarelo
        remainingLetters[remainingLetters.indexOf(letter)] = null; // Remove a letra usada
      } else if (!correctPositions[index]) {
        rowCells[index].style.backgroundColor = "#4c4347"; // Normal color
      }
    });

    // Verifica se a palavra está completamente correta
    if (word === validWord) {
      lockAllCells();
      localStorage.setItem(
        "gameResult",
        JSON.stringify({ status: "win", word })
      );

      modal.style.display = "flex";

      return true;
    }

    return false;
  }

  // Pinta os quadrados da fileira atual com a cor especificada
  function colorIndividualCells(color) {
    const currentCells = document.querySelectorAll(
      `[data-row="${currentRow}"] .cell`
    );
    currentCells.forEach((cell) => {
      cell.style.backgroundColor = color;
    });
  }

  // Desbloqueia a próxima fileira
  function unlockNextRow() {
    if (currentRow < totalRows - 1) {
      const currentCells = document.querySelectorAll(
        `[data-row="${currentRow}"] .cell`
      );

      currentCells.forEach((cell) => {
        cell.classList.add("locked");
      });

      currentRow++;
      currentCellIndex = 0;

      const nextCells = document.querySelectorAll(
        `[data-row="${currentRow}"] .cell`
      );
      nextCells.forEach((cell) => cell.classList.remove("locked"));

      updateSelectedCell(currentRow, currentCellIndex);
    } else {
      alert("Usou todas as tentativas");
      colorUnusedCells();
    }
  }

  // Aplicar a cor às células não utilizadas
  function colorUnusedCells() {
    const allCells = document.querySelectorAll(".cell");
    allCells.forEach((cell) => {
      if (cell.textContent.trim() === "") {
        cell.style.backgroundColor = "var(--color-bloqueado)";
      }
    });
  }
}); 