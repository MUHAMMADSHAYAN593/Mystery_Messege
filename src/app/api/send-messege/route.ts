import UserModel from "@/models/User";
import dbConnect from "@/lib/dbConnect";
import { Messege } from "@/models/User";
import { success } from "zod";


export async function POST(request: Request) {
    await dbConnect();
    const { username, content } = await request.json();
    try {
        const user = await UserModel.findOne({ username });
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
            content,
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