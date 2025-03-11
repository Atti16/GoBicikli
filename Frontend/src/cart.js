let kosar = [];

function hozzaad(termek, ar) {
    try {
        kosar = JSON.parse(localStorage.getItem("kosar")) || [];
    } catch (error) {
        kosar = [];
        console.error("Hiba történt a kosár betöltésekor a localStorage-ból:", error);
    }

    const szin = document.getElementById("itemColor").value;
    const meret = document.getElementById("itemSize").value;
    const mennyiseg = document.getElementById("qty").value;
    
    const termekAdat = {
        id: generalId(),
        termek,
        ar,
        meret: meret,
        szin: szin,
        mennyiseg: parseInt(mennyiseg)
    };

    kosar.push(termekAdat);
    console.log(kosar);

    localStorage.setItem("kosar", JSON.stringify(kosar));  
    alert("A termék hozzáadva a kosárhoz!");
}

function generalId() {
    return kosar.length + 1;
}

function generalTable() {
    try {
        kosar = JSON.parse(localStorage.getItem("kosar")) || []; 
    } catch (error) {
        kosar = [];
        console.error("Hiba történt a kosár betöltésekor a localStorage-ból:", error);
    }
    
    const tabla = document.createElement("table");
    tabla.className = "col-10 mb-4";
    
    const fejlécSor = tabla.insertRow(-1);
    const fejlec = ["Termék", "Ár", "Méret", "Szín", "Mennyiség", "Törlés"];
    
    fejlec.forEach(fejlecSzoveg => {
        const fejlecCell = document.createElement("th");
        fejlecCell.textContent = fejlecSzoveg;
        fejlécSor.appendChild(fejlecCell);
    });

    console.log(kosar);
   
    kosar.forEach((termek, index) => {
        const sor = tabla.insertRow(-1);
        
        ["termek", "ar", "meret", "szin", "mennyiseg"].forEach(prop => {
            const cella = sor.insertCell(-1);
            cella.textContent = termek[prop];
        });
        
        const torlesCell = sor.insertCell(-1);
        torlesCell.innerHTML = `
            <button type='button' class='btn btn-outline-danger' onclick='torolTermek(${index})'>
                <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-trash' viewBox='0 0 16 16'>
                    <path d='M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z'></path>
                    <path fill-rule='evenodd' d='M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z'></path>
                </svg>
            </button>
        `;
    });
    
    oldalFrissites(tabla);
}

function kosarTisztit() {
    localStorage.removeItem('kosar');  
    kosar = [];
    oldalFrissites(null);
}

function torolTermek(index) {
    try {
        kosar = JSON.parse(localStorage.getItem("kosar")) || [];  
    } catch (error) {
        kosar = [];
        console.error("Hiba történt a kosár betöltésekor a localStorage-ból:", error);
    }
    
    console.log(`Törölt termék: ${kosar[index]?.termek || 'ismeretlen termék'}`);
    
    kosar = kosar.filter((_, i) => i !== index);
    
    localStorage.setItem("kosar", JSON.stringify(kosar));  
    generalTable();
}

function oldalFrissites(tabla) {
    const kosarFejléc = document.getElementById("cartItemsHeader");
    const dvTabla = document.getElementById("cartItems");
    
    if (kosarFejléc) kosarFejléc.textContent = "";
    if (dvTabla) dvTabla.innerHTML = "";
    
    if (!kosar.length) { 
        if (kosarFejléc) kosarFejléc.textContent = "A kosarad üres...";
    } else { 
        if (kosarFejléc) kosarFejléc.textContent = "A termékeid:";
        if (dvTabla && tabla) dvTabla.appendChild(tabla);
    }
    
    try {
        kedvezmenySzamitas();
    } catch (error) {
        console.log("Kedvezmény számítás nem elérhető");
    }
}

function setIdOfItemToShow(id) {
    localStorage.setItem("itemToShow", JSON.stringify(id));
}

function kosarbaHelyezes() {
    const termekNev = document.getElementById('dynamicItemName').innerText;
    const termekAr = document.getElementById('dynamicItemPrice').innerText;
    hozzaad(termekNev, termekAr);
}

function kosarGombHozzaadas() {
    const dinamikusGombContainer = document.getElementById('dynamicItemAction');
    if (dinamikusGombContainer) {
        dinamikusGombContainer.innerHTML = '';
        
        const kosarbaGomb = document.createElement('button');
        kosarbaGomb.className = 'btn btn-primary btn-block';
        kosarbaGomb.textContent = 'Kosárba tesz';
        kosarbaGomb.onclick = kosarbaHelyezes;
        
        dinamikusGombContainer.appendChild(kosarbaGomb);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const eredetiLoadItemToShow = window.loadItemToShow;
    if (eredetiLoadItemToShow) {
        window.loadItemToShow = function() {
            eredetiLoadItemToShow();
            setTimeout(kosarGombHozzaadas, 500);
        };
    }
    
    setTimeout(function() {
        if (document.getElementById('dynamicItemName') && 
            document.getElementById('dynamicItemName').innerText && 
            document.getElementById('dynamicItemAction')) {
            kosarGombHozzaadas();
        }
    }, 1000);
});

function generateTable() {
    const kosar = JSON.parse(localStorage.getItem('kosar')) || [];  
    const cartItems = document.getElementById('cartItems');

    if (kosar.length === 0) {
        cartItems.innerHTML = "<p>A kosár üres.</p>";
    } else {
        let html = "<table class='table'><thead><tr><th>Termék neve</th><th>Méret</th><th>Szín</th><th>Mennyiség</th><th>Ár</th></tr></thead><tbody>";
        kosar.forEach(item => {
            html += `<tr><td>${item.termek}</td><td>${item.meret}</td><td>${item.szin}</td><td>${item.mennyiseg}</td><td>${item.ar}</td></tr>`;
        });
        html += "</tbody></table>";
        cartItems.innerHTML = html;
    }
}

function clearBasket() {
    localStorage.removeItem('kosar'); 
    generateTable(); 
    alert('A kosár kiürítve!');
}
