function loginUser() {
    let userAuth = {
        userEmail: document.getElementById("userEmail").value,
        userPassword: document.getElementById("userPassword").value
    }
    console.log(userAuth);
    fetch('http://localhost:3000/login', {
        method: 'POST',
        body: JSON.stringify(userAuth),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((response) => {
        return response.json();
    }).then((responseJSON) => {
        if (responseJSON.message) {
            sessionStorage.setItem("userId", responseJSON.userId);
            sessionStorage.setItem("userEmail", responseJSON.userEmail);
            sessionStorage.setItem("loggedin", true);
            window.location.replace("http://localhost:3000/");
            alert('Wellcome ' + responseJSON.userEmail);
        } else {
            document.getElementById("loginAlert").innerHTML = `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
            Error logging in.
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
            </div>
            `;
        };
    });
}

function addItem() {
    let item = {
        name: document.getElementById("inputItemName").value,
        description: document.getElementById("formControlTextarea1").value,
        price: document.getElementById("newItemPrice").value,
        rate: document.getElementById("inputRate").value
    }
    console.log(item);
    // post item to server
    fetch('http://localhost:3000/addItem/', {
        method: 'POST',
        body: JSON.stringify(item),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((response) => {
        return response.json();
    }).then((responseJSON) => {
        console.log(responseJSON);
        if (responseJSON.status === "added") {
            document.getElementById("addedAlert").innerHTML = `
            <div class="alert alert-success alert-dismissible fade show" role="alert">
            New bike added! :).
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
            </div>
            `;
        }
        else {
            document.getElementById("addedAlert").innerHTML = `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
            Error adding a bike. ` + responseJSON.status + `
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
            </div>
            `;
        };
    });
}
function getItems() {
    var bikes = [];
    fetch('http://localhost:3000/getItems/')
    .then((res) => {
        return res.json();
    }).then((resJSON) => {
        bikes = resJSON;
        const dvTable = document.getElementById("indexWraper");
        dvTable.innerHTML = "";
        const table = getBikesInTable(bikes);
        dvTable.appendChild(table);
    });
    
}
function getBikesInTable(bikes) {
    let divT = document.createElement("div");
    divT.className = "container";

    let divTable = document.createElement("div");
    divTable.className = "row justify-content-center";

    const table = document.createElement("TABLE");
    table.className = "col-10 mt-4 mb-4";

    //Add the header row.
    var row = table.insertRow(-1);
    var headerCell = document.createElement("TH");
    headerCell.innerHTML = "Name";
    row.appendChild(headerCell);

    headerCell = document.createElement("TH");
    headerCell.innerHTML = "Description";
    row.appendChild(headerCell);

    headerCell = document.createElement("TH");
    headerCell.innerHTML = "Price";
    row.appendChild(headerCell);

    headerCell = document.createElement("TH");
    headerCell.innerHTML = "Rate";
    row.appendChild(headerCell);

    for (var i = 1; i <= Object.keys(bikes).length; i++) {
        row = table.insertRow(-1);
        var cell = row.insertCell(-1);
        cell.innerHTML = bikes[i].name;

        cell = row.insertCell(-1);
        cell.innerHTML = bikes[i].description;

        cell = row.insertCell(-1);
        cell.innerHTML = bikes[i].price;

        cell = row.insertCell(-1);
        cell.innerHTML = bikes[i].rate;

    }
    divTable.appendChild(table);
    divT.appendChild(divTable);
    return divT;
}