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
var boxDb = require('../models/box');
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
let dbController = new DatabaseController();

async function listBox(req, res) {

	let filterDoc = {};

	if (req.query.scope ) {
		if (!scopeArr.includes(scope)) {
			res.status(400).send();//'bad input parameter');
			return;
		}

		filterDoc.scope = req.query.scope;
	}

	if (req.query.product_id ) {
		if (!_.isNumber(parseInt(product_id))) {
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
		if (!_.isNumber(parseInt(product_id))) {
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


function _findBoxByCriteria(criteria) {
	let criteria_count = 1;
	var scope = (criteria.scope ? criteria.scope : null);
	var device_id = (criteria.device_id ? criteria.device_id : null);
	var product_id = (criteria.product_id ? criteria.product_id : null);
	var boxKey = criteria.key;

	if (scope) {
		criteria_count++;
	}

	if (device_id) {
		criteria_count++;
	}

	if (product_id) {
		criteria_count++;
	}

	let i = 0;
	let index = -1;

	console.log('needed criteria '+criteria_count);
	data.dataArr.forEach(doc => {

		let matchItems = 0;

		if (doc.key == boxKey) {
			// console.log(boxKey);
			// console.log('key not found '+i);
			matchItems++;
		}

		if (scope && (scopeArr.includes(scope))) {
			if (doc.scope == scope) {
				matchItems++;
			}
		}

		if (device_id) {
			if (doc.device_id == device_id) {
				matchItems++;

			}
		}

		if (product_id && _.isNumber(parseInt(product_id))) {
			if (doc.product_id == product_id) {
				matchItems++;
			}
		}

		console.log('doc '+i+' matchItems: '+matchItems+' criteria_count: '+criteria_count);
		if (matchItems == criteria_count) {
			if (index == -1) {
				index = i;
			}
		}

		i++;
	});

	return index;
}

function delBox(req, res) {

	let criteria = {};
	criteria.scope = (req.query.scope ? req.query.scope : null);
	criteria.device_id = (req.query.device_id ? req.query.device_id : null);
	criteria.product_id = (req.query.product_id ? req.query.product_id : null);
	criteria.key = req.url.substr(req.url.lastIndexOf('/') + 1);

	let index = _findBoxByCriteria(criteria);
	console.log(index);

	if (index >= 0) {
		delete data.dataArr[index];
		res.status(204).send();
	} else {
		res.status(404).send();
	}
}


function setBox(req, res) {


	console.log(req.body);
	let criteria = {};


	criteria.scope = (req.body.scope ? req.body.scope : null);
	criteria.device_id = (req.body.device_id ? req.body.device_id : null);
	criteria.product_id = (req.body.product_id ? parseInt(req.body.product_id) : null);
	criteria.key = (req.body.key ? req.body.key : null);
	let value = (req.body.value ? req.body.value : null);

	if (!criteria.key) {
		console.log('missing key');
		res.response(400).send(); // must specify key
	}

	if ((!criteria.scope) || (!scopeArr.includes(criteria.scope))) {
		console.log('bad scope');
		res.response(400).send(); // must specify scope
	}

	if (!criteria.device_id) {
		console.log('missing device_id');
		res.response(400).send(); // must specify device_id
	}

	if (!criteria.product_id) {
		console.log('missing product_id');
		res.response(400).send(); // must specify product_id
	}

	if (!value) {
		console.log('missing value');
		res.response(400).send(); // must specify value
	}

	let d = new Date;
	let newDoc = {
		key : criteria.key,
		value: criteria.value,
		scope: criteria.scope,
		device_id: criteria.device_id,
		product_id: criteria.product_id,
		updated_at: d.toISOString()
	}

	let index = _findBoxByCriteria(criteria);
	console.log(index);

	if (index >= 0) {
		data.dataArr[index] = newDoc;
		res.status(200).send();//'document updated');
	} else {
		data.dataArr.push(newDoc);
		res.status(200).send();//'document created');
	}
}
