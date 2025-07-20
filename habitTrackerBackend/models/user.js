import mongoose from "mongoose";

const userSchema =new mongoose.Schema({
    username: String,
    email: String,
    passwordHash: String,
    createdAt:{
        type: Date,
        default: Date.now
    },
    categoryStats: {
        fitness: { xp: { type: Number, default: 0 }, level: { type: Number, default: 1 } },
        mind: { xp: { type: Number, default: 0 }, level: { type: Number, default: 1 } },
        gratitude: { xp: { type: Number, default: 0 }, level: { type: Number, default: 1 } },
        family: { xp: { type: Number, default: 0 }, level: { type: Number, default: 1 } },
        professional: { xp: { type: Number, default: 0 }, level: { type: Number, default: 1 } },
        spiritual: { xp: { type: Number, default: 0 }, level: { type: Number, default: 1 } },
        learning: { xp: { type: Number, default: 0 }, level: { type: Number, default: 1 } },
        personal: { xp: { type: Number, default: 0 }, level: { type: Number, default: 1 } },
    },
});

const User =  mongoose.model('User', userSchema);

export default User;