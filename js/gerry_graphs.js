var selection = 0;

$("#team3").hide();
$("#team4").hide();
function myFunction() {
    /* Get the text field */
    var copyText = ""
    console.log(selection)
    if (selection == 2) {
        copyText = $('#team1').val() + ' vs ' + $('#team2').val() + " in "  + $('#location').val() + " " + $('#room').val();
    } else if (selection == 3) {
        copyText = $('#team1').val() + ' vs ' + $('#team2').val() + ' vs ' + $('#team3').val() + " " + " in "  + $('#location').val() + " " + $('#room').val();
    } else if (selection == 4) {
        copyText = $('#team1').val() + ' vs ' + $('#team2').val() + ' vs ' + $('#team3').val()  + ' vs ' + $('#team4').val() + " " + " in "  + $('#location').val() + " " + $('#room').val();
    }
    if ( $('#score1').val() !== "" &&  $('#score2').val() !== "") {
        copyText = copyText + " - " + "Final Score: " + $('#score1').val() + "-" + $('#score2').val()
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
    $('#team3').val("");
    $('#team4').val("");
    $('#location').val("");
    $('#room').val("");
    $('#score1').val("");
    $('#score2').val("");

}

$('.selection').on('change', function() {
    if ($(".selection option:selected").text() == "Two Teams") {
        console.log('here2')
        $("#team3").hide();
        $("#team4").hide();
        $('#score1').show();
        $('#score2').show();
        selection = 2;
    } else if ($(".selection option:selected").text() == "Three Teams") {
        $("#team4").hide();
        $("#team3").show();
        $('#score1').hide();
        $('#score2').hide();
        selection = 3;
        console.log('here3')
    } else if ($(".selection option:selected").text() == "Four Teams") {
        console.log('here4')
        $("#team4").show();
        $("#team3").show();
        $('#score1').hide();
        $('#score2').hide();
        selection = 4;
    }
});