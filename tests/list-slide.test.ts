import { describe, expect, it } from "vitest";

import { resolveListSlideIcon } from "../templates/ListSlide";

describe("ListSlide icon presentation", () => {
  it("maps brief semantic icon names to compact CSS symbols", () => {
    expect(resolveListSlideIcon("search")).toEqual({
      kind: "symbol",
      className: "list-slide__symbol list-slide__symbol--search",
      label: "search",
    });
    expect(resolveListSlideIcon("calendar")).toMatchObject({
      kind: "symbol",
      className: "list-slide__symbol list-slide__symbol--calendar",
    });
    expect(resolveListSlideIcon("doc")).toMatchObject({
      kind: "symbol",
      className: "list-slide__symbol list-slide__symbol--doc",
    });
  });

  it("keeps short numeric labels available for preview defaults", () => {
    expect(resolveListSlideIcon("01")).toEqual({
      kind: "text",
      label: "01",
    });
  });
});
