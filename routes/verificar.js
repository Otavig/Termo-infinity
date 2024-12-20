const express = require("express");
const router = express.Router();
const fs = require("fs");

function obterPalavrasDoArquivo(caminhoArquivo) {
  try {
    const dados = fs.readFileSync(caminhoArquivo, "utf-8");
    return dados.split(/\s+/);
  } catch (erro) {
    console.error("Erro ao ler o arquivo:", erro.message);
    return [];
  }
}

// Implementação da busca binária
function buscaBinaria(lista, alvo) {
  let inicio = 0;
  let fim = lista.length - 1;
  while (inicio <= fim) {
    const meio = Math.floor((inicio + fim) / 2);
    const palavraAtual = lista[meio];
    if (palavraAtual === alvo) return true;
    if (palavraAtual < alvo) inicio = meio + 1;
    else fim = meio - 1;
  }
  return false;
}

const caminhoArquivo = "src/palavras.txt";

// Rota que verifica se uma palavra existe
router.get("/", (req, res) => {
  const palavra = req.query.palavra;
  if (!palavra) return res.status(400).send("A palavra não foi fornecida");
  const palavras = obterPalavrasDoArquivo(caminhoArquivo);
  if (palavras.length === 0) {
    return res.status(500).send("Erro ao carregar as palavras do arquivo");
  }
  const palavraExiste = buscaBinaria(palavras, palavra);
  res.send(palavraExiste.toString());
});

module.exports = router;
