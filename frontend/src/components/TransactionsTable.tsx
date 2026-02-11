import { format } from "date-fns";
import type { Transaction } from "../api/client";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

const CURRENCY = "MAD";

type TransactionsTableProps = {
  items: Transaction[];
  onEdit: (t: Transaction) => void;
  onDelete: (t: Transaction) => void;
  loading?: boolean;
};

export function TransactionsTable({ items, onEdit, onDelete, loading }: TransactionsTableProps) {
  if (loading) {
    return (
      <div className="page-loading">
        <div className="page-loading-spinner" />
        <p>Loading transactions...</p>
      </div>
    );
  }
  if (items.length === 0) {
    return (
      <div className="transactions-empty">
        <p>No transactions found. Add your first one!</p>
      </div>
    );
  }

  return (
    <div className="transactions-table-wrap">
      <table className="transactions-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Category</th>
            <th className="transactions-table-amount">Amount</th>
            <th>Description</th>
            <th className="transactions-table-actions"></th>
          </tr>
        </thead>
        <tbody>
          {items.map((t) => (
            <tr key={t.id}>
              <td>{format(new Date(t.date), "MMM d, yyyy")}</td>
              <td>
                <Badge variant={t.type}>{t.type}</Badge>
              </td>
              <td>{t.category}</td>
              <td className={`transactions-table-amount ${t.type === "income" ? "amount-income" : "amount-expense"}`}>
                {t.type === "income" ? "+" : "-"}{CURRENCY} {Math.abs(t.amount).toFixed(2)}
              </td>
              <td className="transactions-table-desc">{t.description || "—"}</td>
              <td className="transactions-table-actions">
                <Button variant="ghost" size="sm" onClick={() => onEdit(t)}>
                  Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => onDelete(t)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
