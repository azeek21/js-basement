import { Record } from "@prisma/client/runtime/library";
import { Socket } from "socket.io";

type WithIoSocket<T extends Record> = T & { socket: Socket }
