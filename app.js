const express = require('express')
const app = express()
const axios = require('axios')
const mysql = require('mysql')
const HOST = 'localhost' // Change to actual host
const cors = require('cors')
const PORT = 3003 || process.env.PORT
const DB_NAME = 'sistemainstitucional' 
const DB_USER = 'root'  // Change to your DB user
const DB_PASSWORD = 'camilo9116' // Change to your DB password

app.use(express.json())
app.use(cors())

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

// Get all comunicaciones from the database
app.get('/comunicaciones', async (req, res) => {
    const query = 'SELECT * FROM comunicaciones'
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
    const query = `SELECT * FROM servicios WHERE id_sede = ${idSede}`
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

// Get all ordenes of a persona from the database 
app.get('/ordenes-:idPersona', async (req, res) => {
    const { idPersona } = req.params
    const query = `SELECT * FROM ordenes WHERE id_persona = ${idPersona}`
    connection.query(query, (error, results) => {
        if (error) throw error
        if (results.length > 0) {
            res.json(results)
        } else {
            res.send('Empty result')
        }
    })
})

// Get all relaciones de trabajo from the database
app.get('/trabaja-en', async (req, res) => {
    const query = 'SELECT * FROM trabaja'
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
        "url": "http://localhost:3003",
        "enabled": true
    })
    console.log(response.data)
    console.log(`Query server listening on port ${PORT}`)
}) 
