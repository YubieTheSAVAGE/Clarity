import { useSearchParams } from "react-router-dom";
import { Button } from "../ui/Button";
import { Select } from "../ui/Select";
import { Input } from "../ui/Input";

type FiltersBarProps = {
  onAddClick: () => void;
};

const TYPE_OPTIONS = [
  { value: "", label: "All types" },
  { value: "income", label: "Income" },
  { value: "expense", label: "Expense" },
];

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

  function clearFilters() {
    setSearchParams({});
  }

  const hasFilters = type || category || startDate || endDate;

  return (
    <div className="transactions-toolbar">
      <div className="transactions-toolbar-filters">
        <Select
          options={TYPE_OPTIONS}
          value={type}
          onChange={(e) => updateFilter("type", e.target.value)}
          aria-label="Filter by type"
        />
        <Input
          type="text"
          placeholder="Search category"
          value={category}
          onChange={(e) => updateFilter("category", e.target.value)}
          aria-label="Filter by category"
        />
        <Input
          type="date"
          value={startDate}
          onChange={(e) => updateFilter("startDate", e.target.value)}
          aria-label="Start date"
        />
        <Input
          type="date"
          value={endDate}
          onChange={(e) => updateFilter("endDate", e.target.value)}
          aria-label="End date"
        />
        {hasFilters && (
          <Button variant="secondary" size="sm" onClick={clearFilters}>
            Clear
          </Button>
        )}
      </div>
      <Button variant="primary" onClick={onAddClick}>
        Add transaction
      </Button>
    </div>
  );
}
