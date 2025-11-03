import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import App from "../App";
import { describe, it, expect } from "vitest";

function renderApp() {
  return render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

describe("App navigation", () => {
  it("viser navbar med links", () => {
    renderApp();
    expect(screen.getByText("Min App")).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
    expect(screen.getByText("Contact")).toBeInTheDocument();
  });

  it("viser Home-siden som standard", () => {
    renderApp();
    expect(screen.getByText(/home/i)).toBeInTheDocument();
  });
});
