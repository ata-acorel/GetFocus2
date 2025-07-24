Let's say we want to receive Suggestions on the same connection which is built and the data is streaming through it!

We agreed for the backend to send the suggestions after the main content/text streaming is finished, using the same connection (either SSE or WebSocket). Instead of setting up a separate API and making an additional call for suggestions, we will leverage the existing streaming connection. When the backend finishes sending the main reply from the language model (LM), it will then send another data payload containing a list of suggestions, also in JSON format, over the same connection.

This approach ensures that the suggestions are delivered as a distinct section in the JSON, making them easy for the frontend to read and parse. The frontend will listen for this additional data, extract the suggestions from the JSON, and display them appropriately in the UI. This method keeps the process efficient, avoids extra API calls, and ensures all relevant information is streamed and handled together.

---

**Note on Folder Structure and Domain-Driven Architecture**

The current folder structure in this project is intentionally simple, as it is designed for a small-scale training/demo scenario. For larger or enterprise-level projects, a more robust and maintainable structure is recommended.

In such cases, the codebase would typically be organized into main folders such as:
- `features/`: Contains domain-based feature folders (e.g., chat, feed, user management), following domain-driven design principles for better clarity and scalability.
- `shared/`: Contains shared resources, utilities, or services that can be reused across features (e.g., authorization services, utility functions).

This separation helps keep the codebase organized, understandable, and easier to maintain as the project grows.