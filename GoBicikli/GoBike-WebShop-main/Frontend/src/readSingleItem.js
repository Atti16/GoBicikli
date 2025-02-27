// this file will load given item from JSON file, 
// click on "Read more" will pass ID by localstorage of an item. 5 dot from JS task
var data;
var id;
function loadItemToShow() {
    readTextFile("../bikesInfo.json", function(text){
        data = JSON.parse(text);
        console.log(data);
        id = JSON.parse(localStorage.getItem("itemToShow"));
        generateItemOnPage();
    });
}
function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}
function generateItemOnPage() {
    var str = '<div id="carouselExampleControls" class="carousel slide" data-ride="carousel">\
                    <div class="carousel-inner">';
                    for( var j = 0;j<data[id].imgSufix.length;j++){
                        if (j == 0) {
                            str += '<div class="carousel-item active">';
                        } else {
                            str += '<div class="carousel-item">';
                        }
                        str += '<img class="d-block w-100" src="../assets/images/'+data[id].name+data[id].imgSufix[j]+'.jpg" alt="'+j+' slide"/>\
                        </div>';
                    }
                    str += '</div>\
                    <a class="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">\
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>\
                    <span class="sr-only">Previous</span>\
                    </a>\
                    <a class="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">\
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>\
                    <span class="sr-only">Next</span>\
                    </a>\
                </div>';
    document.getElementById("dynamicItemPhotos").innerHTML = str;
    document.getElementById("dynamicItemName").innerHTML = data[id].name;
    document.getElementById("dynamicItemDescription").innerHTML = data[id].description;
    document.getElementById("dynamicItemRate").innerHTML = data[id].rate;
    document.getElementById("dynamicItemPrice").innerHTML = data[id].price;
    
    var actionStr = '<a class="btn btn-secondary btn-block mb-3" onclick="add(\''+data[id].name+'\', '+data[id].price+')">Add to Cart</a>';
    document.getElementById("dynamicItemAction").innerHTML = actionStr;
}
