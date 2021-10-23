/* eslint-disable no-console */

const lambda = require('./index.js');
const event = {
    'body': "{\"params\":{\"id\":20211022,\"weather\":\"Mostly cloudy, with a low around 60. South wind around 9 mph. Chance of precipitation is 20%.\",\"event\":\"test eventadsasdasd\"}}"
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