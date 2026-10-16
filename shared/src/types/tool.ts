export type ToolType =
  | 'select'
  | 'rectangle'
  | 'ellipse'
  | 'line'
  | 'arrow'
  | 'pencil'
  | 'text'
  | 'eraser';

export type StrokeStyle = 'solid' | 'dashed' | 'dotted';

export type TextAlign = 'left' | 'center' | 'right';

export interface ToolSettings {
  strokeColor: string;
  fillColor: string;
  strokeWidth: number;
  strokeStyle: StrokeStyle;
  opacity: number;
  fontSize: number;
  fontFamily: string;
  textAlign: TextAlign;
}
