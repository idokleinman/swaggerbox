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

function listBox(req, res) {
	var scope = (req.query.scope ? req.query.scope : null);
	var device_id = (req.query.device_id ? req.query.device_id : null);
	var product_id = (req.query.product_id ? req.query.product_id : null);
	var filter = (req.query.filter ? req.query.filter : null);
	var page = (req.query.page ? req.query.page : 1);
	var per_page = (req.query.per_page ? req.query.per_page : 10);


	var boxDocuments = data.dataArr;
	if (scope) {
		boxDocuments = boxDocuments.filter(doc => doc.scope === scope);
    }

	if (device_id) {
		boxDocuments = boxDocuments.filter(doc => doc.device_id === device_id);
	}

	if (filter) {
		boxDocuments = boxDocuments.filter(doc => doc.key.contains(filter));
	}


	if (product_id) {
		boxDocuments = boxDocuments.filter(doc => doc.product_id === product_id);
	}



    boxDocuments = boxDocuments.slice((page-1)*per_page, (page*per_page)-1);
	var total = boxDocuments.length;

	var meta = {
		page,
		total,
		per_page
	};


    res.status(200).json({meta, data: boxDocuments});
}


function setBox(req, res) {
  res.json('setBox');
}

function getBox(req, res) {


	// get the path
	var boxKey = req.url.substr(req.url.lastIndexOf('/') + 1);

	data.dataArr.forEach(doc => {
		if (doc.key === boxKey) { //todo: extend checks
			res.json(doc);
			return;
		}
	});

	console.log('not found');
	res.status(404).send('no document exists for these criteria');

}

function delBox(req, res) {
  res.json('delBox');
}
