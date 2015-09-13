document.addEventListener("load", function() {
    document.findElementById('togglepfontbutton').style.display = 'block';
});

function changetheme(name) {
    document.getElementById('maincss').setAttribute('href', name);
}

function changepfont(font) {
    var eles = document.getElementsByTagName('p');
    for (var i = 0; i < eles.length; i++) {
        eles[i].style.fontFamily = font;
        eles[i].style.letterSpacing = 0;
    }
}

function customfontprompt() {
    font = prompt("Insert custom fontname.");
    changepfont(font);
}

function garishprompt() {
    font = prompt("Insert custom fontname.");
    changepfont(font);
}

var pfonttoggle = true;

function togglepfont() {

    if (pfonttoggle) {
        pfonttoggle = false;
        document.findElementById('togglepfontbutton').value = 'default';
        changepfont('verdana');
    } else {
        pfonttoggle = true;
        document.findElementById('togglepfontbutton').value = 'verdana';
        changepfont('Source Sans Pro');
    }
}