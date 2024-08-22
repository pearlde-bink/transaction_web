import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import { TransactionProvider } from "./context/TransactionContext.tsx";

createRoot(document.getElementById("root")!).render(
  <TransactionProvider>
    <StrictMode>
      <App />
    </StrictMode>
  </TransactionProvider>
  // document.getElementById("root");
);
