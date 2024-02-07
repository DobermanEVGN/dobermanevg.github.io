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

  // Обновление количества пассажиров
  function updateCounts() {
    $("#adultsCount").text(adultsCount);
    $("#childrenCount").text(childrenCount);
    $("#infantsCount").text(infantsCount);
  }

  $("#adultsMinusBtn").click(function() {
    if (adultsCount > 1) {
      adultsCount--;
      updateCounts();
    }
  });

  $("#adultsPlusBtn").click(function() {
    adultsCount++;
    updateCounts();
  });

  $("#childrenMinusBtn").click(function() {
    if (childrenCount > 0) {
      childrenCount--;
      updateCounts();
    }
  });

  $("#childrenPlusBtn").click(function() {
    childrenCount++;
    updateCounts();
  });

  $("#infantsMinusBtn").click(function() {
    if (infantsCount > 0) {
      infantsCount--;
      updateCounts();
    }
  });

  $("#infantsPlusBtn").click(function() {
    infantsCount++;
    updateCounts();
  });

  $("#confirm-btn").click(function() {
    $("#modal").hide();
  });

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
   
  var adultsCount = 1;

  $("#adultsCount").text(adultsCount);

  $("#passenger-btn").click(function() {
    $("#modal").show();
  });

  $(".close").click(function() {
    $("#modal").hide();
  });  

});
