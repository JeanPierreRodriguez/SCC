<?php 

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    include_once '../config/database.php';
    include_once '../entities/direcciondepartamento.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database -> getConnection();

    try{
    	$departamento = new Departamento($db);

        $departamento->dpt_nombre = !empty($_GET['prnombre']) ? trim($_GET['prnombre']) : '';
        $departamento->numero_pagina = !empty($_GET['prpagina']) ? trim($_GET['prpagina']) : 1;
        $departamento->total_pagina = !empty($_GET['prtotalpagina']) ? trim($_GET['prtotalpagina']) : 10;

    	$departamento_list = $departamento->read();
        $departamento_contar = $departamento->contar();

    	if (count(array_filter($departamento_list))>0)
    	{
    		print_json("0000", $departamento_contar,$departamento_list);
    	}
    	else
    	{
    		print_json("0001", "No existen direcciones registradas", null);
    	}
    }
    catch(Exception $exception)
    {
    	print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>