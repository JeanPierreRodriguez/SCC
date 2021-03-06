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
        
        $banco->banco = !empty($_GET['prbanco']) ? trim($_GET['prbanco']) : '';
        $banco->numero_pagina = !empty($_GET['prpagina']) ? trim($_GET['prpagina']) : 1;
        $banco->total_pagina = !empty($_GET['prtotalpagina']) ? trim($_GET['prtotalpagina']) : 20;

        $bancos = $banco->read() ;
        $total = $banco->contar() ;

    	if (count(array_filter($bancos))>0)
    	{
    		print_json("0000", $total, $bancos);
    	}
    	else
    	{
    		print_json("0001", "No existen tipos de producto registrados", null);
    	}
    }
    catch(Exception $exception)
    {
    	print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>