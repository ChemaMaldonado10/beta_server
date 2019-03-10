const mysql = require('mysql')
const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

var SEED = require('../config/config').SEED
var CLIENT_ID = require('../config/config').CLIENT_ID

const router = express.Router()


// EJEMPLO DE HTTP GET.
router.get("/rol/:email_usuario", (req, res) => {
    const email_usuario = req.params.email_usuario;
    const conn = getConnection();
    const sql = "SELECT USUARIO.nombre_usuario, ENTIDAD.nombre_entidad, ROL_USUARIO_ENTIDAD.tipo_usuario, ROL_USUARIO_ENTIDAD.ROL_id_rol  FROM ENTIDAD LEFT JOIN ROL_USUARIO_ENTIDAD INNER JOIN USUARIO ON USUARIO.id_usuario=ROL_USUARIO_ENTIDAD.USUARIO_id_usuario ON ROL_USUARIO_ENTIDAD.ENTIDAD_id_entidad=ENTIDAD.id_entidad WHERE USUARIO.email_usuario=? ";

    console.log(email_usuario);
    conn.query(sql, [email_usuario], (err, rows, fields) => {
        if (err) {
            return res.status(500).json({
                state: false,
                message: "Internal Server Error"
            });
        } else {
            for (row in rows) {
                console.log(rows[row].ROL_id_rol);
            }
            return res.status(200).json({
                state: true,
                message: "Fetching roles",
                body: rows
            });
        }
    })
})

// EJEMPLO DE HTTP POST
router.post("/jugador/eliminar", (req, res) => {

    const nombre_jugador = req.body.nombre_jugador;
    const posicion_jugador = req.body.posicion_jugador;

    const sql = "DELETE FROM JUGADOR WHERE nombre_jugador=? AND posicion_jugador=?"

    const conn = getConnection();

    conn.query(sql, [nombre_jugador, posicion_jugador], (err, rows, fields) => {
        if (err) {
            res.status(500).json({
                state: false,
                message: err
            });
        } else {
            return res.status(200).json({
                state: true,
                message: "Jugador eliminado",
                body: rows
            });
        }
    })
});



// We create a pool in order to have a function with all the database
// parameters 

const pool = mysql.createPool({
    connectionLimit: 10,
    host: "localhost",
    user: 'chema',
    password: "123456",
    database: 'tuekipo_beta'
})

function getConnection() {
    return pool
}

module.exports = router