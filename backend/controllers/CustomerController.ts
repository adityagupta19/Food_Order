import express,{Request,Response,NextFunction} from 'express';
import {plainToInstance} from 'class-transformer';
import {validate} from 'class-validator';
import { CreateCustomerInputs } from '../models/Customer.dto';
import { GeneratePassword, GenerateSalt } from '../utility/PasswordUtitlity'

export const CustomerSignup = async (req: Request, res: Response, next: NextFunction) =>{
    const customerInputs = plainToInstance(CreateCustomerInputs,req.body);

    const validationError = await validate(customerInputs, {validationError: { target: true}})

    if(validationError.length > 0){
        return res.status(400).json(validationError);
    }

    const { email, phone, password } = customerInputs;


}


export const CustomerLogin = async (req: Request, res: Response, next: NextFunction) =>{
    
}


export const CustomerVerify = async (req: Request, res: Response, next: NextFunction) =>{
    
}

export const RequestOtp = async (req: Request, res: Response, next: NextFunction) =>{
    
}

export const GetCustomerProfile = async (req: Request, res: Response, next: NextFunction) =>{
    
}

export const EditCustomerProfile = async (req: Request, res: Response, next: NextFunction) =>{
    
}
