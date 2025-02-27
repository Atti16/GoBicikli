// this file will manipulate with cart. 4,6,7 dot from JS task
var basket = new Array();

function add(item, price) {
    basket = JSON.parse(localStorage.getItem("basket"));

    if (basket == null) {
        basket = new Array();
    }
    const c = document.getElementById("itemColor").value;
    const s = document.getElementById("itemSize").value;
    const q = document.getElementById("qty").value;
    const product = new Object();
    product.id = generateId();
    product.item = item;
    product.price = price;
    product.size = s;
    product.color = c;
    product.quantity = q;

    basket.push(product);

    console.log(basket);

    localStorage.setItem("basket", JSON.stringify(basket));

    alert("Item added to chart!");
}

function generateId() {
    const newId = basket.length + 1;

    return newId;
}

function generateTable() {
    basket = JSON.parse(localStorage.getItem("basket"));

    if (basket == null) {
        basket = new Array();
    }

    //Create a HTML Table element.
    const table = document.createElement("TABLE");
    table.className = "col-10 mb-4";

    //Add the header row.
    var row = table.insertRow(-1);
    var headerCell = document.createElement("TH");
    headerCell.innerHTML = "Item";
    row.appendChild(headerCell);

    headerCell = document.createElement("TH");
    headerCell.innerHTML = "Price";
    row.appendChild(headerCell);

    headerCell = document.createElement("TH");
    headerCell.innerHTML = "Size";
    row.appendChild(headerCell);

    headerCell = document.createElement("TH");
    headerCell.innerHTML = "Color";
    row.appendChild(headerCell);

    headerCell = document.createElement("TH");
    headerCell.innerHTML = "Quantity";
    row.appendChild(headerCell);

    headerCell = document.createElement("TH");
    headerCell.innerHTML = "Delete";
    row.appendChild(headerCell);

    let btn = document.createElement("div");

    console.log(basket);

    //Add the data rows.
    for (var i = 0; i < basket.length; i++) {
        row = table.insertRow(-1);
        var cell = row.insertCell(-1);
        cell.innerHTML = basket[i].item;

        cell = row.insertCell(-1);
        cell.innerHTML = basket[i].price;

        cell = row.insertCell(-1);
        cell.innerHTML = basket[i].size;

        cell = row.insertCell(-1);
        cell.innerHTML = basket[i].color;

        cell = row.insertCell(-1);
        cell.innerHTML = basket[i].quantity;

        btn.innerHTML = "<button type='button' class='btn btn-outline-danger' onclick='removeItem("+i+")'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-trash' viewBox='0 0 16 16'><path d='M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z'></path><path fill-rule='evenodd' d='M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z'></path></svg></button>";

        cell = row.insertCell(-1);
        cell.innerHTML = btn.innerHTML;
    }
    resetPageView(table);
}

function clearBasket() {
    localStorage.clear();
    resetPageView(null);
}
// remove selected item from basket
function removeItem(i) {
    const items = JSON.parse(localStorage.getItem("basket"));
    delete items[i];
    console.log("Removed item: "+ items[i]);

    var tempBasket = new Array();
    for (var i = 0; i < items.length; i++) {
        if (typeof items[i] !== 'undefined') {
            tempBasket.push(items[i])
        }
    }
    basket = new Array();
    basket = tempBasket;
    localStorage.setItem("basket", JSON.stringify(basket));
    generateTable();
}
function resetPageView(table) {
    const itemsHeader = document.getElementById("cartItemsHeader");
    const dvTable = document.getElementById("cartItems");
    itemsHeader.innerHTML = "";
    dvTable.innerHTML = "";
    if (basket.length == 0) { 
        itemsHeader.innerHTML = "Your shopping cart is empty...";
    } else { 
        itemsHeader.innerHTML = "Your Items:";
        dvTable.appendChild(table);
    }
    calcDiscount()
}
// calculate dicount
function calcDiscount() {
    basket = JSON.parse(localStorage.getItem("basket"));
    if (basket.length !== 0) {
        let sum = 0;
        let sumQty = 0;
        for (var i = 0; i < basket.length; i++) {
            sumQty = basket[i].price * basket[i].quantity;
            sum = sum + sumQty;
        }
        document.getElementById("currPrice1").innerHTML = Math.round(sum * 0.9); // 10%
        document.getElementById("currPrice2").innerHTML = Math.round(sum * 0.85); // 15%
        document.getElementById("currPrice3").innerHTML = Math.round(sum * 0.95); // 5%
    } else {
        document.getElementById("currPrice1").innerHTML = 0;
        document.getElementById("currPrice2").innerHTML = 0;
        document.getElementById("currPrice3").innerHTML = 0; 
    }
}
function setIdOfItemToShow(id){
    // item will be shown on single item page, dinamicali  lodaded from Json
    const idToShow = id;
    localStorage.setItem("itemToShow", JSON.stringify(idToShow));
}