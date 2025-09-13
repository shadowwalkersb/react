import React, { useState, useEffect } from "react";
import "./ShoppingList.css";

const catalogItems = [
  "Milk","Bread","Eggs","Butter","Cheese","Yogurt",
  "Apples","Bananas","Oranges","Tomatoes","Potatoes",
  "Onions","Carrots","Lettuce","Chicken","Beef",
  "Fish","Rice","Pasta","Cereal","Coffee","Tea",
  "Sugar","Salt","Cooking Oil","Flour","Baking Powder"
];

// Encode items into compact Base64 URL
function generateShareUrl(items) {
  if(items.length === 0) return "#";
  const str = items.map(i => `${i.name}|${i.quantity}`).join(",");
  const encoded = btoa(unescape(encodeURIComponent(str)));
  return `${window.location.origin}${window.location.pathname}?list=${encoded}`;
}

// Decode items from Base64 URL
function getItemsFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const raw = params.get("list");
  if(!raw) return [];
  try {
    const decodedStr = decodeURIComponent(escape(atob(raw)));
    return decodedStr.split(",").map(item => {
      const [name, quantity] = item.split("|");
      return { id: Date.now().toString() + Math.random(), name, quantity: Number(quantity)||1, checked:false };
    });
  } catch(e) {
    return [];
  }
}

export default function ShoppingList() {
  const [items, setItems] = useState([]);
  const [catalogQty, setCatalogQty] = useState(catalogItems.reduce((acc,c)=>({...acc,[c]:1}),{}));

  // Populate list from URL on load
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

  const shareUrl = generateShareUrl(items);

  return (
    <div className="shopping-container">
      <h2>🛒 Shopping List</h2>

      <div className="share-link-container">
        {items.length > 0 ? (
          <a href={shareUrl} target="_blank" rel="noopener noreferrer">
            Click to open/share
          </a>
        ) : (
          <span>Add items to generate link</span>
        )}
      </div>

      <div className="flex-panels">

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

      </div>
    </div>
  );
}
