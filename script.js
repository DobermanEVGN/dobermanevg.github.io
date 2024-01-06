$(function() {

  // Автокомплит для полей ввода городов
  $("#departure, #arrival").autocomplete({

    // Источник данных 
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

        // Ограничиваем до 5 элементов
        var results = [];
        for(var i = 0; i < Math.min(data.length, 5); i++){

          var item = data[i];
          var label = item.name + ' - ' + item.code;
          
          results.push({
             label: label,
             value: item.name,
             code: item.code
          });

        }
        
        response(results);
      }
      });
    },

    // Обработчик выбора элемента
    select: function(event, ui) {
      
      // Устанавливаем значение поля равным названию города
      $(this).val(ui.item.value);

      // Остальная логика  
      var id = this.id === "departure" ? "departure-hint" : "arrival-hint";
      $("#" + id).text("Вы выбрали: " + ui.item.label);
      return false;
    },

    minLength: 3
    
  });
  
  
    


  

  $("#passenger-btn").click(function() {
    // код для модального окна с выбором пассажиров
  });

});
