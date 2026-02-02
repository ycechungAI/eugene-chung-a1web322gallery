## 2026-02-02 - Global Mutable State in Node.js
**Vulnerability:** A global variable (`someData`) was used to store request-specific state (the currently selected image). This caused a race condition where concurrent users would overwrite each other's view data, leading to information leakage and inconsistent UI.
**Learning:** This likely existed because the developer treated the Node.js server like a single-user desktop application, unaware that the global scope is shared across all requests.
**Prevention:** Avoid global variables for request state. Pass state explicitly to view rendering functions or use request-scoped objects (like `res.locals` or passing data directly to `res.render`).
