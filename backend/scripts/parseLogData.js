const data = require('./log-2021.json');
const mySql = require('mysql');

const connection = mySql.createConnection({
    host: 'log-entry-1.cwwtcoc9fclh.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: 'test1234',
    database: 'log-entry'
});

let log = data.GoogleSheetData;


log = log.map(val => {
    let month = val[0]; // TODO: Fix harcoded month values
    return month;
});


let dateHolder = [];
let month = '';
let event = '';
let day = '';

log = log.map((val, idx) => {

    day = val.split(':')[0];
    event = val.split(':')[1];
    dateHolder.push(day);
    month = dateHolder[0];
    month = month.split('T')[0];
    month = month.split('-');

    if (day.length === 1) {
      day = 0 + day;
    }

    if (day.includes('S')) {
      day = day.replace(/^Sat/, '');
      day = day.replace(/^Sun/, '');
      day = day.replace(/\s/g, '');
    }

    if (day.length === 1) {
      day = `0${day}`;
    }

    day = `${month[0]}-${month[1]}-${day}`;
    console.log(day);

    return [day, event];

});

log.shift();

log = log.forEach(val => {
    let sql = `update time_dimension set event = \'${val[1]}\' where db_date = \'${val[0]}\';`;

    console.log(sql);
    insertData(sql);
})


function insertData(sql) {
    return new Promise((resolve, reject) => {

        connection.query(sql, (error, results) => {
            if (error) {
                console.log('error inserting data: ' + error);
                reject(error);
            } else {
             resolve(results);
            }
        });
    });
}

