document.addEventListener('DOMContentLoaded', () => {
  const taskForm = document.getElementById('taskForm');
  const taskInput = document.getElementById('taskInput');
  const dueDateInput = document.getElementById('dueDate');
  const priorityInput = document.getElementById('priority');
  const categoryInput = document.getElementById('category');
  const taskList = document.getElementById('taskList');
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  // Load tasks from localStorage
  tasks.forEach(addTaskToList);

  taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const taskText = taskInput.value.trim();
    const dueDate = dueDateInput.value;
    const priority = priorityInput.value;
    const category = categoryInput.value.trim();
    
    if (taskText === '') return;

    const task = {
      id: Date.now(),
      text: taskText,
      completed: false,
      dueDate: dueDate || 'No due date',
      priority: priority || 'low',
      category: category || 'No category'
    };

    tasks.push(task);
    addTaskToList(task);
    saveTasks();
    
    taskInput.value = '';
    dueDateInput.value = '';
    categoryInput.value = '';
  });

  function addTaskToList(task) {
    const li = document.createElement('li');
    li.className = `list-group-item ${task.completed ? 'completed-task' : 'pending-task'} priority-${task.priority}`;
    li.innerHTML = `
      <div>
        <strong>${task.text}</strong>
        <div class="category">Category: ${task.category} | Due: ${task.dueDate}</div>
      </div>
      <div>
        <button class="btn btn-sm btn-success complete-task">Complete</button>
        <button class="btn btn-sm btn-info edit-task">Edit</button>
        <button class="btn btn-sm btn-danger delete-task">Delete</button>
      </div>
    `;

    // Complete task
    li.querySelector('.complete-task').addEventListener('click', () => {
      task.completed = !task.completed;
      li.classList.toggle('completed-task');
      li.classList.toggle('pending-task');
      saveTasks();
    });

    // Edit task
    li.querySelector('.edit-task').addEventListener('click', () => {
      taskInput.value = task.text;
      dueDateInput.value = task.dueDate !== 'No due date' ? task.dueDate : '';
      priorityInput.value = task.priority;
      categoryInput.value = task.category !== 'No category' ? task.category : '';
      tasks = tasks.filter(t => t.id !== task.id);
      li.remove();
      saveTasks();
    });

    // Delete task
    li.querySelector('.delete-task').addEventListener('click', () => {
      tasks = tasks.filter(t => t.id !== task.id);
      li.remove();
      saveTasks();
    });

    taskList.appendChild(li);
  }

  function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  // Filters: All, Completed, Pending
  document.getElementById('allTasks').addEventListener('click', () => filterTasks('all'));
  document.getElementById('completedTasks').addEventListener('click', () => filterTasks('completed'));
  document.getElementById('pendingTasks').addEventListener('click', () => filterTasks('pending'));

  function filterTasks(filter) {
    const taskItems = taskList.querySelectorAll('.list-group-item');
    taskItems.forEach((item, index) => {
      const task = tasks[index];
      switch (filter) {
        case 'all':
          item.style.display = 'flex';
          break;
        case 'completed':
          task.completed ? item.style.display = 'flex' : item.style.display = 'none';
          break;
        case 'pending':
          task.completed ? item.style.display = 'none' : item.style.display = 'flex';
          break;
      }
    });
  }
});
