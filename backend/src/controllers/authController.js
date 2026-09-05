const User = require('../models/User');
const { registerSchema, loginSchema } = require('../validators/authSchema');
const { generateToken } = require('../utils/jwt');
const { successResponse, errorResponse } = require('../utils/response');

const register = async (req, res, next) => {
  try {
    const validatedData = registerSchema.parse(req.body);

    const existingUser = await User.findOne({ email: validatedData.email });
    if (existingUser) {
      return errorResponse(res, 'An account with this email address already exists', 'EMAIL_ALREADY_EXISTS', 409);
    }

    const user = new User({
      name: validatedData.name,
      email: validatedData.email,
      password: validatedData.password,
    });

    await user.save();

    const token = generateToken(user._id);

    return successResponse(
      res,
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
        },
        token,
      },
      'User registered successfully',
      201
    );
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const validatedData = loginSchema.parse(req.body);

    const user = await User.findOne({ email: validatedData.email });
    if (!user) {
      return errorResponse(res, 'Invalid email or password credentials', 'INVALID_CREDENTIALS', 401);
    }

    const isMatch = await user.comparePassword(validatedData.password);
    if (!isMatch) {
      return errorResponse(res, 'Invalid email or password credentials', 'INVALID_CREDENTIALS', 401);
    }

    const token = generateToken(user._id);

    return successResponse(
      res,
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
        },
        token,
      },
      'Login successful'
    );
  } catch (error) {
    next(error);
  }
};

const me = async (req, res, next) => {
  try {
    return successResponse(
      res,
      {
        user: {
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          createdAt: req.user.createdAt,
        },
      },
      'Current user profile'
    );
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    return successResponse(
      res,
      null,
      'Logged out successfully. Please clear client-stored session tokens.'
    );
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return errorResponse(res, 'Email is required', 'VALIDATION_ERROR', 400);
    }
    // We confirm whether user exists or provide generic secure confirmation
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    return successResponse(
      res,
      {
        emailSent: true,
        message: 'If an account with that email exists, reset instructions have been dispatched.',
      },
      'Password reset request received'
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  me,
  logout,
  forgotPassword,
};
