var jr_k = {
  data: "",
  json_obj: {},
  dwell_time: {},
  init: function(evt) {
    //this is just for testing purposes
    var reader = new FileReader();
    var f = evt.target.files
    reader.readAsText(f[0]);
    reader.onload = function() {
      jr_k.data = reader.result;
      jr_k.parse(jr_k.data);
    }
  },
  parse: function(str) {
    jr_k.json_obj = JSON.parse(str);
    jr_k.dwell_time = jr_k.calculateDwellTime(jr_k.json_obj.KeyEvents);
    console.log(ConvertToCSV(jr_k.dwell_time))

    function ConvertToCSV(obj) {
      var csv = {
        data: []
      };
      for (var prop in obj) {
        if (!obj.hasOwnProperty(prop)) {
          continue;
        }
        for (var i = 0; i < obj[prop].length; i++) {
          var temp = {};
          var bool = false;
          for (var k = 0; k < csv.data.length; k++) {
            if (csv.data[k].hasOwnProperty(prop)) {} else {
              temp[prop] = obj[prop][i];
              csv.data[k][prop] = obj[prop][i];
              bool = true;
              break;
            }
          }
          if (!bool) {
            temp[prop] = obj[prop][i];
            csv.data.push(temp);
          }
        }
      }
      console.log(JSON.stringify(csv));
      return csv;
    }
  },
  calculateDwellTime: function(data) {
    var result = {}
    var str = '{'

    //8,9,10,14,15,27,32-127

    for (var i = 0; i < data.length; i++) {
      //if (String.fromCharCode(i) != '')
      //str += '"_' + i + '": [],';
      str += '"' + data[i].Key + '": [],';
    }

    str = str.slice(0, -1);
    str += '}';
    result = JSON.parse(str);


    var keyTemp = [];
    var temp = [];
    for (var k = data.length - 1; k >= 0; k--) {
      var index = keyTemp.indexOf(data[k].KeyCode);
      if (index != -1) {
        var dwelltime = temp[index].Timestamp - data[k].Timestamp;
        result[data[k].Key].push(dwelltime)
        temp.splice(index, 1);
        keyTemp.splice(index, 1);
      } else {
        keyTemp.push(data[k].KeyCode);
        temp.push(data[k]);
      }
    }
    return result;
  }
}

document.getElementById('jr_file').addEventListener('change', jr_k.init);
