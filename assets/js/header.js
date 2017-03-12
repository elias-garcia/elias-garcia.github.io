document.addEventListener("DOMContentLoaded", function(event) { 
  var mainHeader = document.querySelector(".main-header h1");
  var menuElements = document.querySelectorAll("header a");

  menuElements.forEach(function(element) {
    if (element.innerHTML.toLowerCase() === mainHeader.innerHTML.toLowerCase()) {
      element.className += " active";
    }
  });
});