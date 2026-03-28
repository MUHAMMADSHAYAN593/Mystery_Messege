"use client"

import { useMemo, useState } from "react"
import axios from "axios"
import { Loader2, Trash2 } from "lucide-react"
import { toast } from "sonner"

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
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Messege } from "@/models/User"
import { ApiResponse } from "@/types/ApiResponse"

type MessegeCardProps = {
  messege: Messege
  onMessegeDelete: (messegeId: string) => void
}

const MessegeCard = ({ messege, onMessegeDelete }: MessegeCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false)

  const messageId = useMemo(() => {
    if (typeof messege._id === "string") return messege._id
    if (
      messege._id &&
      typeof (messege._id as { toString?: () => string }).toString === "function"
    ) {
      return (messege._id as { toString: () => string }).toString()
    }
    return ""
  }, [messege._id])

  const formattedDate = useMemo(() => {
    const parsedDate = new Date(messege.createdAt)
    if (Number.isNaN(parsedDate.getTime())) return "Just now"

    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(parsedDate)
  }, [messege.createdAt])

  const handleDeleteConfirm = async () => {
    if (!messageId) {
      toast.error("Unable to delete message", {
        description: "Invalid message id.",
        className: "border-destructive text-destructive",
      })
      return
    }

    setIsDeleting(true)
    try {
      const response = await axios.delete<ApiResponse>(
        `/api/delete-messege/${messageId}`
      )
      toast.success("Message deleted", {
        description: response.data.message || "The message was removed successfully.",
      })
      onMessegeDelete(messageId)
    } catch (error) {
      console.error("Error deleting message:", error)
      const axiosError = error as { response?: { data?: { message?: string } } }
      toast.error("Unable to delete message", {
        description: axiosError.response?.data?.message || "Please try again.",
        className: "border-destructive text-destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Card className="border border-white/80 bg-white/85 shadow-lg shadow-slate-200/60 backdrop-blur">
      <CardHeader>
        <div className="space-y-1">
          <CardTitle className="text-slate-900">Anonymous message</CardTitle>
          <CardDescription className="text-slate-500">{formattedDate}</CardDescription>
        </div>

        <CardAction>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="icon-sm"
                aria-label="Delete message"
                disabled={isDeleting}
                className="rounded-full"
              >
                {isDeleting ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Trash2 className="size-4" />
                )}
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this message?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardAction>
      </CardHeader>

      <CardContent>
        <p className="text-[15px] leading-relaxed text-slate-700">
          {messege.content}
        </p>
      </CardContent>

      <CardFooter className="border-t border-emerald-100 bg-emerald-50/60 text-xs font-medium uppercase tracking-wide text-emerald-700">
        Received privately
      </CardFooter>
    </Card>
  )
}

export default MessegeCard
