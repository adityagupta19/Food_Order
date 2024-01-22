import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import path from "path";

import { AdminRoute, ShoppingRoute, VandorRoute } from "./routes";
import { CustomerRoute } from "./routes/CustomerRoute";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/admin", AdminRoute);
app.use("/vandor", VandorRoute);
app.use("user",CustomerRoute);
app.use("/shop",ShoppingRoute);

mongoose
	.connect("Valid Mongo URI")
	.then((result) => {
		console.log("Connceted to DB");
	})
	.catch((err) => {
		console.log(err);
	});

app.listen(8080, () => {
	console.log("App is running on port 8080");
});
