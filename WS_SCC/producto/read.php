<?php

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 3600");
    //header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    include_once '../config/database.php';
    include_once '../entities/producto.php';
    include_once '../shared/utilities.php';

    $database = new Database();
    $db = $database->getConnection();

    try{
        $producto = new Producto($db);

        $producto->tprd_nombre = !empty($_GET['prtipo']) ? $_GET['prtipo'] : null;
        $producto->mrc_nombre = !empty($_GET['prmarca']) ? $_GET['prmarca'] : null;
        $producto->mdl_nombre = !empty($_GET['prmodelo']) ? $_GET['prmodelo'] : null;
        $producto->prd_descripcion = !empty($_GET['prdescripcion']) ? $_GET['prdescripcion'] : null;
        $producto->numero_pagina = !empty($_GET['prpagina']) ? $_GET['prpagina'] : null;
        $producto->total_pagina = !empty($_GET['prtotalpagina']) ? $_GET['prtotalpagina'] : null;

        $producto_list = $producto->read();
        $producto_contar = $producto->contar();

        if (count(array_filter($producto_list))>0)
        { 
            function cmd($a, $b){
            $columna =!empty($_GET['columna']) ? $_GET['columna']: null;
            $tipo=!empty($_GET['tipo']) ? $_GET['tipo'] : null;
                if(gettype($a[$columna])=="string"){
                    return $tipo*(strcmp($a[$columna], $b[$columna]));                    
                }else{
                    return $tipo*(intval($a[$columna] - intval($b[$columna])));                     
                }
            }

            usort($producto_list["productos"], "cmd");
            $contador = $producto->numero_pagina*$producto->total_pagina;
            $i=0;
            foreach( $producto_list["productos"] as $row) {
                $producto_list["productos"]["$i"]["numero"] = $contador+1;
                $contador = $contador +1 ;
                $i=$i+1;
            }

            print_json("0000", $producto_contar, $producto_list);
        }
        else
        { print_json("0001", 0, $producto_list); }
    }

    catch(Exception $exception)
    {
        print_json("9999", "Ocurrió un error", $exception->getMessage());
    }

?>