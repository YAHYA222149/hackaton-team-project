const tasks = [
    { task: "Wake up", status: true },
    { task: "Brush teeth", status: true },
    { task: "Pray", status: true },
    { task: "Make coffee", status: true },
    { task: "Read 20 pages", status: false },
    { task: "Write journal", status: false },
    { task: "Code 1 hour", status: true },
    { task: "Exercise", status: true },
    { task: "Plan tomorrow", status: false },
    { task: "Sleep before 23:00", status: false }
];

function filterTasks() {
    const filter = document.getElementById("taskFilter").value;

    // Filter tasks based on the selected option
    let filteredTasks;
    if (filter === "done") {
        filteredTasks = tasks.filter(t => t.status);
    } else if (filter === "undone") {
        filteredTasks = tasks.filter(t => !t.status);
    } else {
        filteredTasks = tasks;  // "all" option, show everything
    }

    printTaskList(filteredTasks);
    updateProgressBar(filteredTasks);
    getCompletionStats(filteredTasks);
    getUnfinishedTasks(filteredTasks);
    getStreak(filteredTasks);
}
function printTaskList(filteredTasks) {
            const ul = document.getElementById("taskList");
            ul.innerHTML = ""; 
            for (let i = 0; i < filteredTasks.length; i++) {
                const li = document.createElement("li");
                li.textContent = filteredTasks[i].task;
                li.className = filteredTasks[i].status ? "completed" : "pending";
                ul.appendChild(li);
            }
        }

function updateProgressBar(filteredTasks) {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status).length;
    const percent = Math.round((completed / total) * 100);
    const bar = document.getElementById("progressBar");
    bar.style.width = percent + "%";
    bar.textContent = percent + "%";
}

function   getCompletionStats(filteredTasks){
    console.log("the summary list task")
    let total = 0;
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].status === true) {
            total = total + 1;
        }
    }
    console.log("tasks completed are ", total, "/", tasks.length, " ", total * 10, "%")
}

function getUnfinishedTasks(filteredTasks) {
    console.log("the unfinished  list task:")
    const uncompleted = [];
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].status === false) {
            uncompleted.push(tasks[i].task);
        }
    }
    for (let i = 0; i < uncompleted.length; i++) {
        console.log(uncompleted[i]);
    }
}

function getStreak(filteredTasks){
    let count = 0;
    const streaks = [];
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].status === true) {
            count++;
        } else {
            if (count > 0) {
                streaks.push(count);
                count = 0;
            }
        }
    }
    if (count > 0) {
        streaks.push(count);
    }
    if (streaks.length > 0) {
        const maxStreak = Math.max(...streaks);
        console.log("Longest streak of completed tasks:", maxStreak);
    }
}

printTaskList();
getCompletionStats();
getUnfinishedTasks();
getStreak();