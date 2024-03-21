$(function() {

  // Инициализация автозаполнения для поля "Откуда"
  $("#departure").autocomplete({
    source: function(request, response) {
      $.ajax({
        url: "https://autocomplete.travelpayouts.com/places2",
        dataType: "json", 
         {
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
      checkFieldsAndToggleButtonState(); // Проверка состояния кнопки после выбора
      return false;
    },
    minLength: 3
  });

  // Инициализация автозаполнения для поля "Куда"
  $("#arrival").autocomplete({
    source: function(request, response) {
      $.ajax({
        url: "https://autocomplete.travelpayouts.com/places2", 
        dataType: "json",
         {
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
      checkFieldsAndToggleButtonState(); // Проверка состояния кнопки после выбора
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

  // Обработчики событий для кнопок увеличения и уменьшения количества пассажиров
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
    var totalCount = adultsCount + childrenCount + infantsCount;
    var flightClass = isBusinessClass ? "Бизнес" : "Эконом";
    $("#passenger-info").text(totalCount + " чел, " + flightClass);
  }

  updatePassengerInfo();

  // Инициализация datepicker для выбора даты
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
    $("#depart-date").val(dates.join(";"));
  });

  $("#passenger-btn").click(function() {
    $("#modal").show();
  });

  $(".close").click(function() {
    $("#modal").hide();
  });

  // Проверка заполненности полей и установка состояния кнопки
  function checkFieldsAndToggleButtonState() {
    const isAllFieldsFilled = $('#departure').val().trim() !== '' && 
                              $('#arrival').val().trim() !== '' && 
                              $('#depart-date').val().trim() !== '';

    // Включаем или выключаем главную кнопку
    tg.MainButton.isVisible = isAllFieldsFilled;
  }

  // Проверяем поля при загрузке страницы и при каждом изменении
  $('#departure, #arrival, #depart-date').on('input change', function() {
    checkFieldsAndToggleButtonState();
  });

  checkFieldsAndToggleButtonState(); // Вызовем при инициализации, чтобы установить начальное состояние кнопки

  // Интеграция с Telegram Web App SDK
  let tg = window.Telegram.WebApp;

  tg.expand();  
  tg.MainButton.textColor = '#FFFFFF';
  tg.MainButton.color = '#1877f2';
  tg.MainButton.text = 'ПОДТВЕРДИТЬ И ПРОДОЛЖИТЬ';  
  tg.MainButton.isVisible = true;

  Telegram.WebApp.onEvent("mainButtonClicked", function() {
    tg.MainButton.hide();
    tg.sendData("BookingData"); // Отправка данных. Замените "BookingData" на реальные данные бронирования.
    tg.close();
  });

  // Функции для модального окна
  const modalOverlay = document.getElementById('modal-overlay');
  const modalInput = document.getElementById('modal-input');
  const suggestionsList = document.getElementById('suggestions');
  const closeBtn = document.getElementsByClassName('close')[0];

  function openModal(inputId) {
    const input = document.getElementById(inputId);
    modalOverlay.style.display = 'block';
    modalInput.value = input.value;
    modalInput.dataset.for = inputId;
    modalInput.focus();
  }

  departureInput.addEventListener('click', () => {
    openModal('departure');
  });

  arrivalInput.addEventListener('click', () => {
    openModal('arrival');
  });

  function closeModal() {
    modalOverlay.style.display = 'none';
    suggestionsList.innerHTML = '';
  }

  closeBtn.addEventListener('click', closeModal);

  modalInput.addEventListener('input', () => {
    const request = modalInput.value;
    if (request.length >= 3) {
      $.ajax({
        url: "https://autocomplete.travelpayouts.com/places2",
        dataType: "json",
         {
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
  });

  function showSuggestions(results) {
    suggestionsList.innerHTML = '';
    results.forEach(function(suggestion) {
      const li = document.createElement('li');
      li.textContent = suggestion.label;
      li.onclick = function() {
        selectSuggestion(suggestion);
        closeModal();
        checkFieldsAndToggleButtonState(); // Обновляем состояние кнопки после выбора подсказки
      };
      suggestionsList.appendChild(li);
    });
  }

  function selectSuggestion(suggestion) {
    const inputId = modalInput.dataset.for;
    const input = document.getElementById(inputId);
    input.value = `${suggestion.value} - ${suggestion.code}`;
    input.dataset.code = suggestion.code;
  }
});
