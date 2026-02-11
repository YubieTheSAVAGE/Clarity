import { useSearchParams } from "react-router-dom";

type FiltersBarProps = {
  onAddClick: () => void;
};

export function FiltersBar({ onAddClick }: FiltersBarProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const type = searchParams.get("type") ?? "";
  const category = searchParams.get("category") ?? "";
  const startDate = searchParams.get("startDate") ?? "";
  const endDate = searchParams.get("endDate") ?? "";

  function updateFilter(key: string, value: string) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  }

  return (
    <div className="filters-bar">
      <select
        value={type}
        onChange={(e) => updateFilter("type", e.target.value)}
      >
        <option value="">All types</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>
      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => updateFilter("category", e.target.value)}
      />
      <input
        type="date"
        value={startDate}
        onChange={(e) => updateFilter("startDate", e.target.value)}
      />
      <input
        type="date"
        value={endDate}
        onChange={(e) => updateFilter("endDate", e.target.value)}
      />
      <button type="button" onClick={onAddClick} className="btn-primary">
        Add Transaction
      </button>
    </div>
  );
}
