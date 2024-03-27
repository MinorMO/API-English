//Nombre Archivo : dynamoDBConfig.js
import AWS from '../awsConfig.js';

class DynamoDB {
    static TABLE_NAME = "english-app";

    static _INSTANCE;

    static getInstance(options) {
        if (this._INSTANCE === undefined) {
            this._INSTANCE = new AWS.DynamoDB(options);
        }
        return this._INSTANCE;
    }
}

export default DynamoDB;