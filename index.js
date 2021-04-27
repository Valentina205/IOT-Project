//Esto es igual hasta la línea 21 en todos los programas Back
var ingreso = false; //Con esta variable se verifica si el usuario inició sesión o no con su contraseña adecuada
//Express
const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static("public"));
//mySQL
var mysql = require('mysql');
 //Info de la base de datos en MySQL
var con = mysql.createConnection({
  host: "localhost",
  user: "Valentina",
  password: "harrypotter123",
  database: "koredata" //Nombre base de datos
});
//Para conectarse a la base de datos
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected...");
});
//-------------------------------------------------
//Ponemos el HTML Kore.html cuándo se entra a "/", dirmane: Ubicación actual
app.get("/", function(request, response){
  response.status(200);
  response.sendFile(__dirname + "/public/Kore.html");
});
//Si el usuario si ingresó bien usuario y contraseña entra a Koredata, si no manda a Error
app.get("/koredata", function(request, response){
  if(ingreso){
    console.log("success");
    response.sendFile(__dirname + "/public/Data.html");
  }else{
    response.sendFile(__dirname + "/public/Error.html");
  }
});
//---------------------------------------------------
//Agrega los datos a la base de datos desde el ESP o postman
app.post("/data", function (request, response) {
  let data = request.body; //Variable con la info de la pregunta del front
  console.log(data); //Imprime en la consola 
  if (data.device_id) {
    var date_1 = new Date(); //Crea la fecha
    var dia = date_1.getDate();
    var mes = date_1.getMonth();
    var months = ['Enero ', 'Febrero ', 'Marzo ', 'Abril ', 'Mayo ', 'Junio ', 'Julio ', 'Agosto ', 'Septiembre ', 'Octubre ', 'Noviembre ', 'Diciembre '];
    var date = months[mes] + dia;
    //Insert crea una nueva fila en la base de datos
    con.query('INSERT INTO `koredata`.`flowers` (`bee_id`, `date`, `var1`, `var2`) VALUES (?, ?, ?, ?)', [data.device_id, date, data.var1, data.var2], function (error, result, fields) {});
  } else {
    response.send("Not"); //Respuesta del back al front
  }

});

//Ingresar con usuario y contraseña
app.post("/login", function (request, response) {
  let data = request.body;
  var datalog = {};
  console.log(data);
  if (data.user && data.pass) {
    //Select selecciona los datos y los muestra, '?' en el mismo orden que en el []
    con.query('SELECT * FROM koredata.nymphs WHERE user = ? AND pass = ?', [data.user, data.pass], function (error, result, fields) {
      var datalog = result; //Resultado del select
      console.log(datalog);
      if (datalog.length > 0) { //Si la base de datos si entregó algo del select
        ingreso = true;
        response.send("Ok"); 
      } else {
        response.send("Not");
        ingreso = false;
      }
    });
  } else {
    response.send("Not");
  }
});

//Busca en la base de datos según se esté solicitando
app.post("/search", function (request, response) {
  let data2 = request.body;
  var dataser = {};
  console.log(data2);
  if (data2.bee_id && data2.date) {
    //Se ponen las opciones de cuándo es Todos o sólo 1 día o dispositivo y según eso busca y selecciona en la base de datos
      if(data2.bee_id === "All" && data2.date !== "All"){
        con.query('SELECT * FROM koredata.flowers WHERE date = ?', [data2.date], function (error, result, fields) {
          var dataser = result;
          console.log(dataser);
          if (dataser.length > 0) {
            response.send(dataser); //Devuelvo los datos
          } else {
            response.send("Not");
          }
        });
      }else if (data2.date === "All" && data2.bee_id !== "All") {
        con.query('SELECT * FROM koredata.flowers WHERE bee_id = ?', [data2.bee_id], function (error, result, fields) {
          var dataser = result;
          console.log(dataser);
          if (dataser.length > 0) {
            response.send(dataser); 
          } else {
            response.send("Not");
          }
        });
      } else if(data2.bee_id === "All" && data2.date === "All"){
        //Así se selleciona TODO lo de la base de datos
        con.query("SELECT * FROM koredata.flowers", function (err, result, fields) {
          var dataser = result;
          console.log(dataser);
          if (dataser.length > 0) {
            response.send(dataser); 
          } else {
            response.send("Not");
          }
        });
      }else{
        //Aquí busca fecha Y ID específico
        con.query('SELECT * FROM koredata.flowers WHERE bee_id = ? AND date = ?', [data2.bee_id, data2.date], function (error, result, fields) {
          var dataser = result;
          console.log(dataser);
          if (dataser.length > 0) {
            response.send(dataser); 
          } else {
            response.send("Not");
          }
        });
      }
      
  } else {
    response.send("Not2");
  }

});

//Para salir del usuario
app.post("/logout", function (request, response) {
  ingreso = false;
  response.send("Ok");
});

//Este siempre va igual también
app.listen(3000, function(){
  console.log("Servidor iniciado ");
});