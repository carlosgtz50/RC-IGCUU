<?php


$url =  "//{$_SERVER['HTTP_HOST']}{$_SERVER['REQUEST_URI']}";

    $parts = parse_url($url);

    if ( array_key_exists('query', $parts)){
        parse_str($parts['query'], $query);
        $parametroQS = $query['id'];  
    }
    else{
        $parametroQS = 0;  
    }

$return_arrayPersonas = array();

// Read JSON file
$json = file_get_contents('./listadoPersonas2.json');


//Decode JSON
$json_data = json_decode($json);

$idPersona = "";
$imagenPersona = "";
$nombrePersona = "";
$apellidoPaterno = "";
$apellidoMaterno = "";
$lugar = "";


foreach($json_data as $obj){

    if ($obj->idPersona == $parametroQS){

        $idPersona = $obj->idPersona;
        $imagenPersona = '<img src="fotos/person.png" class="col-xl-12" alt="">';
        $nombrePersona = $obj->Nombre;
        $apellidoPaterno = $obj->ApellidoPaterno;
        $apellidoMaterno = $obj->ApellidoMaterno;
        $lugar = $obj->Asiento;
        $Sector = $obj->SECTOR;
        $Categoria = $obj->CATEGORIA;
        $Organizacion = $obj->ORGANIZACION;
        $Zona = $obj->ZONA;
        $Fila = $obj->Fila;
        $Confirmacion = $obj->CONFIRMACION;

        break;
    }

	   
}

?>


<div class="row">
    <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7">
        <?php echo $imagenPersona ?>
    </div>
    <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5">
        <div class="row">
            <div class="col-xl-12">
                <span class="m-widget14__desc">Nombre (s)</span>
                <h3 class="m-widget14__title"><?php echo $nombrePersona ?></h3>
            </div>
        </div>

        <div class="row">
            <div class="col-xl-12">
                <span class="m-widget14__desc">Apellido Paterno</span>
                <h3 class="m-widget14__title"><?php echo $apellidoPaterno ?></h3>
            </div>
        </div>

        <div class="row">
            <div class="col-xl-12">
                <span class="m-widget14__desc">Apellido Materno</span>
                <h3 class="m-widget14__title"><?php echo $apellidoMaterno ?></h3>
            </div>
        </div>

        <div class="row">
            <div class="col-xl-12">
                &nbsp
            </div>
        </div>

        <div class="row">
            <div class="col-xl-6">
                <span class="m-widget14__desc">Sector</span>
                <h4 class="m-widget14__title"><?php echo $Sector ?></h4>
            </div>
            <div class="col-xl-6">
                <span class="m-widget14__desc">Categoria</span>
                <h4 class="m-widget14__title"><?php echo $Categoria ?></h4>
            </div>
        </div>

        <div class="row">
            <div class="col-xl-12">
                <span class="m-widget14__desc">Organización</span>
                <h3 class="m-widget14__title"><?php echo $Organizacion ?></h3>
            </div>
        </div>

        <div class="row">
            <div class="col-xl-12">
                &nbsp
            </div>
        </div>

        <div class="row">
            <div class="col-xl-6">
                <span class="m-widget14__desc">Zona</span>
                <h1 class=""><?php echo $Zona ?></h1>
            </div>
            <div class="col-xl-6">
                <span class="m-widget14__desc">Fila</span>
                <h1 class=""><?php echo $Fila ?></h1>
            </div>
        </div>

        <div class="row">
            <div class="col-xl-6">
                <span class="m-widget14__desc">Asiento</span>
                <h1 class=""><?php echo $lugar ?></h1>
            </div>
            <div class="col-xl-6">
                <span class="m-widget14__desc">Confirmación</span>
                <h1 class=""><?php echo $Confirmacion ?></h1>
            </div>
        </div>
    </div>

</div>