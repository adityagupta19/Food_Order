import express,{Request,Response,NextFunction} from 'express';
import {plainToInstance} from 'class-transformer';
import {Validate, validate} from 'class-validator';
import { CreateCustomerInputs, UserLoginInput } from '../dto/Customer.dto';
import { Customer } from '../models/Customer';
import { GeneratePassword, GenerateSalt, GenerateOtp, GenerateSignature, onRequestOTP, ValidatePassword } from '../utility'

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

    const loginInputs = plainToInstance(UserLoginInput,req.body);
    const loginErrors = await validate(loginInputs, {validationError:{target: false}});

    if(loginErrors.length >0){
        return res.status(400).json(loginErrors);
    }

    const {email,password} = loginInputs;

    const customer = await Customer.findOne({email:email});

    if(customer){
        const validation = await ValidatePassword(password,customer.password,customer.salt)

        if(validation){

            const signature = GenerateSignature({
                _id: customer._id,
                email:customer.email,
                verified: customer.verified
            })

            res.status(201).json({signature:signature,verified:customer.verified,email:customer.email});
        }
    }

    res.status(404).json({message: 'Login Error'});

}


export const CustomerVerify = async (req: Request, res: Response, next: NextFunction) =>{
    const { otp } = req.body;
    const customer = req.user;

    if(customer){
        const profile = await Customer.findById(customer._id);
        if(profile){
            if(profile.otp === parseInt(otp) && profile.otp_expiry >= new Date()){
                profile.verified = true;

                const updatedCustomerResponse = await profile.save();

                const signature = GenerateSignature({
                    _id: updatedCustomerResponse._id,
                    email: updatedCustomerResponse.email,
                    verified: updatedCustomerResponse.verified
                })

                return res.status(200).json({
                    signature,
                    email: updatedCustomerResponse.email,
                    verified: updatedCustomerResponse.verified
                })
            }
            
        }

    }

    return res.status(400).json({ msg: 'Unable to verify Customer'});
}

export const RequestOtp = async (req: Request, res: Response, next: NextFunction) =>{
    const customer = req.user;

    if(customer){

        const profile = await Customer.findById(customer._id);

        if(profile){
            const { otp, expiry } = GenerateOtp();
            profile.otp = otp;
            profile.otp_expiry = expiry;

            await profile.save();
            await onRequestOTP(otp, profile.phone);

            return res.status(200).json({ message: 'OTP sent to your registered Mobile Number!'})
        }
    }

    return res.status(400).json({ msg: 'Error with Requesting OTP'});
}

export const GetCustomerProfile = async (req: Request, res: Response, next: NextFunction) =>{
    
}

export const EditCustomerProfile = async (req: Request, res: Response, next: NextFunction) =>{
    
}
