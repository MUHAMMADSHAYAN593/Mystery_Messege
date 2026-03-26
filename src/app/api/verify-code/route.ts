import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import User from "@/models/User";
import { success } from "zod";



export async function POST(request: Request) {
    await dbConnect();
    try {
        const { username, code } = await request.json();
        const decodeUsername = decodeURIComponent(username);
        const user = await UserModel.findOne({ username: decodeUsername });
        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            },
                { status: 404 });
        }

        const isCodeValid = user.verifyCode === code;
        const isExpiredCode = new Date(user.verifyCodeExpiry) < new Date();

        if (isCodeValid && isExpiredCode) {
            user.isVerified = true;
            await user.save();
            return Response.json({
                success: true,
                message: "User verified successfully"
            },
                { status: 200 });
        } else if (!isCodeValid) {
            return Response.json({
                success: false,
                message: "Invalid verification code"
            },
                { status: 400 });
        } else if (isExpiredCode) {
            return Response.json({
                success: false,
                message: "Verification code has expired"
            },
                { status: 400 });
        } else {
            return Response.json({
                success: false,
                message: "User verification failed"
            },
            )
        }


    } catch (error) {
        console.log("Error Verifying User", error);
        return Response.json({
            success: false,
            message: "Error Verifying User"
        },
            { status: 500 });
    }
}


