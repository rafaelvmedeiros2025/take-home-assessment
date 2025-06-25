import React, { createContext, useCallback, useContext, useState } from "react";

const DataContext = createContext();

export function DataProvider({ children }) {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchItems = useCallback(
    async ({ q = "", limit = 10, offset = 0 } = {}) => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ q, limit, offset });
        const res = await fetch(`http://localhost:3001/api/items?${params}`);
        const json = await res.json();
        setItems(json.data || []);
        setTotal(json.total || 0);
      } catch (err) {
        console.error("Failed to fetch items", err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return (
    <DataContext.Provider value={{ items, total, loading, fetchItems }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
