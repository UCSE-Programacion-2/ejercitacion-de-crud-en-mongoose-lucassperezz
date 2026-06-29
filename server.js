const express = require('express');
const { mongoose, connectDB, closeDB, Equipo } = require('./src/mongoose');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/equipos', async (req, res) => {
    const equipos = await Equipo.find();
    res.status(200).json(equipos);
});

app.get('/equipos/buscar', async (req, res) => {
    const { tecnico } = req.query;
    const equipos = await Equipo.find({ tecnico: { $regex: tecnico, $options: 'i' } });
    res.status(200).json(equipos);
});

app.get('/equipos/:id', async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "ID inválido" });
    }
    const equipo = await Equipo.findById(id);
    if (!equipo) {
        return res.status(404).json({ error: "Equipo no encontrado" });
    }
    res.status(200).json(equipo);
});

app.post('/equipos', async (req, res) => {
    try {
        const equipo = await Equipo.create(req.body);
        res.status(201).json(equipo);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.put('/equipos/:id', async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "ID inválido" });
    }
    try {
        const { equipo, tecnico, continente, campeonatos_mundiales } = req.body;
        if (!equipo || !tecnico || !continente || campeonatos_mundiales === undefined) {
            return res.status(400).json({ error: "Faltan campos requeridos" });
        }
        const updated = await Equipo.findByIdAndUpdate(
            id,
            { equipo, tecnico, continente, campeonatos_mundiales },
            { new: true, runValidators: true }
        );
        if (!updated) {
            return res.status(404).json({ error: "Equipo no encontrado" });
        }
        res.status(200).json(updated);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.delete('/equipos/:id', async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "ID inválido" });
    }
    const deleted = await Equipo.findByIdAndDelete(id);
    if (!deleted) {
        return res.status(404).json({ error: "Equipo no encontrado" });
    }
    res.status(200).json({ message: "Equipo eliminado" });
});

// Iniciar el servidor solo si este archivo se ejecuta directamente
if (require.main === module) {
    connectDB().then(() => {
        app.listen(PORT, () => {
            console.log(`Servidor escuchando en http://localhost:${PORT}`);
        });
    });
}

// Exportamos 'app', 'closeDB' y 'connectDB' para poder hacer testing
module.exports = { app, closeDB, connectDB };
