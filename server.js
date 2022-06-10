const express = require('express')
const fs = require('fs');
const crypto = require('crypto')
const bodyparser = require("body-parser");
const Conexion = require("./db");
session = require('express-session');
const app = express();
app.use(session({
    secret: '5577-4D44-WppQ38S',
    resave: true,
    saveUninitialized: true
}));

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

// Authentication and Authorization Middleware
var auth = function(req, res, next) {
    console.log("Ejecutando middleware")
    if (req.session && req.session.user)
      return next();
    else
      return res.sendStatus(401);
  };


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
    let pass= crypto.createHash('md5').update(req.body.password).digest("hex")

    let consulta = "select * from cliente where username=? and password=?";
    conexion.con.query(consulta, [req.body.username,pass], (error, results, fields) => {
        if (error) {
            fs.readFile("./public/view/login.html", (err, data) => {
                data = data.toString().trim().replace("##nombre##", "Login de Página").replace("##err##", error.message);
                res.send(data);
                return;
            })
        } else {
            if(results.length>0){
                req.session.user = results[0];
                if (req.body.username == "juan" && req.body.password == "1234") {
                    fs.readFile("./public/view/contenedor.html", (err, data) => {
                        data = data.toString().trim();
                        res.send(data);
                    })
                } 
            }else{
                fs.readFile("./public/view/login.html", (err, data) => {
                    data = data.toString().trim().replace("##nombre##", "Login de Página").replace("##err##", "Usuario o contraseña incorrecto");
                    res.send(data);
                    return;
                })
            }        
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
// Logout endpoint
app.get('/logout', function (req, res) {
    req.session.destroy();
    res.send("logout success!");
  });
  
  // Get content endpoint
  app.get('/content', auth, function (req, res) {
      res.send("You can only see this after you've logged in.");
  });
  

app.listen(3000)