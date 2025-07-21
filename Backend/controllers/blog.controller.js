import BlogModel from "../models/blog.model.js"
import UserModel from "../models/user.model.js";

export const getBlogs = async (req, res) => {
    try {
        const userid = req.userId ;

        if(!userid) {
            return res.status(400).json({
                message : "User ID is required",
                error : true ,
                success : false 
            })
        }

        const blogs = await UserModel.findById(userid).populate('blogs');

        if (!blogs || blogs.length === 0) {
            return res.status(404).json({
                message: "No blogs found",
                error: true,
                success: false
            });
        }

        return res.status(200).json({
            message: "Blogs fetched successfully",
            error: false,
            success: true,
            data: blogs
        });
    } catch (error) {
        console.error("Error fetching blogs:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: true,
            success: false
        });
    }
}

export const editBlogs = async (req, res) => {
    try {
        const userid = req.userId;
        const { blogId, title, description } = req.body;

        const blog = await BlogModel.findById(blogId);
        if (!blog) {
            return res.status(404).json({
                message: "Blog not found",
                error: true,
                success: false
            });
        }
        if (blog.user.toString() !== userid) {
            return res.status(403).json({
                message: "You are not authorized to edit this blog",
                error: true,
                success: false
            });
        }

        const updatedBlog = await BlogModel.findByIdAndUpdate(
            blogId,
            { title, content: description },
            { new: true }
        );
        if (!updatedBlog) {
            return res.status(500).json({
                message: "Error updating blog",
                error: true,
                success: false
            });
        }
        return res.status(200).json({
            message: "Blog updated successfully",
            error: false,
            success: true,
            data: updatedBlog
        });

    } catch (error) {
        console.error("Error editing blog:", error);
        return res.status(500).json({
            message: "Internal server error while editing blog",
            error: true,
            success: false
        });
    }
}

export const deleteBlogs = async (req, res) => {
    try {
        const userid = req.userId;
        const { blogId } = req.body;

        if(!userid || !blogId) {
            return res.status(400).json({
                message: "User ID and Blog ID are required",
                error: true,
                success: false
            });
        }

        const blog = await BlogModel.findById(blogId);
        if (!blog) {
            return res.status(404).json({
                message: "Blog not found",
                error: true,
                success: false
            });
        }

        if (blog.user.toString() !== userid) {
            return res.status(403).json({
                message: "You are not authorized to delete this blog",
                error: true,
                success: false
            });
        }

        const deletedBlog = await BlogModel.findByIdAndDelete(blogId);
        if (!deletedBlog) {
            return res.status(500).json({
                message: "Error deleting blog",
                error: true,
                success: false
            });
        }
        return res.status(200).json({
            message: "Blog deleted successfully",
            error: false,
            success: true,
            data: deletedBlog
        });

    } catch (error) {
        console.error("Error deleting blog:", error);
        return res.status(500).json({
            message: "Internal server error while deleting blog",
            error: true,
            success: false
        });
    }
}