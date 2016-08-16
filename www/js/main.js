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
       
    myDB.transaction(function(transaction) 
    {
        var query = 'CREATE TABLE IF NOT EXISTS usuario (id integer primary key,idUsuario integer, username text, nombres text, apPaterno text, apMaterno text, nivel integer)';
        transaction.executeSql(query, [],
        function(tx, result) 
        {
            
        },
        function(error) 
        {
            alert("Error occurred while creating the table.");
        });
    });
    
    $.getJSON('http://gasu.mx/views/session.php?'+data,
    function (response)
    {
        if (response[0] === "OK")
        {
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

    });
        
}

function getID()
{
    var myDB = window.openDatabase("gasu.db", "1.0", "Gasu Demo", 200000);
    var id;
    myDB.transaction(function (transaction) {
        transaction.executeSql('SELECT idUsuario FROM usuario where id =1', [], function (tx, results) {
            id = results.rows.item(0).idUsuario;
        }, null);
    });
    
    return id;
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