// controller/habitController.js
import Habit from '../models/habit.js'; // Import Habit model
import User from '../models/user.js'; // Import User model

// -------------------------------------POST: create a new habit--------------------------------------------------------------
export const createHabit = async (req, res) => {
    try {
        const { name, why, timeOfDay, stackAfter, category } = req.body; // Destructure habit data from request body

        if (!name || !why) {
            return res.status(400).json({ message: 'Name and why are required' });
        }
        
        // Create a new habit document
        const newHabit = new Habit({
            userId: req.user._id,                       // comes from auth middleware
            name,
            why,
            timeOfDay,
            stackAfter,
            category,
        });

        res.status(201).json(await newHabit.save()); // Save habit and respond with the created habit
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message }); // Handle errors
    }
}

// --------------------------------------GET: all habits for a user--------------------------------------------------------------
export const getHabits = async (req, res) => {
    try {
        const habits = await Habit.find({ userId: req.user._id }).sort({ createdAt: -1 }); // newest first
        res.status(200).json(habits); // Respond with the list of habits
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message }); // Handle errors
    }
};

// ------------------------PATCH: Mark habit as done for the day add to streak and xp--------------------------------------------------------------

export const checkHabit = async (req, res) => {
    try {
        // Step 1: Find the habit by ID and ensure it belongs to the user
        const habit = await Habit.findOne({ 
            _id: req.params.id, 
            userId: req.user._id 
        });
        if (!habit) {
            return res.status(404).json({ message: 'Habit not found' });
        }

        // Step 2: Get today's date (time stripped)
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to midnight
        
        // Step 3: Check if the habit has already been marked for today
        const alreadyChecked = habit.history.some((date) => {
            const d = new Date(date);
            d.setHours(0, 0, 0, 0); // Reset time to midnight for comparison
            return d.getTime() === today.getTime(); // Compare dates
        });
        if (alreadyChecked) {
            return res.status(400).json({ message: 'Habit already checked for today' });
        }
        
        // Step 4: Mark the habit as done for today
        habit.history.push(new Date()); // Add today's date to history

        
        // Step 5 : Compare with lastChecked to update buildProgress
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1); // Get yesterday's date

        const lastChecked = habit.lastChecked
            ? new Date(habit.lastChecked.setHours(0, 0, 0, 0)) // Reset time to midnight
            : null; // If lastChecked is null, set it to null

        if (!lastChecked || lastChecked.getTime() === yesterday.getTime()) {
            // If lastChecked is null or was yesterday, increment buildProgress
            habit.buildProgress += 1;
        } else {
            // If lastChecked was not yesterday, reset buildProgress
            habit.buildProgress = 1; // Start a new streak
        }

        // Step 6: update lastChecked to today
        habit.lastChecked = today; // Set lastChecked to today

        // Step 7: Update streak and XP
        habit.streak += 1; // Increment streak
        habit.xp += 10; // Increment XP (example value)
        // update user level category xp
        const user = await User.findById(req.user._id); // Find the user
        const category = habit.category; // Get the category of the habit
        if (user && user.categoryStats[category]) {
            user.categoryStats[category].xp += 10; // Increment category XP

            // level uo after 100 xp
            const currentCategoryXp = user.categoryStats[category].xp;
            user.categoryStats[category].level = Math.floor(currentCategoryXp / 100) + 1; // Level up if XP >= 100
            
            await user.save(); // Save the updated user
        }

        // Step 8 : update longestStreak
        if (habit.streak > habit.longestStreak) {
            habit.longestStreak = habit.streak; // Update longest streak if current streak is longer
        }

        // Step 9: Check if the habit is built (21 days consecutive)
        if (habit.buildProgress >= 21) {
            habit.isBuilt = true; // Mark the habit as built
        }

        // Step 10: Calculate Success Rate
        const daysSinceCreation = Math.floor((today - new Date(habit.createdAt)) / (1000 * 60 * 60 * 24)); // Calculate days since creation
        const completedDays = habit.history.length; // Total days habit has been checked
        habit.successRate = Math.round((completedDays / daysSinceCreation) * 100); // Calculate success rate


        // Step : Save the updated habit
        await habit.save();

        res.json({
            message: habit.isBuilt
                ? 'Habit built successfully! Congratulations! 21 days woohooo'
                : 'Habit checked successfully!',
        }); // Respond with the updated habit
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message }); // Handle errors
    }
}

//------------------------------------PATCH: React to Habit--------------------------------------------------------------

export const reactToHabit = async (req, res) => {
    try {
        const {emoji} = req.body; // Get emoji from request body
        if (!emoji) {
            return res.status(400).json({ message: 'Reaction is required' });
        }

        // Find the habit by ID and ensure it belongs to the user
        const habit = await Habit.findOne({ 
            _id: req.params.id, 
            userId: req.user._id 
        });

        if (!habit) {
            return res.status(404).json({ message: 'Habit not found' });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to midnight

        // Remove any existing microlog for today
        habit.micrologs = habit.micrologs.filter((log) => {
            const logDate = new Date(log.date);
            logDate.setHours(0, 0, 0, 0); // Reset time to midnight for comparison
            return logDate.getTime() !== today.getTime(); // Keep logs that are not today
        });

        // Add the new microlog for today
        habit.micrologs.push({
            date: today,
            emoji: emoji, // Add the emoji reaction
        });

        // Save the updated habit
        await habit.save();
        res.status(200).json({ message: 'Reaction added successfully', micrologs: habit.micrologs });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message }); // Handle errors
    }
}


// ------------------------------------ GET : Habit Mood Summary --------------------------------------------------------------

export const getHabitMoodSummary = async (req, res) => {
    try {
        const habit =await  Habit.findOne({ 
            _id: req.params.id, 
            userId: req.user._id 
        });
        if (!habit) {
            return res.status(404).json({ message: 'Habit not found' });
        }   

        //Prepare summary data
        const moodStats ={};

        habit.micrologs.forEach(log => {
            if (!moodStats[log.emoji]) {
                moodStats[log.emoji] = 1;   
            } 
            else {
                moodStats[log.emoji] += 1; // Increment count for the emoji
            }
        });
        // Convert the moodStats object to an array of objects
        const summary = Object.entries(moodStats).map(([emoji, count]) => ({
            emoji,
            count
        }));
        res.status(200).json(
            {
                totalReactions: habit.micrologs.length, // Total number of micrologs
                moodBreakdown: summary, // Summary of reactions
                logs: habit.micrologs, // All micrologs for the habit
            }); 

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message }); // Handle errors
    }
}




// -----------------------------------DELETE: delete a habit--------------------------------------------------------------

export const deleteHabit = async (req, res) => {
    try {
        const habit = await Habit.findOneAndDelete({ 
            _id: req.params.id, 
            userId: req.user._id 
        });
        if (!habit) {
            return res.status(404).json({ message: 'Habit not found' });
        }
        res.status(200).json({ message: 'Habit deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'failed to delete habit', error: error.message });
    }
}
