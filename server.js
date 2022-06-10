const express = require('express')
const fs = require('fs');
const app = express();
const bodyparser=require("body-parser");

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));

app.use('/', express.static(__dirname + '/public'));


app.get('/', function (req, res) {
    //let login=fs.readFileSync("./public/login.html","utf8");
    fs.readFile("./public/view/login.html", (err, data) => {
        data = data.toString().trim().replace("##nombre##", "Login de Página").replace("##err##","");
        res.send(data);
    })

})

app.post("/",(req,res)=>{
    if(req.body.username=="juan" && req.body.password=="1234"){
        fs.readFile("./public/view/contenedor.html", (err, data) => {
            data = data.toString().trim();
            res.send(data);
        }) 
    }else{
        fs.readFile("./public/view/login.html", (err, data) => {
            data = data.toString().trim().replace("##nombre##", "Login de Página").replace("##err##","Usuario o Contraseña incorrecto");
            res.send(data);
        })
    }
})

app.post('/login', function (req, res) {
    console.log(req);
    res.send("Hola que tal");
})


app.listen(3000)