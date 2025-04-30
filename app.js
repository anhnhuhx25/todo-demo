document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addButton = document.getElementById('addButton');
    const taskList = document.getElementById('taskList');
    const clockDisplay = document.getElementById('current-clock');
    
    let tasks = [];
    
    // Load tasks from local storage
    loadTasks();
    
    // Set up clock
    updateClock();
    setInterval(updateClock, 1000);
    
    // Event listeners
    addButton.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });
    
    function updateClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        clockDisplay.textContent = `${hours}:${minutes}`;
    }
    
    function formatDateTime(timestamp) {
        const date = new Date(timestamp);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    }
    
    function addTask() {
        const taskText = taskInput.value.trim();
        const taskNotesText = document.getElementById('taskNotes').value;
        
        if (taskText !== '') {
            const timestamp = Date.now();
            const task = {
                id: timestamp,
                text: taskText,
                notes: taskNotesText,
                completed: false,
                timestamp: timestamp
            };
            
            tasks.push(task);
            saveTasks();
            renderTasks();
            
            taskInput.value = '';
            document.getElementById('taskNotes').value = '';
            taskInput.focus();
        }
    }
    
    function toggleTaskCompletion(id) {
        tasks = tasks.map(task => {
            if (task.id === id) {
                return { ...task, completed: !task.completed };
            }
            return task;
        });
        
        saveTasks();
        renderTasks();
    }
    
    function deleteTask(id) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
    }
    
        function showEditForm(listItem, task) {
        // Check if edit form already exists to prevent duplicates
        const existingEdit = listItem.querySelector('.edit-container');
        if (existingEdit && existingEdit.classList.contains('active')) {
            return; // Form is already open
        }
        
        // Hide any other open edit forms
        const activeEditForms = document.querySelectorAll('.edit-container.active');
        activeEditForms.forEach(form => form.classList.remove('active'));
        
        // Create edit container
        const editContainer = document.createElement('div');
        editContainer.className = 'edit-container active';
        
        // Create edit textarea
        const editTextarea = document.createElement('textarea');
        editTextarea.value = task.notes || '';
        editTextarea.rows = 3;
        
        // Create action buttons
        const editActions = document.createElement('div');
        editActions.className = 'edit-actions';
        
        const saveButton = document.createElement('button');
        saveButton.className = 'save-edit-button';
        saveButton.textContent = 'Save';
        saveButton.addEventListener('click', () => {
            saveTaskEdit(task.id, editTextarea.value);
            editContainer.classList.remove('active');
        });
        
        const cancelButton = document.createElement('button');
        cancelButton.className = 'cancel-edit-button';
        cancelButton.textContent = 'Cancel';
        cancelButton.addEventListener('click', () => {
            editContainer.classList.remove('active');
        });
        
        editActions.appendChild(saveButton);
        editActions.appendChild(cancelButton);
        
        editContainer.appendChild(editTextarea);
        editContainer.appendChild(editActions);
        
        listItem.appendChild(editContainer);
        editTextarea.focus();
    }
    
    function saveTaskEdit(taskId, newNotes) {
        tasks = tasks.map(task => {
            if (task.id === taskId) {
                return { ...task, notes: newNotes };
            }
            return task;
        });
        
        saveTasks();
        renderTasks();
    }
    
    function renderTasks() {
        taskList.innerHTML = '';
        
        tasks.forEach(task => {
            const li = document.createElement('li');
            
            const taskTextContainer = document.createElement('div');
            
            const taskTextSpan = document.createElement('span');
            taskTextSpan.className = 'task-text';
            taskTextSpan.textContent = task.text;
            if (task.completed) {
                taskTextSpan.classList.add('completed');
            }
            
            const taskDateSpan = document.createElement('div');
            taskDateSpan.className = 'task-date';
            taskDateSpan.textContent = formatDateTime(task.timestamp);
            
            taskTextContainer.appendChild(taskTextSpan);
            taskTextContainer.appendChild(taskDateSpan);
            
            if (task.notes && task.notes.trim() !== '') {
                const taskNotesDiv = document.createElement('div');
                taskNotesDiv.className = 'task-notes';
                taskNotesDiv.textContent = task.notes;
                if (task.completed) {
                    taskNotesDiv.classList.add('completed');
                }
                taskTextContainer.appendChild(taskNotesDiv);
            }
            
            const actionButtons = document.createElement('div');
            actionButtons.className = 'action-buttons';
            
            const completeButton = document.createElement('button');
            completeButton.className = 'complete-button';
            completeButton.textContent = task.completed ? 'Undo' : 'Complete';
            completeButton.addEventListener('click', () => toggleTaskCompletion(task.id));
            
            const editButton = document.createElement('button');
            editButton.className = 'edit-button';
            editButton.textContent = 'Edit';
            editButton.addEventListener('click', () => showEditForm(li, task));
            
            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete-button';
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => deleteTask(task.id));
            
            actionButtons.appendChild(completeButton);
            actionButtons.appendChild(editButton);
            actionButtons.appendChild(deleteButton);
            
            li.appendChild(taskTextContainer);
            li.appendChild(actionButtons);
            
            taskList.appendChild(li);
        });
    }
    
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    
    function loadTasks() {
        const savedTasks = localStorage.getItem('tasks');
        if (savedTasks) {
            tasks = JSON.parse(savedTasks);
            renderTasks();
        }
    }
});