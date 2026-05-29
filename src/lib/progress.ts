export type ProgressLogger = (message: string) => void;

export const consoleProgressLogger: ProgressLogger = (message) => {
  console.log(message);
};
