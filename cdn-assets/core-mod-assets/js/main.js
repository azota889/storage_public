$('#localSearchSimple').jsLocalSearch();

$('img[data-enlargeable]').addClass('img-enlargeable').click(function () {
    var src = $(this).attr('src');
    var modal;

    function removeModal() {
        modal.remove();
        $('body').off('keyup.modal-close');
    }
    modal = $('<div>').css({
        background: 'RGBA(0,0,0,.5) url(' + src + ') no-repeat center',
        backgroundSize: 'contain',
        width: '100%',
        height: '100%',
        position: 'fixed',
        zIndex: '10000',
        top: '0',
        left: '0',
        cursor: 'zoom-out'
    }).click(function () {
        removeModal();
    }).appendTo('body');
    //handling ESC
    $('body').on('keyup.modal-close', function (e) {
        if (e.key === 'Escape') {
            removeModal();
        }
    });
});
$("#gsearchsimple").keyup(function(){
    if(this.value !== ''){
        $("#question_base h3").css("display","none");
        $("#question_exercise_teacher h3").css("display","none");
        $("#question_exercise_user h3").css("display","none");
        $("#question_test h3").css("display","none");
    }else{
        $("#question_base h3").css("display","block");
        $("#question_exercise_teacher h3").css("display","block");
        $("#question_exercise_user h3").css("display","block");
        $("#question_test h3").css("display","block");
    }
});
$("#btn_question_base").click(function() {
    $("#btn_question_base").addClass("active");
    $("#btn_question_exercise_teacher").removeClass("active");
    $("#btn_question_exercise_user").removeClass("active");
    $("#btn_question_test").removeClass("active");
        // 
    $("#gsearchsimple").val('')
    $('#localSearchSimple').jsLocalSearch();
    $('html, body').animate({
        scrollTop: $("#question_base").offset().top
    }, 500);
});
$("#btn_question_exercise_teacher").click(function() {
    $("#btn_question_exercise_teacher").addClass("active");
    $("#btn_question_base").removeClass("active");
    $("#btn_question_exercise_user").removeClass("active");
    $("#btn_question_test").removeClass("active");
    // 
    $("#gsearchsimple").val('')
    $('#localSearchSimple').jsLocalSearch();
    $('html, body').animate({
        scrollTop: $("#question_exercise_teacher").offset().top
    }, 500);
});
$("#btn_question_exercise_user").click(function() {
    $("#btn_question_exercise_user").addClass("active");
    $("#btn_question_base").removeClass("active");
    $("#btn_question_exercise_teacher").removeClass("active");
    $("#btn_question_test").removeClass("active");
    // 
    $("#gsearchsimple").val('')
    $('#localSearchSimple').jsLocalSearch();
    $('html, body').animate({
        scrollTop: $("#question_exercise_user").offset().top
    }, 500);
});
$("#btn_question_test").click(function() {

    $("#btn_question_test").addClass("active");
    $("#btn_question_base").removeClass("active");
    $("#btn_question_exercise_teacher").removeClass("active");
    $("#btn_question_exercise_user").removeClass("active");
        // 
    $("div").show();
        $("#gsearchsimple").val('')
        $('#localSearchSimple').jsLocalSearch();
    $('html, body').animate({
        scrollTop: $("#question_test").offset().top
    }, 500);
});
// 
var btn = $('#button');

$(window).scroll(function() {
  if ($(window).scrollTop() > 300) {
    btn.addClass('show');
  } else {
    btn.removeClass('show');
  }
});

btn.on('click', function(e) {
  e.preventDefault();
  $('html, body').animate({scrollTop:0}, '300');
});