import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import passport from "passport";
//models
import { UserModel } from "../../database/user"; //need to destructure because it is not default export


const Router = express.Router();

/* 
Route:       /signup
Description: Signup with email and password
Params:      None
Access        Public
Method        Post
*/
Router.post("/signup", async(req, res) => {
    try {
        
        //check whether email exists by calling model and triggering
        await UserModel.findByEmailAndPhone(req.body.credentials);

        const newUser = await UserModel.create(req.body.credentials);


        //generate jwt auth token if email is new
        const token = newUser.generateJwtToken();

        //we are using method and static for jwttokens because, we dont usermodel to attach with it so that, token is fomed only when new user is created i.e. only after instantiating you will need the data

        //return the token 
        return res.status(400).json({ token, status: "success" });
    } 
    catch (error) 
    {
        return res.status(500).json({ error: error.message });
    }
});


/* 
Route:       /signin
Description: Signin with email and password
Params:      None
Access        Public
Method        Post
*/

Router.post("/signin", async(req, res) => {
    try {
        const user = await UserModel.findByEmailAndPassword(req.body.credentials);
      
        const token = user.generateJwtToken();

        return res.status(400).json({ token, status: "success" });
    } 
    catch (error) 
    {
        return res.status(500).json({ error: error.message });
    }
});


/* 
Route:       /google
Description: google signin
Params:      None
Access        google
Method        Post
*/

//scope permission from google for user's profile and email
Router.get("/google", 
passport.authenticate("google",{
    scope:["https://www.googleapis.com/auth/userinfo.profile","https://www.googleapis.com/auth/userinfo.email"
],
})
);

/* 
Route:       /google/callback
Description: google signin callback
Params:      None
Access        google
Method        Post
*/

//scope permission from google for user's profile and email
Router.get("/google/callback", 
passport.authenticate("google",
    {failureRedirect: "/"}),
    (req,res)=>{
        return res.json({token:req.session.passport.user.token});
    }
);



export default Router;
