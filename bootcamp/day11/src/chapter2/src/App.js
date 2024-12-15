import React, { useState } from "react";

export function App() {
	const [todos, setTodos] = useState([]);
	const [input, setInput] = useState('');

	const addTodo = () => {
		if (!input) return;
		setTodos(t => [...t, input]);
		setInput('');
	}

	const removeTodo = (todo) => {
		setTodos(t => t.filter(x => x != todo));
	}

	return (<div>
		<input value={input} onChange={(ev) => setInput(ev.target.value)} placeholder="Todo Text" />
		<button onClick={addTodo}>Add</button>
		<hr />
		<ol>
			{todos.map(t => <li key={t} onClick={() => removeTodo(t)}>{t} <button style={{ color: 'red' }}>x</button></li>)}
		</ol>
	</div>)
}
