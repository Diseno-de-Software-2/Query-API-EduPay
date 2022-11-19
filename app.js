const express = require('express')
const credentials = require('../db_credentials');
const app = express()
const axios = require('axios')
const mysql = require('mysql2')
const HOST = 'localhost' // Change to actual host
const cors = require('cors')
const morgan = require('morgan')
var setTerminalTitle = require('set-terminal-title');
var portfinder = require('portfinder');
portfinder.setBasePort(3100);
portfinder.setHighestPort(3149);
setTerminalTitle('Query service', { verbose: true });
var PORT;
const DB_NAME = 'sistemainstitucional'
const DB_USER = credentials['DB_USER']
const DB_PASSWORD = credentials['DB_PASSWORD']

app.use(express.json())
app.use(cors())
app.use(morgan('dev'))

// Create a connection to the mysql database
const connection = mysql.createConnection({
    host: HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME
})

// Test database connection
connection.connect(error => {
    if (error) throw error
    console.log('Database connection running!')
})

// Get all personas from the database
app.get('/personas', (req, res) => {
    const sql = 'SELECT * FROM personas'
    connection.query(sql, (error, results) => {
        if (error) throw error
        if (results.length > 0) {
            res.json(results)
        } else {
            res.send('Empty result')
        }
    })
})

// Get all sedes from the database
app.get('/sedes', async (req, res) => {
    const query = 'SELECT * FROM sedes'
    connection.query(query, (error, results) => {
        if (error) throw error
        if (results.length > 0) {
            res.json(results)
        } else {
            res.send('Empty result')
        }
    })
})

// Get all oficinas from the database
app.get('/oficinas', async (req, res) => {
    const query = 'SELECT * FROM oficinas'
    connection.query(query, (error, results) => {
        if (error) throw error
        if (results.length > 0) {
            res.json(results)
        } else {
            res.send('Empty result')
        }
    })
})


// Get all servicios of a specific oficina from the database
app.get('/services-:idSede-:nombreOficina', async (req, res) => {
    const { idSede, nombreOficina } = req.params
    const query = `SELECT servicios.id, servicios.nombre, servicios.valor, servicios.descripcion, oficinas.id_sede, servicios.id_oficina, oficinas.nombre as oficina FROM servicios INNER JOIN oficinas ON servicios.id_oficina = oficinas.id WHERE oficinas.id_sede = ${idSede} AND oficinas.nombre = '${nombreOficina}'`
    connection.query(query, (error, results) => {
        if (error) throw error
        if (results.length > 0) {
            res.json(results)
        } else {
            res.send('Empty result')
        }
    })
})

// Get all servicios of a sede from the database
app.get('/servicios-:idSede', async (req, res) => {
    const { idSede } = req.params
    const query = `SELECT servicios.id, servicios.nombre, servicios.valor, servicios.descripcion, oficinas.id_sede, servicios.id_oficina, oficinas.nombre as oficina FROM servicios INNER JOIN oficinas ON servicios.id_oficina = oficinas.id WHERE oficinas.id_sede = ${idSede}`
    connection.query(query, (error, results) => {
        if (error) throw error
        if (results.length > 0) {
            res.json(results)
        } else {
            res.send('Empty result')
        }
    })
})

// Get all oficinas of a sede from the database
app.get('/oficinas-:idSede', async (req, res) => {
    const { idSede } = req.params
    const query = `SELECT * FROM oficinas WHERE id_sede = ${idSede}`
    connection.query(query, (error, results) => {
        if (error) throw error
        if (results.length > 0) {
            res.json(results)
        } else {
            res.send('Empty result')
        }
    })
})

// Get all the historal of a persona from the database
app.get('/historial-:idPersona', async (req, res) => {
    const { idPersona } = req.params
    const query = `SELECT * FROM historial WHERE id_persona = ${idPersona}`
    connection.query(query, (error, results) => {
        if (error) throw error
        if (results.length > 0) {
            res.json(results)
        } else {
            res.send('Empty result')
        }
    })
})

// Get all tarjetas of a persona from the database
app.get('/tarjetas-:idPersona', async (req, res) => {
    const { idPersona } = req.params
    const query = `SELECT * FROM tarjetas WHERE id_persona = ${idPersona}`
    connection.query(query, (error, results) => {
        if (error) throw error
        if (results.length > 0) {
            res.json(results)
        } else {
            res.send('Empty result')
        }
    })
})

// Get all cuentas of a persona from the database
app.get('/cuentas-:idPersona', async (req, res) => {
    const { idPersona } = req.params
    const query = `SELECT * FROM cuentas WHERE id_persona = ${idPersona}`
    connection.query(query, (error, results) => {
        if (error) throw error
        if (results.length > 0) {
            res.json(results)
        } else {
            res.send('Empty result')
        }
    })
})

// Register or connect service in the API Gateway service
portfinder.getPort(function (err, port) {
    PORT = port;
    app.listen(PORT, async () => {
        const response = await axios({
            method: 'post',
            url: `http://localhost:3000/register`,
            headers: { 'Content-Type': 'application/json' },
            data: {
                apiName: "query",
                protocol: "http",
                host: HOST,
                port: PORT,
            }
        })
        await axios.post('http://localhost:3000/switch/query', {
            "url": "http://localhost:" + PORT,
            "enabled": true
        })
        console.log(response.data)
        console.log(`Query server listening on port ${PORT}`)
    })
});


