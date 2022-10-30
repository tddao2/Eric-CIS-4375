const mysql = require('mysql');
const util = require('util');
require('dotenv').config();

///db connection credential
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB,
    //active column didnt work -resulted in buffer 00 error 
    //this fixes buffer and get true/false as value 0/1
    typeCast: function castField( field, useDefaultTypeCasting ) {

		// We only want to cast bit fields that have a single-bit in them. If the field
		// has more than one bit, then we cannot assume it is supposed to be a Boolean.
		if ( ( field.type === "BIT" ) && ( field.length === 1 ) ) {

			var bytes = field.buffer();

			// A Buffer in Node represents a collection of 8-bit unsigned integers.
			// Therefore, our single "bit field" comes back as the bits '0000 0001',
			// which is equivalent to the number 1.
			return( bytes[ 0 ] === 1 );

		}

		return( useDefaultTypeCasting() );

	}
});

// https://stackoverflow.com/questions/44004418/node-js-async-await-using-with-mysql
const query = util.promisify(connection.query).bind(connection);

// https://www.freecodecamp.org/news/module-exports-how-to-export-in-node-js-and-javascript/
// https://stackoverflow.com/questions/34414659/how-to-get-rows-with-a-bit-typed-fields-from-mysql-in-node-js
// exports.connection = connection;
exports.query = query;
