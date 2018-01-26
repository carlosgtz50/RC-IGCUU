    function MostrarDetalle(control){

    var contenido = $(control).attr("datosUrl")

    $('#bodyModalDetalle').load(contenido);

    $('#modalDetalle').modal('show').on('hidden.bs.modal', function () {
        
        $('#bodyModalDetalle').html("<img src='img/loading-spinner-grey.gif' alt='' class='loading'><span> &nbsp;&nbsp;Cargando... </span>");
    });
};


informeGob = function() {

    return {

        initTabla: function(idOrden) {

            var parametros = {
                // seccion: 'consultaPersonas'
                seccion: 'consultaAcuerdos',
                nombreBuscar: $('#nombrePersona').val(),
                frmidCategoria: $('#frmidCategoria').val()
                
            };

            var $table = $('#listadoPersonas');

            $table.bootstrapTable('destroy');

            $.ajax({
                type : "POST",
                url : "datos/listadoPersonas.php",
                data : parametros,
                success : function(resp){

                    alert('Correcto');

                    $table.bootstrapTable({
                        data: resp,
                        exportDataType: 'all'
                    });

                    $table.bootstrapTable('refresh', {silent: true});   

                    $('#nombrePersona').focus();
                    
                },
                error: function(e) {
                    alert('Error: ' + e.message);
                }

            });
        },

        detallePersona: function(idOrden) {

            var parametros = {
                // seccion: 'consultaPersonas'
                seccion: 'consultaAcuerdos',
                nombreBuscar: $('#nombrePersona').val()
                
            };

            var $table = $('#listadoPersonas');

            $table.bootstrapTable('destroy');

            $.ajax({
                type : "POST",
                url : "datos/detallePersona.php",
                data : parametros,
                success : function(resp){



                    
                }
            });
        },

        limpiar: function(){
            $('#nombrePersona').val("");
            $('#nombrePersona').focus();
        },

        init: function() {
            this.initTabla();
        }
    };

}();

jQuery(document).ready(function() {

    $("#nombrePersona").keypress(function(e) {
       if(e.which == 13) {
          // Acciones a realizar, por ej: enviar formulario.
          informeGob.init(); 
       }
    });

    informeGob.init(); 
});
