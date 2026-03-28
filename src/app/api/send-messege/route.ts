import UserModel from "@/models/User";
import dbConnect from "@/lib/dbConnect";
import { Messege } from "@/models/User";


export async function POST(request: Request) {
    await dbConnect();
    const { username, content } = await request.json();
    try {
        const cleanUsername = decodeURIComponent((username || "").trim());
        const cleanContent = (content || "").trim();

        if (!cleanUsername || !cleanContent) {
            return Response.json(
                {
                    success: false,
                    message: "Username and message content are required",
                },
                { status: 400 }
            );
        }

        const escapeRegex = (value: string) =>
            value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const usernameRegex = new RegExp(`^${escapeRegex(cleanUsername)}$`, "i");
        const user = await UserModel.findOne({ username: usernameRegex });
        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            }, {
                status: 404
            }
            )
        }

        //Is User Accepting the messeges
        if (!user.isAcceptingMessege) {
            return Response.json({
                success: false,
                message: "User does not accept messeges"
            }, {
                status: 400
            }
            )
        }

        const newMessege = {
            content: cleanContent,
            createdAt: new Date()
        }

        user.messege.push(newMessege as Messege);
        await user.save();

        return Response.json({
            success: true,
            message: "Messege sent successfully"
        }, {
            status: 200
        }
        )

    } catch (error) {
        console.log('An Unexpected Error Occured While Sending Messege', error);
        return Response.json({
            success: false,
            message: "Not able to send messege"
        }, {
            status: 500
        }
        )
    }
}
