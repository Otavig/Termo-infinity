const express = require("express");
const cors = require("cors");
const path = require("path");
const axios = require("axios"); // Para fazer requisições HTTP

const aleatorioRouter = require("./routes/aleatorio");
const verificarRouter = require("./routes/verificar");
const pagesRouter = require("./routes/pages");

const app = express();
const port = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

// Rotas
app.use("/aleatorio", aleatorioRouter);
app.use("/verificar", verificarRouter);
app.use("/", pagesRouter);

// Middleware para capturar rotas não encontradas
app.use((req, res) => {
  const htmlContent = `
    <html>
      <head>
        <title>Erro 404 - Página Não Encontrada</title>
        <style>
          /* Estilização omitida para brevidade */
        </style>
      </head>
      <body>
        <section class="page_404">
          <h1>404</h1>
          <p>Página Não Encontrada</p>
          <a href="/termo-infinity" class="link_404">Voltar</a>
        </section>
      </body>
    </html>
  `;
  res.status(404).send(htmlContent);
});

// Requisição automática para manter o servidor ativo (Pode remover essa parte se preferir)
setInterval(() => {
  axios.get("https://otavig.onrender.com/")
    .then(response => {
      console.log("Ping enviado com sucesso!");
    })
    .catch(error => {
      console.error("Erro ao enviar o ping:", error.message);
    });
}, 49000); // Executa a cada 49 segundos

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
