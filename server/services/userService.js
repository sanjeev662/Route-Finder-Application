const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userDao = require('../dao/userDao');

const signUp = async ({ name, email, password }) => {
    try {
        let user = await userDao.findUserByEmail(email);
        if (user) {return { message: 'User already exists' }}

        const hashedPassword = await bcrypt.hash(password, 10);
        user = await userDao.saveUser({ name, email, password: hashedPassword });

        return { message: 'User registered successfully' };
    } catch (error) {
        console.error(error.message);
        throw new Error('Server error');
    }
};

const signIn = async ({ email, password }) => {
    try {
        const user = await userDao.findUserByEmail(email);
        if (!user) {throw new Error('Invalid credentials')}

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) { throw new Error('Invalid credentials')}

        const payload = { user: { id: user.id } };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        return { name: user.name, email: user.email, token };
    } catch (error) {
        console.error(error.message);
        throw new Error('Server error');
    }
};

const validateToken = () => {
    return { message: 'Token is valid.' };
};

module.exports = { signUp, signIn, validateToken };


