const form = document.getElementById("taskForm");
const input = document.getElementById("taskInput");
const list = document.getElementById("taskList");
const error = document.getElementById("error");

// функция с параметром ✅
function createTask(taskText) {
    const li = document.createElement("li");
    li.textContent = taskText;

    // кнопка удалить
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "X";

    deleteBtn.addEventListener("click", () => {
        li.remove();
    });

    // отметить как выполнено
    li.addEventListener("click", () => {
        li.classList.toggle("done");
    });

    li.appendChild(deleteBtn);
    list.appendChild(li);
}

form.addEventListener("submit", function(e) {
    e.preventDefault();

    try {
        // if / else + validation ✅
        if (input.value.trim() === "") {
            error.textContent = "Lauks nedrīkst būt tukšs!";
        } else {
            error.textContent = "";
            createTask(input.value);
            input.value = "";
        }
    } catch (err) {
        error.textContent = "Radās kļūda!";
    }
});
