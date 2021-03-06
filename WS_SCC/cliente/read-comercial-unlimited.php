<?php

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 3600");
    //header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    include_once '../config/database.php';
    include_once '../entities/cliente.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try{
        $cliente = new Cliente($db);

        $cliente->archivo = !empty($_GET['prarchivo']) ? trim($_GET['prarchivo']) : '';
        $cliente->clt_codigo = strlen($_GET['prcodigo']) > 0 ? trim($_GET['prcodigo']) : '';
        $cliente->clt_cip = strlen($_GET['prcip']) > 0 ? trim($_GET['prcip']) : '';
        $cliente->clt_dni = strlen($_GET['prdni']) > 0 ? trim($_GET['prdni']) : '';
        $cliente->clt_nombre = !empty($_GET['prnombre']) ? trim($_GET['prnombre']) : '';
        $cliente->inst_nombre = !empty($_GET['prinstitucion']) ? trim($_GET['prinstitucion']) : 0 ;
        $cliente->sd_nombre = !empty($_GET['prsede']) ? trim($_GET['prsede']) : 0 ;
        $cliente->clt_estado = !empty($_GET['prestado']) ? trim($_GET['prestado']) : 1;

        $cliente_archivo = $cliente->read_comercial_unlimited();
        
        if ( $cliente_archivo )
        { 
            print_json("0000", 1, $cliente_archivo);
        }
        else
        { print_json("0001", 0, false ); }
    }

    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>