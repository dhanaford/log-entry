
exports.handler = async (event, context, callback) => {

	let mySql = require('mysql');

	let connection = mySql.createConnection({
		host: 'log-entry-1.cwwtcoc9fclh.us-east-1.rds.amazonaws.com',
		user: 'admin',
	  	password: 'test1234',
	  	database: 'log-entry'
	});

	console.log('input: ' + JSON.stringify(event));

	let input = JSON.parse(event.body);

	async function saveEntry() {

		return new Promise((resolve, reject) => {
			connection.connect();

	        connection.query(
	        	'UPDATE time_dimension set weather = ?, event = ? where id = ?', [input.params.weather, input.params.event, input.params.id], (error, results) => {
	            if (error) {
	                console.log('error: ' + error);
	                reject(error);

	            } else {
	            	if (results.affectedRows) {
	            		console.log('Entry has been saved');
	            		resolve(results);
	                } else {
	                	console.log('Entry failed to save');
	                }
	            }
	            connection.end();
	        });

	    });
	}


	let results = await saveEntry();
    var responseBody = {
        result: results
    };

    const response = {
        "statusCode": 200,
        "headers": {
           'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'PUT, GET, POST, OPTIONS'
        },
        
        "body": JSON.stringify(responseBody),
        "isBase64Encoded": false
    };
    callback(null, response);
};
