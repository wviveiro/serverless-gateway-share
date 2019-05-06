'use strict';

module.exports.index = async (req) => {
    return ({
        statusCode: this._statusCode,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({message: 'Hello World My Service B'})
    })
}