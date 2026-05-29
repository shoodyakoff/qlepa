export type SerializedRunner = () => Promise<void>;

export function createSerializedRunner(task: () => Promise<void>): SerializedRunner {
  let running = false;
  let queued = false;
  let active: Promise<void> | undefined;

  return async () => {
    if (running) {
      queued = true;
      return active;
    }

    running = true;
    active = runQueuedTasks(task, () => queued, (value) => {
      queued = value;
    }).finally(() => {
      running = false;
      active = undefined;
    });

    return active;
  };
}

async function runQueuedTasks(
  task: () => Promise<void>,
  getQueued: () => boolean,
  setQueued: (value: boolean) => void,
): Promise<void> {
  do {
    setQueued(false);
    await task();
  } while (getQueued());
}
