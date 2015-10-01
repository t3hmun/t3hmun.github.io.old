
var THEMETOGGLE = true;
var LIGHTTHEME = "/css/main.css"
var DARKTHEME = "/css/main-light.css"

function toggleTheme()
{
    if(THEMETOGGLE){
        THEMETOGGLE=false;
        changeTheme(LIGHTTHEME);
    }else{
        THEMETOGGLE=true;
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