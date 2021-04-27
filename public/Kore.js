var usuario = '0';
var password = '0';
var btn = document.getElementById("Log");

var datau = {
    user: usuario,
    pass: password
};

btn.addEventListener("click", function () {
    datau.user = document.getElementById("User").value;
    datau.pass = document.getElementById("Pass").value;
    $.post({
        url: "/login",
        data: JSON.stringify(datau), //Info pregunta front a back
        contentType: "application/json",
        success: function (datosEntrada, status) { //Lo que pasa cuando el post se hizo satisfactoriamente
            if (datosEntrada === "Ok") { //datosEntrada es la info que respondió el back
                window.location.replace("/koredata"); //Ir a koredata
            }
            else {
                alert("Nombre de usuario y/o contraseña incorrectos");
            }
        }
    });
});

    
