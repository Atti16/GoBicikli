function sartHappyHour() {
  var x = setInterval(function() {
    var starTime = new Date();
    var hours = 0;
    var minutes = 59 - starTime.getMinutes();
    var seconds = 59 - starTime.getSeconds();
      
    document.getElementById("happyHour").innerHTML = hours + "h " + minutes + "m " + seconds + "s ";
      
    if (minutes < 0) {
      clearInterval(x);
      document.getElementById("happyHour").innerHTML = "EXPIRED";
    }
  }, 1000);
}
function displayDateAndTime() {

  var d = new Date().toLocaleString();
  document.getElementById("dateAndTime").innerHTML = d;
}