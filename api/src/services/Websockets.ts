import { Server } from "http";
import { WebSocketServer, Server as WsServer, WebSocket } from "ws";
import { getUserFromRequest } from "../utils/getUserFromRequest";
import { User } from "../entities/User";

export class Websockets {
  server: Server;
  wss: WsServer | null = null;
  users: Record<number, Array<WebSocket>> = {};

  constructor(server: Server) {
    this.server = server;
  }

  initialize() {
    this.wss = new WebSocketServer({ noServer: true });

    this.server.on("upgrade", async (request, socket, head) => {
      // Authenticate the request
      console.log(request.headers);
      const user = await getUserFromRequest(request);

      if (user) {
        // Accept the WebSocket connection
        this.wss?.handleUpgrade(request, socket, head, (ws) => {
          this.wss?.emit("connection", ws, request);
          this.handleSocket(user, ws);
        });
      } else {
        console.error("WebSocket authentication failed");

        // Reject the connection with appropriate status
        socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
        socket.destroy();
      }
    });
  }

  handleSocket(user: User, socket: WebSocket) {
    if (!this.users[user.id]) {
      this.users[user.id] = [];
    }

    this.users[user.id]?.push(socket);

    socket.on("close", () => {
      this.users[user.id] =
        this.users[user.id]?.filter((s) => s !== socket) ?? [];
    });

    socket.on("message", (data) => {
      console.log(
        `Got message from ${user.id} (${user.email}): ${data.toString()}`,
      );
      // Example
      this.sendAll(data.toString());
    });
  }

  sendAll(message: string) {
    console.log(`Sending message ${message} to all`);
    for (const userId in this.users) {
      if (this.users[userId]) {
        for (const socket of this.users[userId]) {
          socket.send(message);
          console.log(`Message sent to ${userId}`);
        }
      }
    }
  }
}
