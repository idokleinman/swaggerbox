'use strict';
/*
 'use strict' is not required but helpful for turning syntactical errors into true errors in the program flow
 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
*/

/*
 Modules make it possible to import JavaScript files into your application.  Modules are imported
 using 'require' statements that give you a reference to the module.

  It is a good idea to list the modules that your application depends on in the package.json in the project root
 */
// var util = require('util');
// var _ = require('lodash');
// var boxDb = require('../models/box');
var DatabaseController = require('./DatabaseController');

/*
 Once you 'require' a module you can reference the things that it exports.  These are defined in module.exports.

 For a controller in a127 (which this is) you should export the functions referenced in your Swagger document by name.

 Either:
  - The HTTP Verb of the corresponding operation (get, put, post, delete, etc)
  - Or the operationId associated with the operation in your Swagger document

  In the starter/skeleton project the 'get' operation on the '/hello' path has an operationId named 'hello'.  Here,
  we specify that in the exports of this module that 'hello' maps to the function named 'hello'
 */

/*
  Functions in a127 controllers used for operations should take two parameters:

  Param 1: a handle to the request object
  Param 2: a handle to the response object
 */

let scopeArr = ['device','user','product'];
let default_page = 1;
let default_per_page = 10;
let dbController = new DatabaseController();

async function listBox(req, res) {

	let filterDoc = {};

	if (req.query.scope ) {
		if (!scopeArr.includes(req.query.scope)) {
			res.status(400).send();//'bad input parameter');
			return;
		}

		filterDoc.scope = req.query.scope;
	}

	if (req.query.product_id ) {
		if (!_.isNumber(parseInt(req.query.product_id))) {
			res.status(400).send();//'bad input parameter');
			return;
		}

		filterDoc.product_id = parseInt(req.query.product_id);
	}

	if (req.query.device_id) {
		filterDoc.device_id = req.query.device_id;
	}

	if (req.query.filter) {
		filterDoc.key = req.query.filter;
	}

	var page = (req.query.page ? req.query.page : 1);
	var per_page = (req.query.per_page ? req.query.per_page : 10);

	// let boxDocuments = data.dataArr;

	console.log(req.query);


	if (page !== default_page) {
		if (!_.isNumber(page)) {
			res.status(400).send();//'bad input parameter');
			return;
		}

		page = parseInt(page);
	}

	if (per_page !== default_per_page) {
		if (!_.isNumber(parseInt(per_page))) {
			res.status(400).send();//'bad input parameter');
			return;
		}

		per_page = parseInt(per_page);
	}


	let boxDocuments = await dbController.listBox(filterDoc);


	let total = boxDocuments.length;
	boxDocuments = boxDocuments.slice((page-1)*per_page, (page*per_page));

	let meta = {
		page,
		total,
		per_page
	};

	let response = {meta : meta, data: boxDocuments};

    res.status(200).json(response);
}


async function getBox(req, res) {

	// get the path
	let boxKey = req.url.substr(req.url.lastIndexOf('/') + 1);
	// console.log(boxKey);

	let filterDoc = {};
	filterDoc.key = boxKey;

	if (req.query.scope ) {
		if (!scopeArr.includes(scope)) {
			res.status(400).send();//'bad input parameter');
			return;
		}

		filterDoc.scope = req.query.scope;
	}

	if (req.query.product_id ) {
		if (!_.isNumber(parseInt(req.query.product_id))) {
			res.status(400).send();//'bad input parameter');
			return;
		}

		filterDoc.product_id = parseInt(req.query.product_id);
	}

	if (req.query.device_id) {
		filterDoc.device_id = req.query.device_id;
	}

	let boxDocuments = await dbController.listBox(filterDoc);
	let total = boxDocuments.length;
	let response = {};
	if (total > 0) {
		response = boxDocuments[0];
	}

	res.status(200).json(response);
}


async function delBox(req, res) {

	// get the path
	let boxKey = req.url.substr(req.url.lastIndexOf('/') + 1);
	// console.log(boxKey);

	let filterDoc = {};
	filterDoc.key = boxKey;

	if (req.query.scope ) {
		if (!scopeArr.includes(scope)) {
			res.status(400).send();//'bad input parameter');
			return;
		}

		filterDoc.scope = req.query.scope;
	}

	if (req.query.product_id ) {
		if (!_.isNumber(parseInt(req.query.product_id))) {
			res.status(400).send();//'bad input parameter');
			return;
		}

		filterDoc.product_id = parseInt(req.query.product_id);
	}

	if (req.query.device_id) {
		filterDoc.device_id = req.query.device_id;
	}

	let ok = await dbController.removeBox(filterDoc).catch(error => {
		console.log('! delBox: '+error);
		res.status(404).send();
	});

	res.status(204).send();
}


async function setBox(req, res) {
// get the path
	let boxKey = req.url.substr(req.url.lastIndexOf('/') + 1);
	// console.log(boxKey);

	let boxDoc = {};
	boxDoc.key = boxKey;

	if (req.query.scope) {
		if (!scopeArr.includes(req.query.scope)) {
			res.status(400).send('test');//'bad input parameter');
			return;
		}

		boxDoc.scope = req.query.scope;
	} else {
		res.status(400).send();//'missing scope`
		return;

	}


	if (req.query.product_id) {
		if (!_.isNumber(parseInt(product_id))) {
			res.status(400).send();//'bad input parameter');
			return;
		}

		boxDoc.product_id = parseInt(req.query.product_id);
	} else {
		res.status(400).send();//`missing product id`
		return;
	}


	if (req.query.device_id) {
		boxDoc.device_id = req.query.device_id;
	} else {
		res.status(400).send();// missing device id
		return;
	}

	if (req.query.value) {
		boxDoc.value = req.query.value;
	} else {
		res.status(400).send();// missing value
		return;
	}

	let ok = await dbController.addBox(boxDoc).catch(error => {
		console.log('! setBox: '+error);
		res.status(400).send();
	});

	let ok = await dbController.addBox(boxDoc).catch(error => {
		console.log('! setBox: '+error);
		res.status(400).send();
	});

	res.status(201).send(); // box created
}


module.exports = {
	listBox, setBox, getBox, delBox
};
