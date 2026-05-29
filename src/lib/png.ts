export type PngDimensions = {
  width: number;
  height: number;
};

const PNG_SIGNATURE = "89504e470d0a1a0a";

export function readPngDimensionsFromBuffer(buffer: Buffer): PngDimensions {
  if (buffer.length < 24) {
    throw new Error("PNG buffer is too small to contain dimensions");
  }

  const signature = buffer.subarray(0, 8).toString("hex");
  if (signature !== PNG_SIGNATURE) {
    throw new Error("File is not a PNG");
  }

  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}
