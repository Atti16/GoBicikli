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
app.post('/addItem', addNewItem); 
app.get('/getItems', getItems);
app.post('/login', loginUser);

function getItems(req,res) {
    var data = fs.readFileSync('../Frontend/bikesInfo.json');
    res.send(data);
}
function loginUser(req,res) {
    var found = false;
    var i;
    for (i = 0; i < users.length; i++) {
        if (users[i].email === req.body.userEmail) {
            if (users[i].pass === req.body.userPassword) {
                found = true;
                break;
            }
        }
    }
    if (found) {
        res.status(200).send({
            message: true,
            userId: users[i].id,
            userEmail: users[i].email
        })
    } else {
        res.status(404).send({
            message: false
        });
    }
}
function addNewItem(req,res) {
    let bike = req.body;
    if (! fs.existsSync('../Frontend/bikesInfo.json')) {
        res.status(404);
        res.send({status: "File not found"});
        return;
    }
    var data = fs.readFileSync('../Frontend/bikesInfo.json');
    var data2 = JSON.parse(data);
    var lastId = Object.keys(data2).length + 1;
    bike.id = lastId.toString();
    var newJson = '{ ';
    for (var i = 1; i <= Object.keys(data2).length; i++) {
        newJson +=  '"'+ i +'": ' + JSON.stringify(data2[i], null, 2) + ', ';
    }
    var d = '"'+ lastId +'": '+ JSON.stringify(bike, null, 2);
    newJson += d;
    newJson += '}';
    fs.writeFileSync('../Frontend/bikesInfo.json',newJson);
    console.log('Item added');
    reply = { status: "added", bike: bike }
    res.send(reply);
}

console.log('Server is listening on port: 3000');
module.exports = app;
app.listen(3000)