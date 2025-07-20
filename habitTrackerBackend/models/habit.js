import mongoose, { model } from "mongoose";

const habitSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {type: String, required: true},
    why: {type: String, required: true},                // reason for the habit
    timeOfDay: {type: String},                          // time of day to perform the habit
    stackAfter: {type: String},                         // habit to stack after
   
   
    // Hbabit performance tracking
    streak: {type: Number, default: 0},
    longestStreak: {type: Number, default: 0},
    xp: {type: Number, default: 0},
    history: [Date],
    lastChecked: {type: Date, default: null},           // last time the habit was checked
    buildProgress: {type: Number, default: 0},          // consecutive days the habit has been done
    isBuilt: {type: Boolean, default: false},           // whether the habit is built - 21 days consecutive
    isActive : {type: Boolean,default: true},
    successRate: {type: Number, default: 0},            // success rate of the habit
    
    // Micrologs
    micrologs: [{
        date: {type: Date, default: Date.now},
        emoji: {type: String, required: true},          // emoji representing the microlog
    }],

    // Category
    category: {
        type: String,
        enum: ['Fitness', 'Mind', 'Gratitude', 'Family', 'Professional', 'Spiritual', 'Learning', 'Personal'],
        required: true
    },
    
    // metadata
    reminderTime: {type: String, default: null},        // time to send reminder for the habit
    resetStreakIfMissed: {type: Boolean, default: true}, // whether to reset streak if habit is missed for a day
    createdAt: {type: Date, default: Date.now}
});

const Habit = mongoose.model('Habit', habitSchema)

export default Habit;