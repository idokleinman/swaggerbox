'use strict';

require('dotenv').config();
// all times given in seconds

let mongo_pwd = encodeURI(process.env.MONGODB_PASSWORD);

const settings = {
	mongodb: {
		connection_string: `mongodb://${process.env.MONGODB_USERNAME}:${mongo_pwd}@ds231719.mlab.com:31719/mobilebox`
	}
}
