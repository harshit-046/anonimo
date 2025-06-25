'use client'

import { Message } from '@/model/User';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { acceptMessagesSchema } from '@/schemas/acceptMesaageSchema';
import { useSession } from 'next-auth/react';
import { z } from 'zod';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Loader2, RefreshCcw } from 'lucide-react';
import MessageCard from '@/components/MessageCard';
import { User } from 'next-auth';
const page = () => {
  const [message, setMessage] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const handelDeleteMessage = (messageId: string) => {
    setMessage(message.filter((message) => {
      message._id !== messageId
    }))
  }
  const { data: session } = useSession();

  const user = session?.user;

  const form = useForm<z.infer<typeof acceptMessagesSchema>>({
    resolver: zodResolver(acceptMessagesSchema),
  })

  const { register, watch, setValue } = form;

  const acceptMessages = watch('acceptMessages');

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages');
      const isAcceptingMessage = response.data.getStatusOfMessage;
      setValue('acceptMessages', isAcceptingMessage)

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      console.log(axiosError);
      toast("Error", {
        description: axiosError.response?.data.message || "Failed to fetch message settings"
      })
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue])

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true);
    setIsSwitchLoading(false);
    try {
      const response = await axios.get<ApiResponse>('/api/get-messages');
      setMessage(response.data.messages || []);
      toast("Refreshed Messages", {
        description: "Showing latest messages"
      })
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      console.log(axiosError);
      toast("Error", {
        description: axiosError.response?.data.message || "Failed to fetch messages"
      })
    } finally {
      setIsLoading(false);
      setIsSwitchLoading(false);
    }

  }, [setIsLoading, setMessage])

  useEffect(() => {
    if (!session || !user) return;
    fetchMessages();
    fetchAcceptMessage();

  }, [session, setValue, fetchAcceptMessage, fetchMessages]);

  // handle switch change
  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages', {
        acceptMessages: !acceptMessages
      })
      setValue('acceptMessages', !acceptMessages);
      toast("Status", {
        description: response.data.message
      })
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      console.log(axiosError);
      toast("Error", {
        description: axiosError.response?.data.message || "Failed to change message settings"
      })
    }
  }
  const  username  = session?.user.username as unknown as User;

  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast('URL Copied!',{
      description: 'Profile URL has been copied to clipboard.',
    });
  };

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register('acceptMessages')}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? 'On' : 'Off'}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {message.length > 0 ? (
          message.map((message, index) => (
            <MessageCard
              key={message._id}
              message={message}
              onMessageDelete={handelDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  );
}

export default page