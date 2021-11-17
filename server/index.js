//importing rnv variables
require("dotenv").config();

//libraries
import express from "express";
import cors from "cors";
import helmet from "helmet";

//microservice routes
import Auth from "./API/Auth";

//Database connection 
import connectDB from "./database/connection";


const zomato = express();

//application middlewares
zomato.use(express.json());
zomato.use(express.urlencoded({extended: false}));
zomato.use(helmet());
zomato.use(cors());

//merging routes
//application routes

zomato.use("/auth",Auth);
zomato.get("/",(req,res)=>res.json({message: "Setup sucessfull"}));

zomato.listen(4000, () =>
  connectDB()
    .then(() => console.log("Server is running 🚀"))
    .catch((error) =>
      console.log(error)
    )
);
