/*
  $('#modal_detalle').modal({
    keyboard: false,
    show:true,
    close: false,
    backdrop: 'static'
  });
*/

const URL_BACKEND="http://localhost:8080";
var AppConsulta = {

    init: function() {
        console.log("inicio de la aplicación AppConsulta");
        this.eventos();


    },
    eventos: function(){

        $("#boton_consultar").on("click",function(){
            if($('#tipo_documento').val() == ''){
                alert('Seleccione tipo de documento');
                return false;
            }else if($('#numero_documento').val() == ''){
                alert('Ingrese número de documento');
                return false;
            } else if($('#fecha_reserva').val() == ''){
                alert('Seleccione una fecha de reserva');
                return false;
            }

            console.log("FECHA_RESERVA=>"+$('#fecha_reserva').val());

            var splitFecha = $('#fecha_reserva').val().split("-");
            var fechaReserva = splitFecha[2] + "/" + splitFecha[1] + "/" + splitFecha[0];

            
            console.log("fechaReserva=>"+fechaReserva);

            $.ajax({ 
                type: 'GET', 
                url: URL_BACKEND+"/citas/buscarCita",
                data: { tipoDocumento:$('#tipo_documento').val(), numeroDocumento:$('#numero_documento').val(), fechaReserva:fechaReserva }, 
                dataType: 'json',
                success: function (data) {
                    //AppCitas.fnSetearFechas(data);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    //alert('No se encontraron citas');
                }
            });



            $('#modal_detalle').modal({
                keyboard: false,
                show:true,
                close: false,
                backdrop: 'static'
            });

            return false;
        });

        $("#nueva_consulta").on("click",function(){
            $('#numero_documento').val('');
            $('#fecha_reserva').val('');

            $('#modal_detalle').modal('hide');
            return false;
        });

        
    },

    mostrarDatosCita: function(dta){

    }


}

AppConsulta.init();