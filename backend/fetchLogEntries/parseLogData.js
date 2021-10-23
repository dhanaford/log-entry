const data = require('./log-2021.json');
const mySql = require('mysql');

const connection = mySql.createConnection({
	host: 'log-entry-1.cwwtcoc9fclh.us-east-1.rds.amazonaws.com',
	user: 'admin',
  	password: 'test1234',
  	database: 'log-entry'
});

// console.log(data);

// console.log(data.GoogleSheetData[1]);

let log = data.GoogleSheetData;

let monthsHeaders = data.GoogleSheetData[0];

let dayOne = data.GoogleSheetData[1];

// console.log('dayOne: ' + dayOne);


// dayOne = dayOne.forEach(val => {
// 	// console.log(val);
// 	// console.log(val[1]);
// 	// return {
// 	// 	day1: val[0],
// 	// 	day2: val[1]
// 	// };
// 	console.log('update: ' + val);
// });

log = log.map(val => {
	// console.log(val);
	let january = val[0];
	return january;
	// return {
	// 	day1: val[0],
	// 	day2: val[1]
	// };
	// console.log('update: ' + val);
});

console.log(log);

let sql = 'update time_dimension set event = \'test2\' where db_date = \'2021-10-02\';'


function insertData() {
	return new Promise((resolve, reject) => {
		connection.connect();

        connection.query(sql, (error, results) => {
            if (error) {
                console.log('error inserting data: ' + error);
                reject(error);
            } else {
            	resolve(results);
            }
        });
       	connection.end();
    });
}

// let results = insertData();

// console.log('results: ' + JSON.stringify(results));
