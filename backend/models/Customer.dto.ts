import {IsEmail, IsEmpty, Length} from 'class-validator';


export class CreateCustomerInputs {

    @IsEmail()
    email: String;

    @Length(7,12)
    phone: String;

    @IsEmpty()
    @Length(6,12)
    password: String;
}