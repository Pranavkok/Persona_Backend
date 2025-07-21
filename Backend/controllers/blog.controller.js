import BlogModel from "../models/blog.model.js"
import UserModel from "../models/user.model.js";

export const getBlogs = async (req, res) => {
    try {
        const userid = req.userId ;
        const blogs = await UserModel.findById(userid).populate({
            BlogModel
        })
    } catch (error) {
        console.error("Error fetching blogs:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: true,
            success: false
        });
    }
}

// export const editBlogs = async (req, res) => {}

// export const deleteBlogs = async (req, res) => {}