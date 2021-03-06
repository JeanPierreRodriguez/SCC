<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
    include_once '../config/database.php';
    include_once '../entities/log.php';
    include_once '../entities/salidacabecera.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try
    {
        $log = new Log($db);
        $salida = new SalidaCabecera($db);
        $data = json_decode(file_get_contents('php://input'), true);

        if (($_POST["prid"])!=null)
        {
            $salida->id_salida = trim($_POST["prid"]);

            $usuario_alvis = trim($_POST["usuario_alvis"]) ;

            if($salida->delete())
            {

                $log->create($usuario_alvis, 7, 3, $venta->id_salida) ;
                print_json("0000", "Se eliminó la salida satisfactoriamente.", $salida->id_salida);
            }
            else
            {
                print_json("9999", "Ocurrió un error al eliminar la salida.", "");
            }
        }
        else
        {
            print_json("9999", "Los campos no pueden estar vacíos.", "");
        }
    }
    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error al eliminar la salida.", $exception->getMessage());
    }

?>