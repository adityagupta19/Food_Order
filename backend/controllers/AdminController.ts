import { Request, Response, NextFunction } from "express";
import { CreateVandorInput } from "../dto";
import { Vandor } from "../models";
import { GeneratePassword, GenerateSalt } from "../utility/PasswordUtitlity";


export const FindVendor = async (id: String | undefined, email?: string) => {

    if(email){
        return await Vandor.findOne({ email: email})
    }else{
        return await Vandor.findById(id);
    }

}

export const CreateVandor = async (req: Request, res: Response, next: NextFunction) => {

    const {name, address, pincode, foodType, email, password, ownerName, phone} = <CreateVandorInput>req.body;

    const existingVandor = await FindVendor('', email);

    if(existingVandor !== null){
        return res.json({ "message": "A vandor is exist with this email ID"})
    }

    const salt = await GenerateSalt();
    const userPassword = await GeneratePassword(password,salt);

    const CreatedVandor = await Vandor.create({
        name: name,
        address: address,
        pincode: pincode,
        foodType: foodType,
        email: email,
        password: userPassword,
        salt: salt,
        ownerName: ownerName,
        phone: phone,
        rating: 0,
        serviceAvailable: false,
        coverImages: [],
        foods: []
    })

    res.json(CreatedVandor);

}

export const GetVandors = async (req: Request, res: Response, next: NextFunction) => {
    
    const vandors = await Vandor.find();

    if(vandors !== null){
        return res.json(vandors);
    }

    return res.json({"message":"Vandor data not available"});
}

export const GetVandorByID = async (req: Request, res: Response, next: NextFunction) => {

    const id = req.params.id;

    const vandors = await FindVendor(id);

    if(vandors !== null){
        return res.json(vandors)
    }

    return res.json({"message": "Vandors data not available"})
    
}

