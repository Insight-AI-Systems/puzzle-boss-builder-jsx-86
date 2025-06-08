
import { BlockType } from '../types/tetrisTypes';

export const TETRIS_SHAPES: Record<BlockType, { shape: number[][][], color: string }> = {
  I: {
    shape: [
      [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ],
      [
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0]
      ]
    ],
    color: '#00f0f0'
  },
  O: {
    shape: [
      [
        [1, 1],
        [1, 1]
      ]
    ],
    color: '#f0f000'
  },
  T: {
    shape: [
      [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0]
      ],
      [
        [0, 1, 0],
        [0, 1, 1],
        [0, 1, 0]
      ],
      [
        [0, 0, 0],
        [1, 1, 1],
        [0, 1, 0]
      ],
      [
        [0, 1, 0],
        [1, 1, 0],
        [0, 1, 0]
      ]
    ],
    color: '#a000f0'
  },
  S: {
    shape: [
      [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]
      ],
      [
        [0, 1, 0],
        [0, 1, 1],
        [0, 0, 1]
      ]
    ],
    color: '#00f000'
  },
  Z: {
    shape: [
      [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
      ],
      [
        [0, 0, 1],
        [0, 1, 1],
        [0, 1, 0]
      ]
    ],
    color: '#f00000'
  },
  J: {
    shape: [
      [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0]
      ],
      [
        [0, 1, 1],
        [0, 1, 0],
        [0, 1, 0]
      ],
      [
        [0, 0, 0],
        [1, 1, 1],
        [0, 0, 1]
      ],
      [
        [0, 1, 0],
        [0, 1, 0],
        [1, 1, 0]
      ]
    ],
    color: '#0000f0'
  },
  L: {
    shape: [
      [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0]
      ],
      [
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 1]
      ],
      [
        [0, 0, 0],
        [1, 1, 1],
        [1, 0, 0]
      ],
      [
        [1, 1, 0],
        [0, 1, 0],
        [0, 1, 0]
      ]
    ],
    color: '#f0a000'
  }
};

export const BLOCK_TYPES: BlockType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];

export function getRandomBlockType(): BlockType {
  return BLOCK_TYPES[Math.floor(Math.random() * BLOCK_TYPES.length)];
}

export function createBlock(type: BlockType, x: number = 4, y: number = 0): any {
  const { shape, color } = TETRIS_SHAPES[type];
  return {
    type,
    shape: shape[0],
    color,
    position: { x, y },
    rotation: 0
  };
}

export function rotateBlock(block: any): any {
  const { type } = block;
  const shapes = TETRIS_SHAPES[type].shape;
  const nextRotation = (block.rotation + 1) % shapes.length;
  
  return {
    ...block,
    shape: shapes[nextRotation],
    rotation: nextRotation
  };
}
