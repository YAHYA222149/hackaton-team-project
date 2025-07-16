const tasks = [
    "Wake up",
    "Brush teeth",
    "Pray",
    "Make coffee",
    "Read 20 pages",
    "Write journal",
    "Code 1 hour",
    "Exercise",
    "Plan tomorrow",
    "Sleep before 23:00"];
const state = [
    true,
    true,
    true,
    true,
    false,
    false,
    true,
    true,
    false,
    false];
  
function printTaskList() {
    console.log("the full list task")
    for (let Y = 0; Y < 10; Y++) {

        if (state[Y] === true) {
            console.log("✔", tasks[Y]);
        } else {
            console.log("X", tasks[Y]);
        }
    }

};
let total = 0
function getCompletionStats() {
        console.log("the summary list task")

    for (let Y = 0; Y < 10; Y++) {

        if (state[Y] === true) {
            total = total + 1;

        }
    }
    console.log("tasks completed are ", total,"/10 ", total * 10, "%")
}
const uncompleted = [];
function getUnfinishedTasks() {
        console.log("the unfinished  list task:")

    for (let Y = 0; Y < 10; Y++) {
        if (state[Y] === false) {
            uncompleted.push(tasks[Y]);
        }
    }

    for (let Y = 0; Y < uncompleted.length; Y++) {
        console.log(uncompleted[Y]);
    }
}

function getStreak() {

    let count = 0;
    const streaks = [];

    for (let Y = 0; Y < state.length; Y++) {
        if (state[Y] === true) {
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
