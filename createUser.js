//NEED TO FINISH THIS
var jr = {
  createUser: function () {

    var getData = new XMLHttpRequest();
    var sendData = new XMLHttpRequest();

    getData.open('GET', URL + 'users?apiKey=' + apiKey + '&q={"_id":"Users"}');

    getData.setRequestHeader('Content-Type', 'application/json');

    getData.onload = function () {

      if (getData.status === 200) {

        var response = JSON.parse(getData.responseText);
        var TYPE = null;
        console.log(response);
        response[0][users].push(jr_key.data.Username);

        var data = JSON.stringify(response);

        sendData.open(TYPE, URL + jr_key.data.Username + '?apiKey=' + apiKey);
        sendData.setRequestHeader('Content-Type', 'application/json');
        sendData.onload = function () {

          if (sendData.status == 200 || sendData.status == 201) {
            console.log(sendData.responseText);
          } else {
            console.log(sendData.status);
            console.log(sendData.responseText);
          }
        };
        sendData.send(data);
      }

      else if (getData.status !== 200) {
        console.log('Request failed.  Returned status of ' + getData.status);
        console.log(getData.responseText)
      }
    };
    getData.send();

    //old
    var createUser = new XMLHttpRequest();
    createUser.open('PUT', URL + 'users?apiKey=' + apiKey + '&q={"_id":"Users"}');
    createUser.setRequestHeader('Content-Type', 'application/json');

    createUser.onload = function () {
      if (createUser.status == 200 || createUser.status == 201) {
        console.log(createUser.responseText);
      }
      else {
        console.log(createUser.status);
        console.log(createUser.responseText);
      }
    }
    var temp = {};
    temp["_id"] = 'Users';
    temp["users"] = [""];
    var data = JSON.stringify(temp);
    createUser.send(data);
  }
}