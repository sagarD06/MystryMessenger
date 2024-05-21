import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel, { Message } from "@/models/User.model";
import { User } from "next-auth";

export async function POST(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user = session?.user as User;

  if (!session && !user) {
    return Response.json(
      { success: false, message: "User not authenticated!" },
      { status: 401 }
    );
  }

  const { username, content } = await request.json();

  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return Response.json(
        { success: false, message: "User not found!" },
        { status: 404 }
      );
    }
    if (!user.isAcceptingMessage) {
      return Response.json(
        { success: false, message: "User not accepting messages!" },
        { status: 403 }
      );
    }
    const newMessage = { content, createdAt: new Date() };
    user.messages.push(newMessage as Message);
    await user.save();
    return Response.json(
      { success: true, message: "Message sent succesfully!" },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { success: false, message: "Unable to send message!" },
      { status: 500 }
    );
  }
}
