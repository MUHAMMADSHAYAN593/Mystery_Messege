import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { success, z } from "zod";
import { usernamevalidation } from "@/schema/signUpSchema";
import UserModel from "@/models/User";

const UserNameQuerySchema = z.object({
    username: usernamevalidation,
});

export async function GET(request: Request) {
    await dbConnect();

    try {

        const { searchParams } = new URL(request.url);
        const queryParam = { username: searchParams.get("username") }
        const result = UserNameQuerySchema.safeParse(queryParam);
        console.log(result);
        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || [];
            return Response.json({
                success: false,
                messege: usernameErrors?.length > 0 ? usernameErrors.join(', ') : 'Invalid username format'
            }, { status: 400 })
        }

        const { username } = result.data;
        const ExistingUser = await UserModel.findOne({ username, isVerified: true })
        if (ExistingUser) {
            return Response.json({
                success: false,
                messege: "Username already exists"
            }, { status: 400 })
        }

        return Response.json({
            success: true,
            messege: "Username is Available"
        }, { status: 200 })

    } catch (error) {
        console.log("Error in Checking username (check-UserName-route): ", error);
        return Response.json({
            success: false,
            messege: "Error in Checking username (check-UserName-route)"
        }, { status: 500 })
    }
}