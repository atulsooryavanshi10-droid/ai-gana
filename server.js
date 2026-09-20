const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("."));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/api/status", (req, res) => {
  res.json({
    success: true,
    message: "AI Gana server is running"
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`AI Gana running on port ${PORT}`);
});
