-- Felhasználók tábla
CREATE TABLE felhasznalok (
    felhasznalo_id SERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    jelszo_hash VARCHAR(255) NOT NULL,
    teljes_nev VARCHAR(100) NOT NULL,
);

-- Kategóriák tábla 
CREATE TABLE kategoriak (
    kategoria_id SERIAL PRIMARY KEY,
    nev VARCHAR(50) NOT NULL,
    leiras TEXT
);

-- Márkák tábla 
CREATE TABLE markak (
    marka_id SERIAL PRIMARY KEY,
    nev VARCHAR(50) NOT NULL
);

-- Termékek tábla (biciklik)
CREATE TABLE termekek (
    termek_id SERIAL PRIMARY KEY,
    sku VARCHAR(20) NOT NULL UNIQUE,
    nev VARCHAR(100) NOT NULL,
    leiras TEXT,
    marka_id INTEGER REFERENCES markak(marka_id),
    kategoria_id INTEGER REFERENCES kategoriak(kategoria_id),
    ar NUMERIC(10,2) NOT NULL,
    kep_url VARCHAR(255),
    specifikaciok TEXT,
    aktiv BOOLEAN DEFAULT TRUE
);

-- Méret opciók biciklikhez (pl. S, M, L, XL)
CREATE TABLE meretek (
    meret_id SERIAL PRIMARY KEY,
    termek_id INTEGER REFERENCES termekek(termek_id) ON DELETE CASCADE,
    meret_nev VARCHAR(20) NOT NULL,
    UNIQUE(termek_id, meret_nev)
);

-- Kosár tábla
CREATE TABLE kosarak (
    kosar_id SERIAL PRIMARY KEY,
    felhasznalo_id INTEGER REFERENCES felhasznalok(felhasznalo_id),
    letrehozas_datum TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Kosár elemek tábla
CREATE TABLE kosar_elemek (
    kosar_elem_id SERIAL PRIMARY KEY,
    kosar_id INTEGER REFERENCES kosarak(kosar_id) ON DELETE CASCADE,
    termek_id INTEGER REFERENCES termekek(termek_id),
    meret_id INTEGER REFERENCES meretek(meret_id),
    mennyiseg INTEGER NOT NULL DEFAULT 1,
    hozzaadas_datum TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Rendelések tábla
CREATE TABLE rendelesek (
    rendeles_id SERIAL PRIMARY KEY,
    felhasznalo_id INTEGER REFERENCES felhasznalok(felhasznalo_id),
    rendeles_datum TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    statusz VARCHAR(20) NOT NULL DEFAULT 'pending', 
    szallitas_cim TEXT NOT NULL,
    teljes_osszeg NUMERIC(10,2) NOT NULL,
    szallitas_modja VARCHAR(50) NOT NULL, 
);

-- Rendelés tételek tábla
CREATE TABLE rendeles_tetelek (
    rendeles_tetel_id SERIAL PRIMARY KEY,
    rendeles_id INTEGER REFERENCES rendelesek(rendeles_id) ON DELETE CASCADE,
    termek_id INTEGER REFERENCES termekek(termek_id),
    meret_id INTEGER REFERENCES meretek(meret_id),
    mennyiseg INTEGER NOT NULL,
    ar NUMERIC(10,2) NOT NULL
);

-- Értékelések tábla
CREATE TABLE ertekelesek (
    ertekeles_id SERIAL PRIMARY KEY,
    termek_id INTEGER REFERENCES termekek(termek_id) ON DELETE CASCADE,
    felhasznalo_id INTEGER REFERENCES felhasznalok(felhasznalo_id),
    ertekeles INTEGER NOT NULL CHECK (ertekeles BETWEEN 1 AND 5),
    komment TEXT,
    letrehozas_datum TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);