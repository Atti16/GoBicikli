function changeLoginText() {
    if (sessionStorage.getItem("loggedin") === "true") {
        document.getElementById("loginB").innerHTML = '<a class="nav-link" onClick="logoutUser()">Logout</a></li>';
    }
    if (sessionStorage.getItem("loggedin") === null) {
        document.getElementById("loginB").innerHTML = '<a class="nav-link" href="auth/login.html">Login</a></li>';
    }
}
function logoutUser() {
    sessionStorage.setItem("userId", null);
    sessionStorage.setItem("userEmail", null);
    sessionStorage.setItem("loggedin", null);
    window.location.replace("http://localhost:3000/");
    alert('Logged Out');
}