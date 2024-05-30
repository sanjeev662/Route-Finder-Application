const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const UserService= require('../services/userService');

const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const result = await UserService.signUp({ name, email, password });
    res.json(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await UserService.signIn({ email, password });
    res.json(result);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ message: 'Invalid credentials' });
  }
};

const validateToken = async (req, res) => {
  try {
    const result = UserService.validateToken();
    res.json(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { signIn, signUp, validateToken };
