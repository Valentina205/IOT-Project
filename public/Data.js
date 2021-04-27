var dataf = [];
var valorFecha = "";
var valorID = "";
var datase = {
    bee_id: valorID,
    date: valorFecha
};

document.getElementById("Buscar").addEventListener("click", function() {
    //Toma el dato seleccionado en la pag para buscar en la base de datos
    datase.date = document.Datos.Fecha.options[document.Datos.Fecha.selectedIndex].value;
    datase.bee_id = document.Datos.ID.options[document.Datos.ID.selectedIndex].value;
    $.post({
        url: "/search",
        data: JSON.stringify(datase),
        contentType: "application/json",
        success: function (datosEntrada, status) {
            if (datosEntrada === "Not") {
                alert("Debe seleccionar una opción adecuada en Fecha y ID Dispositivo");
            }
            else{
                dataf = datosEntrada;
                console.log(dataf);
                $("#Tabla").html("<tbody id='Tabla'> </tbody>");
                for(i = 0; i < dataf.length; i++) {
                    if(dataf[i].var2 === null) {
                        dataf[i].var2 = "";
                    }
                    $("#Tabla").append("<tr> <th>" + dataf[i].bee_id + "</th> <td>" + dataf[i].date + "</td> <td>" + dataf[i].var1 +"</td> <td>" + dataf[i].var2 +"</td> </tr>");
                }
            }
        }
    });
});

$("#Eliminar").on("click", function() {
    $("#Tabla").html("<tbody id='Tabla'> </tbody>");
});

document.getElementById("Salir").addEventListener("click", function() {
    $.post({
        url: "/logout",
        data: null, //Cuándo la pregunta que le hago al back no necesita info
        contentType: "application/json",
        success: function (datosEntrada, status) {
            if (datosEntrada === "Ok") {
                window.location.replace("/");
            }
            else {
                alert("No se ha podido cerrar sesión.");
            }
        }
    });
});