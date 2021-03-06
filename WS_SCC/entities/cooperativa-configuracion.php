<?php 

require '../vendor/autoload.php';
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

date_default_timezone_set('America/Lima');

class Cooperativa{

  private $conn;

  public $id_cooperativa ;
  public $id_cooperativa_cuenta ;
  public $departamento ;
  public $provincia ;
  public $distrito ;
  public $direccion ;
  public $relevancia ;
  public $principal ;
  public $estado ;
  public $numero_pagina ;
  public $total_pagina ;
  public $total_resultado ;
  public $banco ;
  public $titular ;
  public $cuenta ;
  public $cci ;
  public $alias ;

  public $numero_orden_antigua ;
  public $numero_orden_nueva ;

  public $archivo ; // Guarda el nombre del archivo 
  public $path_reporte = '../uploads/reporte-clientes/';

  public function __construct($db){
    $this->conn = $db;
  }

  function read(){
    $query = "CALL sp_listarcooperativadireccion(?,?,?,?,?,?,?)";

    $result = $this->conn->prepare($query);

    $result->bindParam(1, $this->departamento ) ;
    $result->bindParam(2, $this->provincia ) ;
    $result->bindParam(3, $this->distrito ) ;
    $result->bindParam(4, $this->direccion ) ;
    $result->bindParam(5, $this->estado ) ;
    $result->bindParam(6, $this->numero_pagina ) ;
    $result->bindParam(7, $this->total_pagina ) ;

    $result->execute();

    $direccion_list=array();
    $direccion_list["direccion"]=array();

    $contador = $this->total_pagina*($this->numero_pagina-1);

    while($row = $result->fetch(PDO::FETCH_ASSOC))
    {
      extract($row);
      $contador = $contador+1;
      $item = array(
        "numero" => $contador,
        "id_cooperativa_direccion" => $id_cooperativa_direccion ,
        "id_departamento" => $id_departamento ,
        "id_provincia" => $id_provincia ,
        "id_distrito" => $id_distrito ,
        "departamento" => $departamento ,
        "provincia" => $provincia ,
        "distrito" => $distrito ,
        "cooperativa_direccion" => $cooperativa_direccion ,
        "relevancia" => $relevancia ,
        "principal" => $principal ,
        "numero_orden" => $numero_orden ,
      );
      array_push($direccion_list["direccion"],$item);
    }
    return $direccion_list;
  }

  function contar(){
    $query = "CALL sp_listarcooperativadireccioncontar(?,?,?,?,?)";

    $result = $this->conn->prepare($query);

    $result->bindParam(1, $this->departamento ) ;
    $result->bindParam(2, $this->provincia ) ;
    $result->bindParam(3, $this->distrito ) ;
    $result->bindParam(4, $this->direccion ) ;
    $result->bindParam(5, $this->estado ) ;

    $result->execute();

    $row = $result->fetch(PDO::FETCH_ASSOC);

    $this->total_resultado=$row['total'];

    return $this->total_resultado;
  }

	function create(){
		$query = "CALL sp_crearcooperativadireccion(
			:prdistrito,
			:prdireccion
		)";
  
		$result = $this->conn->prepare($query);
  
		$result->bindParam(":prdistrito", $this->distrito);
		$result->bindParam(":prdireccion", $this->direccion);
  
		$this->distrito=htmlspecialchars(strip_tags($this->distrito));
		$this->direccion=htmlspecialchars(strip_tags($this->direccion));
  
		if($result->execute())
		{
		  return true;
		}
		return false;
	}

	function update(){
		$query = "CALL sp_actualizarcooperativadireccion(
      :prid,
      :prdistrito,
			:prdireccion
		)";
  
		$result = $this->conn->prepare($query);
  
    $result->bindParam(":prid", $this->id_cooperativa);
    $result->bindParam(":prdistrito", $this->distrito);
		$result->bindParam(":prdireccion", $this->direccion);
  
    $this->id_cooperativa=htmlspecialchars(strip_tags($this->id_cooperativa));
    $this->distrito=htmlspecialchars(strip_tags($this->distrito));
		$this->direccion=htmlspecialchars(strip_tags($this->direccion));
  
		if($result->execute())
		{
		  return true;
		}
		return false;
  }
  
	function delete(){
		$query = "CALL sp_eliminarcooperativadireccion(
      :prid
		)";
  
		$result = $this->conn->prepare($query);
  
    $result->bindParam(":prid", $this->id_cooperativa);
  
    $this->id_cooperativa=htmlspecialchars(strip_tags($this->id_cooperativa));
  
		if($result->execute())
		{
		  return true;
		}
		return false;
	}

  function actualizar_orden() {
    $query = "CALL sp_actualizarcooperativadireccionorden(
      :prdireccion,
      :prordenactual,
			:prordennueva
		)";
  
		$result = $this->conn->prepare($query);
  
    $result->bindParam(":prdireccion", $this->id_cooperativa);
    $result->bindParam(":prordenactual", $this->numero_orden_antigua);
		$result->bindParam(":prordennueva", $this->numero_orden_nueva);
  
    $this->id_cooperativa=htmlspecialchars(strip_tags($this->id_cooperativa));
    $this->numero_orden_antigua=htmlspecialchars(strip_tags($this->numero_orden_antigua));
		$this->numero_orden_nueva=htmlspecialchars(strip_tags($this->numero_orden_nueva));
  
		if($result->execute())
		{
		  return true;
		}
		return false;
  }

  function obtener_ultimo_orden() {
    $query = "CALL sp_listarcooperativadireccionultimonumeroorden()";
  
		$result = $this->conn->prepare($query);
  
    $result->execute();

    $row = $result->fetch(PDO::FETCH_ASSOC);

    $this->numero_orden=$row['numero_orden'];

    return $this->numero_orden ;
  }
  
  function read_cuenta(){
    $query = "CALL sp_listarcooperativacuenta(?,?,?,?)";

    $result = $this->conn->prepare($query);

    $result->bindParam(1, $this->banco ) ;
    $result->bindParam(2, $this->titular ) ;
    $result->bindParam(3, $this->numero_pagina ) ;
    $result->bindParam(4, $this->total_pagina ) ;

    $result->execute();

    $cuentas_list=array();
    $cuentas_list["cuentas"]=array();

    $contador = $this->total_pagina*($this->numero_pagina-1);

    while($row = $result->fetch(PDO::FETCH_ASSOC))
    {
      extract($row);
      $contador = $contador+1;
      $item = array(
        "numero" => $contador,
        "id" => $id ,
        "id_banco" => $id_banco ,
        "banco" => $banco ,
        "numero_cuenta" => $numero_cuenta ,
        "cci" => $cci ,
        "titular" => $titular ,
        "alias" => $alias ,
      );
      array_push($cuentas_list["cuentas"],$item);
    }
    return $cuentas_list;
  }

  function contar_cuenta(){
    $query = "CALL sp_listarcooperativacuentacontar(?,?)";

    $result = $this->conn->prepare($query);

    $result->bindParam(1, $this->banco ) ;
    $result->bindParam(2, $this->titular ) ;

    $result->execute();

    $row = $result->fetch(PDO::FETCH_ASSOC);

    $this->total_resultado=$row['total'];

    return $this->total_resultado;
  }

	function create_cuenta(){
		$query = "CALL sp_crearcooperativacuenta(
      :prbanco,
      :prtitular,
      :prnumero,
      :prcci,
			:pralias
		)";
  
		$result = $this->conn->prepare($query);
  
		$result->bindParam(":prbanco", $this->banco);
    $result->bindParam(":prtitular", $this->titular);
    $result->bindParam(":prnumero", $this->numero);
    $result->bindParam(":prcci", $this->cci);
    $result->bindParam(":pralias", $this->alias);
  
		$this->banco=htmlspecialchars(strip_tags($this->banco));
    $this->titular=htmlspecialchars(strip_tags($this->titular));
    $this->numero=htmlspecialchars(strip_tags($this->numero));
    $this->cci=htmlspecialchars(strip_tags($this->cci));
    $this->alias=htmlspecialchars(strip_tags($this->alias));
  
		if($result->execute())
		{
		  return true;
		}
		return false;
	}

	function update_cuenta(){
		$query = "CALL sp_actualizarcooperativacuenta(
      :prid,
      :prbanco,
      :prtitular,
      :prnumero,
      :prcci,
			:pralias
		)";
  
		$result = $this->conn->prepare($query);
  
    $result->bindParam(":prid", $this->id_cooperativa_cuenta);
    $result->bindParam(":prbanco", $this->banco);
    $result->bindParam(":prtitular", $this->titular);
    $result->bindParam(":prnumero", $this->numero);
    $result->bindParam(":prcci", $this->cci);
    $result->bindParam(":pralias", $this->alias);
  
		$this->id_cooperativa_cuenta=htmlspecialchars(strip_tags($this->id_cooperativa_cuenta));
    $this->titular=htmlspecialchars(strip_tags($this->titular));
    $this->numero=htmlspecialchars(strip_tags($this->numero));
    $this->cci=htmlspecialchars(strip_tags($this->cci));
    $this->alias=htmlspecialchars(strip_tags($this->alias));
  
		if($result->execute())
		{
		  return true;
		}
		return false;
  }
  
	function delete_cuenta(){
		$query = "CALL sp_eliminarcooperativacuenta(
      :prid
		)";
  
		$result = $this->conn->prepare($query);
  
    $result->bindParam(":prid", $this->id_cooperativa_cuenta);
  
    $this->id_cooperativa_cuenta=htmlspecialchars(strip_tags($this->id_cooperativa_cuenta));
  
		if($result->execute())
		{
		  return true;
		}
		return false;
  }

  function read_cuenta_unlimited() {

    $spreadsheet = new Spreadsheet();
    $sheet = $spreadsheet->getActiveSheet();

    $query = "CALL sp_listarcooperativacuentadepositosunlimited(?)";

    $result = $this->conn->prepare($query);

    $result->bindParam(1, $this->id_cooperativa_cuenta);

    $result->execute();
    
    $archivo = "" ;
    $cobranza=array();
    $cobranza["clientes"]=array();

    $contador = 1;

    $sheet->setCellValue('A1', 'N°');
    $sheet->setCellValue('B1', 'Fecha');
    $sheet->setCellValue('C1', 'DNI');
    $sheet->setCellValue('D1', 'Nombre');
    $sheet->setCellValue('E1', 'Número de operación');
    $sheet->setCellValue('F1', 'Monto');
    $sheet->setCellValue('G1', 'Validado');
    $sheet->setCellValue('H1', 'Tiene voucher');

    while($row = $result->fetch(PDO::FETCH_ASSOC))
    {
        extract($row);
        $contador=$contador+1;

        $sheet->setCellValue('A' . $contador, $contador-1 );
        $sheet->setCellValue('B' . $contador, $fecha );
        $sheet->setCellValue('C' . $contador, $cliente_dni );
        $sheet->setCellValue('D' . $contador, $cliente_nombre );
        $sheet->setCellValue('E' . $contador, $numero_operacion );
        $sheet->setCellValue('F' . $contador, $monto );
        $sheet->setCellValue('G' . $contador, $validado == 1 ? 'SI' : 'NO' );
        $sheet->setCellValue('H' . $contador, $voucher == 1 ? 'SI' : 'NO' );
    }

    $writer = new Xlsx($spreadsheet);

    $archivo = $this->path_reporte.$this->archivo.'.xlsx';

    $writer->save($archivo);
    
    if( file_exists ( $archivo ) ){
      return $archivo;
    } else {
      return false;
    };
}
}
?>