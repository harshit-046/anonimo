import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/dbConnect';
import userModel from '@/model/User';


export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                identifier: { label: "Email or Username", type: "text", placeholder: "Enter your email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req): Promise<any> {
                console.log("Identifier received:", credentials?.identifier);

                await dbConnect();
                try {
                    const user = await userModel.findOne({
                        $or: [
                            { username: credentials?.identifier },
                            { email: credentials?.identifier }
                        ]
                    })

                    if (!user) {
                        throw new Error("No User found with this email")
                    }

                    if (!(user.isVerified)) {
                        throw new Error("Please Verify your account first")
                    }

                    const isValidUser = await bcrypt.compare(credentials?.password!, user.password);

                    if (!isValidUser) {
                        throw new Error("Incorrect password");
                    }
                    return user;

                } catch (error: any) {
                    throw new Error(error);
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user}) {
            if(user){
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username;
            } 
            return token;
        },
        async session({ session, token }) {
            if(token){
                session.user._id = token._id;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessages = token.isAcceptingMessages;
                session.user.username = token.username;
            }
            return session
        },
    },
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/signin'
    },
};