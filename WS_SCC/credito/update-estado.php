<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
    include_once '../config/database.php';
    include_once '../entities/log.php';
    include_once '../entities/credito.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try
    {
        $log = new Log($db);
        $credito = new Creditos($db);
        $data = json_decode(file_get_contents('php://input'), true);

        if (($_POST["prcredito"])!=null)
        {
            $credito->id_credito=trim($_POST["prcredito"]);
            $credito->estado=trim($_POST["prestado"]);

            $usuario_alvis = trim($_POST["usuario_alvis"]) ;

            if($credito->actualizar_credito_estado())
            {
                $accion = $credito->estado == "1" ? 13 : 12 ;
                $log->create($usuario_alvis, 8, $accion, $credito->id_credito) ;
                
                print_json("0000", "Se actualizó el crédito satisfactoriamente.", $credito->id_credito);
            }
            else
            {
                print_json("9999", "Ocurrió un error al actualizar el crédito.", "");
            }
        }
        else
        {
            print_json("9999", "Los campos no pueden estar vacíos.", "");
        }
    }
    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error al eliminar el crédito.", $exception->getMessage());
    }

?>