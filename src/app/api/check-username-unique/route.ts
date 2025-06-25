import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import { z } from 'zod';
import { usernameValidation } from "@/schemas/signUpSchema";
import { NextRequest } from "next/server";


const usernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: NextRequest) {
    console.log("abbove dbConnect")
    await dbConnect();
    try {
        const { searchParams } = new URL(request.url);
        const queryParam = {
            username: searchParams.get('username')
        }
       
        const result = usernameQuerySchema.safeParse(queryParam);
        console.log(result); // temp
        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || [];
            return Response.json(
                {
                    success: false,
                    message: usernameErrors?.length > 0 ? usernameErrors.join(', ') : 'Invalid query parameter'
                },
                {
                    status: 400
                }
            )
        }

        const { username } = result.data;
        const existingVerifiedUser = await userModel.findOne({ username, isVerified: true });
        if (existingVerifiedUser) {
            return Response.json(
                {
                    success: false,
                    message: 'username already exits'
                },
                {
                    status: 400
                }
            )
        }

        return Response.json(
            {
                success: true,
                message: 'username is available'
            },
            {
                status: 200
            }
        )
    }
    catch (error) {
        console.error("Error checking username  ", error);
        return Response.json(
            {
                success: false,
                message: "Error checking username"
            },
            {
                status: 500
            }
        )
    }
} 