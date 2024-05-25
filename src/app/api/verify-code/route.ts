import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import { z } from "zod";
import { verifytokenSchema } from "@/schemas/verifySchema";

/*****************************VERIFY ROUTE********************************************/

const verifyCodeQuerySchema = z.object({
  token: verifytokenSchema,
});

export async function POST(request: Request) {
  dbConnect();
  try {
    const { username, code } = await request.json();
    // const result = verifyCodeQuerySchema.safeParse(token);
    // console.log(result)
    // if (!result.success) {
    //   // Errors in token mainly in formating..//
    // //   const tokenErrors = result.error.format().token?._errors || [];
    // //   console.log(tokenErrors)
    // //   return Response.json(
    // //     {
    // //       success: false,
    // //       message:
    // //         tokenErrors?.length > 0
    // //           ? tokenErrors.join(", ")
    // //           : "Invalid query parameter!",
    // //     },
    // //     { status: 400 }
    // //   );
    // }
    const user = await UserModel.findOne({ username });
    if (!user) {
      return Response.json(
        { success: false, message: "User does not exist!" },
        { status: 404 }
      );
    }
console.log("token from request",code)
console.log("token from db",user.verifyToken)
    const isTokenCorrect = user.verifyToken === code;
    const isTokenValid = new Date(user.verifyTokenExpiry) > new Date();

    if (isTokenCorrect && isTokenValid) {
      user.isVerified = true;
      await user.save();

      return Response.json(
        { success: true, message: "Code verified successfully!" },
        { status: 201 }
      );
    } else if (!isTokenValid) {
      return Response.json(
        {
          success: false,
          message: "Your veirfication code has expired, please sign up again!",
        },
        { status: 400 }
      );
    } else {
      return Response.json(
        { success: false, message: "Verification code entered is incorrect!" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Failed to verfiy code!");
    return Response.json(
      { success: false, message: "Failed to verify code!" },
      { status: 500 }
    );
  }
}
