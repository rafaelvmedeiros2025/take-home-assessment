import React, { useEffect, useState } from "react";
import { useData } from "../state/DataContext";
import { Link } from "react-router-dom";
import { FixedSizeList as List } from "react-window";

function SkeletonRow({ style }) {
  return (
    <div
      style={{
        ...style,
        padding: "8px 12px",
        backgroundColor: "#eee",
        borderRadius: 4,
        marginBottom: 8,
        animation: "pulse 1.5s infinite ease-in-out",
      }}
      aria-busy="true"
      aria-label="Loading item"
    />
  );
}

function Items() {
  const { items, fetchItems, total, loading } = useData();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const limit = 100;

  useEffect(() => {
    fetchItems({ q: query, limit, offset: page * limit });
  }, [query, page, fetchItems]);

  const handleSearchChange = (e) => {
    setQuery(e.target.value);
    setPage(0);
  };

  const Row = ({ index, style }) => {
    const item = items[index];
    return (
      <div style={{ ...style, padding: "8px 12px" }}>
        <Link
          to={`/items/${item.id}`}
          style={{ textDecoration: "none", color: "#007bff" }}
          aria-label={`View details for ${item.name}`}
        >
          {item.name}
        </Link>
      </div>
    );
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 16 }}>
      <label htmlFor="search" style={{ display: "block", marginBottom: 8 }}>
        Search Items
      </label>
      <input
        id="search"
        type="text"
        placeholder="Search items..."
        value={query}
        onChange={handleSearchChange}
        aria-label="Search items"
        style={{
          width: "100%",
          padding: "10px 12px",
          fontSize: 16,
          borderRadius: 4,
          border: "1px solid #ccc",
          marginBottom: 16,
          boxSizing: "border-box",
        }}
      />

      {loading && (
        <List
          height={350}
          itemCount={limit}
          itemSize={40}
          width={"100%"}
          aria-busy="true"
          aria-label="Loading items"
        >
          {SkeletonRow}
        </List>
      )}

      {!loading && items.length === 0 && (
        <p role="alert" style={{ textAlign: "center", color: "#666" }}>
          No items found matching your search.
        </p>
      )}

      {!loading && items.length > 0 && (
        <List
          height={350}
          itemCount={items.length}
          itemSize={40}
          width={"100%"}
          aria-label="List of items"
        >
          {Row}
        </List>
      )}

      <div
        style={{
          marginTop: 16,
          display: "flex",
          justifyContent: "center",
          gap: 12,
        }}
      >
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 0))}
          disabled={page === 0}
          aria-label="Previous page"
          style={{
            padding: "8px 16px",
            fontSize: 16,
            cursor: page === 0 ? "not-allowed" : "pointer",
            borderRadius: 4,
            border: "1px solid #ccc",
            backgroundColor: page === 0 ? "#f5f5f5" : "#fff",
          }}
        >
          Prev
        </button>

        <span
          aria-live="polite"
          style={{ fontSize: 16, alignSelf: "center", color: "#333" }}
        >
          Page {page + 1} of {Math.ceil(total / limit)}
        </span>

        <button
          onClick={() => setPage((p) => (p + 1 < total / limit ? p + 1 : p))}
          disabled={(page + 1) * limit >= total}
          aria-label="Next page"
          style={{
            padding: "8px 16px",
            fontSize: 16,
            cursor: (page + 1) * limit >= total ? "not-allowed" : "pointer",
            borderRadius: 4,
            border: "1px solid #ccc",
            backgroundColor: (page + 1) * limit >= total ? "#f5f5f5" : "#fff",
          }}
        >
          Next
        </button>
      </div>

      <style>{`
        @keyframes pulse {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

export default Items;
