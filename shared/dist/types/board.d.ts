import { WhiteboardElement } from './element.js';
export interface Board {
    id: string;
    title: string;
    elements: WhiteboardElement[];
    schemaVersion: number;
    createdAt: string;
    updatedAt: string;
}
export interface BoardSummary {
    id: string;
    title: string;
    updatedAt: string;
    elementCount: number;
}
//# sourceMappingURL=board.d.ts.map