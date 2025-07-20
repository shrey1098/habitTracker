import User from "../models/user.js";

// get user category summary

export const getUserCategorySummary = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('categoryStats'); // Fetch user category stats
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Prepare summary data
        const summary = Object.entries(user.categoryStats).map(([category, stats]) => ({
            category,
            xp: stats.xp,
            level: stats.level
        }));

        res.status(200).json(summary); // Respond with the summary data
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message }); // Handle errors
    }
}