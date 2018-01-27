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




$fila = 1;

f (($gestor = fopen("BaseRegistro.csv", "r")) !== FALSE) {

	echo $gestor;

    // while (($datos = fgetcsv($gestor, 0, ",")) !== FALSE) {

    //     $fila++;


    //     echo $datos[0];
    //     break; 

    //     // for ($c=0; $c < $numero; $c++) {
    //     //     echo $datos[$c] . "<br />\n";
    //     // }
    // }

    fclose($gestor);
}

// header('Content-type: application/json');
// echo json_encode($return_arrayPersonas, JSON_PRETTY_PRINT);


// print_r($long);

//Print data
// print_r($json_data);

?>