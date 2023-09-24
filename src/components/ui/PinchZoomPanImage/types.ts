/**
 * CODE TAKEN FROM https://github.com/secretwpn/react-responsive-pinch-zoom-pan
 */

export interface ClientPosition {
  clientX: number;
  clientY: number;
}

export interface Position {
  x: number;
  y: number;
}

export interface Dimensions {
  width: number;
  height: number;
}

export interface Inset {
  top: number;
  left: number;
  bottom: number;
  right: number;
}

export interface Transform {
  top: number;
  left: number;
  scale: number;
}
