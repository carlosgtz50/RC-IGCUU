<?php


if(isset($_POST['nombreBuscar']) and !empty($_POST['nombreBuscar'])){
    $nombreBuscar = $_POST['nombreBuscar'];
}else{
    $nombreBuscar = '';
}

if(isset($_POST['frmidCategoria']) and !empty($_POST['frmidCategoria'])){
    $frmidCategoria = $_POST['frmidCategoria'];
}else{
    $frmidCategoria = '';
}




$return_arrayPersonas = array();

// Read JSON file
$json = file_get_contents('../listadoPersonas2.json');


//Decode JSON
$json_data = json_decode($json);


if( $nombreBuscar !== '' AND $frmidCategoria == ''){
	$datosEncontrados = array_filter($json_data, function($datos)

	{
		$seEncontro = stripos($datos->Nombre.' '.$datos->ApellidoPaterno.' '.$datos->ApellidoMaterno, $_POST['nombreBuscar']);

		$porCategoria = stripos($datos->CATEGORIA, $_POST['nombreBuscar']);


		if ($seEncontro !== false) {
		    return $datos;
		}
	});
}
else if( $frmidCategoria !== '' AND $nombreBuscar == ''){
	$datosEncontrados = array_filter($json_data, function($datos)
	{
		$porCategoria = stripos($datos->CATEGORIA, $_POST['frmidCategoria']);

		if ($porCategoria !== false) {
		    return $datos;
		}
	});	
}
else if( $nombreBuscar !== '' AND $frmidCategoria !== ''){

	// echo "aqui entro";

	$datosEncontrados = array_filter($json_data, function($datos)

	{
		$seEncontro = stripos($datos->Nombre.' '.$datos->ApellidoPaterno.' '.$datos->ApellidoMaterno, $_POST['nombreBuscar']);

		$porCategoria = stripos($datos->CATEGORIA, $_POST['frmidCategoria']);


		if ($seEncontro !== false AND $porCategoria !== false) {
		    return $datos;
		}
	});
}
else {
	$datosEncontrados = $json_data;
}

foreach($datosEncontrados as $obj){

	$row_array['No'] = $obj->idPersona;

    $row_array['Foto'] = '<img src="fotos/100_1.jpg" style="height:50px;" class="m--img-rounded m--marginless m--img-centered" alt="">';
    $row_array['Nombre'] = $obj->Nombre;
    $row_array['ApellidoPaterno'] = $obj->ApellidoPaterno;
    $row_array['ApellidoMaterno'] = $obj->ApellidoMaterno;
    $row_array['Lugar'] = $obj->Asiento;
    $row_array['Zona'] = $obj->ZONA;
    $row_array['Fila'] = $obj->Fila;
    $row_array['Categoria'] = $obj->CATEGORIA;
    $row_array['Detalle'] = '<span class="m-badge  m-badge--info m-badge--wide cursor" data-toggle="modal" data-target=".bd-example-modal-lg-content" datosUrl="datos/detallePersona.php?id='.$obj->idPersona.'" onclick="MostrarDetalle(this);">Info.</span>';

    array_push($return_arrayPersonas,$row_array);   
}

header('Content-type: application/json');
echo json_encode($return_arrayPersonas, JSON_PRETTY_PRINT);


// print_r($long);

//Print data
// print_r($json_data);

?>