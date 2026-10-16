import { nanoid } from 'nanoid';
export const generateBoardId = () => {
    return nanoid(12);
};
export const generateElementId = () => {
    return nanoid(10);
};
