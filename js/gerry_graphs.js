function myFunction() {
    /* Get the text field */
    var copyText = $('#team1').val() + ' vs ' + $('#team2').val() + " in "  + $('#location').val() + " " + $('#room').val();
    if ( $('#score1').val() !== "" &&  $('#score2').val() !== "") {
        copyText = copyText + " - " + " Final Score: " + $('#score1').val() + "-" + $('#score2').val()
    }
    var textArea = document.createElement("textarea");
    textArea.style.position = 'fixed';
    textArea.style.top = 0;
    textArea.style.left = 0;
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = 0;
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    textArea.value = copyText;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    $('.textHere').text(copyText);
    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Copying text command was ' + msg);
    } catch (err) {
        console.log('Oops, unable to copy');
    }
    /* Select the text field */
    /* Copy the text inside the text field */
    textArea.value = ""
    $('#team1').val("");
    $('#team2').val("");
    $('#location').val("");
    $('#room').val("");
    $('#score1').val("");
    $('#score2').val("");

}
