$(function() {

  $("#depart-date, #return-date").datepicker({
    dateFormat: 'yy-mm-dd',
    minDate: 0,
    maxDate: '+2M',
    defaultDate: '+1w',
    language: 'ru'
  });

  $("#departure, #arrival").autocomplete({
    source: function(request, response) {
      $.ajax({
        url: "https://autocomplete.travelpayouts.com/places2",
        dataType: "json",
        data: {
          locale: "ru",
          types: ["airport", "city"],
          term: request.term
        },
        success: function(data) {
          var results = [];
          for (var i = 0; i < Math.min(data.length, 5); i++) {
            var label = data[i].name + ' - ' + data[i].code;
            results.push({
              label: label,
              value: data[i].name,
              airportCode: data[i].code
            });
          }
          response(results);
        }
      });
    },
    minLength: 3,
    select: function(event, ui) {
      $(this).siblings(".airport-code").remove();
      $("<span class='airport-code'>" + ui.item.airportCode + "</span>").insertAfter($(this));
    }
  });

});
