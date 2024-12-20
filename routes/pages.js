const express = require("express");
const path = require("path");
const router = express.Router();

router.get("/termo-infinity", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/pages/index.html"));
});

router.get("/sobre-infinity", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/pages/info.html"));
});

router.get("/", (req, res) => {
  const htmlContent = `
    <html>
      <head>
        <title>Bem-vindo</title>
        <style>
          body {
            font-family: 'Poppins', sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: #f0f0f0;
            overflow: hidden;
          }
          .container {
            text-align: center;
            background-color: #fff;
            padding: 50px 40px;
            border-radius: 12px;
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
            animation: fadeIn 1.5s ease-out;
          }

          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(30px); }
            100% { opacity: 1; transform: translateY(0); }
          }

          h1 {
            font-size: 48px;
            color: rgb(31, 154, 185);
            animation: scaleUp 1s ease-out;
          }

          @keyframes scaleUp {
            0% { transform: scale(0.8); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }

          p {
            font-size: 20px;
            color: #333;
            margin-top: 20px;
            animation: fadeInText 2s ease-out;
          }

          @keyframes fadeInText {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }

          a {
            font-size: 20px;
            color: rgb(31, 154, 185);
            text-decoration: none;
            font-weight: bold;
            padding: 10px 20px;
            border: 2px solid rgb(31, 154, 185);
            border-radius: 50px;
            margin-top: 20px;
            display: inline-block;
            transition: all 0.3s ease;
          }

          a:hover {
            background-color: rgb(31, 154, 185);
            color: #fff;
            transform: translateY(-5px);
          }

          a:active {
            transform: translateY(2px);
          }

        </style>
      </head>
      <body>
        <div class="container">
          <h1>Seja bem-vindo à minha API!</h1>
          <p>Desenvolvida por <a href="https://ourworks.site/otavig/" target="_blank" rel="noopener noreferrer">Otavig</a></p>
        </div>
      </body>
    </html>
  `;
  res.status(200).send(htmlContent);
});

module.exports = router;
