const express = require('express');
const cors = require('cors');
const fs = require('fs');
const mysql = require('mysql2'); 

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('Frontend'));
app.set('json spaces', 2);
app.use(cors());

const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root', 
    password: '', 
    database: 'gobicikli', 
    port: '3306'
});

connection.connect((err) => {
    if (err) {
        console.error('Hiba a MySQL kapcsolat létrehozásakor:', err);
        return;
    }
    console.log('Sikeresen csatlakozva a MySQL adatbázishoz.');
});

app.post('/addItem', addNewItem);

app.get('/getItems', getItems);

app.post('/login', loginUser);

function getItems(req, res) {
    const data = fs.readFileSync('Frontend/bikesInfo.json');
    res.send(data);
}

function loginUser(req, res) {
    const { userEmail, userPassword } = req.body;

    
    connection.query('SELECT * FROM users WHERE email = ? AND pass = ?', [userEmail, userPassword], (error, results) => {
        if (error) {
            return res.status(500).send({ message: 'Database error' });
        }
        if (results.length > 0) {
            
            res.status(200).send({
                message: true,
                userId: results[0].id,
                userEmail: results[0].email
            });
        } else {
            // Felhasználó nem található
            res.status(404).send({ message: false });
        }
    });
}

function addNewItem(req, res) {
    const bike = req.body;
    if (!fs.existsSync('Frontend/bikesInfo.json')) {
        res.status(404).send({ status: "File not found" });
        return;
    }

    const data = fs.readFileSync('Frontend/bikesInfo.json');
    const data2 = JSON.parse(data);
    const lastId = Object.keys(data2).length + 1;
    bike.id = lastId.toString();
    data2[lastId] = bike;

    fs.writeFileSync('Frontend/bikesInfo.json', JSON.stringify(data2, null, 2));
    console.log('Item added');
    res.send({ status: "added", bike: bike });
}

// Szerver indítása
app.listen(3000, () => {
    console.log('Fut a szerver a 3000-es porton.');
});