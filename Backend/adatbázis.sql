-- Felhasználók tábla
CREATE TABLE felhasznalok (
    felhasznalo_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    jelszo_hash VARCHAR(255) NOT NULL,
    teljes_nev VARCHAR(100) NOT NULL
);

-- Kategóriák tábla 
CREATE TABLE kategoriak (
    kategoria_id INT AUTO_INCREMENT PRIMARY KEY,
    nev VARCHAR(50) NOT NULL,
    leiras TEXT
);

-- Márkák tábla 
CREATE TABLE markak (
    marka_id INT AUTO_INCREMENT PRIMARY KEY,
    nev VARCHAR(50) NOT NULL
);

-- Termékek tábla (biciklik)
CREATE TABLE termekek (
    termek_id INT AUTO_INCREMENT PRIMARY KEY,
    sku VARCHAR(20) NOT NULL UNIQUE,
    nev VARCHAR(100) NOT NULL,
    leiras TEXT,
    marka_id INT,
    kategoria_id INT,
    ar DECIMAL(10,2) NOT NULL,
    kep_url VARCHAR(255),
    specifikaciok TEXT,
    aktiv TINYINT(1) DEFAULT 1,
    FOREIGN KEY (marka_id) REFERENCES markak(marka_id) ON DELETE RESTRICT,
    FOREIGN KEY (kategoria_id) REFERENCES kategoriak(kategoria_id) ON DELETE RESTRICT
);

-- Méret opciók biciklikhez (pl. S, M, L, XL)
CREATE TABLE meretek (
    meret_id INT AUTO_INCREMENT PRIMARY KEY,
    termek_id INT NOT NULL,
    meret_nev VARCHAR(20) NOT NULL,
    UNIQUE (termek_id, meret_nev),
    FOREIGN KEY (termek_id) REFERENCES termekek(termek_id) ON DELETE CASCADE
);

-- Kosár tábla
CREATE TABLE kosarak (
    kosar_id INT AUTO_INCREMENT PRIMARY KEY,
    felhasznalo_id INT NOT NULL,
    letrehozas_datum TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (felhasznalo_id) REFERENCES felhasznalok(felhasznalo_id) ON DELETE CASCADE
);

-- Kosár elemek tábla
CREATE TABLE kosar_elemek (
    kosar_elem_id INT AUTO_INCREMENT PRIMARY KEY,
    kosar_id INT NOT NULL,
    termek_id INT NOT NULL,
    meret_id INT NOT NULL,
    mennyiseg INT NOT NULL DEFAULT 1,
    hozzaadas_datum TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (kosar_id) REFERENCES kosarak(kosar_id) ON DELETE CASCADE,
    FOREIGN KEY (termek_id) REFERENCES termekek(termek_id) ON DELETE RESTRICT,
    FOREIGN KEY (meret_id) REFERENCES meretek(meret_id) ON DELETE RESTRICT
);

-- Rendelések tábla
CREATE TABLE rendelesek (
    rendeles_id INT AUTO_INCREMENT PRIMARY KEY,
    felhasznalo_id INT NOT NULL,
    rendeles_datum TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    statusz VARCHAR(20) NOT NULL DEFAULT 'pending',
    szallitas_cim TEXT NOT NULL,
    teljes_osszeg DECIMAL(10,2) NOT NULL,
    szallitas_modja VARCHAR(50) NOT NULL,
    FOREIGN KEY (felhasznalo_id) REFERENCES felhasznalok(felhasznalo_id) ON DELETE RESTRICT
);

-- Rendelés tételek tábla
CREATE TABLE rendeles_tetelek (
    rendeles_tetel_id INT AUTO_INCREMENT PRIMARY KEY,
    rendeles_id INT NOT NULL,
    termek_id INT NOT NULL,
    meret_id INT NOT NULL,
    mennyiseg INT NOT NULL,
    ar DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (rendeles_id) REFERENCES rendelesek(rendeles_id) ON DELETE CASCADE,
    FOREIGN KEY (termek_id) REFERENCES termekek(termek_id) ON DELETE RESTRICT,
    FOREIGN KEY (meret_id) REFERENCES meretek(meret_id) ON DELETE RESTRICT
);

-- Értékelések tábla
CREATE TABLE ertekelesek (
    ertekeles_id INT AUTO_INCREMENT PRIMARY KEY,
    termek_id INT NOT NULL,
    felhasznalo_id INT NOT NULL,
    ertekeles INT NOT NULL CHECK (ertekeles BETWEEN 1 AND 5),
    komment TEXT,
    letrehozas_datum TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (termek_id) REFERENCES termekek(termek_id) ON DELETE CASCADE,
    FOREIGN KEY (felhasznalo_id) REFERENCES felhasznalok(felhasznalo_id) ON DELETE CASCADE
);