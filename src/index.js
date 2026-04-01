import 'dotenv/config'

import express from 'express'
import cors from 'cors'
import { loadBackendCarta } from './rutas/carta.js';
import { loadBackendReservas } from './rutas/reservas.js';
import mongoose from 'mongoose';







const app = express()

app.use(cors());


app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));

//conectar la base

const conectarDB = async () => {
  try {
    // Corregido: process (con una sola 'c')
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Conectado a la base de datos");
  } catch (error) {
    // Corregido: Cierre de llave antes del catch
    console.error("Error al conectar:", error.message);
    process.exit(1); // Corregido: process
  }
};




conectarDB();

loadBackendCarta(app);
loadBackendReservas(app);


const PORT= process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Server is running on http://localhost:3000')
})






