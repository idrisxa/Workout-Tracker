const actionBtn = document.getElementById("action-button");
// new item
const makeNote = document.getElementById("make-new");
// clear all items
const clear = document.getElementById("clear-all");
// delete an item
const results = document.getElementById("results");

//const status = document.getElementById("status");

function getResults() {
    clearExercise();
    fetch("/all")
        .then(function(response) {
            if (response.status !== 200) {
                console.log("Looks like there was a problem. Status Code: " + response.status);
                return;
            }
            response.json().then(function(data) {
                newWorkoutPlan(data);
            });
        })
        .catch(function(err) {
            console.log("Fetch Error :-S", err);
        });
}

function newWorkoutPlan(res) {
    for (var i = 0; i < res.length; i++) {
        let data_id = res[i]["_id"];
        let title = res[i]["title"];
        let workoutPlan = document.getElementById("results");
        snippet = `
      <p class="data-entry">
      <span class="dataTitle" data-id=${data_id}>${title}</span>
      <span onClick="delete" class="delete" data-id=${data_id}>x</span>;
      </p>`;
        workoutPlan.insertAdjacentHTML("beforeend", snippet);
    }
}

function clearExercise() {
    const workoutPlan = document.getElementById("results");
    workoutPlan.innerHTML = "";
}

function resetTitleAndExercise() {
    const title = document.getElementById("title");
    title.value = "";
    const exercise = document.getElementById("exercise");
    exercise.value = "";
    const workout = document.getElementById("workout");
    workout.value = "";
}

function updateTitleAndExercise(data) {
    const title = document.getElementById("title");
    title.value = data.title;
    const exercise = document.getElementById("exercise");
    exercise.value = data.exercise;
    const workout = document.getElementById("workout");
    workout.value = data.workout;
}

getResults();

// clear.addEventListener("click", function(e) {
//     if (e.target.matches("#clear-all")) {
//         element = e.target;
//         data_id = element.getAttribute("data-id");
//         fetch("/clearall", {
//                 method: "delete"
//             })
//             .then(function(response) {
//                 if (response.status !== 200) {
//                     console.log("Looks like there was a problem. Status Code: " + response.status);
//                     return;
//                 }
//                 clearTodos();
//             })
//             .catch(function(err) {
//                 console.log("Fetch Error :-S", err);
//             });
//     }
// });

results.addEventListener("click", function(e) {
    if (e.target.matches(".delete")) {
        element = e.target;
        data_id = element.getAttribute("data-id");
        fetch("/delete/" + data_id, {
                method: "delete"
            })
            .then(function(response) {
                if (response.status !== 200) {
                    console.log("Looks like there was a problem. Status Code: " + response.status);
                    return;
                }
                element.parentNode.remove();
                resetTitleAndExercise();
                let newButton = `<button class="btn btn-outline-light" id='make-new'>Submit</button>`;
                actionBtn.innerHTML = newButton;
            })
            .catch(function(err) {
                console.log("Fetch Error :-S", err);
            });
    } else if (e.target.matches(".dataTitle")) {
        element = e.target;
        data_id = element.getAttribute("data-id");
        status.innerText = "Editing"
        fetch("/find/" + data_id, { method: "get" })
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                updateTitleAndExercise(data);
                let newButton = `<button class="btn btn-outline-light" id='updater' data-id=${data_id}>Update</button>`;
                actionBtn.innerHTML = newButton;
            })
            .catch(function(err) {
                console.log("Fetch Error :-S", err);
            });
    }
});

actionBtn.addEventListener("click", function(e) {
    if (e.target.matches("#updater")) {
        updateBtnEl = e.target;
        data_id = updateBtnEl.getAttribute("data-id");
        const title = document.getElementById("title").value;
        const exercise = document.getElementById("exercise").value;
        const workout = document.getElementById("workout").value;
        fetch("/update/" + data_id, {
                method: "post",
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title,
                    exercise,
                    workout
                })
            })
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                element.innerText = title
                resetTitleAndExercise();
                let newButton = `<button class="btn btn-outline-light" id='make-new'>Submit</button>`;
                actionBtn.innerHTML = newButton;
                status.innerText = "Creating"
            })
            .catch(function(err) {
                console.log("Fetch Error :-S", err);
            });
    } else if (e.target.matches("#make-new")) {
        element = e.target;
        data_id = element.getAttribute("data-id");
        fetch("/submit", {
                method: "post",
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: document.getElementById("title").value,
                    exercise: document.getElementById("exercise").value,
                    workout: document.getElementById("workout").value
                })
            })
            .then(res => res.json())
            .then(res => newWorkoutPlan([res]));
        resetTitleAndExercise();
    }
});
