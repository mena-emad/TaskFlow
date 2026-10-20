
const form = document.querySelector("#taskForm");
const titleInput = document.querySelector("#task-name");
const categoryInput = document.querySelector("#category");
const dueDateInput = document.querySelector("#due-date");

const searchInput = document.querySelector("#Search");
const display = document.querySelector("#displayTasks");
const filterButtons = document.querySelectorAll("[data-filter]");

const totalCount = document.querySelector("#totalCount");
const activeCount = document.querySelector("#activeCount");
const completedCount = document.querySelector("#completedCount");

const visibleCount = document.querySelector("#visibleCount");
const allFilterCount = document.querySelector("#allFilterCount");
const activeFilterCount = document.querySelector("#activeFilterCount");
const completedFilterCount = document.querySelector("#completedFilterCount");

const STORAGE_KEY = "tasks";

let tasks = loadLocalStorage();
let currentFilter = "all";
let currentSearch = "";

/* =========================
   Local Storage
========================= */

function saveToLocalStorage(tasksToSave) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasksToSave));
        tasks = tasksToSave;
        return true;
    } catch (error) {
        console.error("Could not save tasks:", error);
        return false;
    }
}

function loadLocalStorage() {
    try {
        const savedTasks = JSON.parse(localStorage.getItem(STORAGE_KEY));

        if (!Array.isArray(savedTasks)) {
            return [];
        }

        // Ignore malformed entries rather than breaking the entire UI.
        return savedTasks.filter(task =>
            task &&
            typeof task.id === "string" &&
            typeof task.title === "string" &&
            typeof task.completed === "boolean"
        );
    } catch (error) {
        console.error("Could not load tasks:", error);
        return [];
    }
}

/* =========================
   Task CRUD
========================= */

function addTask(taskObject) {
    const updatedTasks = [...loadLocalStorage(), taskObject];

    if (!saveToLocalStorage(updatedTasks)) {
        return false;
    }

    return true;
}

function updateTask(taskId, changes) {
    const currentTasks = loadLocalStorage();

    const updatedTasks = currentTasks.map(task =>
        task.id === taskId
            ? { ...task, ...changes, id: task.id }
            : task
    );

    if (!saveToLocalStorage(updatedTasks)) {
        return false;
    }

    return true;
}

function toggleTask(taskId) {
    const task = loadLocalStorage().find(item => item.id === taskId);

    if (!task) {
        return false;
    }

    return updateTask(taskId, {
        completed: !task.completed
    });
}

function deleteTask(taskId) {
    const currentTasks = loadLocalStorage();
    const updatedTasks = currentTasks.filter(task => task.id !== taskId);

    if (updatedTasks.length === currentTasks.length) {
        return false;
    }

    return saveToLocalStorage(updatedTasks);
}

/* =========================
   Filtering & Searching
========================= */

function getVisibleTasks() {
    const keyword = currentSearch.trim().toLowerCase();

    return tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(keyword);

        const matchesFilter =
            currentFilter === "all" ||
            (currentFilter === "active" && !task.completed) ||
            (currentFilter === "completed" && task.completed);

        return matchesSearch && matchesFilter;
    });
}

/* =========================
   Task Element Creation
========================= */

function formatDueDate(dateString) {
    if (!dateString) {
        return "No due date";
    }

    // Parse as local date to avoid timezone shifts.
    const date = new Date(`${dateString}T00:00:00`);

    if (Number.isNaN(date.getTime())) {
        return "Invalid date";
    }

    return new Intl.DateTimeFormat("en", {
        day: "numeric",
        month: "short",
        year: "numeric"
    }).format(date);
}

function getDueDateClass(task) {
    if (!task.dueDate || task.completed) {
        return "";
    }

    // ISO date strings in YYYY-MM-DD format can be compared directly.
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const todayString = `${year}-${month}-${day}`;

    if (task.dueDate < todayString) {
        return "overdue";
    }

    if (task.dueDate === todayString) {
        return "due-today";
    }

    return "";
}

function createTaskElement(task) {
    const article = document.createElement("article");
    article.className = `task${task.completed ? " completed" : ""}`;
    article.dataset.id = task.id;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-checkbox";
    checkbox.checked = task.completed;
    checkbox.dataset.action = "toggle";
    checkbox.setAttribute(
        "aria-label",
        `Mark ${task.title} as ${task.completed ? "active" : "completed"}`
    );

    const content = document.createElement("div");
    content.className = "task-content";

    const title = document.createElement("span");
    title.className = "task-title";
    title.textContent = task.title;

    const meta = document.createElement("div");
    meta.className = "task-meta";

    const category = document.createElement("span");
    category.className = "category-tag";
    category.dataset.category = task.category || "Other";
    category.textContent = task.category || "Other";

    const date = document.createElement("span");
    date.className = "task-date";

    if (task.dueDate) {
        date.textContent = `Due ${formatDueDate(task.dueDate)}`;

        const dateClass = getDueDateClass(task);

        if (dateClass) {
            date.classList.add(dateClass);
        }
    } else {
        date.textContent = "No due date";
    }

    meta.append(category, date);
    content.append(title, meta);

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete";
    deleteButton.dataset.action = "delete";
    deleteButton.textContent = "Delete";
    deleteButton.setAttribute("aria-label", `Delete ${task.title}`);

    article.append(checkbox, content, deleteButton);

    return article;
}

/* =========================
   Empty State
========================= */

function createEmptyState() {
    const container = document.createElement("div");
    container.className = "empty-state";

    const icon = document.createElement("div");
    icon.className = "empty-icon";
    icon.textContent = currentSearch ? "⌕" : "✦";

    const title = document.createElement("h3");
    const description = document.createElement("p");

    if (currentSearch) {
        title.textContent = "No matching tasks";
        description.textContent =
            "Try another keyword or change your filters.";
    } else if (currentFilter === "active") {
        title.textContent = "All caught up!";
        description.textContent =
            "There are no active tasks right now. Enjoy the progress you've made.";
    } else if (currentFilter === "completed") {
        title.textContent = "Nothing completed yet";
        description.textContent =
            "Finish a task and it will appear here.";
    } else {
        title.textContent = "Your space is ready";
        description.textContent =
            "Add your first task above and start making progress.";
    }

    container.append(icon, title, description);

    return container;
}

/* =========================
   Statistics & Filters
========================= */

function updateStatistics() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const active = total - completed;

    totalCount.textContent = total;
    activeCount.textContent = active;
    completedCount.textContent = completed;

    allFilterCount.textContent = total;
    activeFilterCount.textContent = active;
    completedFilterCount.textContent = completed;

    const visible = getVisibleTasks().length;
    visibleCount.textContent = `${visible} ${visible === 1 ? "task" : "tasks"}`;
}

function updateFilterButtons() {
    filterButtons.forEach(button => {
        const isActive = button.dataset.filter === currentFilter;

        button.classList.toggle("active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
    });
}

/* =========================
   Render
========================= */

function displayTasks() {
    // Always use the latest persisted data.
    tasks = loadLocalStorage();

    const visibleTasks = getVisibleTasks();
    const fragment = document.createDocumentFragment();

    if (visibleTasks.length === 0) {
        fragment.append(createEmptyState());
    } else {
        visibleTasks.forEach(task => {
            fragment.append(createTaskElement(task));
        });
    }

    display.replaceChildren(fragment);

    updateStatistics();
    updateFilterButtons();
}

/* =========================
   Form Events
========================= */

form.addEventListener("submit", event => {
    event.preventDefault();

    const title = titleInput.value.trim();

    if (!title) {
        titleInput.focus();
        return;
    }

    const task = {
        id: crypto.randomUUID(),
        title,
        category: categoryInput.value,
        dueDate: dueDateInput.value,
        completed: false
    };

    if (!addTask(task)) {
        alert("Could not save your task. Check your browser storage.");
        return;
    }

    form.reset();

    // Restore the preferred default category after resetting.
    categoryInput.value = "Study";

    currentFilter = "all";
    currentSearch = "";
    searchInput.value = "";

    displayTasks();
    titleInput.focus();
});

/* =========================
   Search Event
========================= */

searchInput.addEventListener("input", event => {
    currentSearch = event.target.value;
    displayTasks();
});

/* =========================
   Filter Events
========================= */

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        currentFilter = button.dataset.filter;
        displayTasks();
    });
});

/* =========================
   Task List Events
   Event Delegation
========================= */

display.addEventListener("change", event => {
    const checkbox = event.target.closest(
        'input[data-action="toggle"]'
    );

    if (!checkbox) {
        return;
    }

    const taskElement = checkbox.closest(".task");

    if (!taskElement) {
        return;
    }

    const taskId = taskElement.dataset.id;
    const isChecked = checkbox.checked;

    // Read the current state and persist the intended value.
    if (!updateTask(taskId, { completed: isChecked })) {
        alert("Could not update this task. Please try again.");
    }

    displayTasks();
});

display.addEventListener("click", event => {
    const deleteButton = event.target.closest(
        'button[data-action="delete"]'
    );

    if (!deleteButton) {
        return;
    }

    const taskElement = deleteButton.closest(".task");

    if (!taskElement) {
        return;
    }

    const taskId = taskElement.dataset.id;

    if (!deleteTask(taskId)) {
        alert("Could not delete this task. Please try again.");
        return;
    }

    displayTasks();
});

/* =========================
   Initial Render
========================= */

displayTasks();
