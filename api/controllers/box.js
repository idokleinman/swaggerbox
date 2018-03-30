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
var util = require('util');
var data = require('../helpers/data');
var _ = require('lodash');

/*
 Once you 'require' a module you can reference the things that it exports.  These are defined in module.exports.

 For a controller in a127 (which this is) you should export the functions referenced in your Swagger document by name.

 Either:
  - The HTTP Verb of the corresponding operation (get, put, post, delete, etc)
  - Or the operationId associated with the operation in your Swagger document

  In the starter/skeleton project the 'get' operation on the '/hello' path has an operationId named 'hello'.  Here,
  we specify that in the exports of this module that 'hello' maps to the function named 'hello'
 */
module.exports = {
  listBox, setBox, getBox, delBox
};

/*
  Functions in a127 controllers used for operations should take two parameters:

  Param 1: a handle to the request object
  Param 2: a handle to the response object
 */

let scopeArr = ['device','user','product'];
let default_page = 1;
let default_per_page = 10;

function listBox(req, res) {

	var scope = (req.query.scope ? req.query.scope : null);
	var device_id = (req.query.device_id ? req.query.device_id : null);
	var product_id = (req.query.product_id ? req.query.product_id : null);
	var filter = (req.query.filter ? req.query.filter : null);
	var page = (req.query.page ? req.query.page : 1);
	var per_page = (req.query.per_page ? req.query.per_page : 10);

	let boxDocuments = data.dataArr;


	console.log(req.query);

	if (scope) {
		if (!scopeArr.includes(scope)) {
			res.status(400).send();//'bad input parameter');
			return;
		}
		boxDocuments = boxDocuments.filter(doc => doc.scope == scope);
	}

	if (device_id) {
		boxDocuments = boxDocuments.filter(doc => doc.device_id == device_id);
	}

	if (filter) {
		boxDocuments = boxDocuments.filter(doc => {
			return doc.key.includes(filter)
		});
	}

	if (!_.isNumber(parseInt(product_id))) {
		res.status(400).send();//'bad input parameter');
		return;
	}

	if (product_id) {
		boxDocuments = boxDocuments.filter(doc => doc.product_id == product_id);
	}


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


function setBox(req, res) {
  res.json('setBox');
}

function getBox(req, res) {

	var scope = (req.query.scope ? req.query.scope : null);
	var device_id = (req.query.device_id ? req.query.device_id : null);
	var product_id = (req.query.product_id ? req.query.product_id : null);

	// get the path
	var boxKey = req.url.substr(req.url.lastIndexOf('/') + 1);
	// console.log(boxKey);

	let match = false;

	let i = 0;
	data.dataArr.forEach(doc => {

		if (match) {
			return; // short circuit if first match was found
		}

		console.log(doc.key+' ['+i+']');
		if (doc.key == boxKey) {
			// console.log(boxKey);
			// console.log('key not found '+i);
			match = true;
		}

		if (scope && (scopeArr.includes(scope))) {
			if (doc.scope == scope) {
				console.log('scope  found');
				match = true;
			}
		}

		if (device_id) {
			if (doc.device_id == device_id) {
				console.log('device_id  found');
				match = true;

			}
		}

		if (product_id && _.isNumber(parseInt(product_id))) {
			if (doc.product_id == product_id) {
				console.log('prodyct_id  found');
				match = true;
			}
		}

		if (match) {
			console.log('match!!!');
			console.log(doc);
			res.status(200).json(doc);
		}

		i++;
	});

	if (!match) {
		console.log('not found');
		res.status(404).send();//\.send('no document exists for these criteria');
		return;

		// todo: why the f does this fail validation?
	}

}

function delBox(req, res) {
  res.json('delBox');
}
