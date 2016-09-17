var jsonfile = require('jsonfile')
var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https', 
  apiKey: 'API_KEY', 
  formatter: null  
};
 
var geocoder = NodeGeocoder(options);

var file = 'realty.json';

jsonfile.readFile(file, function(err, obj) {
	var data = obj.data,
		result = [];

	while(data.length >= 0){
		data.pop();
	}
	
	geocode(data);
});

function geocode(data, result){
	console.log(data.length);

	if(!data.length){
		jsonfile.writeFile('locations.json', {data:result}, function (err) {
      		console.error(err)
    	})
		return;
	}

	var result = result || [];

	var item = data.pop();
	var address = item.text.match("адресу: (.*) был построен")[1];
	var year = item.text.match("был построен в (.*) году.")[1];
	geocoder.geocode(address, function ( err, geodata ) {
			if(!geodata || !geodata.length){
				console.log(err);
				data.push(item);
				geocode(data, result);
				return;
			}
			var location = {
				lat: geodata[0].latitude,
				lng: geodata[0].longitude
			};
			result.push({
				id: item.id,
				year: year,
				location: location
			})
			geocode(data, result);
		});
}
