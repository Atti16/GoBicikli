// this file will calculate happy hour on shop page. 1,2 dot from JS task
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
  // date and time will be displayed in footer on home page
  var d = new Date().toLocaleString();
  document.getElementById("dateAndTime").innerHTML = d;
}