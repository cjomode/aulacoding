const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(bodyParser.json());


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'teste',
    database: 'produto'
});


db.connect(err => {
    if (err) {
        throw err;
    }
    console.log('MySQL Connectado...');
});


app.get('/produtos', (req, res) => {
    let sql = 'SELECT * FROM produto';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});


app.post('/produto', (req, res) => {
    let produto = req.body;
    let sql = 'INSERT INTO produto SET ?';
    db.query(sql, produto, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});


app.put('/produto/:id', (req, res) => {
    let sql = `UPDATE produto SET nome = '${req.body.nome}', valor = ${req.body.valor} WHERE id = ${req.params.id}`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});


app.delete('/produto/:id', (req, res) => {
    let sql = `DELETE FROM produto WHERE id = ${req.params.id}`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

app.listen('3000', () => {
    console.log('Server started on port 3000');
});