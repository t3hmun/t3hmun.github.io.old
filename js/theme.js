
var THEMETOGGLE = true;
var LIGHTTHEME = "/css/main-light.css";
var DARKTHEME = "/css/main.css";

window.onload = function () {
  var scriptbuttons = document.getElementById('scripties');
  scriptbuttons.style.display = 'block';
  
  var lighttext = document.getElementById('lightbutton');
  var darktext = document.getElementById('darkbutton');
  
  lighttext.onclick = function(){
    changeTheme(LIGHTTHEME);
    return false;
  };
  
  darktext.onclick = function(){
    changeTheme(DARKTHEME);
    return false;
  };
};

function toggleTheme() {
  if (THEMETOGGLE) {
    THEMETOGGLE = false;
    changeTheme(LIGHTTHEME);
  } else {
    THEMETOGGLE = true;
    changeTheme(DARKTHEME);
  }
}

function changeTheme(name) {
  document.getElementById('maincss').setAttribute('href', name);
}

function changeParaFont(font) {
  var eles = document.getElementsByTagName('p');
  for (var i = 0; i < eles.length; i++) {
    eles[i].style.fontFamily = font;
    eles[i].style.letterSpacing = 'normal';
  }
}

function customFontPrompt() {
  var font = prompt("Insert custom fontname.");
  changeParaFont(font);
}

var FONTTOGGLE = true;
var DEFAULTFONT = 'Source Sans Pro';
var OTHERFONT = 'verdana';

function toggleParaFont() {

  if (FONTTOGGLE) {
    FONTTOGGLE = false;
    document.getElementById('toggleParaFontButton').innerHTML = DEFAULTFONT;
    changeParaFont(OTHERFONT);
  } else {
    FONTTOGGLE = true;
    document.getElementById('toggleParaFontButton').innerHTML = OTHERFONT;
    changeParaFont(DEFAULTFONT);
  }
}