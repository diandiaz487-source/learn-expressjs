const express = require('express');
const pool = require('./db');

const app = express();

app.use(express.json());

app.get('/hola-mundo', (req, res) => {
  res.send('Hello World!');
});

app.get('/productos', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM productos');
    res.json(resultado.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/productos', async (req, res) => {
  try {

    const { nombre, precio } = req.body;

    const nuevoProducto = await pool.query(
      'INSERT INTO productos(nombre, precio) VALUES($1,$2) RETURNING *',
      [nombre, precio]
    );

    res.status(201).json(nuevoProducto.rows[0]);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});
