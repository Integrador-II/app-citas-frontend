$(document).ready(function(){

    $("#select_especialidad").selectable({
        stop: function() {
          $(".ui-selected", this ).each(function() {
            var idEspecialidadSelect = $(this).attr('data-id');
            //console.log("index==>"+$(this).text());
            //console.log("id==>"+$(this).attr('data-id'));
          });
        }
    });

    

    $("#select_medico").selectable({
        stop: function() {
          $(".ui-selected", this ).each(function() {
            var idMedico = $(this).data('id');

            //console.log("index==>"+$(this).text());
            //console.log("idMedico==>"+$(this).data('id'));
            //console.log("fecha==>"+$(this).data('fecha'));

            AppCitas.cargarMedicoFechaDisponibilidad(idMedico);
          });
        }
    });

    $("#select_hora").selectable({
        stop: function() {
          $(".ui-selected", this ).each(function() {
            //console.log("index==>"+$(this).text());
          });
        }
    });


    
    $('#datepicker_cita').datepicker({
        inline: true,
        dateFormat: 'dd/mm/yy',
        firstDay: 1
    });

    /*
    var array = ['06/07/2021', '08/07/2021'];
    $('#datepicker_cita').datepicker('option', 'beforeShowDay', function(date) {
      var f = $.datepicker.formatDate('dd/mm/yy', date);
      if ($.inArray(f, array) > -1) {
        return [true,'highlight2', ''];
      }else{
        return arr = [false, '', 'No Disponible'];
      }
    });
    */
    /*
    $('#datepicker_cita').datepicker('option', 'onSelect', function(e){
      console.log("select=>"+e);
    });
    */
   

    $('#datepicker_cita').datepicker('option', 'onSelect', function(e){
      var idMedico = $('#select_medico .ui-selected').data('id');
      var fecha = e;

      
      console.log(".idMedico=>"+idMedico);
      console.log(".fecha=>"+fecha);

      AppCitas.cargarMedicoFechaHoraDisponibilidad(idMedico, fecha);


      /*
      $(document).on("click","#select_medico .ui-selected", function() {
        alert("Hello World!");
      });
      */

      /*
      $("#select_medico .ui-selected").each(function() {
          var idMedico = $(this).data('id');
          console.log("idMedico=>"+idMedico);
          console.log("fecha=>"+fecha);
          AppCitas.cargarMedicoFechaHoraDisponibilidad(idMedico, fecha);
        });
      */

    });
     
    //$('#datepicker_cita').datepicker("setDate", new Date(2021,7,8));

    //$('#datepicker_cita').datepicker('option', 'defaultDate', new Date(2021,7,8));
    //$('#datepicker_cita').datepicker('option', 'defaultDate', '08/07/2021');
    //$("#datepicker_cita").datepicker({ dateFormat: "yy-mm-dd" }).datepicker("setDate", "+2d");
    

  /*
    $('#datepicker_cita').datepicker('option', 'minDate', '1');
    $('#datepicker_cita').datepicker('option', 'maxDate', new Date(2021,7-1,15));

    $("#datepicker_cita").datepicker('option', 'onSelect', function(dateText, inst){
      console.log("date==>"+dateText);
    });

    $('#datepicker_cita').datepicker('option', 'setDate', '06/07/2021');
    */



    /*
    $("#datepicker_cita").datepicker({
      onSelect: function(dateText, inst) {
        var date = $(this).val();
        console.log("date==>"+date);
      }
    });
    */

    
    //$('#datepicker_cita').data({date: '2021-07-05'});
    //$('#datepicker_cita').datepicker('update');
    


    var current_fs, next_fs, previous_fs; //fieldsets
    var opacity;
    var current = 1;
    var steps = $("fieldset").length;
    
    setProgressBar(current);
    
    $(".next").click(function(){

      var buttonId = $(this).attr('id');
      var validado = true;

      //console.log("button.id=>"+buttonId);


      if(buttonId == 'next_especialidad'){
        validado = AppCitas.fnValidarDatosPersonales();
      }

      if(buttonId == 'next_medico'){
        validado = AppCitas.fnValidarEspecialidad();
      }

      if(buttonId == 'next_reservar'){
        validado = AppCitas.fnValidarMedicoHorario();
        if(validado){
          AppCitas.registrarCita();
        }
      }      

      if(!validado) return false;
    
      current_fs = $(this).parent();
      next_fs = $(this).parent().next();
      
      //Add Class Active
      $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");
      
      //show the next fieldset
      next_fs.show();
      //hide the current fieldset with style
      current_fs.animate({opacity: 0}, {
      step: function(now) {
      // for making fielset appear animation
      opacity = 1 - now;
      
      current_fs.css({
      'display': 'none',
      'position': 'relative'
      });
      next_fs.css({'opacity': opacity});
      },
      duration: 500
      });
      setProgressBar(++current);


    });
    
    $(".previous").click(function(){
    
    current_fs = $(this).parent();
    previous_fs = $(this).parent().prev();
    
    //Remove class active
    $("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");
    
    //show the previous fieldset
    previous_fs.show();
    
    //hide the current fieldset with style
    current_fs.animate({opacity: 0}, {
    step: function(now) {
    // for making fielset appear animation
    opacity = 1 - now;
    
    current_fs.css({
    'display': 'none',
    'position': 'relative'
    });
    previous_fs.css({'opacity': opacity});
    },
    duration: 500
    });
    setProgressBar(--current);


    });
    
    function setProgressBar(curStep){
    var percent = parseFloat(100 / steps) * curStep;
    percent = percent.toFixed();
    $(".progress-bar")
    .css("width",percent+"%")
    }
    
    $(".submit").click(function(){
    return false;
    })
    
    });