import express from 'express';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;
const JWT_SECRET = 'hello world';
const users = [];
const todos = [];
let countId = 0;

// Resolve __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Serve the homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Signup endpoint
app.post('/signup', (req, res) => {
  const { username, password } = req.body;
  if (users.find(user => user.username === username)) {
    return res.status(400).send({ message: 'User already exists' });
  }
  users.push({ username, password });
  res.send({ message: 'Signed up successfully' });
});

// Signin endpoint
app.post('/signin', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(user => user.username === username && user.password === password);
  if (!user) {
    return res.status(401).send({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ username }, JWT_SECRET);
  res.json({ token });
});

// Auth middleware
function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]; // Extract token after 'Bearer'
  if (token) {
    jwt.verify(token, JWT_SECRET, (err, decodedUser) => {
      if (err) {
        res.status(401).send({ message: 'Invalid token' });
      } else {
        req.user = decodedUser;
        next();
      }
    });
  } else {
    res.status(401).send({ message: 'No token provided' });
  }
}

// Me endpoint
app.get('/me', auth, (req, res) => {
  const user = users.find(user => user.username === req.user.username);
  if (user) {
    res.json({ username: user.username });
  } else {
    res.status(404).send({ message: 'User not found' });
  }
});

// Add Todo
app.post('/todo', auth, (req, res) => {
  const { text } = req.body;
  const user = req.user.username;

  if (!text) {
    return res.status(400).send({ message: "Todo text is required" });
  }

  const id = ++countId;
  todos.push({
    id: id.toString(), 
    text: text,
    username: user
  });

  res.send({ message: "Todo added successfully" });
});

// Get Todos
app.get('/todos', auth, (req, res) => {
  const user = req.user.username;
  const userTodos = todos.filter(todo => todo.username === user);
  res.json(userTodos);
});

// Update Todo
app.patch('/todo/:id', auth, (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  const user = req.user.username;

  const todoIndex = todos.findIndex(todo => todo.id === id && todo.username === user);

  if (todoIndex !== -1) {
    if (text) {
      todos[todoIndex].text = text;
      res.send({ message: "Todo updated successfully" });
    } else {
      res.status(400).send({ message: "Todo text is required" });
    }
  } else {
    res.status(404).send({ message: "Todo not found or unauthorized" });
  }
});

// Delete Todo
app.delete('/todo/:id', auth, (req, res) => {
  const { id } = req.params;
  const user = req.user.username;

  const todoIndex = todos.findIndex(todo => todo.id === id && todo.username === user);

  if (todoIndex !== -1) {
    todos.splice(todoIndex, 1); 
    res.send({ message: "Todo deleted successfully" });
  } else {
    res.status(404).send({ message: "Todo not found or unauthorized" });
  }
});

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
