import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import UserModel from "@/models/User";
import dbConnect from "@/lib/dbConnect";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                identifier: {
                    label: "Email or Username",
                    type: "text",
                    placeholder: "Enter your email or username",
                },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                await dbConnect();
                try {
                    const identifier = credentials?.identifier
                    const password = credentials?.password

                    if (!identifier || !password) {
                        throw new Error("Identifier and password are required");
                    }

                    const user = await UserModel.findOne({
                        $or: [
                            { email: identifier },
                            { username: identifier }
                        ]
                    });

                    if (!user) {
                        throw new Error("Invalid credentials");
                    }

                    if (!user.isVerified) {
                        throw new Error("Please verify your account First");
                    }

                    const isPasswordCorrect = await bcrypt.compare(password, user.password);
                    if (isPasswordCorrect) {
                        return {
                            id: user._id.toString(),
                            _id: user._id.toString(),
                            email: user.email,
                            username: user.username,
                            isVerified: user.isVerified,
                            isAcceptingMessege: user.isAcceptingMessege,
                        };
                    } else {
                        throw new Error("Invalid credentials");
                    }


                } catch (error) {
                    console.log(error)
                    if (error instanceof Error) {
                        throw new Error(error.message)
                    }
                    throw new Error("Something went wrong");
                }
            }
        })

    ],
    callbacks: {
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessege = token.isAcceptingMessege;
                session.user.username = token.username;
            }
            return session
        },
        async jwt({ token, user}) {
            if (user) {
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessege = user.isAcceptingMessege;
                token.username = user.username;
            }
            return token
        }
    },
    pages: {
        signIn: "/sign-in",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
}
