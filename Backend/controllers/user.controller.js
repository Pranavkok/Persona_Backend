import UserModel from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import genarateAccessToken from '../utils/generateAccessToken.js';
import genarateRefreshToken from '../utils/generateRefreshToken.js';

export async function register(req,res){
    try {
        const { username , password , confirmPassword} = req.body;
        if (!username || !password) {
            return res.status(400).json({
                message: 'Username and password are required',
                error: true,
                success: false
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                message: 'Passwords do not match',
                error: true,
                success: false
            });
        }

        const user = await UserModel.findOne({ username });
        if (user) {
            return res.status(400).json({
                message: 'Username already exists',
                error: true,
                success: false
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new UserModel({
            username,
            password : hashedPassword,
        });
        const savedUser = await newUser.save();

        res.status(201).json({
            message: 'User registered successfully',
            data: savedUser,
            error: false,
            success: true
        });
    } catch (error) {
        console.error('Error in register:', error);
        res.status(500).json({
            message : 'Internal server error during registration',
            error : true ,
            success : false 
        });
    }
}

export async function login(req, res) {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                message: 'Username and password are required',
                error: true,
                success: false
            });
        }

        const user = await UserModel.findOne({ username });
        if (!user) {
            return res.status(400).json({
                message: 'Invalid username or password',
                error: true,
                success: false
            });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                message: 'Invalid username or password',
                error: true,
                success: false
            });
        }

        const accessToken = await genarateAccessToken(user._id)
        const refreshToken = await genarateRefreshToken(user._id)

        user.last_login_date = new Date();
        user.refresh_token = refreshToken;
        await user.save();

        const cookiesOption = {
            httpOnly : true ,
            secure :true,
            samesite : "None"
        }

        res.cookie('accessToken',accessToken,cookiesOption)
        res.cookie('refreshToken',refreshToken,cookiesOption)

        res.status(200).json({
            message: 'Login successful',
            data: {
                accessToken,
                refreshToken
            },
            error: false,
            success: true
        });

    } catch (error) {
        console.error('Error in login:', error);
        res.status(500).json({
            message: 'Internal server error during login',
            error: true,
            success: false
        });
    }
}

export async function logout(req, res) {
    try {
        const userid = req.userId;

        if (!userid) {
            return res.status(400).json({
                message: 'User ID is required',
                error: true,
                success: false
            });
        }

        user = await UserModel.findById(userid);
        if (!user) {
            return res.status(404).json({
                message: 'User not found',
                error: true,
                success: false
            });
        }
        const cookiesOption = {
            httpOnly : true ,
            secure :true,
            samesite : "None"
        }
        res.clearCookie('accessToken', cookiesOption);
        res.clearCookie('refreshToken', cookiesOption);

        const removeRefreshToken = await UserModel.findByIdAndUpdate(userid, { refresh_token: "" });
        if (!removeRefreshToken) {
            return res.status(500).json({
                message: 'Error clearing refresh token',
                error: true,
                success: false
            });
        }
        res.status(200).json({
            message: 'Logout successful',
            error: false,
            success: true
        });

    } catch (error) {
        console.error('Error in logout:', error);
        res.status(500).json({
            message: 'Internal server error during logout',
            error: true,
            success: false
        });
    }
}