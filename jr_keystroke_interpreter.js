var jr_k = {
  data: "",
  json_obj: {},
  init: function(evt) {
    //this is just for testing purposes
    var reader = new FileReader();
    var f  = evt.target.files
    reader.readAsText(f[0]);
    reader.onload = function() {
      jr_k.data = reader.result;
      jr_k.parse(jr_k.data);
    }
  },
  parse: function(str) {
    jr_k.json_obj = JSON.parse(str);
    console.log(jr_k.json_obj);
  }
}

document.getElementById('jr_file').addEventListener('change', jr_k.init);
