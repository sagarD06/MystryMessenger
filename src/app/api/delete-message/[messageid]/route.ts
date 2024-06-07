import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import { User } from "next-auth";

export async function DELETE(
  request: Request,
  { params }: { params: { messageid: string } }
) {
  const messageId = params.messageid;
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user = session?.user as User;

  if (!session && !user) {
    return Response.json(
      { success: false, message: "User not authenticated!" },
      { status: 401 }
    );
  }

  try {
    const updatedUser = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: messageId } } }
    );
    if (updatedUser.modifiedCount == 0) {
      return Response.json(
        { success: false, message: "Message not found or already deleted!" },
        { status: 404 }
      );
    }

    return Response.json(
      { success: true, message: "Message deleted successfully!" },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { success: false, message: "Unable to delete message!" },
      { status: 500 }
    );
  }
}
