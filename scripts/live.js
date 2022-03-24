(function() {
  var navigate = document.querySelector('.navigate');

  /**
   * Submit new place to server
   */
  function submitPlace(relocate, selected) {
    var payload = new FormData(relocate);
    payload.append('coords', selected.coords);

    var request = new XMLHttpRequest();
    request.open('POST', relocate.action);
    request.responseType = 'json';

    var button = relocate.querySelector('button');

    // Disable button
    button.setAttribute('disabled', 'disabled');

    request.addEventListener('readystatechange', function() {
      if (request.readyState === 4) {
        button.removeAttribute('disabled');
      }
    });

    request.addEventListener('load', function() {
      if (request.status > 200) {
        return relocate.textContent = 'An unknown error has occurred';
      }

      document.location.reload();
    });

    request.addEventListener('error', function() {
      return relocate.textContent = 'Failed to complete the request';
    });

    request.send(payload);
  }

  /**
   * Show relocate fields
   */
  function showRelocate(selected) {
    var suggest = document.querySelector('.suggest');
    document.body.removeChild(suggest);

    var offers = document.querySelector('.offers');
    document.body.removeChild(offers);

    var relocate = document.createElement('form');
    relocate.classList.add('relocate');
    relocate.setAttribute('method', 'POST');
    relocate.setAttribute('action', '/relocate/');

    document.body.insertBefore(relocate, navigate);

    var input = document.createElement('input');
    input.setAttribute('name', 'from');
    input.setAttribute('type', 'date');
    input.valueAsDate = new Date();
    relocate.appendChild(input);

    var button = document.createElement('button');
    button.textContent = 'Submit';
    button.setAttribute('type', 'submit');
    relocate.appendChild(button);

    var label = document.createElement('label');
    label.innerHTML = 'I have relocated to ' + '<strong>' + selected.name + '</strong>';
    relocate.appendChild(label);

    relocate.addEventListener('submit', function(e) {
      e.preventDefault();

      if (!input.value) {
        return;
      }

      return submitPlace(relocate, selected);
    });
  }

  /**
  * Show suggestions from server
  */
  function showSuggestion(offers, selected) {
    var place = document.createElement('div');
    place.classList.add('place');
    place.textContent = selected.name;
    offers.appendChild(place);

    var country = document.createElement('strong');
    country.textContent = ' / ' + selected.country;
    place.append(country);

    var coords = document.createElement('a');
    coords.textContent = selected.coords;
    coords.setAttribute('href', selected.link);
    coords.setAttribute('target', '_blank');
    place.append(coords);

    coords.addEventListener('click', function(e) {
      e.stopPropagation();
    });

    place.addEventListener('click', function() {
      showRelocate(selected);
    });
  }

  /**
   * Send searching request to server
   */
  function searchPlace(suggest) {
    var payload = new FormData(suggest);

    var request = new XMLHttpRequest();
    request.open('POST', suggest.action);
    request.responseType = 'json';

    var button = suggest.querySelector('button');

    // Disable button
    button.setAttribute('disabled', 'disabled');

    var offers = document.querySelector('.offers');

    if (offers !== null) {
      document.body.removeChild(offers);
    }

    request.addEventListener('readystatechange', function() {
      if (request.readyState === 4) {
        button.removeAttribute('disabled');

        offers = document.createElement('div');
        offers.classList.add('offers');

        document.body.insertBefore(offers, navigate);
      }
    });

    request.addEventListener('load', function() {
      var response = request.response;

      if (request.status > 200) {
        return offers.textContent = 'An unknown error has occurred';
      }

      const fields = response.fields || [];

      if (fields.length < 1) {
        return offers.textContent = 'Nothing found';
      }

      for (var i = 0; i < response.fields.length; i++) {
        showSuggestion(offers, response.fields[i]);
      }
    });

    request.addEventListener('error', function() {
      return offers.textContent = 'Failed to complete the request';
    });

    request.send(payload);
  }

  /**
   * Create place fields
   */
  function createPlace() {
    var suggest = document.createElement('form');
    suggest.classList.add('suggest');
    suggest.setAttribute('method', 'POST');
    suggest.setAttribute('action', '/suggest/');

    document.body.insertBefore(suggest, navigate);

    var input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('name', 'place');
    input.setAttribute('placeholder', 'Enter the city');
    suggest.append(input);

    var button = document.createElement('button');
    button.textContent = 'Check in';
    button.setAttribute('type', 'submit');
    suggest.appendChild(button);

    // Submit form action
    suggest.addEventListener('submit', function(e) {
      e.preventDefault();

      if (!input.value) {
        return;
      }

      return searchPlace(suggest);
    });
  }

  var login = document.createElement('button');

  login.classList.add('login');
  login.textContent = 'Login';
  login.setAttribute('type', 'button');

  document.body.appendChild(login);

  login.addEventListener('click', function(e) {
    e.preventDefault();

    createPlace();

    // Remove login icon
    document.body.removeChild(login);
  });
})();
