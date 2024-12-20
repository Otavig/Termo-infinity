let validWord = null;
let isValidating = false;
let backspacePressed = false; // Estado para rastrear o backspace contínuo
let trys = 0;

let modal = document.getElementById("myModal");

const telaGameOver = () => {
  limparModal();
  modal.style.display = "flex";

  const html = `   
    <span class="close">&times;</span>
    <div class="titulo">
        <h1>Game Over</h1>
        <h1 style="color: white;">A palavra era <span style="color: #ff5733;">${validWord}</span></h1>
        <div class="row-status">
        </div>
    
        <div class="emBaixo">
          <button onclick="window.location.reload()" class="btn-reload">Jogue novamente...</button>

        </div>
    </div>
    <button onclick="window.location.reload()" class="btn-reload">Tentar Novamente</button>
    `;

  document.getElementById("modal-content").innerHTML = html;
  let modalClose = document.getElementsByClassName("close")[0];

  modalClose.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Bloquear todas as fileiras após o Game Over
  const allRows = document.querySelectorAll(".row");
  allRows.forEach((row) => {
    const cells = row.querySelectorAll(".cell");
    cells.forEach((cell) => {
      cell.classList.add("locked"); // Bloqueia cada célula
    });
  });
};

const telaAcerto = () => {
  limparModal();
  modal.style.display = "flex";

  let parabenizacao;
  if (trys === 1) {
    parabenizacao = "<h2>Super parabéns! Você acertou de primeira!</h2>";
  } else if (trys <= 3) {
    parabenizacao = "<h2>Excelente! Você acertou rápido!</h2>";
  } else if (trys < 6 && trys > 3) {
    parabenizacao = "<h2>Boa! Você conseguiu!</h2>";
  }
  else if (trys === 6) {
    parabenizacao = "<h2>Uff, por pouco! Mas você conseguiu!</h2>";
  }

  const html = `   
    <span class="close">&times;</span>
    <div style="color: white;">
        <h1 class="titulo">Vitória!</h1>
        ${parabenizacao}
        <h3>Você acertou a palavra <span style="color: #3aa394;">${validWord}</span> em ${trys} tentativa!</h3>
    
        <div class="row-status">
        </div>
    
        <div class="emBaixo">
          <button onclick="window.location.reload()" class="btn-reload">Jogue novamente...</button>

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

  const tecladoContainer = document.getElementById("tecladoContainer");

  // Alfabeto para criar o teclado
  const alfabeto = "QWERTYUIOPASDFGHJKLZXCVBNM".split("");

  function showAlert(message, duration = 3000) {
    const alertBox = document.getElementById("customAlert");
    const alertMessage = document.getElementById("alertMessage");
    alertMessage.textContent = message;

    // Exibe o alerta com animação
    alertBox.classList.add("show", "pulseAlert");

    // Remove a classe de animação após terminar (para reiniciar em futuras exibições)
    setTimeout(() => {
      alertBox.classList.remove("pulseAlert");
    }, 500); // Tempo da animação de pulso

    // Esconde o alerta após o tempo definido
    setTimeout(() => {
      alertBox.classList.remove("show");
      setTimeout(() => {
        alertBox.style.display = "none";
      }, 500); // Aguarda a transição terminar
    }, duration);
    alertBox.style.display = "block";
  }

  // Função para criar o teclado
  function criarTeclado() {
    // Criar as teclas de A a Z
    alfabeto.forEach((letra) => {
      const tecla = document.createElement("div");
      tecla.classList.add("tecla");
      tecla.textContent = letra;
      tecla.id = `keyboard_letra_${letra}`; // Adiciona o ID único

      // Adiciona evento de clique nas teclas
      tecla.addEventListener("click", () => {
        if (selectedCell && !selectedCell.classList.contains("locked")) {
          selectedCell.textContent = letra; // Preenche a célula com a letra clicada
          moveToNextCell(); // Move para a próxima célula
        }
      });

      tecladoContainer.appendChild(tecla);
    });

    // Criar a tecla "Backspace"
    const backspace = document.createElement("div");
    backspace.classList.add("teclaEspecial");
    backspace.textContent = "⌫";
    backspace.id = "keyboard_backspace"; // Adiciona o ID único
    backspace.addEventListener("click", () => {
      if (selectedCell && !selectedCell.classList.contains("locked")) {
        selectedCell.textContent = ""; // Limpa a célula selecionada
        moveToPreviousCell(); // Move para a célula anterior
      }
    });
    tecladoContainer.appendChild(backspace);

    // Criar a tecla "Enter"
    const enter = document.createElement("div");
    enter.classList.add("teclaEspecial");
    enter.textContent = "Enter";
    enter.id = "keyboard_enter"; // Adiciona o ID único
    tecladoContainer.appendChild(enter);
  }

  criarTeclado(); // Chama a função para criar o teclado ao carregar a página

  async function getValidWord() {
    // Exibe o indicador de carregamento enquanto espera pela palavra
    loadingIndicator.style.display = "block";

    const response = await fetch(
      "https://otavig.onrender.com/aleatorio"
    );
    const data = await response.json();

    loadingIndicator.style.display = "none"; // Esconde o indicador após a resposta

    if (data.word && data.word.length === 5 && data.word !== "Goyaz") {
      return data.word.toUpperCase(); // Retorna a palavra válida de 5 letras, sem acento
    }

    return null; // Se não for uma palavra válida, retorna null
  }

  async function findWord() {
    while (validWord === null) {
      validWord = await getValidWord(); // Tenta obter uma palavra válida

      // Espera um segundo antes de tentar novamente
      if (validWord === null) {
        await new Promise((resolve) => setTimeout(resolve, 10));
      }
    }
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

  // Função para verificar se a palavra existe, primeiro usando a API principal e depois a de backup
  async function verificarPalavraExistente(word) {
    try {
      // Primeiro, verifica a palavra na API principal
      const response = await fetch(
        `https://otavig.onrender.com/verificar?palavra=${word.toUpperCase()}`
      );
      const data = await response.json();

      // Se a resposta da API principal for true, retorna true
      if (data === true) {
        return true;
      }

      // Se a resposta da API principal for false, tenta na API de backup
      const backupResponse = await fetch(
        `https://api.dicionario-aberto.net/word/${word.toLowerCase()}`
      );

      if (backupResponse.ok) {
        const backupData = await backupResponse.json();
        return backupData.length > 0; // Se a resposta de backup contiver dados, a palavra existe
      } else {
        return false; // Se a resposta da API de backup não for ok, a palavra não existe
      }
    } catch (error) {
      console.error("Erro ao verificar a palavra:", error);
      return false; // Se houver erro em qualquer das consultas, considera que a palavra não existe
    }
  }

  // Função para selecionar um quadrado
  function selectCell(cell) {
    if (isValidating || cell.classList.contains("locked")) return; // Bloqueia a seleção durante a validação

    if (selectedCell) {
      selectedCell.classList.remove("selected");
    }
    selectedCell = cell;
    selectedCell.classList.add("selected");
    currentRow = parseInt(cell.getAttribute("data-row"));
    currentCellIndex = parseInt(cell.getAttribute("data-cell"));
  }

  // Modifique o evento de tecla para bloquear durante a validação
  document.addEventListener("keydown", async (e) => {
    if (
      isValidating ||
      !selectedCell ||
      selectedCell.classList.contains("locked")
    )
      return; // Bloqueia durante a validação

      if (e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
        // Insere letra maiúscula e adiciona animação
        selectedCell.textContent = e.key.toUpperCase();
        selectedCell.classList.add("pulse");
        setTimeout(() => selectedCell.classList.remove("pulse"), 100); // Remove a animação após 0.1s
        backspacePressed = false; // Reseta o estado do backspace
        moveToNextCell();
      } else if (e.key === "Backspace") {
        if (backspacePressed) {
          // Volta para a célula anterior se Backspace for pressionado duas vezes
          moveToPreviousCell();
          selectedCell.textContent = "";
        } else {
          // Apenas apaga o conteúdo da célula atual
          selectedCell.textContent = "";
        }
        backspacePressed = true; // Define o estado do backspace como pressionado
      } else if (e.key === "Enter") {
        validarTudo();
        backspacePressed = false; // Reseta o estado do backspace
      } else if (e.key === "ArrowRight" || e.key === "Tab") {
        moveToNextCell(); // Move para a próxima célula na linha
        backspacePressed = false; // Reseta o estado do backspace
      } else if (e.key === "ArrowLeft") {
        moveToPreviousCell(); // Move para a célula anterior na linha
        backspacePressed = false; // Reseta o estado do backspace
      } else {
        backspacePressed = false; // Reseta o estado para qualquer outra tecla
      }
  });

  document.getElementById("keyboard_enter").addEventListener("click", () => {
    validarTudo();
  });

  async function validarTudo() {
    if (isValidating) return; // Impede que a validação seja chamada se já estiver em andamento

    isValidating = true; // Começa a validação

    let currentWord = getCurrentWord(currentRow);

    if (currentWord.length === lettersPerRow) {
      let validar = await verificarPalavraExistente(currentWord);

      if (validar === true) {
        if (isValidWord(currentWord)) {
          telaAcerto();
        } else {
          unlockNextRow();
        }
      } else {
        // alert("Palavra não encontrada");
        showAlert("Essa palavra não é aceita", 3000);
      }
    } else {
      shakeRow(currentRow); // Aplica o tremor na fileira atual
    }

    isValidating = false; // Termina a validação
  }

  // Função para aplicar o tremor em uma fileira
  function shakeRow(rowIndex) {
    const rowElement = document.querySelector(`[data-row="${rowIndex}"]`);
    if (rowElement) {
      rowElement.classList.add("shake");
      // Remove a classe após a animação para permitir futuras aplicações
      setTimeout(() => {
        rowElement.classList.remove("shake");
      }, 300);
    }
  }

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
    } else if (e.key === "Enter") {
      let currentWord = getCurrentWord(currentRow);

      if (currentWord.length === lettersPerRow) {
        if (isValidWord(currentWord)) {
          return; // Acertou, já finalizou
        } else {
          unlockNextRow();
        }
      } else {
        alert("Caracteres insuficientes");
        // showAlert("Caracteres insuficientes!", 300);
      }
    }
  };

  function isValidWord(word) {
    const correctWord = validWord.split(""); // Divide a palavra válida em um array de letras
    const wordArray = word.split(""); // Divide a palavra digitada em um array de letras
  
    const rowCells = document.querySelectorAll(
      `[data-row="${currentRow}"] .cell`
    );
  
    // Arrays auxiliares para acompanhar o estado das letras
    let correctPositions = Array(lettersPerRow).fill(false);
    let remainingLetters = [...correctWord];
  
    // 1ª Passada: Verifica letras nas posições corretas (azul)
    wordArray.forEach((letter, index) => {
      const cell = rowCells[index];
      if (letter === correctWord[index]) {
        cell.style.backgroundColor = "#3aa394"; // azul
        updateKeyboardKey(letter, "exact-match"); // Atualiza o teclado para azul
        correctPositions[index] = true; // Marca como posição correta
        remainingLetters[index] = null; // Remove a letra correta da lista de comparação
        // Aplica a animação pulse
        cell.classList.add("pulse");
        setTimeout(() => cell.classList.remove("pulse"), 500); // Remove a animação após 0.5s
      }
    });
  
    // 2ª Passada: Verifica letras corretas, mas fora de posição (amarelo) e letras incorretas
    wordArray.forEach((letter, index) => {
      const cell = rowCells[index];
      if (!correctPositions[index]) {
        if (remainingLetters.includes(letter)) {
          cell.style.backgroundColor = "#f3c237"; // Amarelo
          updateKeyboardKey(letter, "partial-match"); // Atualiza o teclado para amarelo
          remainingLetters[remainingLetters.indexOf(letter)] = null; // Remove a letra usada
          // Aplica a animação com atraso baseado no índice
          cell.classList.add("flip-in");
          cell.style.animationDelay = `${index * 0.1}s`; // Atraso incremental de 0.1s por célula
        } else {
          cell.style.backgroundColor = "#312a2c"; // Cinza
          updateKeyboardKey(letter, "disabled"); // Atualiza o teclado para cinza
          cell.classList.add("flip-in");
          cell.style.animationDelay = `${index * 0.1}s`; // Atraso incremental de 0.1s por célula
        }
      }
    });
  
    trys++; // Incrementa as tentativas do jogador
  
    // Verifica se a palavra está completamente correta
    if (word === validWord) {
      lockAllCells();
      telaAcerto(); // Mostra a tela de vitória
      return true;
    }
  
    return false;
  }  

  function updateKeyboardKey(letter, tipo) {
    const tecla = document.getElementById(`keyboard_letra_${letter}`);

    if (tecla.classList.contains("exact-match")){
      return;
    } else {
      if (tecla) {
        // Remove todas as classes antes de definir a nova classe
        tecla.classList.remove("normal", "partial-match", "exact-match", "disabled");
        if (tipo === "exact-match") {
          tecla.classList.add("exact-match"); // Azul
        } else if (tipo === "partial-match") {
          tecla.classList.add("partial-match"); // Amarelo
        } else if (tipo === "disabled") {
          tecla.classList.add("disabled"); // Transparente (cinza escuro)
        } else {
          tecla.classList.add("disabled"); // Classe padrão, caso necessário
        }
      }
    }
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
      telaGameOver();
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
