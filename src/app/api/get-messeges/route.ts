import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/options'
import dbConnect from '@/lib/dbConnect'
import UserModel from '@/models/User'
import { User } from 'next-auth'

export async function GET() {
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

    try {
        const foundUser = await UserModel.findById(user._id).select('messege')
        if (!foundUser) {
            return Response.json(
            {
                success: false,
                message: 'User Not found'
            },
            { status: 404 }
        )
        }

        const messeges = [...(foundUser.messege || [])].sort((a, b) => {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        })

        return Response.json(
            {
                success: true,
                message: 'Messeges fetched successfully',
                messeges
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
