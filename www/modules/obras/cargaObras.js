obrasEstado = function() {

    return {

        creaMapa: function(idOrden) {

            var parametros = {
                seccion: 'consultaPuntosObras',
                idMunicipio: $('#frmFidMunicipio').val()
            };

            $.ajax({
                type : "POST",
                url : "modules/obras/obrasController.php",
                data : parametros,
                success : function(resp){

                    var json = JSON.parse(resp); 

                    

                    var map = L.map('map').setView([json[0].lat,json[0].long], 12.45);

                    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
                        maxZoom: 18,
                        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
                            '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                            'Imagery © <a href="http://mapbox.com">Mapbox</a>',
                        id: 'mapbox.light'
                    }).addTo(map);

                    markers = new L.FeatureGroup();
                    map.addLayer(markers);
                    

                }
            });
        },

        consultaPuntos: function(idOrden) {

            var parametros = {
                seccion: 'consultaPuntosObras',
                idMunicipio: $('#frmFidMunicipio').val()
            };

            $.ajax({
                type : "POST",
                url : "modules/obras/obrasController.php",
                data : parametros,
                success : function(resp){

                    var json = JSON.parse(resp); 

                    var map = L.map('map');


                    map.setView([json[0].lat,json[0].long], 12.45);

                }
            });
        },

        cboMunicipios: function(idOrden) {

            var parametros = {
                seccion: 'comboMunicipios'
            };

            $.ajax({
                type : "POST",
                url : "modules/obras/obrasController.php",
                data : parametros,
                success : function(resp){

                    $('#frmFidMunicipio').html(resp);    

                }
            });
        },

        init: function() {
            this.creaMapa();
        }
    };

}();

jQuery(document).ready(function() {
    obrasEstado.init(); 
});
