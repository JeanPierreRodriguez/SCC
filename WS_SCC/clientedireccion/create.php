<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
    include_once '../config/database.php';
    include_once '../entities/clientedireccion.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try
    {
        $producto = new Producto($db);
        $data = json_decode(file_get_contents('php://input'), true);

        if (($_POST["id_cliente"])!=null  && !empty(trim($_POST["drc_nombre"])) 
        && ($_POST["id_provincia"])!=null && ($_POST["drc_relevancia"])!=null
        && !empty(trim($_POST["drc_observacion"])))
        {
            $producto->id_cliente = $_POST["id_cliente"];
            $producto->drc_nombre = trim($_POST["drc_nombre"]);
            $producto->id_provincia = $_POST["id_provincia"];
            $producto->drc_relevancia = $_POST["drc_relevancia"];
            $producto->drc_observacion = $_POST["drc_observacion"];

            if($producto->create())
            {
                print_json("0000", "Se creó la dirección satisfactoriamente.", "");
            }
            else
            {
                print_json("9999", "Ocurrió un error al crear la dirección.", "");
            }
        }
        else
        {
            print_json("9999", "Los campos no pueden estar vacíos.", "");
        }
    }
    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error al eliminar la dirección.", $exception->getMessage());
    }

?>