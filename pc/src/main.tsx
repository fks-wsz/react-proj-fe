import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { ApolloProvider } from "@apollo/client";
import { client } from "./utils/apollo";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ROUTES_CONFIG } from "./routes/index.ts";

import "@ant-design/v5-patch-for-react-19";

import Page404 from "@/containers/Page404";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Routes>
          {ROUTES_CONFIG.map((route) => {
            return <Route key={route.key} path={route.path} element={<route.element />} />;
          })}
          <Route path='*' element={<Page404 />} />
        </Routes>
      </BrowserRouter>
    </ApolloProvider>
  </StrictMode>,
);
