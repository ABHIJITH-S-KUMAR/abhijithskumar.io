const tasksSection = document.getElementById("tasks-section");
const scheduledTasksSection = document.getElementById("scheduled-tasks-section");
const settingsSection = document.getElementById("settings-section");

const tasksBtn = document.getElementById("tasks-btn");
const scheduledTasksBtn = document.getElementById("scheduled-tasks-btn");
const settingsBtn = document.getElementById("settings-btn");

const taskInput = document.getElementById("task-input");
const taskDate = document.getElementById("task-date");
const taskTime = document.getElementById("task-time");
const taskCategory = document.getElementById("task-category");
const addTaskBtn = document.getElementById("add-task-btn");
const workList = document.querySelector(".work-tasks");
const personalList = document.querySelector(".personal-tasks");
const freelanceList = document.querySelector(".freelance-tasks");
const scheduledTaskList = document.getElementById("scheduled-task-list");

const addFilterBtn = document.getElementById("add-filter");
const filterPopup = document.getElementById("filter-popup");
const newFilterInput = document.getElementById("new-filter-name");
const addFilterSubmit = document.getElementById("add-filter-submit");
const sidebarFilters = document.querySelector(".sidebar nav ul");
const taskCategoryDropdown = document.getElementById("task-category");

const colors = ["#f28b82", "#aecbfa", "#ccff90", "#ffd700", "#ffb6c1"];
let colorIndex = 0;

// Navigation between sections
tasksBtn.addEventListener("click", () => {
    tasksSection.style.display = "block";
    scheduledTasksSection.style.display = "none";
    settingsSection.style.display = "none";
});

scheduledTasksBtn.addEventListener("click", () => {
    tasksSection.style.display = "none";
    scheduledTasksSection.style.display = "block";
    settingsSection.style.display = "none";
});

settingsBtn.addEventListener("click", () => {
    tasksSection.style.display = "none";
    scheduledTasksSection.style.display = "none";
    settingsSection.style.display = "block";
});

// Add Task Button Functionality
addTaskBtn.addEventListener("click", () => {
    const task = taskInput.value.trim();
    const date = taskDate.value;
    const time = taskTime.value;
    const category = taskCategory.value;

    if (task && date && time && category) {
        // Check if the task already exists in the scheduled list
        const taskExistsInScheduled = [...scheduledTaskList.children].some(taskItem =>
            taskItem.textContent.includes(task)
        );

        if (taskExistsInScheduled) {
            alert("This task is already added.");
            return;
        }

        // Create task for the Sidebar
        const taskItemSidebar = document.createElement("li");
        taskItemSidebar.textContent = `${task} - ${date} ${time}`;

        const editBtnSidebar = document.createElement("button");
        editBtnSidebar.textContent = "Edit";
        editBtnSidebar.classList.add("edit-btn");

        const completeBtnSidebar = document.createElement("button");
        completeBtnSidebar.textContent = "Complete";
        completeBtnSidebar.classList.add("complete-btn", "button-spacing");

        const deleteBtnSidebar = document.createElement("button");
        deleteBtnSidebar.textContent = "Delete";
        deleteBtnSidebar.classList.add("delete-btn");

        // Append buttons to Sidebar task
        taskItemSidebar.appendChild(editBtnSidebar);
        taskItemSidebar.appendChild(completeBtnSidebar);
        taskItemSidebar.appendChild(deleteBtnSidebar);

        let categoryList = document.querySelector(`.${category}-tasks`);
        if (!categoryList) {
            categoryList = createNewCategoryList(category);
        }
        categoryList.appendChild(taskItemSidebar);

        // Create task for Scheduled Tasks
        const taskItemScheduled = document.createElement("li");
        taskItemScheduled.textContent = `[${category.toUpperCase()}] ${task} - ${date} ${time}`;

        const editBtnScheduled = document.createElement("button");
        editBtnScheduled.textContent = "Edit";
        editBtnScheduled.classList.add("edit-btn");

        const completeBtnScheduled = document.createElement("button");
        completeBtnScheduled.textContent = "Complete";
        completeBtnScheduled.classList.add("complete-btn", "button-spacing");

        const deleteBtnScheduled = document.createElement("button");
        deleteBtnScheduled.textContent = "Delete";
        deleteBtnScheduled.classList.add("delete-btn");

        taskItemScheduled.appendChild(editBtnScheduled);
        taskItemScheduled.appendChild(completeBtnScheduled);
        taskItemScheduled.appendChild(deleteBtnScheduled);
        scheduledTaskList.appendChild(taskItemScheduled);

        // Attach Delete Functionality
        deleteBtnSidebar.addEventListener("click", () => {
            taskItemSidebar.remove();
            taskItemScheduled.remove();
        });

        deleteBtnScheduled.addEventListener("click", () => {
            taskItemScheduled.remove();
            taskItemSidebar.remove();
        });

        // Attach Edit Functionality
        editBtnSidebar.addEventListener("click", () => {
            taskInput.value = task;
            taskDate.value = date;
            taskTime.value = time;
            taskCategory.value = category;
            taskItemSidebar.remove();
            taskItemScheduled.remove();
        });

        editBtnScheduled.addEventListener("click", () => {
            taskInput.value = task;
            taskDate.value = date;
            taskTime.value = time;
            taskCategory.value = category;
            taskItemSidebar.remove();
            taskItemScheduled.remove();
        });

        // Attach Complete/Incomplete Functionality
        completeBtnSidebar.addEventListener("click", () => {
            if (completeBtnSidebar.textContent === "Complete") {
                completeBtnSidebar.textContent = "Incomplete";
                taskItemSidebar.style.textDecoration = "line-through";
            } else {
                completeBtnSidebar.textContent = "Complete";
                taskItemSidebar.style.textDecoration = "none";
            }
        });

        completeBtnScheduled.addEventListener("click", () => {
            if (completeBtnScheduled.textContent === "Complete") {
                completeBtnScheduled.textContent = "Incomplete";
                taskItemScheduled.style.textDecoration = "line-through";
            } else {
                completeBtnScheduled.textContent = "Complete";
                taskItemScheduled.style.textDecoration = "none";
            }
        });

        // Clear Inputs
        taskInput.value = "";
        taskDate.value = "";
        taskTime.value = "";
        taskCategory.value = "";


        // Save to Local Storage
        saveTasks();
    } else {
        alert("Please fill all fields before adding a task.");
    }
});

// Local Storage Functions
function saveTasks() {
    const tasks = [];
    const taskItems = document.querySelectorAll(".task-list li");
    
    taskItems.forEach(item => {
        const taskName = item.textContent.replace("Complete", "").replace("Incomplete", "").trim();
        const isComplete = item.style.textDecoration === "line-through";
        const category = item.closest('ul').classList[0]; // work-tasks, personal-tasks, freelance-tasks
        tasks.push({ taskName, isComplete, category });
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    const savedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (savedTasks) {
        savedTasks.forEach(task => {
            const taskItem = document.createElement("li");
            taskItem.textContent = `${task.taskName} - ${task.category}`;
            if (task.isComplete) {
                taskItem.style.textDecoration = "line-through";
            }
            // Append to respective category
            const categoryList = document.querySelector(`.${task.category}-tasks`);
            categoryList.appendChild(taskItem);
        });
    }
}

// Load tasks when the page is loaded
document.addEventListener("DOMContentLoaded", loadTasks);

// Add Filter Functionality
addFilterSubmit.addEventListener("click", () => {
    const filterName = newFilterInput.value.trim().toLowerCase();

    if (filterName) {
        if (document.querySelector(`.${filterName}-tasks`)) {
            alert("Filter already exists.");
            return;
        }

        // Assign color
        const filterColor = colors[colorIndex % colors.length];
        colorIndex++;

        
        const newFilterItem = document.createElement("li");
        newFilterItem.innerHTML = `<span class="color-circle" style="background-color: ${filterColor}"></span>${filterName}`;
        sidebarFilters.insertBefore(newFilterItem, addFilterBtn);

        // Create task list for new filter
        const newTaskList = createNewCategoryList(filterName);

        // Add filter to dropdown
        const newDropdownOption = document.createElement("option");
        newDropdownOption.value = filterName;
        newDropdownOption.textContent = filterName.charAt(0).toUpperCase() + filterName.slice(1);
        taskCategoryDropdown.appendChild(newDropdownOption);

        
        newFilterInput.value = "";
        filterPopup.classList.add("hidden");
    } else {
        alert("Please enter a filter name.");
    }
});


function createNewCategoryList(category) {
    const categoryList = document.createElement("ul");
    categoryList.classList.add("task-list", `${category}-tasks`);
    const categorySection = document.createElement("li");
    categorySection.innerHTML = `<span class="color-circle" style="background-color: ${
        colors[colorIndex % colors.length]
    }"></span>${category.charAt(0).toUpperCase() + category.slice(1)}`;
    categorySection.appendChild(categoryList);
    sidebarFilters.insertBefore(categorySection, addFilterBtn);
    return categoryList;
}


addFilterBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    filterPopup.classList.toggle("hidden");
});

document.addEventListener("click", (e) => {
    if (!filterPopup.contains(e.target) && e.target !== addFilterBtn) {
        filterPopup.classList.add("hidden");
    }
});
