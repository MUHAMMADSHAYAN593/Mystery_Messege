import { Messege } from "@/models/User"
export interface ApiResponse{
    success : boolean,
    message : string,
    isAcceptingMessege? : boolean,
    isAcceptingMessage? : boolean,
    messeges? : Array<Messege>,
    suggestions?: string[]
}
