$(function() {

  $("#departure").autocomplete({
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
          types: ["airport", "city"],
          term: request.term
        },
        success: function(data) {
          var results = [];
          for (var i = 0; i < Math.min(data.length, 5); i++) {
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
    if (adultsCount + childrenCount + infantsCount < 9 && adultsCount + childrenCount < 9) {
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
    if (infantsCount < adultsCount && adultsCount + childrenCount + infantsCount < 9) {
      infantsCount++;
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

Telegram.WebApp.onEvent("mainButtonClicked", function() {
  // Retrieve user input
  const departure = $("#departure").val();
  const arrival = $("#arrival").val();
  const dates = $("#depart-date").val();
  const email = $("#email").val();

  // Get passenger and class information
  const passengerInfo = $("#passenger-info").text();

  // Prepare data to send
  const dataToSend = {
    departure: departure,
    arrival: arrival,
    dates: dates,
    email: email,
    passengerInfo: passengerInfo
  };

  // Send data to the bot
  tg.sendData(JSON.stringify(dataToSend));

  tg.MainButton.hide();
  tg.close();
});

// Get references to elements
const departureInput = document.getElementById('departure');
const arrivalInput = document.getElementById('arrival');
const modalOverlay = document.getElementById('modal-overlay');
const modalInput = document.getElementById('modal-input');
const suggestionsList = document.getElementById('suggestions');
const closeBtn = document.getElementsByClassName('close')[0];

// Function to open the modal and set the input field value
function openModal(inputId) {
  const input = document.getElementById(inputId);
  modalOverlay.style.display = 'block';
  modalInput.value = input.value;
  modalInput.dataset.for = inputId;
  modalInput.focus();
}

// Add event listener to open the modal for the "Departure" field
departureInput.addEventListener('click', () => {
  openModal('departure');
});

// Add event listener to open the modal for the "Arrival" field
arrivalInput.addEventListener('click', () => {
  openModal('arrival');
});

// Function to close the modal
function closeModal() {
  modalOverlay.style.display = 'none';
  suggestionsList.innerHTML = '';
}

// Function to display suggestions
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

// Function to select a suggestion
function selectSuggestion(suggestion) {
  const inputId = modalInput.dataset.for;
  const input = document.getElementById(inputId);
  input.value = `${suggestion.value} - ${suggestion.code}`;
  input.dataset.code = suggestion.code;
  input.style.color = ""; // Reset text color to default
}

// Add event listeners
closeBtn.addEventListener('click', closeModal);

// Connect autocomplete for the modal window
modalInput.addEventListener('input', () => {
  const request = modalInput.value;
  if (request.length >= 3) {
    $.ajax({
      url: "https://autocomplete.travelpayouts.com/places2",
      dataType: "json",
      data: {
        locale: "ru",
        types: ["airport", "city"],
        term: request
      },
      success: function(data) {
        var results = [];
        for (var i = 0; i < Math.min(data.length, 5); i++) {
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
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email validation regex
      return $("#departure").val() !== "" &&
             $("#arrival").val() !== "" &&
             $("#depart-date").val() !== "" &&
             emailRegex.test($("#email").val()); // Check email validity
    }

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
  });
});


