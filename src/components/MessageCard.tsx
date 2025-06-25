import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "./ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {Message} from '@/model/User'
import axios from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { toast } from "sonner"
import mongoose from "mongoose"

type MessageCardProps = {
  message : Message;
  onMessageDelete: (messageId: string) => void;
}

export const MessageCard = ({message, onMessageDelete} : MessageCardProps) => {
  const handleDeleteConfirm = async () => {
    const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`);
    toast("Status",{
      description: response.data.message
    })
    onMessageDelete(message._id)
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>{message.content}</CardTitle>
        <CardDescription>{message.createdAt.toLocaleString()}</CardDescription>
        <CardAction>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete</Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your
                  account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
              </AlertDialogFooter> 

            </AlertDialogContent>

          </AlertDialog>
          
        </CardAction>
      </CardHeader>
    </Card>
  )
}

export default MessageCard