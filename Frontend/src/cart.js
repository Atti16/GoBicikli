let basket = [];

function add(item, price) {
    try {
        basket = JSON.parse(localStorage.getItem("basket")) || [];
    } catch (error) {
        basket = [];
        console.error("Error parsing basket from localStorage:", error);
    }

    const c = document.getElementById("itemColor").value;
    const s = document.getElementById("itemSize").value;
    const q = document.getElementById("qty").value;
    
    const product = {
        id: generateId(),
        item,
        price,
        size: s,
        color: c,
        quantity: parseInt(q)
    };

    basket.push(product);
    console.log(basket);

    localStorage.setItem("basket", JSON.stringify(basket));
    alert("Item added to cart!");
}

function generateId() {
    return basket.length + 1;
}

function generateTable() {
    try {
        basket = JSON.parse(localStorage.getItem("basket")) || [];
    } catch (error) {
        basket = [];
        console.error("Error parsing basket from localStorage:", error);
    }
    
    const table = document.createElement("table");
    table.className = "col-10 mb-4";
    
    
    const headerRow = table.insertRow(-1);
    const headers = ["Item", "Price", "Size", "Color", "Quantity", "Delete"];
    
    headers.forEach(headerText => {
        const headerCell = document.createElement("th");
        headerCell.textContent = headerText;
        headerRow.appendChild(headerCell);
    });

    console.log(basket);
   
   
    basket.forEach((item, index) => {
        const row = table.insertRow(-1);
        
       
        ["item", "price", "size", "color", "quantity"].forEach(prop => {
            const cell = row.insertCell(-1);
            cell.textContent = item[prop];
        });
        
        
        const deleteCell = row.insertCell(-1);
        deleteCell.innerHTML = `
            <button type='button' class='btn btn-outline-danger' onclick='removeItem(${index})'>
                <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-trash' viewBox='0 0 16 16'>
                    <path d='M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z'></path>
                    <path fill-rule='evenodd' d='M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z'></path>
                </svg>
            </button>
        `;
    });
    
    resetPageView(table);
}

function clearBasket() {
    localStorage.clear();
    basket = [];
    resetPageView(null);
}

function removeItem(index) {
    try {
        basket = JSON.parse(localStorage.getItem("basket")) || [];
    } catch (error) {
        basket = [];
        console.error("Error parsing basket from localStorage:", error);
    }
    
    console.log(`Removed item: ${basket[index]?.item || 'unknown item'}`);
    
    
    basket = basket.filter((_, i) => i !== index);
    
    localStorage.setItem("basket", JSON.stringify(basket));
    generateTable();
}

function resetPageView(table) {
    const itemsHeader = document.getElementById("cartItemsHeader");
    const dvTable = document.getElementById("cartItems");
    
    if (itemsHeader) itemsHeader.textContent = "";
    if (dvTable) dvTable.innerHTML = "";
    
    if (!basket.length) { 
        if (itemsHeader) itemsHeader.textContent = "Your shopping cart is empty...";
    } else { 
        if (itemsHeader) itemsHeader.textContent = "Your Items:";
        if (dvTable && table) dvTable.appendChild(table);
    }
    
    calcDiscount();
}

function calcDiscount() {
    try {
        basket = JSON.parse(localStorage.getItem("basket")) || [];
    } catch (error) {
        basket = [];
        console.error("Error parsing basket from localStorage:", error);
    }
    
    const discountElements = {
        "currPrice1": 0.9,  // 10% discount
        "currPrice2": 0.85, // 15% discount
        "currPrice3": 0.95  // 5% discount
    };
    
    if (basket.length) {
        // Calculate total
        const sum = basket.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
        
        // Update discount prices
        Object.entries(discountElements).forEach(([elementId, discountRate]) => {
            const element = document.getElementById(elementId);
            if (element) {
                element.textContent = Math.round(sum * discountRate);
            }
        });
    } else {
        
        Object.keys(discountElements).forEach(elementId => {
            const element = document.getElementById(elementId);
            if (element) {
                element.textContent = "0";
            }
        });
    }
}

function setIdOfItemToShow(id) {
    localStorage.setItem("itemToShow", JSON.stringify(id));
}