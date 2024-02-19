
let tg = window.Telegram.WebApp;
tg.expand(); //расширяем на все окно

  

    

tg.MainButton.text = 'Отправить в Telegram';
tg.MainButton.isVisible = true; 
tg.MainButton.show(); 

Telegram.WebApp.onEvent("mainButtonClicked", function() {
    // Ваш обработчик события
    // Например, отправка данных боту
    tg.sendData("Test message");
});

$(function() {

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
    select: function(event, ui) {
      $(this).val(ui.item.value);  
      
      var id = this.id === "departure" ? "departure-hint" : "arrival-hint";
      
      $("#" + id).text("Вы выбрали: " + ui.item.label);
      
      return false;
    },
    minLength: 3  
  });

  var adultsCount = 1;
  var childrenCount = 0;
  var infantsCount = 0;

  var isBusinessClass = false;

  function updateCounts() {
    $("#adultsCount").text(adultsCount);
    $("#childrenCount").text(childrenCount);
    $("#infantsCount").text(infantsCount);
    
    if (adultsCount === infantsCount) {
      $("#adultsMinusBtn").prop('disabled', true);
    } else {
      $("#adultsMinusBtn").prop('disabled', false);
    }
  }

  $("#businessClassCheckbox").change(function() {
    isBusinessClass = $(this).is(":checked");
    updatePassengerInfo();
  });

  $("#adultsMinusBtn").click(function() {
    if (adultsCount > 1) {
      adultsCount--;
      updateCounts();
      updatePassengerInfo();
    }
  });

  $("#adultsPlusBtn").click(function() {
    if (adultsCount + childrenCount + infantsCount < 9) {
      adultsCount++;
      updateCounts();
      updatePassengerInfo();
    }
  });

  $("#childrenMinusBtn").click(function() {
    if (childrenCount > 0) {
      childrenCount--;
      updateCounts();
      updatePassengerInfo();
    }
  });

  $("#childrenPlusBtn").click(function() {
    if (adultsCount + childrenCount + infantsCount < 9 &&
        adultsCount + childrenCount < 9) {
        
      childrenCount++;
      updateCounts();
      updatePassengerInfo();
    }
  });

  $("#infantsMinusBtn").click(function() {
    if (infantsCount > 0) {
      infantsCount--;
      updateCounts();
      updatePassengerInfo();
    }
  });

  $("#infantsPlusBtn").click(function() {
    if (infantsCount < adultsCount &&
        adultsCount + childrenCount + infantsCount < 9) {
        
      infantsCount++;
      updateCounts();
      updatePassengerInfo();
    }
  });

  $(".modal-content").append('<button type="button" id="confirm-btn">OK</button>');

  $("#confirm-btn").click(function() {
    $("#modal").hide();
    updatePassengerInfo();
  });
   
  $("#passenger-btn").after('<div id="passenger-info"></div>');

  function updatePassengerInfo() {
    var totalCount = adultsCount + childrenCount + infantsCount;
    var flightClass = isBusinessClass ? "Бизнес" : "Эконом";
    
    $("#passenger-info").text(totalCount + " чел, " + flightClass);
  }

  updatePassengerInfo();

  $("#adultsPlusBtn, #adultsMinusBtn").click(updatePassengerInfo);
  $("#childrenPlusBtn, #childrenMinusBtn").click(updatePassengerInfo);
  $("#infantsPlusBtn, #infantsMinusBtn").click(updatePassengerInfo);
  $("#businessClassCheckbox").change(updatePassengerInfo);

  $("#modal").on("hide", updatePassengerInfo);

  var minDate = new Date();
  
  var maxDate = moment().add(2, 'months').toDate();

  $("#depart-date").datepicker({
     dateFormat: 'yyyy-mm-dd',
     minDate: minDate,
     maxDate: maxDate,
     autoClose: true
  });

  $("#return-date").datepicker({
     dateFormat: 'yyyy-mm-dd',
     minDate: minDate,
     maxDate: maxDate,
     autoClose: true
  });
   
  $("#adultsCount").text(adultsCount);

  $("#passenger-btn").click(function() {
    $("#modal").show();
  });

  $(".close").click(function() {
    $("#modal").hide();
  });

 

});
