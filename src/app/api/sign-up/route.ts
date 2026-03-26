import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVarificationEmail";
import { success } from "zod";


export async function POST(request: Request) {
    await dbConnect();
    try {
        const { username, email, password } = await request.json();
        const existingUserEmailverifiedbyUsername = await UserModel.findOne({
            username,
            isVerified: true
        })

        if (existingUserEmailverifiedbyUsername) {
            return Response.json(
                {
                    success: false,
                    message: "Username is already taken",
                },
                { status: 400 }
            )
        }
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        const existingUserbyEmail = await UserModel.findOne({ email })
        if (existingUserbyEmail) {
            if (existingUserbyEmail.isVerified) {
                return Response.json(
                    {
                        success: false,
                        message: "Email is already taken",
                    },
                    { status: 400 }
                )
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserbyEmail.password = hashedPassword;
                existingUserbyEmail.verifyCode = verifyCode;
                existingUserbyEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
                await existingUserbyEmail.save();
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + 1);
            const newusr = await new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessege: true,
                messeges: [],
            })
            await newusr.save();
        }

        // send Varification Email
        const emailResponse = await sendVerificationEmail(email, username, verifyCode );
        if (!emailResponse.success) {
            return Response.json(
                {
                    success: false,
                    message: emailResponse.message,
                },
                { status: 500 }
            )
        }

        return Response.json(
                {
                    success: true,
                    message: 'User created successfully , please check your email to verify your account',
                },
                { status: 201 }
            )

    } catch (error) {
        console.log("error in signup API", error);
        return Response.json(
            {
                success: false,
                message: "Something went wrong",
            },
            { status: 500 }
        )
    }
}
