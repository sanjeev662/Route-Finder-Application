const User = require('../models/User');

const findUserByEmail = async (email) => {
    try {
        const user = await User.findOne({ email });
        return user;
    } catch (error) {
        throw new Error('Error finding user by email');
    }
};

const saveUser = async (userData) => {
    try {
        const user = new User(userData);
        await user.save();
        return user;
    } catch (error) {
        throw new Error('Error saving user');
    }
};

module.exports = { findUserByEmail, saveUser };
