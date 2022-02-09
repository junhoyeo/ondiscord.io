import { SKRSContext2D } from '@napi-rs/canvas';

export const fillMultiLineText = (
  context: SKRSContext2D,
  lines: string[],
  x: number,
  y: number,
  lineHeight: number = 1,
) => {
  const height = context.measureText('M').width * lineHeight;
  lines.forEach((line, index) => {
    const isLastLine = index === lines.length - 1;
    const hasDescription = lines.length > 1;
    if (isLastLine && hasDescription) {
      context.fillStyle = 'rgba(255, 255, 255, 0.65)';
      y += height / 2;
    }
    context.fillText(line, x, y);
    y += height;
  });
};

export const wrapIntoLines = (
  context: SKRSContext2D,
  text: string,
  maxWidth: number,
) => {
  if (!text) {
    return [];
  }

  const words = text.split(' ');
  const lines = [];
  let currentLine = words[0];

  words.forEach((word) => {
    const width = context.measureText(currentLine + ` ${word}`).width;
    if (width < maxWidth) {
      currentLine += ` ${word}`;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  });

  lines.push(currentLine);
  return lines;
};
