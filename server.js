const express = require('express');
const db = require('./db'); // Asegúrate de que este archivo tenga bien configurada la conexión a MySQL
const path = require('path');

const app = express();


app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use(express.static('public'));


app.get('/', (req, res) => {
    res.redirect('/login.html');
});

//  iniciar sesión
app.post('/login', (req, res) => {
    const { usuario, contrasena } = req.body;

    if (!usuario || !contrasena) {
        return res.status(400).send('Faltan datos');
    }

    const sql = 'SELECT * FROM usuarios WHERE usuario = ? AND contrasena = ?';
    db.query(sql, [usuario, contrasena], (err, resultados) => {
        if (err) {
            console.error('Error al consultar la base de datos:', err);
            return res.status(500).send('Error del servidor');
        }

        if (resultados.length > 0) {
            res.send('Inicio de sesión exitoso');
        } else {
            res.send('Credenciales incorrectas');
        }
    });
});

// resgistro
app.post('/register', (req, res) => {
    const { usuario, contrasena } = req.body;

    if (!usuario || !contrasena) {
        return res.status(400).send('Faltan datos');
    }

    const sql = 'INSERT INTO usuarios (usuario, contrasena) VALUES (?, ?)';
    db.query(sql, [usuario, contrasena], (err, resultado) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.send('El usuario ya existe');
            }
            console.error('Error al insertar en la base de datos:', err);
            return res.status(500).send('Error del servidor al registrar');
        }

        res.send('Registro exitoso');
    });
});

// servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
