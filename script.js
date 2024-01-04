$(function() {
  $("#depart-date, #return-date").datepicker({
    dateFormat: 'yy-mm-dd',
    minDate: '+2M',
    maxDate: '+4M'
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
            results.push({ label: label, value: data[i].name, airportCode: data[i].code });
          }
          response(results);
        }
      });
    },
    minLength: 3,
    select: function(event, ui) {
      // Отображение кода аэропорта в правой части поля для ввода
      var airportCode = ui.item.airportCode;
      $(this).val($(this).val() + ' - ' + airportCode);
      return false;
    }
  });
});
