$(function() {
  $("#depart-date, #return-date").datepicker({
    dateFormat: 'yy-mm-dd',
    minDate: '+2M',
    maxDate: '+4M'
  });
});