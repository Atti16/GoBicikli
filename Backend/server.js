const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise'); // Promise alapú MySql kliens
const bcrypt = require('bcrypt'); // Jelszó hash eléshez

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('Frontend'));
app.set('json spaces', 2);
app.use(cors());

// MySQL kapcsolat használata
const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'gobicikli',
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Kapcsolat tesztelése
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('Sikeresen csatlakozva a MySQL adatbázishoz.');
        connection.release();
    } catch (err) {
        console.error('Hiba a MySQL kapcsolat létrehozásakor:', err);
    }
}
testConnection();

app.post('/addItem', addNewItem);
app.get('/getItems', getItems);
app.post('/login', loginUser);

// Összes termék lekérdezése az adatbázisból
async function getItems(req, res) {
    try {
        const [rows] = await pool.query('SELECT * FROM termekek WHERE aktiv = TRUE');
        res.json(rows);
    } catch (err) {
        console.error('Hiba a termékek lekérdezésekor:', err);
        res.status(500).send({ message: 'Szerver hiba' });
    }
}

// Felhasználó bejelentkezés
async function loginUser(req, res) {
    const { userEmail, userPassword } = req.body;

    if (!userEmail || !userPassword) {
        return res.status(400).send({ message: 'Email és jelszó megadása kötelező' });
    }

    try {
        const [results] = await pool.query('SELECT * FROM users WHERE email = ?', [userEmail]);
        if (results.length === 0) {
            return res.status(404).send({ message: false });
        }

        const user = results[0];
        // Jelszó ellenőrzése
        const isMatch = await bcrypt.compare(userPassword, user.pass);
        if (isMatch) {
            res.status(200).send({
                message: true,
                userId: user.id,
                userEmail: user.email
            });
        } else {
            res.status(401).send({ message: false });
        }
    } catch (err) {
        console.error('Hiba a bejelentkezés során:', err);
        res.status(500).send({ message: 'Szerver hiba' });
    }
}

// Új termék hozzáadása az adatbázisba
async function addNewItem(req, res) {
    const { sku, nev, leiras, ar, kep_url } = req.body;

    if (!sku || !nev || !ar) {
        return res.status(400).send({ message: 'SKU, név és ár megadása kötelező' });
    }

    try {
        const [result] = await pool.query(
            'INSERT INTO termekek (sku, nev, leiras, ar, kep_url, aktiv) VALUES (?, ?, ?, ?, ?, ?)',
            [sku, nev, leiras || null, ar, kep_url || null, true]
        );

        const newItem = {
            id: result.insertId,
            sku,
            nev,
            leiras,
            ar,
            kep_url,
            aktiv: true
        };

        console.log('Termék hozzáadva:', newItem);
        res.status(201).send({ status: 'added', bike: newItem });
    } catch (err) {
        console.error('Hiba a termék hozzáadása során:', err);
        res.status(500).send({ message: 'Szerver hiba' });
    }
}

// Szerver indítása
app.listen(3000, () => {
    console.log('Fut a szerver a 3000-es porton.');
});