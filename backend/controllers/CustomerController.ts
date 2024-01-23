import express,{Request,Response,NextFunction} from 'express';
import {plainToInstance} from 'class-transformer';
import {validate} from 'class-validator';
import { CreateCustomerInputs } from '../dto/Customer.dto';
import { Customer } from '../models/Customer';
import { GeneratePassword, GenerateSalt, GenerateOtp, GenerateSignature, onRequestOTP } from '../utility'

export const CustomerSignup = async (req: Request, res: Response, next: NextFunction) =>{
    const customerInputs = plainToInstance(CreateCustomerInputs,req.body);

    const validationError = await validate(customerInputs, {validationError: { target: true}})

    if(validationError.length > 0){
        return res.status(400).json(validationError);
    }

    const { email, phone, password } = customerInputs;
    const salt = await GenerateSalt();
    const userPassword = await GeneratePassword(password, salt);

    const { otp, expiry } = GenerateOtp();

    const existingCustomer =  await Customer.find({ email: email});
    
    if(existingCustomer !== null){
        return res.status(400).json({message: 'Email already exist!'});
    }

    const result = await Customer.create({
        email: email,
        password: userPassword,
        salt: salt,
        phone: phone,
        otp: otp,
        otp_expiry: expiry,
        firstName: '',
        lastName: '',
        address: '',
        verified: false,
        lat: 0,
        lng: 0,
    })

    if(result){
        
        await onRequestOTP(otp, phone);
        
        //Generate the Signature
        const signature = await GenerateSignature({
            _id: result._id,
            email: result.email,
            verified: result.verified
        })
        
        return res.status(201).json({signature, verified: result.verified, email: result.email})

    }

    return res.status(400).json({ msg: 'Error while creating user'});



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
