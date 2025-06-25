import { getServerSession } from "next-auth";
import { authOptions } from '../../auth/[...nextauth]/options';
import dbConnect from "@/lib/dbConnect";
import userModel from '@/model/User';
import { User } from 'next-auth';
import mongoose from "mongoose";


export async function DELETE(request: Request, {params}: {params: {messageId: string}}) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;
    if (!session || !user) {
        return Response.json(
            {
                success: false,
                message: "Not authenticated"
            },
            {
                status: 401
            }
        )
    }
    const userId = new mongoose.Types.ObjectId(user._id);
    const messageId = new mongoose.Types.ObjectId(params.messageId);

    try {
        if (messageId && userId) {
            const updatedResult = await userModel.updateOne(
                { _id: userId },
                { $pull: { message: { _id: messageId } } }
            )
            if (updatedResult.modifiedCount==0) {
                return Response.json(
                    {
                        success: false,
                        message: "Message not found or already deleted."
                    },
                    {
                        status: 401
                    }
                )
            }
            return Response.json(
                {
                    success: true,
                    message: "Message deleted successfully"
                },
                {
                    status: 200
                }
            )

        }
    } catch (error) {
        console.log("Delete message failed due to internal server error")
        return Response.json(
            {
                success: false,
                message: "Delete message failed due to internal server error"
            },
            {
                status: 500
            }
        )
    }


}