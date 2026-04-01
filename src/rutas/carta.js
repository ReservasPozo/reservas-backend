import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import 'dotenv/config';

// 1. ESQUEMA Y MODELO
const platoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  precio: { type: Number, required: true },
  categoria: { type: String, required: true },
  imagenUrl: String,
});

const Plato = mongoose.model('Plato', platoSchema);

// 2. CONFIGURACIÓN CLOUDINARY
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'menu_restaurante',
    allowed_formats: ['jpg', 'png', 'webp','jpeg'],
  },
});

export const upload = multer({ storage });

// 3. LAS FUNCIONES DE LÓGICA (Fuera de la función de rutas)
export const agregarPlato = async (req, res) => {
  try {
    // 1. Ver qué llega del formulario (Texto)
    console.log("--- DATOS RECIBIDOS ---");
    console.log("Body:", req.body); 
    
    // 2. Ver qué llega de Multer/Cloudinary (Archivo)
    console.log("Archivo (req.file):", req.file)
    const { nombre, precio, categoria } = req.body;
    const urlFoto = req.file ? req.file.path : null; // Verificamos si hay foto

    const nuevoPlato = new Plato({
      nombre,
      precio: parseFloat(precio),
      categoria,
      imagenUrl: urlFoto
    });

    await nuevoPlato.save();
    res.status(201).json({ mensaje: "¡Plato guardado!", data: nuevoPlato });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 4. FUNCIÓN QUE CONFIGURA LAS RUTAS
function loadBackendCarta(app) {
  
  // Ruta para VER la carta (GET)
  app.get('/api/carta', async (req, res) => {
    try {
      const carta = await Plato.find(); // Trae todos los platos de MongoDB
      res.json(carta); // Enviamos el JSON con los datos
    } catch (error) {
      res.status(500).send("Error al obtener la carta");
    }
  });

  // Ruta para AÑADIR a la carta (POST)
  // Aquí usamos 'upload.single' antes de la función de agregar
  app.post('/api/carta', upload.single('foto'), agregarPlato);
}


export {loadBackendCarta};