import React, { useEffect, useState } from "react";
import AppLayout from "../components/AppLayout";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SchoolTab from "../components/Alerts/SchoolTab.jsx";
import PlannedTab from "../components/Alerts/PlannedTab.jsx";

export default function PlannedAlertsPage() {
  const [activeTab, setActiveTab] = useState("school");
  const { token, logout } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Запланированные оповещения | Маяк";
  }, []);

  return (
    <AppLayout>
      <div className="px-4 sm:px-6 lg:px-10 py-6 lg:py-10">
        <h1 className="font-display text-2xl font-bold uppercase tracking-wide mb-6">Оповещения</h1>

        <div className="inline-flex bg-[var(--surface-2)] rounded-lg p-1 mb-8">
          <button
            onClick={() => setActiveTab("school")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer
              ${activeTab === "school" ? "bg-[var(--surface)] text-[var(--text)]" : "text-[var(--text-muted)] hover:text-[var(--text)]"}`}
          >
            Школьные звонки
          </button>

          <button
            onClick={() => setActiveTab("planned")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer
              ${activeTab === "planned" ? "bg-[var(--surface)] text-[var(--text)]" : "text-[var(--text-muted)] hover:text-[var(--text)]"}`}
          >
            Запланированные оповещения
          </button>
        </div>

        {activeTab === "school" && (
          <SchoolTab token={token} logout={logout} navigate={navigate} />
        )}

        {activeTab === "planned" && (
          <PlannedTab token={token} logout={logout} navigate={navigate} />
        )}
      </div>
    </AppLayout>
  );
}
