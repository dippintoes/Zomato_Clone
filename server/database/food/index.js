import mongoose from "mongoose";

const FoodSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    isVeg: { type: Boolean, required: true },
    containsEggs: { type: Boolean, required: true },
    category: { type: String, required: true },
    photos: {
        type: mongoose.Types.ObjectId,
        ref: "Images",
    }, //Which type of it is and which collection to refer.
    price: { type: String, default: 150, required: true }, //because it cant have zero price
    addOns: [{
        type: mongoose.Types.ObjectId,
        ref: "Foods",
    }],
    restaurant: {
        type: mongoose.Types.ObjectId,
        ref: "Restaurants",
        required: true,
    },
}, {
    timestamps : true,
});

export const FoodModel = mongoose.model("Foods", FoodSchema);