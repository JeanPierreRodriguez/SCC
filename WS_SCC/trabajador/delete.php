<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
    include_once '../config/database.php';
    include_once '../entities/trabajador.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try
    {
        $trabajador = new Trabajador($db);

        if (($_POST["prtrabajador"])!=null)
        {
            $trabajador->id_trabajador = trim($_POST["prtrabajador"]);

            if($trabajador->delete())
            {
                print_json("0000", "Se eliminó el trabajador satisfactoriamente.", true);
            }
            else
            {
                print_json("9999", "Ocurrió un error al eliminar el trabajador.", "");
            }
        }
        else
        {
            print_json("9999", "Los campos no pueden estar vacíos.", "");
        }
    }
    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error al eliminar el trabajador.", $exception->getMessage());
    }

?>