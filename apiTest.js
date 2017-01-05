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
    var res = syntaxHighlight(response[0]);

    function syntaxHighlight(json) {
      if (typeof json != 'string') {
        json = JSON.stringify(json, undefined, 2);
      }
      json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = 'key';
          } else {
            cls = 'string';
          }
        } else if (/true|false/.test(match)) {
          cls = 'boolean';
        } else if (/null/.test(match)) {
          cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
      });
    }
    $('#results').html(res);
  },
  error: function (response) {
    console.log('error');
    console.log(response);
  }
});
});
