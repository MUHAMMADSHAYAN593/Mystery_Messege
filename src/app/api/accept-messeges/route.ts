import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/options'
import dbConnect from '@/lib/dbConnect'
import UserModel from '@/models/User'
import { User } from 'next-auth'

export async function POST(req: Request) {
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

    const userId = user._id
    const { acceptMesseges } = await req.json()

    try {
        const UpdatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessege: acceptMesseges },
            { new: true }
        )

        if (!UpdatedUser) {
            return Response.json(
                {
                    success: false,
                    message: 'Failed to update user'
                },
                { status: 404 }
            )
        }

        return Response.json(
            {
                success: true,
                message: 'Messege Accepted Successfully',
                UpdatedUser
            },
            { status: 200 }
        )

    } catch (error) {
        console.log('Error in Accept Messages: ', error)
        return Response.json(
            {
                success: false,
                message: 'Error in Accept Messages'
            },
            { status: 500 }
        )

    }
}


export async function GET(red: Request) {
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

    const userId = user._id
    try {
        const foundUser = await UserModel.findById(userId)
        if (!foundUser) {
            return Response.json(
                {
                    success: false,
                    message: 'User not found'
                },
                { status: 404 }
            )
        }

        return Response.json(
            {
                success: true,
                isAcceptingMessege: foundUser.isAcceptingMessege
            },
            { status: 200 }
        )
    } catch (error) {
        console.log('Error in Accept Messages (GET): ', error)
        return Response.json(
            {
                success: false,
                message: 'Error in Accept Messages (GET)'
            },
            { status: 500 }
        )
    }
}