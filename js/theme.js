var LIGHTTHEME = "/css/main-light.css";
var DARKTHEME = "/css/main.css";

// All script related elements are hidden and only appear if Javascript is enabled.
// The site functions fine without Javascript.
window.onload = function () {
  //Display the theme changer buttons.
  var themebuttons = document.getElementById('theme-changer');
  themebuttons.style.display = 'block';
  
  //Set the button click events.
  var lighttext = document.getElementById('lightbutton');
  var darktext = document.getElementById('darkbutton');

  lighttext.onclick = function () {
    changeTheme(LIGHTTHEME);
    return false;
  };

  darktext.onclick = function () {
    changeTheme(DARKTHEME);
    return false;
  };
  
  //Display toc if the document has one.
  var tocele = document.getElementById('markdown-toc');
  var toctoggle = document.getElementById('toc-toggle-div');
  var tocbutton = document.getElementById('toctogglebutton');

  if (tocele) {
    toctoggle.style.display = 'block';
    var toggle = false;

    tocbutton.onclick = function () {
      if (toggle) {
        tocele.style.display = 'none';
        toggle = false;
      }
      else {
        tocele.style.display = 'block';
        toggle = true;
      }
      return false;
    };
  }
  else {
    tocbutton.onclick = function () {
      return false;
    };
  }

};


function changeTheme(name) {
  document.getElementById('maincss').setAttribute('href', name);
}

