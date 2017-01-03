/*global $*/


//var apiKey = '0FoPzwM5qPszrIT4R-6gG-kPeQ4dMAuI';
var apiKey = 'nt-qNa0ZdNPonR-ocAUj8A4R1A-hLLL-';
var URL = 'https://api.mlab.com/api/1/databases/keystroke-data/collections/users?apiKey=' + apiKey;
console.log('API Tests ran');

$.ajax({
  url: URL,
  type: 'GET',
  success: function(response) {
    console.log('success');
    console.log(response);
  },
  error: function(response) {
    console.log('error');
    console.log(response);
  }
});
