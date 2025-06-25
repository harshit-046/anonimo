import {Message} from "@/model/User";
export interface ApiResponse{
    getStatusOfMessage: boolean;
    success: boolean;
    message: string;
    isAcceptingMessage?: boolean;
    messages?: Array<Message>
}