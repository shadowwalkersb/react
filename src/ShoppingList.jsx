import React, { useState, useEffect } from "react";
import "./ShoppingList.css"; // import the new CSS

export default function ShoppingList() {
  const catalog = [
    "Milk","Bread","Eggs","Butter","Cheese","Yogurt",
    "Apples","Bananas","Oranges","Tomatoes","Potatoes",
    "Onions","Carrots","Lettuce","Chicken","Beef",
    "Fish","Rice","Pasta","Cereal","Coffee","Tea",
    "Sugar","Salt","Cooking Oil","Flour","Baking Powder"
  ];

  const [items, setItems] = useState([]);
  const [input, setInput] = useState("");
  const [qty, setQty] = useState(1);
  const [catalogQty, setCatalogQty] = useState(catalog.reduce((acc,c)=>({...acc,[c]:1}),{}));
  const [dragIndex, setDragIndex] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("shoppingList");
    if(saved) setItems(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("shoppingList", JSON.stringify(items));
  }, [items]);

  const addItem = (name, quantity=1) => {
    if(!name.trim()) return;
    const newItem = { id: Date.now().toString(), name, quantity, checked:false };
    setItems([...items, newItem]);
  };

  const toggleItem = (id) => {
    setItems(prev => {
      const newItems = prev.map(i=>i.id===id ? {...i, checked:!i.checked}:i);
      const unchecked = newItems.filter(i=>!i.checked);
      const checked = newItems.filter(i=>i.checked);
      return [...unchecked,...checked];
    });
  };

  const removeItem = (id) => setItems(items.filter(i=>i.id!==id));

  const onDragStart = (index) => setDragIndex(index);
  const onDragOver = (e) => e.preventDefault();
  const onDrop = (index) => {
    if(dragIndex === null || dragIndex === index) return;
    const newItems = [...items];
    const [moved] = newItems.splice(dragIndex,1);
    newItems.splice(index,0,moved);
    setItems(newItems);
    setDragIndex(null);
  };

  return (
    <div className="shopping-container">
      <h2>🛒 Shopping List</h2>
      <div className="container">
        {/* Catalog */}
        <div className="catalog">
          <h3>Catalog</h3>
          <ul>
            {catalog.map(item=>(
              <li key={item}>
                <span>{item}</span>
                <input
                  type="number"
                  min="1"
                  value={catalogQty[item]}
                  onChange={e=>setCatalogQty({...catalogQty,[item]:Number(e.target.value)})}
                />
                <button onClick={()=>addItem(item, catalogQty[item])}>Add</button>
              </li>
            ))}
          </ul>
          <div className="custom-add">
            <input
              value={input}
              onChange={e=>setInput(e.target.value)}
              placeholder="Add custom item..."
            />
            <input
              type="number"
              min="1"
              value={qty}
              onChange={e=>setQty(Number(e.target.value))}
            />
            <button onClick={()=>{addItem(input,qty); setInput(""); setQty(1)}}>Add</button>
          </div>
        </div>

        {/* Shopping list */}
        <div className="shopping-list">
          <h3>Shopping List</h3>
          <ul>
            {items.map((item,index)=>(
              <li
                key={item.id}
                draggable
                onDragStart={()=>onDragStart(index)}
                onDragOver={onDragOver}
                onDrop={()=>onDrop(index)}
                onClick={()=>toggleItem(item.id)}
                onDoubleClick={()=>removeItem(item.id)}
                className={item.checked ? "checked" : ""}
              >
                {item.quantity} × {item.name}
                <button onClick={e=>{ e.stopPropagation(); removeItem(item.id); }}>❌</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
