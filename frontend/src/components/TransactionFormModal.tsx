import { useState, useEffect } from "react";
import { api } from "../api/client";
import type { Transaction } from "../api/client";

type FormData = {
  type: "income" | "expense";
  amount: string;
  category: string;
  date: string;
  description: string;
};

type TransactionFormModalProps = {
  open: boolean;
  edit?: Transaction | null;
  onClose: () => void;
  onSaved: () => void;
};

function getDefaultForm(): FormData {
  return {
    type: "expense",
    amount: "",
    category: "",
    date: new Date().toISOString().slice(0, 10),
    description: "",
  };
}

export function TransactionFormModal({ open, edit, onClose, onSaved }: TransactionFormModalProps) {
  const [form, setForm] = useState<FormData>(() => getDefaultForm());
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (edit) {
      setForm({
        type: edit.type,
        amount: String(edit.amount),
        category: edit.category,
        date: edit.date.slice(0, 10),
        description: edit.description ?? "",
      });
    } else {
      setForm(getDefaultForm());
    }
    setError("");
  }, [edit, open]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = {
        type: form.type,
        amount: parseFloat(form.amount),
        category: form.category.trim(),
        date: form.date,
        description: form.description.trim() || undefined,
      };
      if (edit) {
        await api.put(`/transactions/${edit.id}`, payload);
      } else {
        await api.post("/transactions", payload);
      }
      onSaved();
      onClose();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error ?? "Save failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{edit ? "Edit Transaction" : "Add Transaction"}</h2>
        <form onSubmit={handleSubmit}>
          {error && <div className="error-banner">{error}</div>}
          <label>
            Type
            <select
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as "income" | "expense" }))}
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </label>
          <label>
            Amount
            <input
              type="number"
              step="0.01"
              min="0"
              required
              value={form.amount}
              onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
            />
          </label>
          <label>
            Category
            <input
              type="text"
              required
              placeholder="e.g. Food, Salary"
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            />
          </label>
          <label>
            Date
            <input
              type="date"
              required
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            />
          </label>
          <label>
            Description (optional)
            <input
              type="text"
              placeholder="Optional notes"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </label>
          <div className="modal-actions">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" disabled={loading}>
              {loading ? "Saving..." : edit ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
