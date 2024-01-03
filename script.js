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
          for (var i = 0; i < data.length; i++) {
            // Форматирование данных для отображения в выпадающем списке
            var label = data[i].name + ' - ' + data[i].code;
            results.push({ label: label, value: data[i].name });
          }
          response(results);
        }
      });
    },
    minLength: 3
  });
});
