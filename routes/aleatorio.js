const express = require("express");
const router = express.Router();
const fs = require("fs");

// Função para ler palavras do arquivo
async function obterPalavrasDoArquivo(caminhoArquivo) {
  try {
    const dados = fs.readFileSync(caminhoArquivo, "utf-8");
    return dados.split(/\s+/);
  } catch (erro) {
    console.error("Erro ao ler o arquivo:", erro.message);
    return [];
  }
}

// Função para obter uma palavra aleatória de um array
function obterPalavraAleatoria(palavras) {
  const indiceAleatorio = Math.floor(Math.random() * palavras.length);
  return palavras[indiceAleatorio];
}

const caminhoArquivo = "src/palavras_sorteio.txt";

// Rota que sorteia uma palavra
router.get("/", (req, res) => {
  const palavras = obterPalavrasDoArquivo(caminhoArquivo);
  if (palavras.length === 0) {
    return res.status(500).send("Erro ao carregar as palavras do arquivo");
  }
  const palavraAleatoria = obterPalavraAleatoria(palavras);
  res.json({ word: palavraAleatoria });
});

module.exports = router;
