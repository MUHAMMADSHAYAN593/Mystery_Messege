import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/options'
import dbConnect from '@/lib/dbConnect'
import UserModel from '@/models/User'
import { User } from 'next-auth'
import mongoose from 'mongoose'

export async function GET(req: Request) {
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user: User = session?.user as User

    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: 'Unauthorized - Not Authenticated'
            },
            { status: 401 }
        )
    }

    const userId = new mongoose.Types.ObjectId(user._id)
    try {
        const user = await UserModel.aggregate([
            { $match: { _id: userId } },
            {$unwind: '$messeges'},
            {$sort: {'$messeges.createdAt': -1}},
            {$group : {_id: '$_id', messeges: {$push: '$messeges'}}}
        ])

        if (!user || user.length == 0) {
            return Response.json(
            {
                success: false,
                message: 'User Not found'
            },
            { status: 401 }
        )
        }

        return Response.json(
            {
                success: true,
                message: user[0].messeges
            },
            { status: 200 }
        )
    } catch (error) {
        console.log('Error in Get Messages (GET): ', error)
        return Response.json(
            {
                success: false,
                message: 'Error in Get Messages (GET)'
            },
            { status: 500 }
        )
    }

}