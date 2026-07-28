// Маяк — система управления звуковыми оповещениями
// by Benovich · https://github.com/Denchikper/mayak

import React from "react";
import Sidebar from "./Sidebar";

export default function AppLayout({ children, className = "" }) {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <Sidebar />
      <main className={`md:pl-60 ${className}`}>{children}</main>
    </div>
  );
}
