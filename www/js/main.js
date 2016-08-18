function info()
{
    var dir = "http://gasu.mx/views/info.php?id=";
    var myDB = window.openDatabase("gasu.db", "1.0", "Gasu Demo", 200000);
    
    myDB.transaction(function (transaction) {
        transaction.executeSql('SELECT * FROM usuario where id =1', [], function (tx, results) {
            content(dir+results.rows.item(0).idUsuario);
        }, null);
    });

}

function content(link)
{        
	$.ajax({
		url: link,
		contentType: 'application/html; charset=utf-8',
		type: 'GET',
		dataType: 'html'

	}).success(
	function(result)
		{
			$('#contenido').html(result);
		}
	).error(function(xhr,status)
	{
		alert("Error: no hay conexión a internet");
	});  
}

function setName()
{
    var myDB = window.openDatabase("gasu.db", "1.0", "Gasu Demo", 200000);
    myDB.transaction(function (transaction) {
        transaction.executeSql('SELECT * FROM usuario where id =1', [], function (tx, results) {
            var full = results.rows.item(0).nombres + " " + results.rows.item(0).apPaterno + " " + results.rows.item(0).apMaterno;
            $('#nombreUsuario').text(full);
        }, null);
    });
    
}

function configuracion()
{
	var dir = "http://gasu.mx/views/configuracion.php?id=";

	 var myDB = window.openDatabase("gasu.db", "1.0", "Gasu Demo", 200000);
    
    myDB.transaction(function (transaction) {
        transaction.executeSql('SELECT idUsuario FROM usuario where id =1', [], function (tx, results) {
            content(dir+results.rows.item(0).idUsuario);
        }, null);
    });

}

function login()
{

    var data = $('#loginForm').serialize();
    var myDB = window.openDatabase("gasu.db", "1.0", "Gasu Demo", 200000);


    $.getJSON('http://gasu.mx/views/session.php?' + data, function (response)
    {
        if (response[0] === "OK")
        {
            //Se crea Tabla
            myDB.transaction(function (transaction)
            {
                var query = 'CREATE TABLE IF NOT EXISTS usuario (id integer primary key,idUsuario integer, username text, nombres text, apPaterno text, apMaterno text, nivel integer)';
                transaction.executeSql(query, [],
                        function (tx, result)
                        {

                        },
                        function (error)
                        {
                            alert("Error occurred while creating the table.");
                        });
            });

            //Se inserta usuario en la tabla
            myDB.transaction(function (transaction)
            {
                var executeQuery = "INSERT INTO usuario (id,idUsuario, username,nombres,apPaterno,apMAterno, nivel) VALUES (?,?,?,?,?,?,?)";
                transaction.executeSql(executeQuery, [1, response[1].id, response[1].username, response[1].nombres, response[1].apPaterno, response[1].apMaterno, response[1].nivel]
                        , function (tx, result) {

                        },
                        function (error) {
                            //alert('Error occurred');
                        });

                window.location = 'main.html';
            });
        } else
        {
            $('#errorMessage').text("Usuario o contraseña incorrecto");
            $('#username').val("");
            $('#contrasenia').val("");
        }

    }).success(function () { 
    })
      .error(function () {
                alert("Error: No hay conexión a internet");
    })
      .complete(function () {

    });
}

function logout()
{
    var myDB = window.openDatabase("gasu.db", "1.0", "Gasu Demo", 200000);
    
    myDB.transaction(function(transaction) 
    {
        var query = 'DROP TABLE usuario';
        transaction.executeSql(query, [],
        function(tx, result) 
        {
            window.location = 'index.html';
        },
        function(error) 
        {
            alert("Error occurred while droping the table.");
        });
    });
}

function modUsuario()
{
    var nombres = $('#nombres').text()
            apPaterno = $('#apPaterno').text(),
            apMaterno = $('#apMaterno').text()
            email = $('#email').text();
            
    var myDB = window.openDatabase("gasu.db", "1.0", "Gasu Demo", 200000);
    myDB.transaction(function (transaction) {
        transaction.executeSql('SELECT idUsuario FROM usuario where id =1', [], function (tx, results) {
            var id = results.rows.item(0).idUsuario;
            
            $.getJSON('http://gasu.mx/views/modusuario.php?id='+id+'&nombres=' + nombres + '&apPaterno=' +
            apPaterno + '&apMaterno=' + apMaterno + '&email=' + email,
            function () {
                
            }).success(function(response){
                alert(response.valor+": Modificado exitosamente");
                configuracion();
            }).error(function(){
                alert("Ha ocurrido un error, intentar más tarde")
            });
            
        }, null);
    });
    
}

function guardarTanque(idtanque)
{
    var direccion = $('#direccion' + idtanque).text()
        capacidad = $('#capacidad' + idtanque).text(),
        nombreTanque = $('#nombreTanque' + idtanque).text();

    $.get('http://gasu.mx/views/modtanque.php?tanque=' + idtanque + '&direccion=' +
            direccion + '&capacidad=' + capacidad + '&nombreTanque=' + nombreTanque,
            function () {
                alert("Modificado exitosamente");
                configuracion();
            });
}