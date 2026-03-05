/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

const supabase = (window as any).supabaseClient;

async function testConnection() {
  const { data, error } = await supabase.from("orders").select("*");

  console.log("SUPABASE DATA:", data);
  console.log("SUPABASE ERROR:", error);
}

testConnection();
