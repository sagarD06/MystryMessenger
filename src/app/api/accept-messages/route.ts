import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
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
  const { acceptMessage } = await request.json();
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      user._id,
      {
        isAcceptingMessage: acceptMessage,
      },
      { new: true }
    );

    if (!updatedUser) {
      return Response.json(
        { success: false, message: "failed to update Accept message!" },
        { status: 401 }
      );
    }

    return Response.json(
      { success: true, message: "Acceptance message updated successfuly!" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error updating Accept message!");
    return Response.json(
      { success: false, message: "Error updating Accept message!" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
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
    const foundUser = await UserModel.findById(user._id);
    if (!foundUser) {
      return Response.json(
        { success: false, message: "User not found!" },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        isAcceptMessage: foundUser.isAcceptingMessage,
        message: "Accept messages fetched succesfully!",
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { success: false, message: "Error fetching Accept message!" },
      { status: 500 }
    );
  }
}
