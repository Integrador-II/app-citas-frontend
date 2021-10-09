
const URL_BACKEND="http://localhost:8080";
var AppCitas = {
    init: function() {
        console.log("inicio de la aplicación");
        this.cargarEspecialidades();
        this.eventos();
    },
    eventos: function(){
        $('input[id=numero_documento]').change(function() {
            AppCitas.buscarPacienteTipoNumDoc();
        });

        $('select[id=tipo_documento]').change(function() {
            $('.step1 input').val('');
        });

        $("#next_especialidad").on("click",function(){
            console.log("next especialidad...");
        });

        $("#next_medico").on("click",function(){
            $("#select_especialidad .ui-selected").each(function() {
                var idEspecialidad = $(this).attr('data-id');
                AppCitas.cargarMedicoEspecialidadDisponibilidad(idEspecialidad);
            });
        });

    },
    
    buscarPacienteTipoNumDoc: function() {
        console.log("***buscarPacienteTipoNumDoc");
        var tipoDoc = $('#tipo_documento').val();
        var numDoc = $('#numero_documento').val();
        if(numDoc.length>=8){
            $.ajax({ 
                type: 'GET', 
                url: URL_BACKEND+"/pacientes/buscarTipoNumDocumento",
                data: { tipoDocumento: tipoDoc, numeroDocumento: numDoc }, 
                dataType: 'json',
                success: function (data) { 
                    if(null != data){
                        $('#nombres').val(data.nombre);
                        $('#apellido_paterno').val(data.apellidoPaterno);
                        $('#apellido_materno').val(data.apellidoMaterno);
                        $('#celular').val(data.celular);
                        $('#correo').val(data.correo);
                    }
                }
            });
        }

    },

    cargarTipoAtencion: function() {
        console.log("***cargarTipoAtencion");
        $.ajax({ 
            type: 'GET', 
            url: URL_BACKEND+"/tipoAtenciones",
            data: {  }, 
            dataType: 'json',
            success: function (data) { 
                $.each(data, function(index, element) {
                    $('#select_tipoAtencion').append($('<li class="ui-widget-content" data-id="'+element.idTipoAtencion+'">'+element.tipoAtencion+'</li>'));
                });
            }
        });
    },

    cargarEspecialidades: function() {
        console.log("***cargarEspecialidades");
        $.ajax({ 
            type: 'GET', 
            url: URL_BACKEND+"/especialidades",
            data: {  }, 
            dataType: 'json',
            success: function (data) { 
                $.each(data, function(index, element) {
                    $('#select_especialidad').append($('<li class="ui-widget-content" data-id="'+element.idEspecialidad+'">'+element.nombre+'</li>'));
                });
            }
        });
    },

    cargarMedicoEspecialidadDisponibilidad: function(idEspecialidad) {
        console.log("***cargarMedicoEspecialidadDisponibilidad");
        $('#div_fecha_hora').removeClass('visible').addClass('hidden');
        $('#select_medico').html('');
        $('#select_hora').html('');

        $.ajax({ 
            type: 'GET', 
            url: URL_BACKEND+"/medicos/listarMedicoCuposPorEspecialidad",
            data: { especialidadId:idEspecialidad }, 
            dataType: 'json',
            success: function (data) { 
                $.each(data, function(index, element) {
                    var idMedico = element.medico.idMedico;
                    var medico = element.medico.apellidoPaterno + " " + element.medico.apellidoMaterno + " "+ element.medico.nombre;
                    var proximaCitaFechaHoraArray = AppCitas.fnObtenerProximaCita(element.cuposDisponibles);

                    $('#select_medico').append($('<li class="ui-widget-content" data-id="'+idMedico+'" data-fecha="'+proximaCitaFechaHoraArray[0]+'"><strong>Dr. '+medico+'</strong> <br /><span>Pr&oacute;xima cita: '+proximaCitaFechaHoraArray[0]+' '+ proximaCitaFechaHoraArray[1] + '</span></li>'));

                    //AppCitas.fnSetearFechas(element.cuposDisponibles);
                    
                });
            }
        });
    },

    cargarMedicoFechaDisponibilidad: function(idMedico, hora="") {
        console.log("***cargarMedicoFechaDisponibilidad");
        $('#fecha_select').text('');

        $.ajax({ 
            type: 'GET', 
            url: URL_BACKEND+"/medicos/listarCuposPorMedico",
            data: { medicoId:idMedico }, 
            dataType: 'json',
            success: function (data) { 
                AppCitas.fnSetearFechas(data);
            }
        });
    },

    
    cargarMedicoFechaHoraDisponibilidad: function(idMedico, fecha) {
        console.log("***cargarMedicoFechaHoraDisponibilidad");
        console.log("***setear fecha");

        $('#fecha_select').text(fecha);

        $.ajax({ 
            type: 'GET', 
            url: URL_BACKEND+"/medicos/listarCuposPorMedicoYFecha",
            data: { medicoId:idMedico, fecha:fecha }, 
            dataType: 'json',
            success: function (data) {
                $('#select_hora').html("");
                $.each(data.horas, function(index, element) {
                    $('#select_hora').append($('<li class="ui-widget-content" data-hora="'+element+'">'+element+'</li>'));
                });

                //AppCitas.fnSetearFechas(data);
            }
        });
    },

    registrarCita: function() {
        console.log("***registrarCita");

        var idMedico = $('#select_medico .ui-selected').data('id');
        var fechaReserva=  $("#fecha_select").text();
        var horaReserva = $('#select_hora .ui-selected').text();

        var paciente = {
            nombre: $('#nombres').val(),
            apellidoPaterno: $('#apellido_paterno').val(),
            apellidoMaterno: $('#apellido_materno').val(),
            tipoDocumento: $('#tipo_documento').val(),
            numeroDocumento: $('#numero_documento').val(),
            celular: $('#celular').val(),
            correo: $('#correo').val()
        }

        var cita = {
            fechaReserva: fechaReserva,
            horaReserva: horaReserva,
            idTipoAtencion: 1,
            idMedico: idMedico,
            paciente: paciente
        }

        $.ajax({ 
            type: 'POST', 
            url: URL_BACKEND+"/citas/generarCita",
            data: JSON.stringify(cita), 
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
                if(null != cita){
                    $('#numero_cita').text(data.idCita);
                }
            }
        });
    },

    fnSetearFechas: function(cupos){
        $('#div_fecha_hora').addClass('visible');
        $('#select_hora').html("");
        //Fechas
        var fechasDisponibles = [];
        $.each(cupos, function(index, element) {
            fechasDisponibles.push(element.fecha);
        });

        //var array = ['06/07/2021', '08/07/2021'];
        //INICIO - VOLVER A CREAR PARA QUE LA FECHA NO QUEDE SELECCIONADA
        $('#datepicker_cita').datepicker("destroy");
        $('#datepicker_cita').datepicker({
            inline: true,
            dateFormat: 'dd/mm/yy',
            firstDay: 1
        });

        $('#datepicker_cita').datepicker('option', 'onSelect', function(e){
            var idMedico = $('#select_medico .ui-selected').data('id');
            var fecha = e;
            AppCitas.cargarMedicoFechaHoraDisponibilidad(idMedico, fecha);
        });
        //FIN - VOLVER A CREAR PARA QUE LA FECHA NO QUEDE SELECCIONADA

        $('#datepicker_cita').datepicker('option', 'beforeShowDay', function(date) {
        var f = $.datepicker.formatDate('dd/mm/yy', date);
            if ($.inArray(f, fechasDisponibles) > -1) {
                return arr = [true,'highlight2', ''];
            }else{
                return arr = [false, '', 'No Disponible'];
            }
        });

        //Horas
        /*
        $.each(cupos, function(index, element) {
            if(index==0){
                if(element.horas.length > 0){
                    $.each(element.horas, function(index, element2) {
                        //console.log("horas=>"+element2);
                        $('#select_hora').append($('<li class="ui-widget-content">'+element2+'</li>'));
                    });
                        

                }
            }
        });
        */

    },

    fnObtenerProximaCita: function(cupos){
        //var proximaCita = "";
        var arrayFechaHora = [];

        if(cupos.length > 0 ){
            arrayFechaHora.push(cupos[0].fecha);
            //proximaCita = cupos[0].fecha;
            if(cupos[0].horas.length > 0){
                //proximaCita = proximaCita + " " +cupos[0].horas[0];
                arrayFechaHora.push(cupos[0].horas[0]);
            }
        }

        /*
        $.each(cupos, function(index, element) {
            if(index==0){
                proximaCita = element.fecha;
                if(element.horas.length > 0){
                    proximaCita=proximaCita+" "+element.horas[0];

                    $.each(element.horas, function(index, element2) {
                        //console.log("horas=>"+element2);
                        $('#select_hora').append($('<li class="ui-widget-content">'+element2+'</li>'));
                    });
                        

                }
            }

        });
        */

        return arrayFechaHora;
    },    

    fnValidarDatosPersonales: function(){
        if($('#numero_documento').val() == ''){
            alert('Ingrese número de documento');
            return false;
        }else if($('#apellido_paterno').val() == ''){
            alert('Ingrese apellido paterno');
            return false;
        }else if($('#apellido_materno').val() == ''){
            alert('Ingrese apellido materno');
            return false;
        }else if($('#nombres').val() == ''){
            alert('Ingrese nombres');
            return false;
        }else if($('#celular').val() == ''){
            alert('Ingrese número de celular');
            return false;
        }
        return true;
    },

    fnValidarEspecialidad: function(){
        var especialidad = $('#select_especialidad .ui-selected').text();
        if(especialidad == ''){
            alert('Seleccione una especialidad');
            return false;
        }
        return true;
    },

    fnValidarMedicoHorario: function(){
        var medico = $('#select_medico .ui-selected').text();
        var hora = $('#select_hora .ui-selected').text();
        var fecha=  $("#fecha_select").text();

        if(medico ==''){
            alert('Seleccione una médico');
            return false;
        }else if(fecha ==''){
            alert('Seleccione una fecha');
            return false;
        }else if(hora ==''){
            alert('Seleccione una hora');
            return false;
        }

        return true;
    }
};

AppCitas.init();