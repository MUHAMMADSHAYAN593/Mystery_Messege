import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { username, code } = await request.json();
        const decodeUsername = decodeURIComponent((username || "").trim());
        const cleanCode = (code || "").trim();

        if (!decodeUsername || !cleanCode) {
            return Response.json(
                {
                    success: false,
                    message: "Username and verification code are required",
                },
                { status: 400 }
            );
        }

        const escapeRegex = (value: string) =>
            value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const usernameRegex = new RegExp(`^${escapeRegex(decodeUsername)}$`, "i");
        const user = await UserModel.findOne({ username: usernameRegex });
        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            },
                { status: 404 });
        }

        if (user.isVerified) {
            return Response.json(
                {
                    success: true,
                    message: "User is already verified",
                },
                { status: 200 }
            );
        }

        const isCodeValid = user.verifyCode === cleanCode;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true;
            await user.save();
            return Response.json(
                {
                    success: true,
                    message: "User verified successfully",
                },
                { status: 200 }
            );
        }

        if (!isCodeValid) {
            return Response.json(
                {
                    success: false,
                    message: "Invalid verification code",
                },
                { status: 400 }
            );
        }

        return Response.json(
            {
                success: false,
                message: "Verification code has expired",
            },
            { status: 400 }
        );

    } catch (error) {
        console.log("Error Verifying User", error);
        return Response.json(
            {
                success: false,
                message: "Error Verifying User",
            },
            { status: 500 }
        );
    }
}


