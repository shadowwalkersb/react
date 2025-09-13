import React, { useState, useEffect } from "react";

export default function ShoppingList() {
  const catalog = ["Milk", "Bread", "Eggs", "Butter", "Cheese", "Apples"];

  const [items, setItems] = useState([]);
  const [input, setInput] = useState("");

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("shoppingList");
    if (saved) setItems(JSON.parse(saved));
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem("shoppingList", JSON.stringify(items));
  }, [items]);

  const addItem = (name) => {
    if (!name.trim()) return;
    const newItem = { id: Date.now(), name, checked: false };
    setItems([...items, newItem]);
    setInput("");
  };

  const toggleItem = (id) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const removeItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "0 auto",
        padding: "1rem",
        fontFamily: "sans-serif",
      }}
    >
      <h2 style={{ textAlign: "center" }}>🛒 Shopping List</h2>

      {/* Catalog Buttons */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        {catalog.map((c) => (
          <button
            key={c}
            onClick={() => addItem(c)}
            style={{
              flex: "1 1 auto",
              padding: "0.5rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
              background: "#f8f8f8",
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Custom input */}
      <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add custom item..."
          style={{ flex: 1, padding: "0.5rem" }}
        />
        <button onClick={() => addItem(input)}>Add</button>
      </div>

      {/* Item list */}
      <ul style={{ listStyle: "none", padding: 0, marginTop: "1rem" }}>
        {items.map((item) => (
          <li
            key={item.id}
            onClick={() => toggleItem(item.id)}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0.5rem",
              marginBottom: "0.25rem",
              background: "#fafafa",
              borderRadius: "6px",
              cursor: "pointer",
              textDecoration: item.checked ? "line-through" : "none",
              color: item.checked ? "#777" : "inherit",
            }}
          >
            {item.name}
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeItem(item.id);
              }}
              style={{
                marginLeft: "1rem",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                color: "red",
                fontSize: "1.2rem",
              }}
            >
              ❌
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
