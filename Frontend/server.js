var express =  require('express');
const cors = require('cors'); 
var fs = require('fs');
const { finished } = require('stream');
const { exit } = require('process');
const users = require('./users').userDB;

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('../Frontend'));
app.set('json spaces', 2);
app.use(cors());
app.post('/addItem', ujElemHozzaad);
app.get('/getItems', elemekLekerdezese);
app.post('/login', bejelentkezes);

function elemekLekerdezese(req, res) {
    var data = fs.readFileSync('../Frontend/bikesInfo.json');
    res.send(data);
}

function bejelentkezes(req, res) {
    var talalt = false;
    var i;
    for (i = 0; i < users.length; i++) {
        if (users[i].email === req.body.userEmail) {
            if (users[i].pass === req.body.userPassword) {
                talalt = true;
                break;
            }
        }
    }
    if (talalt) {
        res.status(200).send({
            message: true,
            userId: users[i].id,
            userEmail: users[i].email
        });
    } else {
        res.status(404).send({
            message: false
        });
    }
}

function ujElemHozzaad(req, res) {
    let bike = req.body;
    if (! fs.existsSync('../Frontend/bikesInfo.json')) {
        res.status(404);
        res.send({status: "Fájl nem található"});
        return;
    }
    var data = fs.readFileSync('../Frontend/bikesInfo.json');
    var data2 = JSON.parse(data);
    var utolsoId = Object.keys(data2).length + 1;
    bike.id = utolsoId.toString();
    var ujJson = '{ ';
    for (var i = 1; i <= Object.keys(data2).length; i++) {
        ujJson +=  '"'+ i +'": ' + JSON.stringify(data2[i], null, 2) + ', ';
    }
    var d = '"'+ utolsoId +'": '+ JSON.stringify(bike, null, 2);
    ujJson += d;
    ujJson += '}';
    fs.writeFileSync('../Frontend/bikesInfo.json', ujJson);
    console.log('Elem hozzáadva');
    reply = { status: "hozzáadva", bike: bike }
    res.send(reply);
}

console.log('A szerver a 3000-es porton fut');
module.exports = app;
app.listen(3000)
