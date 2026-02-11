import { useState, useEffect } from "react";
import { api } from "../api/client";
import type { Transaction } from "../api/client";
import { Modal } from "../ui/Modal";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Button } from "../ui/Button";

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

const TYPE_OPTIONS = [
  { value: "income", label: "Income" },
  { value: "expense", label: "Expense" },
];

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
    <Modal open={open} onClose={onClose} title={edit ? "Edit Transaction" : "Add Transaction"}>
      <form onSubmit={handleSubmit} className="transaction-form">
        {error && <div className="auth-error">{error}</div>}
        <Select
          label="Type"
          options={TYPE_OPTIONS}
          value={form.type}
          onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as "income" | "expense" }))}
          required
        />
        <Input
          label="Amount"
          type="number"
          step="0.01"
          min="0"
          required
          placeholder="0.00"
          value={form.amount}
          onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
        />
        <Input
          label="Category"
          type="text"
          required
          placeholder="e.g. Food, Salary"
          value={form.category}
          onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
        />
        <Input
          label="Date"
          type="date"
          required
          value={form.date}
          onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
        />
        <Input
          label="Description (optional)"
          type="text"
          placeholder="Optional notes"
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
        />
        <div className="transaction-form-actions">
          <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? "Saving..." : edit ? "Update" : "Add"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
