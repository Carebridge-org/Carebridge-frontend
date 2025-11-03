import { describe, it, expect } from "vitest";
import { createRoot } from "react-dom/client";
import App from "../App";
import { BrowserRouter } from "react-router-dom";

describe("main.jsx", () => {
  it("kan renderes uden at crashe", () => {
    const div = document.createElement("div");
    const root = createRoot(div);
    root.render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    expect(div).toBeTruthy();
  });
});
