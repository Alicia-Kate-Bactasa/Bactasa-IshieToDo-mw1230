const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');

const app = express();
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'ishietodo'
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'src')));

app.post('/api/signup', async (req, res) => {
  const { username, email, password } = req.body;
  const [result] = await db.execute(
    'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
    [username, email, password]
  );
  res.json({ id: result.insertId });
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const [users] = await db.execute(
    'SELECT id, username FROM users WHERE email = ? AND password = ?',
    [email, password]
  );
  if (users.length === 0) return res.status(401).json({ error: 'Login failed' });
  res.json(users[0]);
});

app.get('/api/expenses', async (req, res) => {
  const [expenses] = await db.execute(
    'SELECT id, name, amount, category FROM expenses WHERE user_id = ?',
    [req.query.user_id]
  );
  res.json(expenses);
});

app.post('/api/expenses', async (req, res) => {
  const { user_id, name, amount, category } = req.body;
  const [result] = await db.execute(
    'INSERT INTO expenses (user_id, name, amount, category) VALUES (?, ?, ?, ?)',
    [user_id, name, amount, category]
  );
  res.json({ id: result.insertId });
});

app.put('/api/expenses/:id', async (req, res) => {
  const { user_id, name, amount, category } = req.body;
  await db.execute(
    'UPDATE expenses SET name = ?, amount = ?, category = ? WHERE id = ? AND user_id = ?',
    [name, amount, category, req.params.id, user_id]
  );
  res.json({ message: 'Expense updated' });
});

app.delete('/api/expenses/:id', async (req, res) => {
  await db.execute(
    'DELETE FROM expenses WHERE id = ? AND user_id = ?',
    [req.params.id, req.query.user_id]
  );
  res.json({ message: 'Expense deleted' });
});

app.listen(3000, () => console.log('Server running at http://localhost:3000'));
