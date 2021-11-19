import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema(
{
    fullname: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String },
    address: [{ detail: { type: String }, for: { type: String } }],
    phoneNumber: [{ type: Number }],
}, {
    timestamps : true,
});


UserSchema.methods.generateJwtToken=function(){
    return jwt.sign({user: this._id.toString() }, "ZomatoApp");
};//here, _id is the unique object id
//this refers to current user object


//defining static and methods - we can use Any one
//defining own function
UserSchema.statics.findByEmailAndPhone=async({email,phoneNumber})=>{
    const checkUserByEmail = await UserModel.findOne({ email });

    const checkUserByphoneNumber = await UserModel.findOne({ phoneNumber });

    if (checkUserByEmail || checkUserByphoneNumber){
        throw new Error("User already exists");
    }
    return false;
}


//for signin

UserSchema.statics.findByEmailAndPassword=async({email,password})=>{

    //check whether email exist
    const user = await UserModel.findOne({ email });

    if(!user) throw new Error("User does not exist!!");
    //if not data mongoose will return null

    //compare hashed password
    const doesPasswordMatch = await bcrypt.compare(password, user.password);

    if (!doesPasswordMatch){
        throw new Error("Invalid Password!!");
    }
    return user;
}

//here, we are using function because we are going to use this keyword
UserSchema.pre("save",function(next){
    const user = this;//the user object passed to be created should be refereed as user in this

    //check if password is modified using built in function
    if (!user.isModified("password"))
    return next();//to run whatever next function mongoose wants to run.

    //generate bcrypt salt using callback first generate salt then call function, is error then call next function else hash the password from user i.e. from this.user.
    bcrypt.genSalt(8,(error,salt)=>{
        if (error) return next(error);

        //hash password
        bcrypt.hash(user.password, salt,(error, hash)=>{
            if (error) return next(error);

            //assigning hash password
            user.password=hash;
            return next();
        });
    });
});

//we use next function so that even if error is encountered dont stop working, keep going with your functions.
//pre is used to run the function in certain stage of the database or transaction or updation to run some logic, save is used to save while creating new data i.e. while saving it will trigger that function

export const UserModel = mongoose.model("Users", UserSchema);