const loadTasksFromLocalStorage = () => {
    const storedTasks = localStorage.getItem('tasks');

    if (storedTasks) {
        const parsedTasks = JSON.parse(storedTasks);

        parsedTasks.forEach(task => {
            const taskDueDate = new Date(task.taskDueDate);
            saveTaskToList(task.taskDescription, taskDueDate, task.completed);
        });
    }
};

const saveTasksToLocalStorage = () => {
    const list = document.getElementById('task-list');
    const tasks = Array.from(list.children);

    const serializedTasks = tasks.map(task => {
        return {
            taskDescription: task.querySelector('.task-description').textContent,
            taskDueDate: task.dataset.taskDueDate,
            completed: task.dataset.completed === 'true',
        };
    });
    localStorage.setItem('tasks', JSON.stringify(serializedTasks));
};

window.addEventListener('load', () => {
    loadTasksFromLocalStorage();
});

let selectedTask = null;

const getTodaysDate = () => {
    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    let formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
};

document.getElementById("due-date").value = getTodaysDate();

const addTaskFromUser = () => {
    const taskDescriptionInput = document.getElementById('task-description');
    const dueDateInput = document.getElementById('due-date');

    const taskDescription = taskDescriptionInput.value;

    if (taskDescription) {
        const taskDateString = dueDateInput.value;
        const taskDueDate = new Date(taskDateString);

        saveTaskToList(taskDescription, taskDueDate);

        taskDescriptionInput.value = '';
        dueDateInput.value = getTodaysDate(); 

    } else {
        window.alert('Please add description');
    }
};


const tickTask = (event) => {
    const checkbox = event.target;
    const taskListItem = checkbox.closest('li');
    const taskDescriptionElement = taskListItem.querySelector('.task-description');
    const dueDateElement = taskListItem.querySelector('.due-date');

    if (checkbox.checked) {
        taskDescriptionElement.classList.add('completed');
        dueDateElement.classList.add('completed');
        taskListItem.dataset.completed = 'true';
    } else {
        taskDescriptionElement.classList.remove('completed');
        dueDateElement.classList.remove('completed');
        taskListItem.dataset.completed = 'false';
    }
    saveTasksToLocalStorage();
};


const changeTask = (event) => {
    const li = event.target.closest('li');
    let taskDescriptionElement = li.querySelector('.task-description');

    const newTaskDescription = window.prompt('What is the new description?: ');

    if (newTaskDescription != "") {
        taskDescriptionElement.textContent = newTaskDescription;
        console.log('Updated task', taskDescriptionElement.textContent);

        saveTasksToLocalStorage();
    } else {
        window.alert('Please add a description... try again! ');
    }
};

const deleteTask = (event) => {
    const li = event.target.closest('li');
    const list = document.getElementById('task-list');
    list.removeChild(li);

    saveTasksToLocalStorage();
};

const sortTasks = () => {
    const list = document.getElementById('task-list');
    const sortingOption = document.getElementById('sorting').value;

    const tasks = Array.from(list.children);

    tasks.sort((taskA, taskB) => {
        const dueDateA = new Date(taskA.dataset.taskDueDate);
        const dueDateB = new Date(taskB.dataset.taskDueDate);

        const taskDescriptionElementA = taskA.querySelector('.task-description');
        const taskDescriptionElementB = taskB.querySelector('.task-description');
        const completedA = taskDescriptionElementA.classList.contains('completed');
        const completedB = taskDescriptionElementB.classList.contains('completed');

        if (sortingOption === 'completed') {
            return completedB - completedA;
        } else if (sortingOption === 'not-completed') {
            return completedA - completedB;
        } else if (sortingOption === 'most-urgent') {
            return dueDateA - dueDateB;
        } else if (sortingOption === 'least-urgent') {
            return dueDateB - dueDateA;
        } else {
            return 0;
        }
    });

    list.innerHTML = '';

    tasks.forEach(task => list.appendChild(task));

    saveTasksToLocalStorage();
};

document.getElementById('sorting').addEventListener('change', sortTasks);

const createTaskDescriptionElement = (taskDescription) => {
    const taskDescriptionElement = document.createElement('div');

    taskDescriptionElement.classList.add('task-description');
    taskDescriptionElement.textContent = `${taskDescription}`;

    return taskDescriptionElement;
}

const saveTaskToList = (taskDescription, taskDueDate, completed = false) => {
    const list = document.getElementById('task-list');
    const li = document.createElement('li');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = completed;
    checkbox.addEventListener('change', tickTask);

    const taskDescriptionElement = createTaskDescriptionElement(taskDescription);

    const dueDateElement = document.createElement('div');
    dueDateElement.classList.add('due-date');
    let formattedDate = taskDueDate.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
    dueDateElement.textContent = `Deadline: ${formattedDate}`;

    const checkedContainer = document.createElement('div')
    checkedContainer.appendChild(checkbox)

    const taskInfoContainer = document.createElement('div');
    taskInfoContainer.classList.add('task-info-container');
    taskInfoContainer.appendChild(taskDescriptionElement);
    taskInfoContainer.appendChild(dueDateElement);

    const buttonsContainer = document.createElement('div');
    buttonsContainer.classList.add('buttons-container');

    const changeButton = document.createElement('button');
    changeButton.addEventListener('click', changeTask);
    changeButton.textContent = 'Change';

    const deleteButton = document.createElement('button');
    deleteButton.addEventListener('click', deleteTask);
    deleteButton.textContent = 'Delete';

    buttonsContainer.appendChild(changeButton);
    buttonsContainer.appendChild(deleteButton);

    li.appendChild(checkedContainer);
    li.appendChild(taskInfoContainer);
    li.appendChild(buttonsContainer);

    li.dataset.taskDueDate = taskDueDate.toISOString();
    li.dataset.completed = completed;

    if (completed) {
        li.classList.add('completed');
    }

    list.appendChild(li);

    saveTasksToLocalStorage();
};

document.getElementById('add-button').addEventListener('click', addTaskFromUser);
