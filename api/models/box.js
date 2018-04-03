'use strict';

const mongoose = require('mongoose');

var boxSchema = mongoose.Schema({
	key: {type: String, required: true},
	value: {type: String, required: true},
	scope : {
		type: String,
		enum: ['user', 'device', 'product'],
	},
	device_id : String,
	product_id : Number,
}, { timestamps: {createdAt: 'createdAt', updatedAt: 'updatedAt' } });


module.exports = mongoose.model('box', boxSchema);