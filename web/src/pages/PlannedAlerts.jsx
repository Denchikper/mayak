import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SchoolTab from "../components/Alerts/SchoolTab.jsx";
import PlannedTab from "../components/Alerts/PlannedTab.jsx";

export default function PlannedAlertsPage() {
  const [activeTab, setActiveTab] = useState("school");
  const [loading, setLoading] = useState(false);
  const { token, logout } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Запланированные оповещения | Маяк";
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col select-none">
      <Navbar />
      <div className="flex-1 flex flex-col items-center p-4 sm:p-6">

        {/* Переключатель по центру */}
        <div className="mb-8">
          <div className="inline-flex bg-[var(--surface-2)] rounded-md p-1">
            <button
              onClick={() => setActiveTab("school")}
              className={`px-3 sm:px-5 py-2 rounded-lg text-xs sm:text-sm transition
                ${activeTab === "school" ? "bg-[var(--beacon)] text-[#0A0F16]" : "text-[var(--text-muted)] hover:text-[var(--text)]" }`}
            >
              Школьные звонки
            </button>

            <button
              onClick={() => setActiveTab("planned")}
              className={`px-3 sm:px-5 py-2 rounded-lg text-xs sm:text-sm transition
                ${activeTab === "planned" ? "bg-[var(--beacon)] text-[#0A0F16]" : "text-[var(--text-muted)] hover:text-[var(--text)]" }`}
            >
              Запланированные оповещения
            </button>
          </div>
        </div>

        {/* Контент */}
        <div className="w-full rounded-md p-2 scrollbar-hidden overflow-y-auto scrollbar-hidden">
          {loading && <p className="text-center text-[var(--text-muted)]">Загрузка...</p>}

          {activeTab === "school" && !loading && (
            <SchoolTab token={token} logout={logout} navigate={navigate}/>
          )}

          {activeTab === "planned" && !loading && (
            <PlannedTab token={token} logout={logout} navigate={navigate} />
          )}
        </div>
      </div>
    </div>
  );
}
