import React, { useState, useEffect } from "react";

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
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);

  useEffect(() => {
    const saved = localStorage.getItem("shoppingList");
    if(saved) setItems(JSON.parse(saved));
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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
    <div style={{ maxWidth:"900px", margin:"0 auto", padding:"1rem", fontFamily:"sans-serif" }}>
      <h2 style={{ textAlign:"center" }}>🛒 Shopping List</h2>
      <div style={{
        display:"flex",
        gap:"1rem",
        flexWrap:"wrap",
        flexDirection: isMobile ? "column-reverse" : "row"
      }}>
        {/* Catalog */}
        <div style={{ flex:1, maxHeight:"70vh", overflowY:"auto", border:"1px solid #ccc", padding:"0.5rem", borderRadius:"8px" }}>
          <h3 style={{ textAlign:"center" }}>Catalog</h3>
          <ul style={{ listStyle:"none", padding:0 }}>
            {catalog.map(item=>(
              <li key={item} style={{ display:"flex", alignItems:"center", marginBottom:"0.5rem" }}>
                <span style={{ flex:1 }}>{item}</span>
                <input type="number" min="1" value={catalogQty[item]}
                  onChange={e=>setCatalogQty({...catalogQty,[item]:Number(e.target.value)})}
                  style={{ width:"50px", marginRight:"0.5rem" }}
                />
                <button onClick={()=>addItem(item, catalogQty[item])}>Add</button>
              </li>
            ))}
          </ul>
          <div style={{ marginTop:"1rem", display:"flex", gap:"0.5rem", alignItems:"center" }}>
            <input value={input} onChange={e=>setInput(e.target.value)} placeholder="Add custom item..." style={{ flex:1, padding:"0.5rem" }}/>
            <input type="number" min="1" value={qty} onChange={e=>setQty(Number(e.target.value))} style={{ width:"60px", padding:"0.5rem" }}/>
            <button onClick={()=>{addItem(input,qty); setInput(""); setQty(1)}}>Add</button>
          </div>
        </div>

        {/* Shopping list */}
        <div style={{ flex:1, maxHeight:"70vh", overflowY:"auto", border:"1px solid #ccc", padding:"0.5rem", borderRadius:"8px" }}>
          <h3 style={{ textAlign:"center" }}>Shopping List</h3>
          <ul style={{ listStyle:"none", padding:0 }}>
            {items.map((item,index)=>(
              <li
                key={item.id}
                draggable
                onDragStart={()=>onDragStart(index)}
                onDragOver={onDragOver}
                onDrop={()=>onDrop(index)}
                onClick={()=>toggleItem(item.id)}
                onDoubleClick={()=>removeItem(item.id)}
                style={{
                  display:"flex",
                  justifyContent:"space-between",
                  alignItems:"center",
                  padding:"0.5rem",
                  marginBottom:"0.25rem",
                  background:"#fafafa",
                  borderRadius:"6px",
                  cursor:"grab",
                  textDecoration: item.checked ? "line-through" : "none",
                  color: item.checked ? "#777" : "inherit",
                }}
              >
                {item.quantity} × {item.name}
                <button
                  onClick={e=>{ e.stopPropagation(); removeItem(item.id); }}
                  style={{ marginLeft:"1rem", border:"none", background:"transparent", cursor:"pointer", color:"red", fontSize:"1.2rem" }}
                >❌</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
