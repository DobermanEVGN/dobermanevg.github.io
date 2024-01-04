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
            var item = {
              label: data[i].name,
              code: data[i].code
            };
            results.push(item);
          }
          response(results);
        }
      });
    },
    minLength: 3,
    select: function(event, ui) {
      $(this).val(ui.item.label);
      var airportCode = ui.item.code;
      var inputId = $(this).attr('id');
      $("#" + inputId + "-code").text(airportCode);
      return false;
    }
  });

  // Создание элементов для отображения кода аэропорта
  $("<span class='airport-code'></span>").insertAfter("#departure");
  $("<span class='airport-code'></span>").insertAfter("#arrival");
});
