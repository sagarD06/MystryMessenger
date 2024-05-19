import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import { z } from "zod";
import { usernamevalidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
  username: usernamevalidation,
});

export async function GET(request: Request) {
  dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = { username: searchParams.get("username") };

    // validation with zod //
    const result = UsernameQuerySchema.safeParse(queryParams);
    console.log(result);
    if (!result.success) {
      // Errors in username mainly in formating..//
      const usernameErrors = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(", ")
              : "Invalid query parameter!",
        },
        { status: 400 }
      );
    }

    const { username } = result.data;
    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingVerifiedUser) {
      return Response.json(
        { success: false, message: "Username is already taken!" },
        { status: 400 }
      );
    } else {
      return Response.json(
        { success: true, message: "Username is unique!" },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Unable to check username!");
    return Response.json({ success: false, error: error }, { status: 500 });
  }
}
