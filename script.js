const form = document.getElementById("taskForm");
const input = document.getElementById("taskInput");
const dateInput = document.getElementById("dateInput");
const prioritySelect = document.getElementById("prioritySelect");
const categorySelect = document.getElementById("categorySelect");
const list = document.getElementById("taskList");
const error = document.getElementById("error");
const filterButtons = document.querySelectorAll(".filter-btn");
const clearBtn = document.getElementById("clearBtn");
const totalTasksSpan = document.getElementById("totalTasks");
const completedTasksSpan = document.getElementById("completedTasks");

let currentFilter = "all";
let tasks = [];

// Funkcija uzdevuma izveidošanai ar paplašinātiem parametriem
function createTask(taskData) {
    const { text, date = "", priority = "medium", category = "other", completed = false, id = Date.now() } = taskData;
    
    const li = document.createElement("li");
    li.className = completed ? "task done" : "task";
    li.dataset.id = id;
    li.dataset.priority = priority;
    li.dataset.category = category;
    li.dataset.completed = completed;

    // Prioritātes ikona
    const priorityEmoji = { low: "🟢", medium: "🟡", high: "🔴" };
    
    // Kategorijas ikona
    const categoryEmoji = { 
        homework: "📖", 
        study: "📝", 
        sports: "⚽", 
        other: "📌" 
    };

    const taskInfo = document.createElement("div");
    taskInfo.className = "task-info";
    
    const taskContent = document.createElement("span");
    taskContent.className = "task-content";
    taskContent.innerHTML = `
        <span class="priority">${priorityEmoji[priority]}</span>
        <span class="category">${categoryEmoji[category]}</span>
        <span class="text">${text}</span>
        ${date ? `<span class="date">📅 ${date}</span>` : ""}
    `;

    // Vadības pogas
    const buttonGroup = document.createElement("div");
    buttonGroup.className = "button-group";

    const completeBtn = document.createElement("button");
    completeBtn.className = "complete-btn";
    completeBtn.textContent = completed ? "↩️" : "✓";
    completeBtn.title = completed ? "Atgriezt" : "Izpildīts";
    
    completeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleTaskComplete(id);
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "✕";
    deleteBtn.title = "Dzēst";
    
    deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        deleteTask(id);
    });

    buttonGroup.appendChild(completeBtn);
    buttonGroup.appendChild(deleteBtn);

    taskInfo.appendChild(taskContent);
    taskInfo.appendChild(buttonGroup);
    li.appendChild(taskInfo);
    
    return { element: li, id };
}

// Uzdevumu renderēšana ar filtrēšanu
function renderTasks(filter = "all") {
    list.innerHTML = "";
    
    const filteredTasks = tasks.filter(task => {
        if (filter === "completed") return task.completed;
        if (filter === "pending") return !task.completed;
        if (filter === "high") return task.priority === "high" && !task.completed;
        return true;
    });

    if (filteredTasks.length === 0) {
        const emptyMsg = document.createElement("li");
        emptyMsg.className = "empty-message";
        emptyMsg.textContent = "Nav uzdevumu!";
        list.appendChild(emptyMsg);
    } else {
        filteredTasks.forEach(task => {
            const { element } = createTask(task);
            list.appendChild(element);
        });
    }

    updateStats();
}

// Statistikas atjaunošana
function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    totalTasksSpan.textContent = total;
    completedTasksSpan.textContent = completed;
}

// Uzdevuma statusa pārslēgšana
function toggleTaskComplete(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks(currentFilter);
    }
}

// Uzdevuma dzēšana
function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks(currentFilter);
}

// Visu uzdevumu izdzēšana
function clearAllTasks() {
    if (tasks.length === 0) return;
    if (confirm("Jūs tiešām vēlaties dzēst VISUS uzdevumus?")) {
        tasks = [];
        saveTasks();
        renderTasks(currentFilter);
    }
}

// Formas apstrāde
form.addEventListener("submit", function(e) {
    e.preventDefault();

    try {
        if (input.value.trim() === "") {
            error.textContent = "❌ Lauks nedrīkst būt tukšs!";
            return;
        }

        // Noklusējuma datuma iestatīšana uz šodienu, ja nav izvēlēts
        const selectedDate = dateInput.value || new Date().toISOString().split('T')[0];

        const newTask = {
            id: Date.now(),
            text: input.value.trim(),
            date: selectedDate,
            priority: prioritySelect.value,
            category: categorySelect.value,
            completed: false
        };

        tasks.push(newTask);
        error.textContent = "";
        
        saveTasks();
        renderTasks(currentFilter);
        
        input.value = "";
        dateInput.value = "";
        prioritySelect.value = "medium";
        categorySelect.value = "other";
    } catch (err) {
        error.textContent = "❌ Radās kļūda!";
        console.error(err);
    }
});

// Filtrēšana
filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        filterButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentFilter = btn.dataset.filter;
        renderTasks(currentFilter);
    });
});

// Visu dzēšana
clearBtn.addEventListener("click", clearAllTasks);

// Saglabāšana localStorage
function saveTasks() {
    localStorage.setItem("studentTasks", JSON.stringify(tasks));
}

// Ielāde no localStorage palaišanas laikā
window.addEventListener("load", function() {
    try {
        const savedTasks = JSON.parse(localStorage.getItem("studentTasks")) || [];
        tasks = savedTasks;
        renderTasks(currentFilter);
    } catch (err) {
        console.error("Kļūda ielādējot uzdevumus:", err);
        tasks = [];
    }
});