import { Messege } from "@/models/User"
export interface ApiResponse{
    success : boolean,
    message : string,
    isAcceptingMessages? : boolean,
    messeges? : Array<Messege>
}