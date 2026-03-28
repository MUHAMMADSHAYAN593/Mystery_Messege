import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/options"
import dbConnect from "@/lib/dbConnect"
import UserModel from "@/models/User"
import { User } from "next-auth"

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ messegeid: string }> }
) {
  const { messegeid } = await params
  await dbConnect()

  const session = await getServerSession(authOptions)
  const user: User = session?.user as User

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Unauthorized - Not Authenticated",
      },
      { status: 401 }
    )
  }

  try {
    const updatedresult = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { messege: { _id: messegeid } } }
    )

    if (updatedresult.modifiedCount === 0) {
      return Response.json(
        {
          success: false,
          message: "Messege not found",
        },
        { status: 404 }
      )
    }

    return Response.json(
      {
        success: true,
        message: "Messege deleted successfully",
      },
      { status: 200 }
    )
  } catch (error) {
    console.log("Error in deleting messege: ", error)
    return Response.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    )
  }
}
