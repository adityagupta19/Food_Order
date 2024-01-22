import { Request, Response, NextFunction } from "express";
import { UpdateVandorInputs, VandorLoginInput, CreateFoodInput } from "../dto";
import { FindVendor } from "./AdminController";
import {
	GenerateSignature,
	ValidatePassword,
} from "../utility/PasswordUtitlity";
import { Food } from "../models/Food";

export const VandorLogin = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { email, password } = <VandorLoginInput>req.body;
	const existingVandor = await FindVendor("", email);

	if (existingVandor !== null) {
		const validation = await ValidatePassword(
			password,
			existingVandor.password,
			existingVandor.salt
		);

		if (validation) {
			const signature = GenerateSignature({
				_id: existingVandor._id,
				email: existingVandor.email,
				name: existingVandor.name,
				foodTypes: existingVandor.foodType,
			});

			return res.json(signature);
		} else {
			return res.json({ message: "Login credentials not valid" });
		}
	}

	return res.json({ message: "Login credentials not valid" });
};

export const GetVandorProfile = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const user = req.user;

	if (user) {
		const existingVandor = await FindVendor(user._id);
		return res.json(existingVandor);
	}

	return res.json({ message: "vandor Information Not Found" });
};

export const UpdateVandorProfile = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const user = req.user;
	const { name, phone, address, foodType } = <UpdateVandorInputs>req.body;

	if (user) {
		const existingVandor = await FindVendor(user._id);
		if (existingVandor !== null) {
			existingVandor.name = name;
			existingVandor.phone = phone;
			existingVandor.foodType = foodType;
			existingVandor.address = address;

			const savedVandor = await existingVandor.save();
			return res.json(savedVandor);
		}
		return res.json(existingVandor);
	}

	return res.json({ message: "vandor Information Not Found" });
};

export const UpdateVandorCoverImage = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const user = req.user;
	

	if (user) {
		const vandor = await FindVendor(user._id);
		if (vandor !== null) {
			const files = req.files as [Express.Multer.File];
			const images = files.map((file: Express.Multer.File) => file.filename);

			vandor.coverImages.push(...images);
			const result = await vandor.save();
			return res.json(result);

		}
		
	}

	return res.json({ message: "vandor Information Not Found" });
};



export const UpdateVandorService = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const user = req.user;

	if (user) {
		const existingVandor = await FindVendor(user._id);

		if (existingVandor !== null) {
			existingVandor.serviceAvailable = !existingVandor.serviceAvailable;
			const savedVandor = await existingVandor.save();
			return res.json(savedVandor);
		}

		return res.json(existingVandor);
	}

	return res.json({ message: "vandor Information Not Found" });
};

export const AddFood = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const user = req.user;

	const { name, description, category, foodType, readyTime, price } = <
		CreateFoodInput
	>req.body;

	if (user) {
		const vandor = await FindVendor(user._id);

		if (vandor !== null) {
			const files = req.files as [Express.Multer.File];

			const images = files.map((file: Express.Multer.File) => file.filename);

			const food = await Food.create({
				vandorId: vandor._id,
				name: name,
				description: description,
				category: category,
				price: price, 
				rating: 0,
				readyTime: readyTime,
				foodType: foodType,
				images: images,
			});

			vandor.foods.push(food);
			const result = await vandor.save();
			return res.json(result); 
		}
	}

	return res.json({ message: "Something went wrong with add food" });
};

export const GetFoods = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const user = req.user;

	if (user) {
		const foods = await Food.find({ vendorId: user._id });

		if (foods !== null) {
			return res.json(foods);
		}
	}

	return res.json({ message: "Food Information Not Found" });
};
