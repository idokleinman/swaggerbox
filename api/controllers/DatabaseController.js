'use strict';

const settings = require('../../settings');
const mongoose = require('mongoose');
const Box = require('../models/box');


class DatabaseManager {
	constructor() {
		this.db = mongoose.connection;
		this.db.on('error', console.error.bind(console, 'DB connection error:'));
		this.db.once('open', function() {
			console.log(`DB Connected!`);
		});

		mongoose.connect(settings.mongodb.connection_string);
	}

	async addBox(boxDoc) {
		var box = new Box(boxDoc);
		return box.save();
	}

	async listBox(filterDoc) {
		return Box.find(filterDoc).lean().exec();
	}

	async removeBox(filterDoc) {
		return Box.remove(filterDoc).exec();
	}


	terminate() {
		if (mongoose.connection.readyState === 1) {
			console.log(`\nTerminating DB connection.`);
			mongoose.connection.close();
		}
	}
}

module.exports = DatabaseManager;



