/*global $*/


//var apiKey = '0FoPzwM5qPszrIT4R-6gG-kPeQ4dMAuI';
var apiKey = 'nt-qNa0ZdNPonR-ocAUj8A4R1A-hLLL-';



console.log('API Tests ran');

$("#API-submit").on('click', function (e) {
var URL = document.getElementById('API-url').value + "?apiKey=" + apiKey;
var TYPE = document.getElementById('API-type').value;
if ($('#API-parameters').val() != "") {
  URL += $('#API-parameters').val();
}
  $.ajax({
  url: URL,
  type: TYPE,
  contentType: 'JSON',
  success: function (response) {
    console.log('success');
    console.log(response);
    response = JSON.stringify(response)

    $('#results').html(response);
  },
  error: function (response) {
    console.log('error');
    console.log(response);
  }
});
});
