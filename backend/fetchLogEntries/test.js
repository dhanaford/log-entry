/* eslint-disable no-console */

const lambda = require('./index.js');
const event = {
    'params': {
        'startDate': '2021-10-01',
        'endDate': '2021-10-31'
    },
    'queryStringParameters': {
        'month': '10',
        'year': '2021',
        'searchString': ''
    },
};


const context = {
    'invokedFunctionArn': 'a:b:c:DEV'
};

function callback(err, result) {
    if (err) {
        console.log('err', err);
    } else {
        console.log('result', result);
    }
}

lambda.handler(event, context, callback);