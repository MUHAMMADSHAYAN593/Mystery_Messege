import mongoose , { Schema , Document} from "mongoose";


export interface Messege extends Document{
    content: string,
    createdAt: Date,
}

const MessgeSchema: Schema<Messege> = new Schema({
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true,
    },
})

export interface User extends Document{
    username: string,
    email: string,
    password : string,
    verifyCode: string,
    verifyCodeExpiry: Date,
    isVerified: boolean,
    isAcceptingMessege: boolean,
    messege: Messege[]
}

const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true , "User Name is required"],
        unique: [true , "User Name must be unique"],
        trim: true,
    },
    email: {
        type: String,
        required: [true , "Email is required"],
        unique: [true , "Email must be unique"],
        trim: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/ , 'Please Enter a valid Email']
    },
    password: {
        type: String,
        required: [true , "Password is required"],
        trim: true,
        minlength: [8 , "Password must be at least 8 characters"],
        unique: [true , "Password must be unique"],
    },
    verifyCode: {
        type: String,
        required: [true , "Verify Code is required"],
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true , "Verify Code Expiry is required"],
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isAcceptingMessege: {
        type: Boolean,
        default: true,
    },
    messege: [MessgeSchema]
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>('User' , UserSchema)

export default UserModel;