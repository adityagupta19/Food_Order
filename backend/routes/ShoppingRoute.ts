import express, { Request, Response, NextFunction } from "express";
import { GetFoodAvailability, GetFoodsIn30Min, GetTopRestaurants, RestaurantById, SearchFoods } from "../controllers/ShoppingController";

const router = express.Router();

router.get('/:pincode',GetFoodAvailability);
router.get('/top/:pincode',GetTopRestaurants);
router.get('/foods-in-30-min/:pincode',GetFoodsIn30Min);
router.get('/search/:pinocde',SearchFoods);
router.get('/restaurant/:id',RestaurantById);


export {router as ShoppingRoute};
