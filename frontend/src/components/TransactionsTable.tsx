import { format } from "date-fns";
import type { Transaction } from "../api/client";

type TransactionsTableProps = {
  items: Transaction[];
  onEdit: (t: Transaction) => void;
  onDelete: (t: Transaction) => void;
  loading?: boolean;
};

export function TransactionsTable({ items, onEdit, onDelete, loading }: TransactionsTableProps) {
  if (loading) return <div className="loading">Loading transactions...</div>;
  if (items.length === 0) return <p className="empty-state">No transactions found. Add your first one!</p>;

  return (
    <div className="table-wrap">
      <table className="transactions-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Description</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((t) => (
            <tr key={t.id}>
              <td>{format(new Date(t.date), "MMM d, yyyy")}</td>
              <td>
                <span className={`badge ${t.type}`}>{t.type}</span>
              </td>
              <td>{t.category}</td>
              <td className={t.type === "income" ? "amount-pos" : "amount-neg"}>
                {t.type === "income" ? "+" : "-"}${Math.abs(t.amount).toFixed(2)}
              </td>
              <td>{t.description || "—"}</td>
              <td>
                <button type="button" onClick={() => onEdit(t)} className="btn-sm">
                  Edit
                </button>
                <button type="button" onClick={() => onDelete(t)} className="btn-sm btn-danger">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
