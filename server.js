const express = require('express')
const fs = require('fs');
const app = express();
const bodyparser = require("body-parser");
const Conexion = require("./db");

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));



app.use('/', express.static(__dirname + '/public'));


app.get('/', function (req, res) {
    //let login=fs.readFileSync("./public/login.html","utf8");
    fs.readFile("./public/view/login.html", (err, data) => {
        data = data.toString().trim().replace("##nombre##", "Login de Página").replace("##err##", "");
        res.send(data);
    })

})

app.post("/", (req, res) => {
    let conexion = new Conexion();
    let consulta = "select * from cliente where username=?";
    conexion.con.query(consulta, [req.body.username], (error, results, fields) => {
        if (error) {
            fs.readFile("./public/view/login.html", (err, data) => {
                data = data.toString().trim().replace("##nombre##", "Login de Página").replace("##err##", error.message);
                res.send(data);
                return;
            })
        } else {
            console.log(results);
            console.log("_____")
            console.log(fields);
            res.send(results);
        }


    });

    conexion.con.end();
    /*
    if (req.body.username == "juan" && req.body.password == "1234") {
        fs.readFile("./public/view/contenedor.html", (err, data) => {
            data = data.toString().trim();
            res.send(data);
        })
    } 
    */
})

app.post('/login', function (req, res) {
    console.log(req);
    res.send("Hola que tal");
})


app.listen(3000)