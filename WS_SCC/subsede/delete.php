<?php 

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    include_once '../config/database.php';
    include_once '../entities/subsede.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database -> getConnection();

    $subsede = new Subsede($db);

    try{
        if ( ($_POST["prid"])!=null )
        {
            $subsede->id_subsede=trim($_POST["prid"]);

            if($subsede->delete())
            {
                print_json("0000", "Se eliminó la subsede satisfactoriamente.", true);
            }
            else
            {
                print_json("9999", "Ocurrió un error al eliminar la subsede.", "");
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