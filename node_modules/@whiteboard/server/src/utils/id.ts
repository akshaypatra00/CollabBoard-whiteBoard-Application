import { nanoid } from 'nanoid';

export const generateBoardId = (): string => {
  return nanoid(12);
};

export const generateElementId = (): string => {
  return nanoid(10);
};
