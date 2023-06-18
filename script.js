const STORAGE_KEY = "taskList";
const CHECKBOX_ID_PREFIX = "check-";
const BUTTON_ID_PREFIX = "btn-";
const TASK_ID_PREFIX = "task-";
const TASK_P_ID_PREFIX = "p-";

const inputTask = document.getElementById("taskInput");
const addButton = document.getElementById("addTask");
const taskList = document.getElementById("taskList");
let savedTaskList = JSON.parse(localStorage.getItem(STORAGE_KEY));

if (!savedTaskList) savedTaskList = [];

addButton.addEventListener("click", addTask);
start();

function addDeleteButtonClicks() {
    let deleteButtons = document.getElementsByName("delete");
    for (let button of deleteButtons) {
        button.addEventListener("click", handleDelete, { once: true });
    }
}

function addCheckboxClicks() {
    let checkBoxes = document.getElementsByName("done");
    for (let checkbox of checkBoxes) {
        checkbox.addEventListener("click", handleCheckbox);
    }
}
function updateLocalStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedTaskList));
}

function start() {
    renderSavedTasks();
    addDeleteButtonClicks();
    addCheckboxClicks();
}

function renderSavedTasks() {
    let task_count = 1;
    for (let task of savedTaskList) {
        taskList.innerHTML += newTask(task, task_count);
        task_count++;
    }
}

function nextID() {
    if (savedTaskList.length > 0) return savedTaskList.slice(-1)[0].id + 1;
    return 1;
}

function addTask() {
    if(inputTask.value){
        id = nextID();
        text = inputTask.value;
        done = false;
        task = new Task(id, text, done);
        task.save();
        addTaskInListHTML(task);
    }
}

function newTask(task, rowNum = false) {
    checkbox_id = CHECKBOX_ID_PREFIX + task.id;
    button_id = BUTTON_ID_PREFIX + task.id;
    li_id = TASK_ID_PREFIX + task.id;
    rowNum = rowNum ? rowNum : savedTaskList.length;

    return `<li id="${li_id}">
                <div class="flex task">
                    <p>${rowNum}</p>
                    <input  type="checkbox"
                            class="checkbox"
                            data-id="${task.id}" 
                            name="done" ${task.done ? "checked" : ""} 
                            id="${checkbox_id}">
                    <p id="${TASK_P_ID_PREFIX+task.id}"
                            class="task-text ${task.done? "line":""}">
                            ${task.task}
                    </p>
                    <button class="btn btn-delete" 
                            data-id="${task.id}"  
                            name="delete" 
                            id="${button_id}">Delete</button>
                </div>
            </li>`;
}

function addTaskInListHTML(task) {
    taskList.innerHTML += newTask(task);
    addDeleteButtonClicks();
    addCheckboxClicks();
    inputTask.value = "";
}

function removeFromTaskListHTML(taskID) {
    task = document.getElementById(`${TASK_ID_PREFIX + taskID}`);
    task.remove();
}

function handleDelete(e) {
    taskID = e.target.getAttribute("data-id");
    savedTaskList = savedTaskList.filter((task) => task.id != taskID);
    updateLocalStorage();
    removeFromTaskListHTML(taskID);
}

function handleCheckbox(e) {
    checkbox = e.target;
    checked = checkbox.checked
    taskID = e.target.getAttribute("data-id");

    text = document.getElementById(TASK_P_ID_PREFIX+taskID)
    if(checked) 
        text.classList.add('line')
    else
        text.classList.remove('line')
    for (let i = 0; i < savedTaskList.length; i++) {
        if (savedTaskList[i].id == taskID) {
            savedTaskList[i].done = checked;
        }
    }
    updateLocalStorage();
}
