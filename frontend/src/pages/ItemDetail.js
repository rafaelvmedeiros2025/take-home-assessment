import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function ItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch("/api/items/" + id)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Item not found");
        }
        return res.json();
      })
      .then((data) => {
        setItem(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load item");
        setLoading(false);
      });
  }, [id]);

  if (loading)
    return (
      <div
        aria-busy="true"
        aria-label="Loading item details"
        style={{
          padding: 16,
          backgroundColor: "#eee",
          borderRadius: 4,
          width: 300,
          height: 100,
          animation: "pulse 1.5s infinite ease-in-out",
          margin: "auto",
        }}
      />
    );

  if (error)
    return (
      <div
        role="alert"
        style={{ padding: 16, color: "red", textAlign: "center" }}
      >
        <p>{error}</p>
        <button
          onClick={() => navigate("/")}
          style={{
            marginTop: 16,
            padding: "8px 16px",
            cursor: "pointer",
            borderRadius: 4,
            border: "1px solid #ccc",
            backgroundColor: "#fff",
          }}
          aria-label="Back to items list"
        >
          Back to Items
        </button>
      </div>
    );

  return (
    <div
      style={{
        padding: 16,
        maxWidth: 400,
        margin: "20px auto",
        border: "1px solid #ddd",
        borderRadius: 6,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        backgroundColor: "#fff",
      }}
      aria-live="polite"
    >
      <h2 tabIndex={0} style={{ marginBottom: 12 }}>
        {item.name}
      </h2>
      <p>
        <strong>Category:</strong> {item.category}
      </p>
      <p>
        <strong>Price:</strong> ${item.price.toFixed(2)}
      </p>
      <button
        onClick={() => navigate("/")}
        style={{
          marginTop: 16,
          padding: "8px 16px",
          cursor: "pointer",
          borderRadius: 4,
          border: "1px solid #ccc",
          backgroundColor: "#fff",
        }}
        aria-label="Back to items list"
      >
        Back to Items
      </button>

      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default ItemDetail;
