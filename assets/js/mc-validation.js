var regExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
var errorMessage = 'Por favor, introduce un e-mail válido.';

function createErrorMessage() {
  var paragraph = document.createElement('p');

  paragraph.className = 'mc-error-text';
  paragraph.innerHTML = errorMessage;
  return paragraph;
}

document.addEventListener('DOMContentLoaded', function(event) {
  var mcForm = document.querySelector('form');
  var mcInput = document.querySelector('#mce-EMAIL');
  var mcError = document.querySelector('.mc-error');

  mcForm.addEventListener('submit', function(event) {
    event.preventDefault();
    if (regExp.test(mcInput.value)) {
      if ((mcInput.className).includes('mc-error-input')) {
        mcInput.className = '';
      }
      console.log(mcError.children.length);
      if (mcError.children.length > 0) {
        mcError.removeChild(mcError.children[0]);
      }
      mcForm.submit();
      mcForm.reset();
    } else {
      if (!(mcInput.className).includes('mc-error-input')) {
        mcInput.className += 'mc-error-input';
      }
      if (mcError.children.length === 0) {
        mcError.appendChild(createErrorMessage());
      }
    }
  });

});