import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import { User } from "next-auth";

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

  const userId = new mongoose.Types.ObjectId(user._id);

  try {
    const user = await UserModel.aggregate([
      { $match: { id: userId } },
      { $unwind: "$messages" },
      { $sort: { "$messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } }, //Aggregation to push all the sorted messages.
    ]);

    if (!user || user.length === 0) {
      return Response.json(
        { success: false, messages: user[0].messages },
        { status: 404 }
      );
    }

    return Response.json(
      { success: true, message: "User not authenticated!" },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { success: false, message: "Failed to fetch messages!" },
      { status: 500 }
    );
  }
}
