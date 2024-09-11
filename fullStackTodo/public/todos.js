document.addEventListener('DOMContentLoaded', () => {
  const logoutButton = document.getElementById('logout-button');
  const todoInput = document.getElementById('todo-input');
  const addTodoButton = document.getElementById('add-todo-button');
  const todoList = document.getElementById('todo-list');
  const infoHeading = document.getElementById('information');
  
  // Get the token from local storage
  const token = localStorage.getItem('token');

  if (!token) {
    // If no token is present, redirect to login page
    window.location.href = 'index.html';
  } else {
    // Show the logout button
    logoutButton.style.display = 'block';

    // Fetch user info
    fetchUserInfo();

    // Fetch and display todos
    fetchTodos();

    // Add todo button event listener
    addTodoButton.addEventListener('click', async () => {
      const todoText = todoInput.value.trim();
      if (todoText) {
        try {
          await axios.post('http://localhost:3000/todo', { text: todoText }, {
            headers: { Authorization: `Bearer ${token}` }
          });
          todoInput.value = '';
          fetchTodos(); // Refresh the list after adding a new todo
        } catch (error) {
          console.error('Error adding todo:', error);
          alert('Failed to add todo');
        }
      } else {
        alert('Please enter a todo.');
      }
    });

    // Logout button event listener
    logoutButton.addEventListener('click', () => {
      localStorage.removeItem('token');
      window.location.href = 'index.html'; // Redirect to login page
    });
  }

  // Function to fetch user info
  async function fetchUserInfo() {
    try {
      const response = await axios.get('http://localhost:3000/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      infoHeading.textContent = `Logged in as: ${response.data.username}`;
    } catch (error) {
      console.error('Error fetching user info:', error);
      alert('Failed to fetch user info');
    }
  }

  // Function to fetch todos
  async function fetchTodos() {
    try {
      const response = await axios.get('http://localhost:3000/todos', {
        headers: { Authorization: `Bearer ${token}` }
      });
      todoList.innerHTML = response.data.map(todo => `
        <li>
          ${todo.text}
          <button class="delete-todo-button" data-id="${todo.id}">Delete</button>
        </li>
      `).join('');
      
      // Attach event listeners to delete buttons
      document.querySelectorAll('.delete-todo-button').forEach(button => {
        button.addEventListener('click', async (event) => {
          const todoId = event.target.getAttribute('data-id');
          try {
            await axios.delete(`http://localhost:3000/todo/${todoId}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            fetchTodos(); // Refresh the list after deleting a todo
          } catch (error) {
            console.error('Error deleting todo:', error);
            alert('Failed to delete todo');
          }
        });
      });
    } catch (error) {
      console.error('Error fetching todos:', error);
      alert('Failed to fetch todos');
    }
  }
});
