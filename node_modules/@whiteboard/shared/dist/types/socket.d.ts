import { WhiteboardElement } from './element.js';
export interface RemoteCursor {
    clientId: string;
    userName: string;
    userColor: string;
    x: number;
    y: number;
    lastSeen: number;
}
export interface JoinBoardPayload {
    boardId: string;
    clientId: string;
    userName: string;
    userColor: string;
}
export interface ElementCreatePayload {
    boardId: string;
    element: WhiteboardElement;
}
export interface ElementUpdatePayload {
    boardId: string;
    elements: WhiteboardElement[];
}
export interface ElementDeletePayload {
    boardId: string;
    elementIds: string[];
}
export interface BoardClearPayload {
    boardId: string;
}
export interface BoardMetadataUpdatePayload {
    boardId: string;
    title: string;
}
export interface CursorMovePayload {
    boardId: string;
    clientId: string;
    userName: string;
    userColor: string;
    x: number;
    y: number;
}
export interface BoardStatePayload {
    boardId: string;
    title: string;
    elements: WhiteboardElement[];
    schemaVersion: number;
    updatedAt: string;
}
export interface ClientLeftPayload {
    clientId: string;
}
export interface SyncErrorPayload {
    code: string;
    message: string;
}
//# sourceMappingURL=socket.d.ts.map