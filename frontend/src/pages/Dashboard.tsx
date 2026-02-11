import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { api, type DashboardSummary } from "../api/client";
import { Card } from "../ui/Card";
import { Input } from "../ui/Input";

const CURRENCY = "MAD";

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

  if (loading) {
    return (
      <div className="page-loading">
        <div className="page-loading-spinner" />
        <p>Loading dashboard...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="page-error">
        <p>{error}</p>
      </div>
    );
  }
  if (!data) return null;

  const maxExpense = Math.max(...data.expenseByCategory.map((c) => c.total), 1);

  return (
    <div className="dashboard-page">
      <h2 className="page-title">Dashboard</h2>

      <div className="dashboard-filters">
        <Input
          type="date"
          label="From"
          value={startDate}
          onChange={(e) => handleDateChange("start", e.target.value)}
        />
        <Input
          type="date"
          label="To"
          value={endDate}
          onChange={(e) => handleDateChange("end", e.target.value)}
        />
      </div>

      <div className="dashboard-cards">
        <Card className="dashboard-card dashboard-card--income">
          <h3 className="dashboard-card-label">Total Income</h3>
          <p className="dashboard-card-amount dashboard-card-amount--income">
            {CURRENCY} {data.totalIncome.toFixed(2)}
          </p>
        </Card>
        <Card className="dashboard-card dashboard-card--expense">
          <h3 className="dashboard-card-label">Total Expense</h3>
          <p className="dashboard-card-amount dashboard-card-amount--expense">
            {CURRENCY} {data.totalExpense.toFixed(2)}
          </p>
        </Card>
        <Card className="dashboard-card dashboard-card--net">
          <h3 className="dashboard-card-label">Net Balance</h3>
          <p className={`dashboard-card-amount ${data.net >= 0 ? "dashboard-card-amount--income" : "dashboard-card-amount--expense"}`}>
            {CURRENCY} {data.net.toFixed(2)}
          </p>
        </Card>
      </div>

      <section className="dashboard-breakdown">
        <h3 className="dashboard-breakdown-title">Expenses by Category</h3>
        {data.expenseByCategory.length === 0 ? (
          <Card className="dashboard-breakdown-empty">
            <p>No expenses in this period</p>
          </Card>
        ) : (
          <Card className="dashboard-breakdown-list">
            <ul>
              {data.expenseByCategory.map(({ category, total }) => (
                <li key={category} className="dashboard-breakdown-item">
                  <div className="dashboard-breakdown-header">
                    <span className="dashboard-breakdown-category">{category}</span>
                    <span className="dashboard-breakdown-total">{CURRENCY} {total.toFixed(2)}</span>
                  </div>
                  <div className="dashboard-breakdown-bar-wrap">
                    <div
                      className="dashboard-breakdown-bar"
                      style={{ width: `${(total / maxExpense) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </section>
    </div>
  );
}
