import { getServerSession } from "next-auth";
import { authOptions } from '../auth/[...nextauth]/options';
import dbConnect from "@/lib/dbConnect";
import userModel from '@/model/User';
import { User } from 'next-auth';
import mongoose from "mongoose";

export async function GET(request: Request) {
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
    // in case of aggregation pipeline it can cause issues because it is string
    //const userId = user._id; 
    const userId = new mongoose.Types.ObjectId(user._id);
    try {
        const user = await userModel.aggregate([
            { $match: { _id: userId } },
            { $unwind: '$messages' },
            { $sort: { 'messages.createdAt': -1 } },
            { $group: { _id: '$_id', messages: { $push: '$messages' } } }
        ])
        if (!user || user.length === 0) {
            return Response.json(
                {
                    success: false,
                    message: "user not found"
                },
                {
                    status: 401
                }
            )
        }

        return Response.json(
            {
                success: true,
                messages: user[0].messages
            },
            {
                status: 200
            }
        )


    } catch (error) {
        console.log("failed to get messages");
        return Response.json(
            {
                success: false,
                message: "failed to get messages"
            },
            {
                status: 500
            }
        )
    }

}