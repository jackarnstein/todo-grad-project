var todoList = document.getElementById("todo-list");
var todoListPlaceholder = document.getElementById("todo-list-placeholder");
var form = document.getElementById("todo-form");
var todoTitle = document.getElementById("new-todo");
var error = document.getElementById("error");
var toComplete = document.getElementById("count-label");
var filterBar = document.getElementById("filters");
var complete = document.createElement("button");
var allButton = document.createElement("button");
var incomplete = document.createElement("button");
var deleteAllButton = document.createElement("button");


var allButtonPlaceholder = document.getElementById("allButton");
var completeButtonPlaceholder = document.getElementById("completeButton");
var incompletePlaceholder = document.getElementById("incompleteButton");
var deleteCompletedPlaceholder = document.getElementById("deleteCompletedButton");


var sortingMethod = null;
var clearList = false;

var app = angular.module("myApp", []);


form.onsubmit = function(event) {
    var title = todoTitle.value;
    createTodo(title, function() {
        reloadTodoList();
    });
    todoTitle.value = "";
    event.preventDefault();
};

function createTodo(title, callback) {
    fetch("/api/todo", {
        method: "post",
        headers: {
            "Content-type": "application/json"
        },
        body: (JSON.stringify({
            title: title,
            isComplete: false
        }))
    })
        .then(function (data) {
            console.log("Request succeeded with JSON response", data);
            reloadTodoList();
            if (data.status === 201) {
                console.log("Request succeeded with JSON response", data);
            }
            else {
                error.textContent = "Failed to create item. Server returned ";
                error.textContent += data.status + " - " + data.statusText;
            }
        })
        .catch(function (err) {
            console.log("Request failed", error);
            error.textContent = "Failed to create item. Server returned ";
            error.textContent += err.status + " - " + err.statusText;
        });
}

function getTodoList(callback) {
    fetch("/api/todo")
        .then(
        function(response) {
            if (response.status !== 200) {
                error.textContent = "Failed to get list. Server returned ";
                error.textContent += response.status + " - " + response.statusText;
                return;
            }

            // Examine the text in the response
            response.json().then(function(data) {
                console.log(data);
                callback(data);
            });
        }
    )
        .catch(function(err) {
            console.log("Fetch Error :-S", err);
        });
}

function reloadTodoList() {
    while (todoList.firstChild) {
        todoList.removeChild(todoList.firstChild);
    }
    //magic number to count the number of elements
    var completed  = 0;
    todoListPlaceholder.style.display = "block";
    todoList.className = "todoList";
    getTodoList(function(todos) {
        todoListPlaceholder.style.display = "none";
        todos.forEach(function(todo) {
            if (todo.isComplete) {
                completed++;
            }
            if (todo.isComplete === sortingMethod || sortingMethod === null) {
                var listItem = document.createElement("li");
                listItem.className = "list-group";
                listItem.textContent = todo.title;
                if (!todo.isComplete) {
                    listItem.className = "active";
                }
                else {
                    listItem.className = "inactive";
                }
                var deleteButton = document.createElement("button");
                deleteButton.innerText = ("Delete");
                deleteButton.setAttribute("id", todo.id);
                deleteButton.setAttribute("value", todo.id);
                deleteButton.className = "leftButton";
                deleteButton.onclick = clickDeleteButton;
                listItem.appendChild(deleteButton);

                if (!todo.isComplete) {
                    var finishButton = document.createElement("button");
                    finishButton.setAttribute("value", todo.id);
                    finishButton.innerText = ("Finish");
                    finishButton.className = "rightButton";
                    listItem.appendChild(finishButton);
                    finishButton.onclick = clickFinishButton;
                }
                else {
                    var undoButton = document.createElement("button");
                    undoButton.setAttribute("value", todo.id);
                    undoButton.innerText = ("Undo");
                    undoButton.className = "rightButton";
                    listItem.appendChild(undoButton);
                    undoButton.onclick = clickFinishButton;
                }
                var editButton = document.createElement("button");
                editButton.innerText = ("Edit");
                editButton.className = "rightButton";
                editButton.setAttribute("value", todo.id);
                listItem.appendChild(editButton);
                editButton.onclick = clickEditButton;
                todoList.appendChild(listItem);
            }
            var update = document.getElementById("progress-bar");
            update.style.width = (completed / todos.length) * 100 + '%';
        });

        if (completed !== 0) {
            deleteAllButton.onclick = clickDeleteAllButton;
            deleteAllButton.innerText = ("Delete Completed");
            deleteAllButton.className = deleteAllButton;
            deleteCompletedPlaceholder.appendChild(deleteAllButton);
            filterBar.appendChild(deleteCompletedPlaceholder);
        }
        if(completed === 0 && filterBar.childElementCount != 4)
        {
                filterBar.removeChild(deleteCompletedPlaceholder);
        }

        toComplete = todos.length - completed;
        complete.innerText = ("Completed (" + completed + ")");
        incomplete.innerText = ("Incomplete (" + toComplete + ")");
        allButton.innerText = ("All (" + todos.length +")");
    });
    //setTimeout(reloadTodoList,3000);
}

function makeBar() {
    allButton.innerText = ("All");
    allButton.setAttribute("value", "0");
    allButton.onclick = reSort;
    allButton.className = "filterButton";
    allButtonPlaceholder.appendChild(allButton);
    filterBar.appendChild(allButtonPlaceholder);

    complete.innerText = ("Completed" + toComplete);
    complete.setAttribute("value", "2");
    complete.onclick = reSort;
    complete.className = "filterButton";
    completeButtonPlaceholder.appendChild(complete);
    filterBar.appendChild(completeButtonPlaceholder);

    incomplete.innerText = ("Incomplete");
    incomplete.setAttribute("value", "1");
    incomplete.onclick = reSort;
    incomplete.className = "filterButton";
    incompletePlaceholder.appendChild(incomplete);
    filterBar.appendChild(incompletePlaceholder);

}

function reSort() {
    var value = this.getAttribute("value");
    if (value === "0") {
        sortingMethod = null;
    }
    else if (value === "1") {
        sortingMethod = false;
    }
    else {
        sortingMethod = true;
    }
    reloadTodoList();
}

function clickDeleteButton() {
    fetch("/api/todo/"  + this.value, {
        method: "delete"
    })
        .then(function (data) {
            console.log("Request succeeded with JSON response", data);
            reloadTodoList();
        })
        .catch(function (error) {
            console.log("Request failed", error);
        });

}

function clickEditButton() {
    var input = window.prompt("Please enter Update", "Input");

    while (input === null || input === "") {
        input = window.prompt("Please enter a valid Update", "Input");
    }
}

function clickDeleteAllButton() {
    getTodoList(function(todos) {
        todos.forEach(function(todo) {
            if (todo.isComplete) {
                fetch("/api/todo/"  + todo.id, {
                    method: "delete"
                })
                    .then(function (data) {
                        console.log("Request succeeded with JSON response", data);
                    })
                    .catch(function (error) {
                        console.log("Request failed", error);
                    });
            }
        });
        reloadTodoList();
    });
}

function clickFinishButton() {
    fetch("/api/todo/" + this.value, {
        method: "put"
    })
        .then(function (data) {
            console.log("Request succeeded with JSON response", data);
            reloadTodoList();
        })
        .catch(function (error) {
            console.log("Request failed", error);
        });
}

reloadTodoList();
makeBar();
//setTimeout(function() {
  //  setTimeout(reloadTodoList, 3000);
//});
