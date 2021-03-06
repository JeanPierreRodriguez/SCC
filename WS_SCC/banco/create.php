<?php 

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    include_once '../config/database.php';
    include_once '../entities/banco.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database -> getConnection();

    try{
    	$banco = new Bancos($db);
        
        if (($_POST["prbanco"])!=null)
        {

            $banco->banco=trim($_POST["prbanco"]);

            if($banco->create())
            {
                print_json("0000", "Se creó el banco satisfactoriamente.", true);
            }
            else
            {
                print_json("9999", "Ocurrió un error al crear el banco.", "");
            }
        }
        else
        {
            print_json("9999", "Los campos no pueden estar vacíos.", "");
        }
    }
    catch(Exception $exception)
    {
    	print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>