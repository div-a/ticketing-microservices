import { CustomError } from './custom-error';

export class BadRequestError extends CustomError {
    statusCode = 400;
    
    constructor(public message: string){
        super(message);

        //Becase we are extending a built in class 
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }

    serializeErrors(){
        return [
            {message: this.message}
        ]
    }
}
