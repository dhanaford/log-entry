
exports.handler = async (event, context, callback) => {

    const mySql = require('mysql');

    let databasePassword = process.env.rdsPassword;
    let databaseUser = process.env.rdsUser;

    const isProd = context.invokedFunctionArn.split(':').pop() === 'PROD';

    console.log('env: ' + context.invokedFunctionArn.split(':').pop());

    console.log('input: ' + JSON.stringify(event));

    // Connect to database
    const connection = mySql.createConnection({
        host: 'log-entry-dev.cwwtcoc9fclh.us-east-1.rds.amazonaws.com',
        user: databaseUser,
        password: databasePassword,
        database: 'log-entry'
    });

    let input = event.queryStringParameters;

    let sqlSelect = `SELECT * FROM ${isProd ? 'time_dimension_prod' : 'time_dimension'}`;
    let values = [];

    let sqlString = sqlSelect + generateWhere();

    console.log(`sqlString: ${sqlString}`);


    let results = await getMonth();

    let responseBody = {
        result: results
    };

    let response = {
        'statusCode': 200,
        'headers': {
           'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'PUT, GET, POST, OPTIONS'
        },
        
        'body': JSON.stringify(responseBody),
        'isBase64Encoded': false
    };
    
    // Return response for UI
    callback(null, response);


    function generateWhere() {
        let where = '';
        let searchString = `%${input.searchString}%`;
        if (input.searchString) {
            where = ' where event like ?';
            values.push(searchString);
        } else {
            where = ' WHERE month = ? AND year = ?';
            values.push(input.month);
            values.push(input.year);
        }
        return where;
    }
    

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
};
