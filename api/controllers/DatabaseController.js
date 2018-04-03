'use strict';

const settings = require('../settings');
const mongoose = require('mongoose');
const Box = require('./models/box');


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

	// async deletePositionById(id) {
	// 	return Position.findOneAndRemove({_id : id}).exec();
	// }
	//
	// async updatePositionByUuid(uuid, data) {
	// 	return Position.update({uuid : uuid }, data).exec();
	// }

	async listBox(filterDoc) {
		return Box.find(filterDoc).lean().exec();
	}

	// async getAllActivePostions() {
	// 	return Position.find({$or:[{orderStatus: 'open'},{orderStatus:'partial'},{orderStatus:'fulfilled'}]}).exec();
	// }

	// async positionBySignalExists(signal) {
	// 	return Position.findOne({
	// 		signalRawTimeString : signal.time,
	// 		signalPrice : signal.lastprice,
	// 		coin : signal.market.split('-')[1]
	// 	}).exec().then((doc) => {
	// 		if (doc) {
	// 			return Promise.resolve(true);
	// 		} else {
	// 			return Promise.resolve(false);
	// 		}
	// 	});
	// }


	terminate() {
		if (mongoose.connection.readyState === 1) {
			console.log(`\nTerminating DB connection.`);
			mongoose.connection.close();
		}
	}




}

module.exports = DatabaseManager;



