<?php
Class ClienteDireccion{

    private $conn;
    private $table_name = "cliente_direccion";

    public $idcliente_direccion;
    public $id_cliente;
    public $clt_nombre;
    public $drc_nombre;
    public $id_distrito;
    public $drc_relevancia;
    public $drc_observacion;
    public $drc_estado;
    public $prpagina;
    public $prtotalpagina;
    public $referencia;
    
    public function __construct($db){
        $this->conn = $db;
    }

    function create(){
        $query = "CALL sp_crearclientedireccion(
            :id_cliente,
            :drc_nombre,
            :pid_distrito,
            :prreferencia
        )";

        $result = $this->conn->prepare($query);

        $result->bindParam(":id_cliente", $this->id_cliente);
        $result->bindParam(":drc_nombre", $this->drc_nombre);
        $result->bindParam(":pid_distrito", $this->id_distrito);
        $result->bindParam(":prreferencia", $this->referencia);

        $this->id_cliente=htmlspecialchars(strip_tags($this->id_cliente));
        $this->drc_nombre=htmlspecialchars(strip_tags($this->drc_nombre));
        $this->id_distrito=htmlspecialchars(strip_tags($this->id_distrito));
        $this->referencia=htmlspecialchars(strip_tags($this->referencia));

        if($result->execute())
        {
            return true;
        }
        return false;
    }

    function update(){
        $query = "CALL sp_actualizarclientedireccion(
            :id_direccion,
            :drc_nombre,
            :pid_distrito,
            :prreferencia
        )";

        $result = $this->conn->prepare($query);

        $result->bindParam(":id_direccion", $this->idcliente_direccion);
        $result->bindParam(":drc_nombre", $this->drc_nombre);
        $result->bindParam(":pid_distrito", $this->id_distrito);
        $result->bindParam(":prreferencia", $this->referencia);

        $this->idcliente_direccion=htmlspecialchars(strip_tags($this->idcliente_direccion));
        $this->drc_nombre=htmlspecialchars(strip_tags($this->drc_nombre));
        $this->id_distrito=htmlspecialchars(strip_tags($this->id_distrito));
        $this->referencia=htmlspecialchars(strip_tags($this->referencia));

        if($result->execute())
        {
            return true;
        }
        return false;
    }

    function delete(){
      $query = "CALL sp_eliminarclientedireccion(:id_direccion)";

      $result = $this->conn->prepare($query);

      $result->bindParam(":id_direccion", $this->idcliente_direccion);

      $this->idcliente_direccion=htmlspecialchars(strip_tags($this->idcliente_direccion));

      if($result->execute())
      {
        return true;
      }
      return false;
    }

    function read(){
        $query = "CALL sp_listarclientedireccion(:pid_cliente, :pdrc_relevancia, :pagina, :total_pagina)";

        $result = $this->conn->prepare($query);
        $result->bindParam(":pid_cliente", $this->id_cliente);
        $result->bindParam(":pdrc_relevancia", $this->drc_relevancia);
        $result->bindParam(":pagina", $this->prpagina);
        $result->bindParam(":total_pagina", $this->prtotalpagina);

        $result->execute();
        $direccion_list=array();
        $direccion_list["direcciones"]=array();
        $contador = 0;

        while($row = $result->fetch(PDO::FETCH_ASSOC))
        {
            extract($row);
            $contador=$contador+1;
            $direccion_item = array (
                "numero"=>$contador,
                "id"=>$row['id'],
                "idcliente"=>$row['idcliente'],
                "cliente"=>$row['cliente'],
                "direccion"=>$row['direccion'],
                "id_departamento"=>$row['id_departamento'],
                "departamento"=>$row["dpt_nombre"],
                "id_provincia"=>$row['id_provincia'],
                "provincia"=>$row['prv_nombre'],
                "id_distrito"=>$row['id_distrito'],
                "distrito"=> $row['dst_nombre'],
                "direccioncompleta"=> $row['direccioncompleta'],
                "direccion_formateada"=> $row['direccion_formateada'],
                "relevancia"=>$row['drc_relevancia'],
                "referencia"=>$row['referencia'],
            );

            array_push($direccion_list["direcciones"],$direccion_item);
        }
        return $direccion_list;
    }

    function contar(){

        $query = "CALL sp_listarclientedireccioncontar(:pid_cliente, :pdrc_relevancia)";

        $result = $this->conn->prepare($query);

        $result->bindParam(":pid_cliente", $this->id_cliente);
        $result->bindParam(":pdrc_relevancia", $this->drc_relevancia);

        $result->execute();

        $row = $result->fetch(PDO::FETCH_ASSOC);

        $this->total_resultado=$row['total'];

        return $this->total_resultado;
    }

    function actualizar_primario(){
      $query = "CALL sp_actualizarrelevanciadireccion(
        :id_direccion
      )";

      $result = $this->conn->prepare($query);

      $result->bindParam(":id_direccion", $this->idcliente_direccion);

      $this->idcliente_direccion=htmlspecialchars(strip_tags($this->idcliente_direccion));

      if($result->execute())
      {
       return true;
      }
      return false;
    }

}
?>