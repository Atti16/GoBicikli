-- Felhasználók tábla
CREATE TABLE felhasznalok (
felhasznalo_id SERIAL PRIMARY KEY,
email VARCHAR(100) NOT NULL UNIQUE,
jelszo_hash VARCHAR(255) NOT NULL,
teljes_nev VARCHAR(100) NOT NULL,
cim TEXT NOT NULL,
varos VARCHAR(50) NOT NULL,
iranyitoszam VARCHAR(10) NOT NULL,
orszag VARCHAR(50) NOT NULL,
admin_e BOOLEAN DEFAULT FALSE
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

-- Termékek tábla
CREATE TABLE termekek (
termek_id SERIAL PRIMARY KEY,
sku VARCHAR(20) NOT NULL UNIQUE,
nev VARCHAR(100) NOT NULL,
leiras TEXT,
marka_id INTEGER REFERENCES markak(marka_id),
kategoria_id INTEGER REFERENCES kategoriak(kategoria_id),
ar NUMERIC(10,2) NOT NULL,
akcios_ar NUMERIC(10,2),
keszlet_mennyiseg INTEGER NOT NULL DEFAULT 0,
kep_url VARCHAR(255),
specifikaciok TEXT,
aktiv_e BOOLEAN DEFAULT TRUE
);

-- Méret opciók kerékpárokhoz
CREATE TABLE meretek (
meret_id SERIAL PRIMARY KEY,
termek_id INTEGER REFERENCES termekek(termek_id) ON DELETE CASCADE,
meret_nev VARCHAR(20) NOT NULL,
keszlet_mennyiseg INTEGER NOT NULL DEFAULT 0,
UNIQUE(termek_id, meret_nev)
);

-- Kosár tábla
CREATE TABLE kosarak (
kosar_id SERIAL PRIMARY KEY,
felhasznalo_id INTEGER REFERENCES felhasznalok(felhasznalo_id),
letrehozas_datuma TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Kosár elemek tábla
CREATE TABLE kosar_elemek (
kosar_elem_id SERIAL PRIMARY KEY,
kosar_id INTEGER REFERENCES kosarak(kosar_id) ON DELETE CASCADE,
termek_id INTEGER REFERENCES termekek(termek_id),
meret_id INTEGER REFERENCES meretek(meret_id),
mennyiseg INTEGER NOT NULL DEFAULT 1,
hozzaadas_datuma TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Rendelések tábla
CREATE TABLE rendelesek (
rendeles_id SERIAL PRIMARY KEY,
felhasznalo_id INTEGER REFERENCES felhasznalok(felhasznalo_id),
rendeles_datuma TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
statusz VARCHAR(20) NOT NULL DEFAULT 'folyamatban', -- folyamatban, feldolgozas alatt, kiszállítva, kézbesítve, lemondva
szallitasi_cim TEXT NOT NULL,
osszeg NUMERIC(10,2) NOT NULL,
szallitasi_mod VARCHAR(50) NOT NULL,
fizetesi_mod VARCHAR(50) NOT NULL,
megjegyzes TEXT
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
megjegyzes TEXT,
letrehozas_datuma TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexek a hatékony lekérdezésekhez
CREATE INDEX idx_termekek_kategoria_id ON termekek(kategoria_id);
CREATE INDEX idx_termekek_marka_id ON termekek(marka_id);
CREATE INDEX idx_meretek_termek_id ON meretek(termek_id);
CREATE INDEX idx_kosar_elemek_kosar_id ON kosar_elemek(kosar_id);
CREATE INDEX idx_rendeles_tetelek_rendeles_id ON rendeles_tetelek(rendeles_id);
CREATE INDEX idx_rendelesek_felhasznalo_id ON rendelesek(felhasznalo_id);
CREATE INDEX idx_ertekelesek_termek_id ON ertekelesek(termek_id);