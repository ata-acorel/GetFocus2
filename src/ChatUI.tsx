import React, { useState, useEffect } from "react";
import { faker } from "@faker-js/faker";
import { Suggestion } from "./Types/Suggestion";
import styles from "./ChatUI.module.css";
import { Message } from "./Types/Message";


const suggestions: Suggestion[] = [
  { text: "What is your return policy?", order: 1 },
  { text: "How can I contact support?", order: 2 },
  { text: "Show me pricing options.", order: 3 }
];

export default function ChatUI() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);

  const handleSend = () => {
    if (!input.trim() || streaming) return;

    const newMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    simulateStreamingResponse();
  };

  const simulateStreamingResponse = () => {
    setStreaming(true);
    const fakeText = faker.lorem.paragraphs(1);
    let index = 0;
    let current = "";

    const stream = setInterval(() => {
      if (index < fakeText.length) {
        current += fakeText[index];
        index++;
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last && last.role === "ai") {
            return [...prev.slice(0, -1), { ...last, content: current }];
          } else {
            return [...prev, { role: "ai", content: current }];
          }
        });
      } else {
        clearInterval(stream);
        setStreaming(false);
      }
    }, 30);
  };

  // Handler for suggestion click
  const handleSuggestionClick = (text: string) => {
    setInput(text);
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatArea}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={styles.messageRow}
            style={{ textAlign: msg.role === "user" ? "right" : "left" }}
          >
            <span
              className={
                styles.messageBubble +
                " " +
                (msg.role === "user" ? styles.userBubble : styles.aiBubble)
              }
            >
              {msg.content}
            </span>
          </div>
        ))}
      </div>
      {/* Suggestions shown only when not streaming */}
      {!streaming && (
        <div className={styles.suggestions}>
          {suggestions
            .sort((a, b) => a.order - b.order)
            .map((sugg) => (
              <button
                key={sugg.order}
                onClick={() => handleSuggestionClick(sugg.text)}
                className={styles.suggestionButton}
              >
                {sugg.text}
              </button>
            ))}
        </div>
      )}
      <div className={styles.inputArea}>
        <input
          className={styles.inputBox}
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          disabled={streaming}
        />
        <button
          onClick={handleSend}
          disabled={streaming}
          className={styles.sendButton}
        >
          Send
        </button>
      </div>
    </div>
  );
}
