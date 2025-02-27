// 3 dot from JS task works on Login page
function validateFormLogin() {
    err1 = " maximum character is 15";
    err2 = " minimum character is 8";
    err3 = " field must not be empty";
    let x = document.forms["loginForm"]["femail"].value;
    check(x,"Email");
    x = document.forms["loginForm"]["fpass"].value;
    check(x,"Password");
}
function check(x,str) {
    if (x == "") {
        alert(str + err3);
        return false;
    }
    if (x.length > 15) {
        alert(str + err1);
        return false;
    }
    if (x.length < 8) {
        alert(str + err2);
        return false;
    }
}