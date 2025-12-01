const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 5000;

// Clave secreta para firmar tokens (en producción debería ir en una variable de entorno)
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-demo-key";

// Middlewares
app.use(cors());
app.use(express.json());

// Usuario de prueba (mínimo indispensable para JWT)
const users = [
  {
    id: 1,
    email: "test@anahuac.mx",
    password: "123456", // solo demo, sin hash
    name: "Usuario Demo",
  },
];

// Datos en memoria (simulación base de datos)
let products = [
  {
    id: 1,
    name: "Macbook Air",
    price: 4500,
    description: "Laptop en buen estado. Ideal para tareas y trabajos.",
    category: "Tecnología",
    condition: "Usado",
    imageUrl:
      "https://images.pexels.com/photos/18105/pexels-photo.jpg",
    seller: "Diego L.",
    location: "Anáhuac Cancún",
  },
  {
    id: 2,
    name: "iPhone 15",
    price: 6900,
    description: "128 GB, excelente batería y cámara.",
    category: "Celulares",
    condition: "Nuevo",
    imageUrl:
      "https://images.pexels.com/photos/47261/pexels-photo-47261.jpeg",
    seller: "Ana R.",
    location: "Anáhuac Cancún",
  },
  {
    id: 3,
    name: "Bocina JBL",
    price: 800,
    description: "Excelente sonido, buen volumen.",
    category: "Audio",
    condition: "Usado",
    imageUrl:
      "https://images.pexels.com/photos/3394664/pexels-photo-3394664.jpeg",
    seller: "Carlos M.",
    location: "Anáhuac Cancún",
  },
];

// Middleware para verificar JWT
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const [type, token] = authHeader.split(" ");

  if (type !== "Bearer" || !token) {
    return res.status(401).json({ message: "Token faltante o formato inválido" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { userId, email }
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
}

// ----------- RUTAS -----------

// Ping básico
app.get("/", (req, res) => {
  res.json({ message: "Market backend con JWT funcionando 🚀" });
});

// Login: devuelve un token JWT
app.post("/auth/login", (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: "Email y password son obligatorios" });
  }

  const user = users.find((u) => u.email === email);

  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Credenciales inválidas" });
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: "2h" }
  );

  res.json({
    message: "Login correcto",
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  });
});

// GET /products - público
app.get("/products", (req, res) => {
  res.json(products);
});

// GET /products/:id - público
app.get("/products/:id", (req, res) => {
  const id = Number(req.params.id);
  const product = products.find((p) => p.id === id);

  if (!product) {
    return res.status(404).json({ message: "Producto no encontrado" });
  }

  res.json(product);
});

// POST /products - protegido con JWT
app.post("/products", authMiddleware, (req, res) => {
  const {
    name,
    price,
    description,
    imageUrl,
    category,
    condition,
    seller,
    location,
  } = req.body || {};

  if (!name || typeof price !== "number") {
    return res
      .status(400)
      .json({ message: "name y price son obligatorios y válidos" });
  }

  const newProduct = {
    id: Date.now(),
    name,
    price,
    description: description || "Sin descripción",
    category: category || "Sin categoría",
    condition: condition || "Usado",
    imageUrl: imageUrl || null,
    seller: seller || "Vendedor Anónimo",
    location: location || "Anáhuac",
    createdBy: req.user?.email || null,
  };

  products.unshift(newProduct);

  res.status(201).json(newProduct);
});

// DELETE /products/:id - protegido con JWT
app.delete("/products/:id", authMiddleware, (req, res) => {
  const id = Number(req.params.id);
  const index = products.findIndex((p) => p.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Producto no encontrado" });
  }

  const removed = products.splice(index, 1)[0];
  res.json({ message: "Producto eliminado", product: removed });
});

app.listen(PORT, () => {
  console.log(`Backend escuchando en puerto ${PORT}`);
});


