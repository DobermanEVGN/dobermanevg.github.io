$(function() {

  $("#departure").autocomplete({
    source: function(request, response) {
      $.ajax({
        url: "https://autocomplete.travelpayouts.com/places2",
        dataType: "json", 
        data: {
          locale: "ru",
          types: ["airport","city"],
          term: request.term  
        },
        success: function(data) {

          var results = [];

          for(var i = 0; i < Math.min(data.length, 5); i++) {
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
      $(this).val(`${ui.item.value} - ${ui.item.code}`); 
      return false;
    },
    minLength: 3
  });

  $("#arrival").autocomplete({
    source: function(request, response) {
      $.ajax({
        url: "https://autocomplete.travelpayouts.com/places2", 
        dataType: "json",
        data: {
          locale: "ru",
          types: ["airport","city"],
          term: request.term   
        },
        success: function(data) {
            
          var results = [];

          for(var i = 0; i < Math.min(data.length, 5); i++) {
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
      $(this).val(`${ui.item.value} - ${ui.item.code}`);
      return false; 
    },
    minLength: 3
  });


  var adultsCount = 1;

  var childrenCount = 0;

  var infantsCount = 0;


  $("#adultsCount").text(adultsCount);

  $("#childrenCount").text(childrenCount);

  $("#infantsCount").text(infantsCount);


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

  var isBusinessClass = false;

  $("#businessClassCheckbox").change(function() {

    isBusinessClass = $(this).is(":checked");

    updatePassengerInfo();

  });


  $("#adultsMinusBtn").click(function() {

    if (adultsCount > 1) {

      adultsCount = adultsCount - 1;

      updateCounts();

      updatePassengerInfo();

    }

  });

  $("#adultsPlusBtn").click(function() {

    if (adultsCount + childrenCount + infantsCount < 9) {

      adultsCount = adultsCount + 1;

      updateCounts();

      updatePassengerInfo();

    }

  });

  $("#childrenMinusBtn").click(function() {

    if (childrenCount > 0) {

      childrenCount = childrenCount - 1;

      updateCounts();

      updatePassengerInfo();

    }

  });

  $("#childrenPlusBtn").click(function() {

    if (adultsCount + childrenCount + infantsCount < 9 && adultsCount + childrenCount < 9) {

      childrenCount = childrenCount + 1;

      updateCounts();

      updatePassengerInfo();

    }

  });  

  $("#infantsMinusBtn").click(function() {

    if (infantsCount > 0) {

      infantsCount = infantsCount - 1;

      updateCounts();

      updatePassengerInfo();

    }

  });

  $("#infantsPlusBtn").click(function() {

    if (infantsCount < adultsCount && adultsCount + childrenCount + infantsCount < 9) {

      infantsCount = infantsCount + 1;

      updateCounts();

      updatePassengerInfo();

    }

  });


  $("#confirm-btn").click(function() {

    $("#modal").hide();

    updatePassengerInfo();

  });


  $("#passenger-btn").after('<div id="passenger-info"></div>');

  function updatePassengerInfo() {

    var dates = $("#depart-date").val().split(";");

    var departDate = dates[0];

    var returnDate = dates[1];


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
    minDate: new Date(),
    maxDate: moment().add(2, 'months').toDate(),
    autoClose: true,
    range: true,
    multipleDatesSeparator: '; '
  });

  $("#modal").on("hide", function() {
    var dates = $("#depart-date").val().split(" - ");
    var departDate = dates[0];
    var returnDate = dates[1];
    $("#depart-date").val(departDate + ";" + returnDate);
  });

  $("#passenger-btn").click(function() {

    $("#modal").show();

  });

  $(".close").click(function() {

    $("#modal").hide();

  });


  console.log($.fn.datepicker.version);


});


let tg = window.Telegram.WebApp;

tg.expand();  

tg.MainButton.textColor = '#FFFFFF';

tg.MainButton.color = '#1877f2';


tg.MainButton.text = 'ПОДТВЕРДИТЬ И ПРОДОЛЖИТЬ';  

tg.MainButton.isVisible = false;





// Schedule the button to appear after 1 second (1000 milliseconds)
//setTimeout(showButton, 3000);


Telegram.WebApp.onEvent("mainButtonClicked", function() {

  tg.MainButton.hide()

  tg.sendData("Dorou")

  tg.close()

});

// Получаем ссылки на элементы
const departureInput = document.getElementById('departure');
const arrivalInput = document.getElementById('arrival');
const modalOverlay = document.getElementById('modal-overlay');
const modalInput = document.getElementById('modal-input');
const suggestionsList = document.getElementById('suggestions');
const closeBtn = document.getElementsByClassName('close')[0];

// Функция для открытия модального окна и установки значения поля ввода
function openModal(inputId) {
  const input = document.getElementById(inputId);
  modalOverlay.style.display = 'block';
  modalInput.value = input.value;
  modalInput.dataset.for = inputId;
  modalInput.focus();
}

// Добавляем обработчик события для открытия модального окна для поля "Откуда"
departureInput.addEventListener('click', () => {
  openModal('departure');
});

// Добавляем обработчик события для открытия модального окна для поля "Куда"
arrivalInput.addEventListener('click', () => {
  openModal('arrival');
});

// Функция для закрытия модального окна
function closeModal() {
  modalOverlay.style.display = 'none';
  suggestionsList.innerHTML = '';
}

// Функция для отображения подсказок
function showSuggestions(suggestions) {
  suggestionsList.innerHTML = '';
  suggestions.forEach(suggestion => {
    const li = document.createElement('li');
    li.innerHTML = `${suggestion.value} <span>${suggestion.code}</span>`;
    li.addEventListener('click', () => {
      selectSuggestion(suggestion);
      closeModal();
    });
    suggestionsList.appendChild(li);
  });
}

// Функция для выбора подсказки
function selectSuggestion(suggestion) {
  const inputId = modalInput.dataset.for;
  const input = document.getElementById(inputId);
  input.value = `${suggestion.value} - ${suggestion.code}`;
  input.dataset.code = suggestion.code;
  input.style.color = ""; // Сбрасываем цвет текста на значение по умолчанию
}

// Добавляем обработчики событий
closeBtn.addEventListener('click', closeModal);

// Подключаем автозаполнение для модального окна
modalInput.addEventListener('input', () => {
  const request = modalInput.value;
  if (request.length >= 3) {
    $.ajax({
      url: "https://autocomplete.travelpayouts.com/places2",
      dataType: "json",
      data: {
        locale: "ru",
        types: ["airport","city"],
        term: request
      },
      success: function(data) {
        var results = [];
        for(var i = 0; i < Math.min(data.length, 5); i++) {
          var item = data[i];
          var label = item.name + ' - ' + item.code;
          results.push({
            label: label,
            value: item.name,
            code: item.code
          });
        }
        showSuggestions(results);
      }
    });
  } else {
    suggestionsList.innerHTML = '';
  }




   

  $(document).ready(function() {
    // Function to check if all fields have text
  function areAllFieldsFilled() {
    return $("#departure").val() !== "" &&
           $("#arrival").val() !== "" &&
           $("#depart-date").val() !== "" &&
           $("#email").val() !== "";
  }

  // ... (existing code) ...

  // Function to update the button state based on field validation
  function updateButtonState() {
    if (areAllFieldsFilled()) {
      tg.MainButton.show();
    } else {
      tg.MainButton.hide();
    }
  }

  

  // Manually call updateButtonState once to ensure immediate update
  updateButtonState();

  // Set a very small time interval (e.g., 10 milliseconds)
  const checkInterval = 10; // Adjust this value as needed

  // Move setInterval inside the $(document).ready(function() { ... }); block
  setInterval(updateButtonState, checkInterval);

  // ... (rest of the code) ...
});
});



