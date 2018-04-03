'use strict';

var DatabaseController = require('../controllers/DatabaseController');

// mock data
var dataArr = [];
var keys = ['temperature','humidity','height','width','depth','direction','distance','occurrences','density','x_value','y_value','z_value','acceleration','speed','force','pressure'];
var scopes = ['device','user','product'];
var product_ids = [50,60,70,80];
var device_ids = ['70073798839ba79ca696a','70073798839ba79ca925bf','70073798839ba79ca6913c','70073798839ba79ca05fe','70073798839ba79ca2323','70073798839ba79ca090f','70073798839ba79caeefe','70073798839ba79ca03cd'];

let dbController = new DatabaseController();

async function generateMockData(dataLength) {

	let boxDocs = await dbController.listBox({});
	if (boxDocs.length < dataLength) {
		dataLength = boxDocs.length - dataLength;
	} else {
		dbController.terminate();
		return (`- No need to create additional mock data`);
	}

	for (var i=0; i< dataLength; i++) {

		var boxDoc =  {
			key: keys[Math.floor(Math.random()*keys.length)],
			value : Math.floor(Math.random()*360).toString(),
			scope: scopes[Math.floor(Math.random()*scopes.length)],
			product_id: product_ids[Math.floor(Math.random()*product_ids.length)],
			device_id: device_ids[Math.floor(Math.random()*device_ids.length)],
		}

		await dbController.addBox(boxDoc);

	}

	dbController.terminate();
	return (`- ${dataLength} mock box documents created`);

}

module.exports = {
	generateMockData
};