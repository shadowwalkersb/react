import React, { useState, useEffect } from "react";
import "./ShoppingList.css";

const catalogItems = [
  "Milk","Bread","Eggs","Butter","Cheese","Yogurt",
  "Apples","Bananas","Oranges","Tomatoes","Potatoes",
  "Onions","Carrots","Lettuce","Chicken","Beef",
  "Fish","Rice","Pasta","Cereal","Coffee","Tea",
  "Sugar","Salt","Cooking Oil","Flour","Baking Powder"
];

// Encode items into URL
function generateShareUrl(items) {
  const encoded = encodeURIComponent(items.map(i => `${i.name}|${i.quantity}`).join(","));
  return `${window.location.origin}${window.location.pathname}?list=${encoded}`;
}

// Decode items from URL
function getItemsFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const raw = params.get("list");
  if(!raw) return [];
  return raw.split(",").map(item => {
    const [name, quantity] = decodeURIComponent(item).split("|");
    return { id: Date.now().toString() + Math.random(), name, quantity: Number(quantity)||1, checked:false };
  });
}

export default function ShoppingList() {
  const [items, setItems] = useState([]);
  const [catalogQty, setCatalogQty] = useState(catalogItems.reduce((acc,c)=>({...acc,[c]:1}),{}));

  // On mount, check URL for shared list
  useEffect(()=>{
    const urlItems = getItemsFromUrl();
    if(urlItems.length) setItems(urlItems);
  },[]);

  const addItem = (name) => {
    setItems([...items,{id:Date.now()+Math.random(),name,quantity:catalogQty[name],checked:false}]);
  };

  const toggleItem = (id) => {
    setItems(prev => prev.map(i => i.id===id ? {...i, checked:!i.checked} : i));
  };

  const removeItem = (id) => setItems(items.filter(i=>i.id!==id));

  const shareList = () => {
    const url = generateShareUrl(items);
    navigator.clipboard.writeText(url);
    alert("Shareable URL copied!");
  };

  return (
    <div className="shopping-container">
      <h2>🛒 Shopping List</h2>

      <div className="share-button-container">
        <button onClick={shareList}>Share List</button>
      </div>

      <div className="flex-panels">
        {/* Catalog */}
        <div className="catalog-panel">
          <h3>Catalog</h3>
          <ul>
            {catalogItems.map(name => (
              <li key={name}>
                <span>{name}</span>
                <input type="number" min="1" value={catalogQty[name]}
                  onChange={e=>setCatalogQty({...catalogQty,[name]:Number(e.target.value)})}
                />
                <button onClick={()=>addItem(name)}>Add</button>
              </li>
            ))}
          </ul>
        </div>

        {/* Shopping list */}
        <div className="list-panel">
          <h3>Shopping List</h3>
          <ul>
            {items.map(i => (
              <li
                key={i.id}
                className={i.checked ? "checked" : ""}
                onClick={()=>toggleItem(i.id)}
                onDoubleClick={()=>removeItem(i.id)}
              >
                {i.quantity} × {i.name}
                <button onClick={e=>{ e.stopPropagation(); removeItem(i.id); }}>❌</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
