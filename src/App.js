import { useEffect, useState } from "react";
import ShoppingList from "./ShoppingList";

function useTodos() {
  const [todos, setTodos] = useState([1, 2]);

  const clearTodos = () => { setTodos([]) };
  const addTodo = (todo) => { setTodos([...todos, todo]) };
  const removeTodo = (i) => { setTodos(todos.filter((_, ii) => i !== ii)) };

  return { todos, addTodo, clearTodos, removeTodo };
}

function TodosList({ todos, removeTodo }) {
  return (<ul>
    {todos.map((todo, i) => (
      <li key={i} onClick={() => removeTodo(i)}>
        {todo}
      </li>))}
  </ul>)
}
function App() {
  return <ShoppingList />;
}

// function App() {
//   const { todos, addTodo, clearTodos, removeTodo } = useTodos()
//   const [input, setInput] = useState('')
//   const [txt, setTxt] = useState("T")
//   const [api, setApi] = useState('hi')

//   // useEffect(()=>{
//   //   fetch('http://localhost:5000/api/' + api)
//   //   .then(res => res.json())
//   //   .then(data => setTxt(data.message))
//   // },[api])

//   return (<div>
//     <input
//       value={input}
//       onChange={(e) => { setInput(e.target.value) }}
//       placeholder='Input'
//     />

//     <button
//       onClick={() => {
//         addTodo(input);
//         setInput('');
//       }}
//     >Add</button>

//     <button
//       onClick={() => clearTodos()}
//     >Clear</button>

//     <button
//       onClick={() => { removeTodo(0) }}
//     >Pop</button>

//     <TodosList todos={todos} removeTodo={removeTodo} />

//     <input
//       placeholder="api"
//       value={api}
//       onChange={(e)=>{setApi(e.target.value)}}
//     />

//     <p>{txt}</p>
//   </div>);
// }

export default App;
