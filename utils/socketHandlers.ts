import { SOCKET_EVENTS, socketService } from "../services/socket.service";
import { ILocalMessage } from "../types/message.types";



export const handleSocketSendMessage = (message: ILocalMessage) => {

    socketService.emit(SOCKET_EVENTS.MESSAGE_SEND, message, async (data: any) => {
        console.log("🚀 Message sent with callback:", data);
    });


}

