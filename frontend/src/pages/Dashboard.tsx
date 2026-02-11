import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { api, type DashboardSummary } from "../api/client";

export function Dashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const startDate = searchParams.get("startDate") ?? "";
  const endDate = searchParams.get("endDate") ?? "";

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    const params = new URLSearchParams();
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);
    api
      .get<DashboardSummary>(`/dashboard/summary?${params}`)
      .then((r) => {
        if (!cancelled) setData(r.data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.response?.data?.error ?? "Failed to load dashboard");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [startDate, endDate]);

  function handleDateChange(type: "start" | "end", value: string) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(type === "start" ? "startDate" : "endDate", value);
    else next.delete(type === "start" ? "startDate" : "endDate");
    setSearchParams(next);
  }

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (error) return <div className="error-banner">{error}</div>;
  if (!data) return null;

  return (
    <div className="dashboard">
      <div className="dashboard-filters">
        <label>
          From
          <input
            type="date"
            value={startDate}
            onChange={(e) => handleDateChange("start", e.target.value)}
          />
        </label>
        <label>
          To
          <input
            type="date"
            value={endDate}
            onChange={(e) => handleDateChange("end", e.target.value)}
          />
        </label>
      </div>

      <div className="summary-cards">
        <div className="card income">
          <h3>Total Income</h3>
          <p className="amount">${data.totalIncome.toFixed(2)}</p>
        </div>
        <div className="card expense">
          <h3>Total Expense</h3>
          <p className="amount">${data.totalExpense.toFixed(2)}</p>
        </div>
        <div className="card net">
          <h3>Net Balance</h3>
          <p className={`amount ${data.net >= 0 ? "positive" : "negative"}`}>
            ${data.net.toFixed(2)}
          </p>
        </div>
      </div>

      <section className="category-breakdown">
        <h2>Expenses by Category</h2>
        {data.expenseByCategory.length === 0 ? (
          <p className="empty-state">No expenses in this period</p>
        ) : (
          <ul className="category-list">
            {data.expenseByCategory.map(({ category, total }) => (
              <li key={category}>
                <span>{category}</span>
                <span>${total.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
