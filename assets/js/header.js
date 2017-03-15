document.addEventListener('DOMContentLoaded', function(event) {
  var path = window.location.pathname;
  var menuElements = document.querySelectorAll('header a');
  
  if (path === '/' | path.includes('/blog')) {
    menuElements[0].className += ' active';
  }

  if (path === '/sobre-mi/') {
    menuElements[1].className += ' active';
  }

  if (path === '/contacto/') {
    menuElements[2].className += ' active';
  }

});