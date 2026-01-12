import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders the game list with catan", () => {
  const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  render(<App />);
  const catanLink = screen.getByRole("link", { name: /catan/i });
  expect(catanLink).toBeInTheDocument();
  logSpy.mockRestore();
});
