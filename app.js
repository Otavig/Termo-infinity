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
          /*======================
            404 page
          =======================*/
          body, html {
            height: 100%;
            margin: 0;
            font-family: 'Poppins', sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #f0f0f0;
            overflow: hidden;
          }
          /* Animação do texto */
          .page_404 {
            text-align: center;
            position: relative;
          }
          .page_404 h1 {
            font-size: 120px;
            font-weight: bold;
            color: #333;
            animation: bounceIn 1s ease-out;
          }
          @keyframes bounceIn {
            0% { transform: scale(0.3); opacity: 0; }
            50% { transform: scale(1.1); opacity: 1; }
            100% { transform: scale(1); }
          }
          .page_404 p {
            font-size: 24px;
            color: #666;
            margin-top: 20px;
            animation: fadeIn 2s ease-out;
          }
          @keyframes fadeIn {
            0% { opacity: 0; }
            100% { opacity: 1; }
          }
          /* Estilo do botão */
          .link_404 {
            display: inline-block;
            margin-top: 30px;
            padding: 15px 30px;
            font-size: 18px;
            color: white;
            background-color: #1D86E9;
            border-radius: 50px;
            text-decoration: none;
            text-transform: uppercase;
            font-weight: bold;
            box-shadow: 0 4px 15px rgba(29, 134, 233, 0.3);
            transition: all 0.3s ease;
            animation: slideIn 1s ease-out;
          }
          @keyframes slideIn {
            0% { transform: translateY(50px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }
          .link_404:hover {
            background-color: #0c6bb5;
            box-shadow: 0 6px 20px rgba(29, 134, 233, 0.4);
          }
          /* Estilização omitida para brevidade */
        </style>
      </head>
      <body>
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
