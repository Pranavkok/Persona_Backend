import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
    title : {
        type: String,
        required: true,
    },
    content : {
        type: String,
        required: true,
    },
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
},{
    timestamps : true 
})

const BlogModel = mongoose.model('Blog', blogSchema);
export default BlogModel;