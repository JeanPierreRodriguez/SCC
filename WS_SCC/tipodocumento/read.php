<?php 
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    include_once '../config/database.php';
    include_once '../entities/tipodocumento.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database -> getConnection();

    try{
    	$tipodocumento = new TipoDocumento($db);

        $tipodocumento_list = $tipodocumento->read();

        if (count(array_filter($tipodocumento_list))>0)
        { 
            print_json("0000", "OK", $tipodocumento_list);
         }
        else
        { 
            print_json("0001", "No existen tipo de documentos registrados", null);
        }

    }
    catch(Exception $exception)
    {
    	print_json("9999", "Ocurrió un error", $exception->getMessage());
    }


?>