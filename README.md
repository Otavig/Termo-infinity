# Termo Infinity

Termo é um jogo de palavras desafiador onde o objetivo é descobrir uma palavra oculta em um número limitado de tentativas. A cada tentativa, o jogo fornece feedback sobre quais letras estão corretas e onde estão localizadas, ajudando o jogador a deduzir a palavra correta.

Nota: Este é um projeto que eu, Otávio Garcia, fiz por diversão e aprendizado. Trata-se de uma versão personalizada do jogo Termo, inspirado no original criado por Fernando Serboncini em janeiro de 2022.

## Como Jogar

1. **Objetivo**: O objetivo do jogo é adivinhar a palavra secreta.
2. **Tentativas**: Você tem um número limitado de tentativas (geralmente 6).
3. **Feedback**: A cada tentativa, as letras da palavra são coloridas da seguinte forma:
   - **Azul**: A letra está na posição correta.
   - **Amarelo**: A letra está na palavra, mas na posição incorreta.
   - **Marrom transparente**: A letra não está na palavra.

4. **Palavra Secreta**: Você precisa usar as dicas para adivinhar a palavra oculta.
5. **Fim do Jogo**: O jogo termina quando você adivinha a palavra corretamente ou se esgotam suas tentativas.

## Requisitos

- **Node.js**: v14.0 ou superior.
- **npm**: v6.0 ou superior.

## Como Rodar o Jogo

1. **Clone o repositório**:

   ```bash
   git clone https://github.com/Otavig/Termo-infinity.git
   cd Termo-infinity
   ```

2. **Instale as dependências**:

   ```bash
   npm i
   ```

4. **Inicie o jogo**:

     Lembre-se de trocar todas as rotas para sua maquina local!!

4. **Inicie o jogo**:

   ```bash
   node --watch ./app.js
   ```
      ou
   ```bash
   npm start
   ```

4. O jogo estará disponível em `http://localhost:3002/termo-infity`.

## Funcionalidades

- Interface de usuário simples e intuitiva.
- Feedback visual claro (cores Azul, amarelo e cinza).
- Palavra gerada aleatoriamente de uma lista de palavras.
- Suporte para várias tentativas.

## Contribuindo

Se você deseja contribuir para o projeto, fique à vontade para fazer um fork e enviar pull requests. (Sempre será um prazer)


