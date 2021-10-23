
exports.handler = async (event, context, callback) => {

    const mySql = require('mysql');

    // Connect to database
    const connection = mySql.createConnection({
        host: 'log-entry-1.cwwtcoc9fclh.us-east-1.rds.amazonaws.com',
        user: 'admin',
        password: 'test1234',
        database: 'log-entry'
    });

    console.log(`input: ${JSON.stringify(event)}`);

    let input = event.queryStringParameters;

    let sqlSelect = 'SELECT * FROM time_dimension';
    let values = [];

    function generateWhere() {
        let where = '';
        let searchString = `%${input.searchString}%`;
        if (input.searchString) {
            where = ' where event like ?';
            values.push(searchString);
        } else {
            console.log('seachAll else hit');
            where = ' WHERE month = ? AND year = ?';
            values.push(input.month);
            values.push(input.year);
        }
        return where;
    }

    let sqlString = sqlSelect + generateWhere();

    console.log(`sqlString: ${sqlString}`);

    async function getMonth() {

        return new Promise((resolve, reject) => {
            connection.connect();

            connection.query(sqlString, values, (error, results) => {
                if (error) {
                    console.log('error retrieving data: ' + error);
                    reject(error);
                } else {
                    resolve(results);
                }
            });
            connection.end();
        });
    }


    let results = await getMonth();

    let responseBody = {
        result: results
    };

    let response = {
        "statusCode": 200,
        "headers": {
           'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'PUT, GET, POST, OPTIONS'
        },
        
        "body": JSON.stringify(responseBody),
        "isBase64Encoded": false
    };
    // Return response for UI
    callback(null, response);
};
