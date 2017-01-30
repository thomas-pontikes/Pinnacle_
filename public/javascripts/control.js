$( document ).ready(function() {

$('input[name="id"]').mask("999999999")

$('#doTicket').click(function(e){
    e.preventDefault();
      _ajax('/doTicket');
});

$('#checkData').click(function(e){
  e.preventDefault();
      _ajax('/checkData');
});



function _ajax(route, callback) {

var data = $('#ticketForm').serialize();
var userData = $('#credential_form').serialize();

if($('input[name="username"]').val() === "" || $('input[name="password"]').val() === ""){
    $('#response').text("Please enter E-campus username & Sakai password")
    return false;
}
if ($('input[name="id"').val() === ""){
  $('#response').text("Please enter a 9 digit uri ID")
  return false;
}

if(route === '/doTicket' && $('select[name="option"]').val() === "none"){
  $('#response').text("Please Select a Ticket Option")
  return false;
}

if(route === '/doTicket' && !confirm('Please confirm creation of ticket...')){
    return false;
   }


  $.ajax({
    type:"POST",
    url:route,
    data: userData + '&'+ data,
     beforeSend: function() {
    $('#response').text("Please Wait for Results")
    $('#ticketForm').hide();
    $('#loading').html("<img src='/images/loading.gif'/ style='margin-left:3em;'>");
  },
    success:function(data){
      var jsonPretty = JSON.stringify(data, null, '\t');
      $("#response").text(jsonPretty);
      $('#loading').html('');
      $('#ticketForm').show();
    }
  });
}



});

