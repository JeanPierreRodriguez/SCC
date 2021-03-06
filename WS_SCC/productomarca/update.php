<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
    include_once '../config/database.php';
    include_once '../entities/productomarca.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try{
        $marca = new Marca($db);
        $data = json_decode(file_get_contents('php://input'),true);

        if( trim($_POST["id"])!=null &&  trim($_POST["idtipoproducto"])!=null  &&  trim($_POST["marca"])!=null )
        {
            $marca->id_marca = trim($_POST["id"]);
            $marca->id_tipo_producto = trim($_POST["idtipoproducto"]);
            $marca->mrc_nombre = trim($_POST["marca"]);


            if($marca->update())
            {
                print_json("0000", "Se actualizó la marca satisfactoriamente.", "");
            }
            else
            {
                print_json("9999", "Ocurrió un error al actualizar la marca.", "");
            }
        }
        else
        {
                print_json("9999", "Los campos no pueden estar vacíos.", "");
        }
    }
    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error al actualizar la marca.", $exception->getMessage());
    }

?>