import {ValidationError} from 'express-validator';

export class DatabaseConnectionError extends Error {
    reason = 'Error connecting to database'
    constructor(){
        super();

        //Becase we are extending a built in class 
        Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
    }
}
