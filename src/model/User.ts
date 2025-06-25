import mongoose, {Schema, Document} from "mongoose";

export interface Message extends Document{
    _id: string; // Add this line
    content: string;
    createdAt: Date;
}
                   
const MessageSchema: Schema<Message> = new Schema({
    content : {
        type: String,
        required: true 
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})

export interface User extends Document{
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessage: boolean;
    message: Message[]
}

const userSchema: Schema<User> = new Schema({
    username:{
        type: String,
        required: [true,"Username is required"],
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: [true,"email is required"],
        unique: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please use a valid email']
    },
    password: {
        type: String,
        required: [true,"password is required"],
    },
    verifyCode: {
        required: [true,"verifyCode is required"],
        type: String
    },
    verifyCodeExpiry: {
        required: [true,"verifyCodeExpiry is required"],
        type: Date
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAcceptingMessage: {
        type: Boolean,
        default: true
    },
    message: [MessageSchema]
})

const userModel = mongoose.models.User as mongoose.Model<User> || mongoose.model<User>('User',userSchema);

export default userModel;     