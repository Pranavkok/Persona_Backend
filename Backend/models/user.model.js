import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
        unique : true,
    },
    password : {
        type : String,
        required : true,
    },
    refresh_token: {
        type : String ,
        default : ""
    },
    last_login_date: {
        type : Date ,
        default : ""
    },
    blogs:[
        {
            type : mongoose.Schema.Types.ObjectId,
            ref: 'Blog',
        }
    ] 
},{
    timestamps : true 
})

const UserModel = mongoose.model('User', userSchema);
export default UserModel;