// App.js
import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    fetch('http://localhost:3000/api/users')
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error(err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    fetch('http://localhost:3000/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })
    .then(() => {
      setName('');
      fetchUsers();
    })
    .catch(err => console.error(err));
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:3000/api/users/${id}`, {
      method: 'DELETE',
    })
    .then(() => fetchUsers())
    .catch(err => console.error(err));
  };

  return (
    <div className="container">
      <h1>User Management App</h1>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Enter name" 
          value={name} 
          onChange={e => setName(e.target.value)} 
          required
        />
        <button type="submit">Add User</button>
      </form>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.name}
            <button onClick={() => handleDelete(user.id)} style={{ marginLeft: 'auto' }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
