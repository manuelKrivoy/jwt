const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cors = require("cors");

const app = express();
const PORT = 4000;

app.use(cors()); // Permitir solicitudes CORS
app.use(express.json()); // Parsear JSON

// Clave secreta para firmar los tokens
const SECRET_KEY = "mysecretkey";

// Simulación de base de datos de usuarios
const users = [];

// Ruta de registro
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const hashedPassword = await bcrypt.hash(password, 10); // Encriptar la contraseña
  users.push({ username, password: hashedPassword });
  res.status(201).json({ message: "User registered successfully" });
});

// Ruta de login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  // Generar un token JWT
  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });

  res.json({ token });
});

// Ruta protegida
app.get("/protected", (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access denied" });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    res.json({ message: "This is protected data", user });
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
