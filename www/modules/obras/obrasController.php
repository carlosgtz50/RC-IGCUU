<?php 

    require_once '../../config/config.php';


    $seccion = $_POST['seccion'];

   
    
    if ($seccion == 'consultaPuntosObras'){

    	if(isset($_POST['idMunicipio']) and !empty($_POST['idMunicipio'])){
            $idMunicipio = $_POST['idMunicipio'];
        }else{
            $idMunicipio = 217;
        }

    	$sql = "SELECT l.lat, l.lng
				FROM Estados e
				JOIN Municipios m ON e.id = m.estado_id
				JOIN localidades l ON m.id = l.municipio_id
				WHERE m.id = $idMunicipio
				LIMIT 1";

    	$mysqli = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

		if($res = $mysqli->query($sql)){

			$numrows = $res->num_rows;


			if($numrows>0){
				while($row=$res->fetch_assoc()){

					$data= array("lat"=>$row['lat'],"long"=>$row['lng']);
					$rip[] = $data;

				}
				
				header('Content-type:application/JSON');
				echo json_encode($rip,JSON_NUMERIC_CHECK);


			} else {
				echo json_encode(array( array("lat"=>28.6677315,"long"=>-106.0554541) ));
			}
		} else {
			echo json_encode(array( array("lat"=>28.6677315,"long"=>-106.0554541) ));
		}


    }

    if ($seccion == 'comboMunicipios'){

        $conexion = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

        $sql = "SELECT m.id AS ID, m.nombre AS OPCION
				FROM Estados e
				JOIN Municipios m ON e.id = m.estado_id
				WHERE e.id= 8";
        
        $resultado_data = mysqli_query($conexion,$sql);
        
        if(mysqli_connect_errno()){
            echo 'Conexion Fallida:', mysqli_connect_error();
            exit();
        }

        $view="";

        while($row = mysqli_fetch_array($resultado_data, MYSQLI_ASSOC)){
        // while ($row1 = mysql_fetch_array($res)) {
            $view .= '<option value ="' . $row['ID'] . '">' . $row['OPCION'] . '</option>';

        }

        echo $view;

    }
?>


