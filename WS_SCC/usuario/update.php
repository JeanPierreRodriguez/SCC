<?php

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
    include_once '../config/database.php';
    include_once '../entities/usuario.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try{
    	$usuario = new Usuario($db);
    	$data = json_decode(file_get_contents('php://input'),true);

        if ( ($_POST["idusuario"])!=null && !empty(trim($_POST["usr_nombre"])) 
            && !empty(trim($_POST["usr_usuario"])) && trim($_POST["idperfil"])!=null )
    	{
            $usuario->idusuario = trim($_POST["idusuario"]);
    		$usuario->usr_nombre = trim($_POST["usr_nombre"]);
            $usuario->usr_usuario = trim($_POST["usr_usuario"]);
            $usuario->idperfil = trim($_POST["idperfil"]);

	    	if($usuario->update())
	        {
	                print_json("0000", "Se actualizó el usuario satisfactoriamente.", "");
	        }
	        else
	        {
	                print_json("9999", "Ocurrió un error al acutalizar el usuario.", "");
	        }
	    }
    	else
	    {
	            print_json("9999", "Los campos no pueden estar vacíos.", "");
	    }
    }
    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error al actualizar el usuario.", $exception->getMessage());
    }

?>