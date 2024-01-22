import express, { Request, Response, NextFunction } from "express";
import {
	CustomerLogin,
	CustomerSignup,
	CustomerVerify,
	EditCustomerProfile,
	GetCustomerProfile,
	RequestOtp,
} from "../controllers";

const router = express.Router();

router.post("/signup", CustomerSignup);
router.post("/login", CustomerLogin);

//auth required

router.patch("/verify", CustomerVerify);
router.get("/otp", RequestOtp);

//profile routes

router.get("/profile", GetCustomerProfile);
router.patch("/profile", EditCustomerProfile);

export { router as CustomerRoute };
