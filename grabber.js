//http://ya-stroitel.com/house/index.php?status=house&id=4000

var jsdom = require("jsdom");
var jsonfile = require('jsonfile')
 
var file = 'realty.json';

var stroitel = "http://ya-stroitel.com",
	mainUrl = stroitel + "/house/index.php?status=house&id=",
	jquery = "http://code.jquery.com/jquery.js",
	maxId = 4000;

function loadRealtyData(prevPage, prevData){
  var data = prevData || [],
      pageId = prevPage || 0;

  if(pageId > maxId){
    console.log(data);
    jsonfile.writeFile(file, {data:data}, function (err) {
      console.error(err)
    })
    return;
  }

   jsdom.env({
    url: mainUrl + pageId,
      scripts: [jquery],
    done: function (err, window) {
        var $ = window.$;
        $('div').each(function() {
    		if($(this).css('background-color') == "rgb(255, 255, 255)"){
    			data.push({id: pageId, text: $(this).text()});
    		}
		});

		console.log(pageId);
		setTimeout(function(){loadRealtyData(++pageId, data)}, 2000);
		jsonfile.writeFile(file, {data:data}, function (err) {
      		console.error(err)
    	})
      }
  });
}

loadRealtyData()


