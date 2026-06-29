const mongoose = require('mongoose');
const dns = require('dns');

// Para versiones de Node 24.14.0 o superior
dns.setServers(['8.8.8.8']);

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/MundialDB';

/**
 * TODO: Inicializar la conexión a MongoDB mediante Mongoose
 * 1. Utiliza mongoose.connect() para conectarte a la base de datos usando MONGO_URI.
 * Opcional: Imprime por consola que te has conectado correctamente.
 */
async function connectDB() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Conectado a MongoDB');
    } catch (error) {
        console.error("Error al conectar a MongoDB:", error);
    }
}

/**
 * TODO: Definir el Schema y compilar el Modelo
 * 1. Crea un schema para los equipos con los campos:
 *    - equipo (String, requerido)
 *    - tecnico (String, requerido)
 *    - continente (String, requerido)
 *    - campeonatos_mundiales (Number, requerido)
 * 2. Compila el modelo utilizando mongoose.model('Equipo', equipoSchema)
 * 3. Asígnalo a la constante Equipo para exportarlo.
 */
const equipoSchema = new mongoose.Schema({
    equipo: { type: String, required: true },
    tecnico: { type: String, required: true },
    continente: { type: String, required: true },
    campeonatos_mundiales: { type: Number, required: true }
});

const Equipo = mongoose.model('Equipo', equipoSchema);

// Función para cerrar la conexión (útil para tests)
async function closeDB() {
    await mongoose.disconnect();
}

module.exports = { mongoose, connectDB, closeDB, Equipo };
