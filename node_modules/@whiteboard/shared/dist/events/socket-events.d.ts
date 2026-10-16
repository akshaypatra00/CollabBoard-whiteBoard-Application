export declare const SOCKET_EVENTS: {
    readonly CONNECT: "connect";
    readonly DISCONNECT: "disconnect";
    readonly JOIN_BOARD: "join-board";
    readonly LEAVE_BOARD: "leave-board";
    readonly BOARD_STATE: "board-state";
    readonly ELEMENT_CREATE: "element-create";
    readonly ELEMENT_UPDATE: "element-update";
    readonly ELEMENT_DELETE: "element-delete";
    readonly BOARD_CLEAR: "board-clear";
    readonly BOARD_METADATA_UPDATE: "board-metadata-update";
    readonly CURSOR_MOVE: "cursor-move";
    readonly CLIENT_LEFT: "client-left";
    readonly SYNC_ERROR: "sync-error";
};
export type SocketEventName = (typeof SOCKET_EVENTS)[keyof typeof SOCKET_EVENTS];
//# sourceMappingURL=socket-events.d.ts.map