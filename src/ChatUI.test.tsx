import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ChatUI from "./ChatUI";
import "@testing-library/jest-dom";

// Mock faker to control AI output
vi.mock("@faker-js/faker", () => ({
  faker: {
    lorem: {
      paragraphs: () => "This is a fake AI response."
    }
  }
}));

describe("ChatUI", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it("renders initial UI with input and suggestions", () => {
    render(<ChatUI />);
    expect(screen.getByPlaceholderText(/type a message/i)).toBeInTheDocument();
    expect(screen.getByText("What is your return policy?")).toBeInTheDocument();
    expect(screen.getByText("How can I contact support?")).toBeInTheDocument();
    expect(screen.getByText("Show me pricing options.")).toBeInTheDocument();
  });

  it("lets the user type and send a message, then disables input while streaming", async () => {
    render(<ChatUI />);
    const input = screen.getByPlaceholderText(/type a message/i);
    const sendButton = screen.getByRole("button", { name: /send/i });
    await userEvent.type(input, "Hello!");
    expect(input).toHaveValue("Hello!");
    await userEvent.click(sendButton);
    expect(input).toHaveValue("");
    expect(screen.getByText("Hello!")).toBeInTheDocument();
    // Streaming starts, input and button are disabled
    expect(input).toBeDisabled();
    expect(sendButton).toBeDisabled();
    // Suggestions should not be visible during streaming
    expect(screen.queryByText("What is your return policy?")).not.toBeInTheDocument();
  });

  it("streams the AI response and re-enables input after streaming", async () => {
    render(<ChatUI />);
    const input = screen.getByPlaceholderText(/type a message/i);
    const sendButton = screen.getByRole("button", { name: /send/i });
    await userEvent.type(input, "Hi");
    await userEvent.click(sendButton);
    // Fast-forward streaming
    vi.runAllTimers();
    await waitFor(() => {
      expect(screen.getByText("This is a fake AI response.")).toBeInTheDocument();
      expect(input).not.toBeDisabled();
      expect(sendButton).not.toBeDisabled();
    });
    // Suggestions should reappear
    expect(screen.getByText("What is your return policy?")).toBeInTheDocument();
  });

  it("clicking a suggestion fills the input", async () => {
    render(<ChatUI />);
    const suggestion = screen.getByText("Show me pricing options.");
    await userEvent.click(suggestion);
    const input = screen.getByPlaceholderText(/type a message/i);
    expect(input).toHaveValue("Show me pricing options.");
  });

  it("does not send empty or whitespace-only messages", async () => {
    render(<ChatUI />);
    const input = screen.getByPlaceholderText(/type a message/i);
    const sendButton = screen.getByRole("button", { name: /send/i });
    await userEvent.type(input, "   ");
    await userEvent.click(sendButton);
    // No message should be sent
    expect(screen.queryByText("   ")).not.toBeInTheDocument();
  });

  it("sends message on Enter key press", async () => {
    render(<ChatUI />);
    const input = screen.getByPlaceholderText(/type a message/i);
    await userEvent.type(input, "Test message{enter}");
    expect(screen.getByText("Test message")).toBeInTheDocument();
  });
}); 