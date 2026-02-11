import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { api, type Transaction } from "../api/client";
import { FiltersBar } from "../components/FiltersBar";
import { TransactionsTable } from "../components/TransactionsTable";
import { TransactionFormModal } from "../components/TransactionFormModal";

export function Transactions() {
  const [searchParams] = useSearchParams();
  const [items, setItems] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);

  const type = searchParams.get("type") ?? "";
  const category = searchParams.get("category") ?? "";
  const startDate = searchParams.get("startDate") ?? "";
  const endDate = searchParams.get("endDate") ?? "";

  function fetchTransactions() {
    setLoading(true);
    setError("");
    const params = new URLSearchParams();
    if (type) params.set("type", type);
    if (category) params.set("category", category);
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);
    api
      .get<Transaction[]>(`/transactions?${params}`)
      .then((r) => setItems(r.data))
      .catch((err) => setError(err.response?.data?.error ?? "Failed to load transactions"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchTransactions();
  }, [type, category, startDate, endDate]);

  async function handleDelete(t: Transaction) {
    if (!confirm("Delete this transaction?")) return;
    try {
      await api.delete(`/transactions/${t.id}`);
      fetchTransactions();
    } catch (err) {
      setError((err as { response?: { data?: { error?: string } } })?.response?.data?.error ?? "Delete failed");
    }
  }

  return (
    <div className="transactions-page">
      <h2>Transactions</h2>
      <FiltersBar onAddClick={() => { setEditing(null); setModalOpen(true); }} />
      {error && <div className="error-banner">{error}</div>}
      <TransactionsTable
        items={items}
        loading={loading}
        onEdit={(t) => { setEditing(t); setModalOpen(true); }}
        onDelete={handleDelete}
      />
      <TransactionFormModal
        open={modalOpen}
        edit={editing}
        onClose={() => { setModalOpen(false); setEditing(null); }}
        onSaved={fetchTransactions}
      />
    </div>
  );
}
