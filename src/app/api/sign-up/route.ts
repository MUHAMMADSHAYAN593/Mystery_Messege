import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVarificationEmail";


export async function POST(request: Request) {
    await dbConnect();
    try {
        const { username, email, password } = await request.json();
        const normalizedUsername = (username || "").trim();
        const normalizedEmail = (email || "").trim().toLowerCase();
        const normalizedPassword = (password || "").trim();

        if (!normalizedUsername || !normalizedEmail || !normalizedPassword) {
            return Response.json(
                {
                    success: false,
                    message: "Username, email and password are required",
                },
                { status: 400 }
            )
        }

        const escapeRegex = (value: string) =>
            value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const usernameRegex = new RegExp(`^${escapeRegex(normalizedUsername)}$`, "i");
        const existingUserByUsername = await UserModel.findOne({
            username: usernameRegex,
        })

        if (existingUserByUsername?.isVerified) {
            return Response.json(
                {
                    success: false,
                    message: "Username is already taken",
                },
                { status: 400 }
            )
        }
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        const existingUserbyEmail = await UserModel.findOne({
            email: normalizedEmail,
        })
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
                const hashedPassword = await bcrypt.hash(normalizedPassword, 10);
                existingUserbyEmail.password = hashedPassword;
                existingUserbyEmail.verifyCode = verifyCode;
                existingUserbyEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
                existingUserbyEmail.username = normalizedUsername;
                await existingUserbyEmail.save();
            }
        } else {
            if (
                existingUserByUsername &&
                existingUserByUsername.email !== normalizedEmail
            ) {
                return Response.json(
                    {
                        success: false,
                        message: "Username already exists",
                    },
                    { status: 400 }
                )
            }
            const hashedPassword = await bcrypt.hash(normalizedPassword, 10);
            const newusr = await new UserModel({
                username: normalizedUsername,
                email: normalizedEmail,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: new Date(Date.now() + 3600000),
                isVerified: false,
                isAcceptingMessege: true,
                messege: [],
            })
            await newusr.save();
        }

        // send Varification Email
        const emailResponse = await sendVerificationEmail(
            normalizedEmail,
            normalizedUsername,
            verifyCode
        );
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
