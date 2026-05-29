import { describe, expect, it } from "vitest";

import { createSerializedRunner } from "../src/lib/watch";

describe("serialized watch runner", () => {
  it("queues one rebuild while another rebuild is still running", async () => {
    const order: string[] = [];
    const first = createDeferred<void>();
    let runs = 0;

    const run = createSerializedRunner(async () => {
      runs += 1;
      order.push(`start-${runs}`);

      if (runs === 1) {
        await first.promise;
      }

      order.push(`end-${runs}`);
    });

    const firstRun = run();
    const secondRun = run();

    await Promise.resolve();
    expect(order).toEqual(["start-1"]);

    first.resolve();
    await firstRun;
    await secondRun;

    expect(order).toEqual(["start-1", "end-1", "start-2", "end-2"]);
  });
});

function createDeferred<T>(): {
  promise: Promise<T>;
  resolve: (value: T) => void;
} {
  let resolve: (value: T) => void = () => undefined;
  const promise = new Promise<T>((innerResolve) => {
    resolve = innerResolve;
  });

  return { promise, resolve };
}
