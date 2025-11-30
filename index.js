const express = require("express");
const cors = require("cors");

const app = express();

// En Render (y otros) el puerto viene de process.env.PORT
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Datos en memoria (simulación de base de datos)
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

// GET /  -> solo para probar que está vivo
app.get("/", (req, res) => {
  res.json({ message: "Market backend funcionando 🚀" });
});

// GET /products - lista todos los productos
app.get("/products", (req, res) => {
  res.json(products);
});

// GET /products/:id - detalle de un producto
app.get("/products/:id", (req, res) => {
  const id = Number(req.params.id);
  const product = products.find((p) => p.id === id);

  if (!product) {
    return res.status(404).json({ message: "Producto no encontrado" });
  }

  res.json(product);
});

// POST /products - crear un nuevo producto
app.post("/products", (req, res) => {
  const { name, price, description, imageUrl } = req.body;

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
    category: "Sin categoría",
    condition: "Usado",
    imageUrl: imageUrl || null,
    seller: "Vendedor Anónimo",
    location: "Anáhuac",
  };

  products.unshift(newProduct);

  res.status(201).json(newProduct);
});

app.listen(PORT, () => {
  console.log(`Backend escuchando en puerto ${PORT}`);
});

