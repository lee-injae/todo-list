document.addEventListener("DOMContentLoaded", () => {
    console.log("loaded")
    displayTodo()
})

function displayTodo(){
    fetch("/todo")
    .then(res => res.json())
    .then(data => {
        console.log(data.items)
        document.getElementById("todo-list").innerHTML = ""
        data.items.forEach(itemObj => {
            const {todo, checked} = itemObj
            makeTodoList(todo, checked)
        })
    })
}

function makeTodoList(todoStr, checkedBool){

    let textDecoration = checkedBool ? "line-through" : "none" 
    let buttonDisplay = checkedBool ? "none" : "inline-block"

    let tempHtml = `
            <li class="list-group-item d-flex justify-content-between align-items-center"
                >
                <span 
                    class="todo-text"
                    id="todo-text"
                    style="text-decoration: ${textDecoration}"
                    >
                    ${todoStr}
                <span>
                <span>
                    <button 
                        class="btn btn-success btn-sm"
                        onclick="checkTodo('${todoStr}')"
                        style="display: ${buttonDisplay}"
                        >
                        Completed
                    </button>
                    <button 
                        class="btn btn-secondary btn-sm"
                        onclick="editTodo(this, '${todoStr}')"
                        style="display: ${buttonDisplay}"
                        >
                        Edit
                    </button>
                    <button 
                        class="btn btn-danger btn-sm"
                        onclick="deleteTodo('${todoStr}')"
                        >
                        Delete
                    </button>
                </span>
            </li>
            `
    document.getElementById("todo-list").innerHTML += tempHtml
}

function postTodo(){
    const todoInput = document.getElementById("todo-input")
    const todoValue = todoInput.value 
    if (!todoValue){
        alert("Pls add todo!")
        return
    }

    const entry = {
        todo_give: todoValue
    }

    fetch("/todo", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(entry) 
    })
    .then(res => res.json())
    .then(data => {
        alert(data.msg)
        todoInput.value = ""
        displayTodo()
    })
    
}

function checkTodo(todoStr){
    const entry = { 
            todo_give: todoStr, 
        }

    fetch("/todo/checked", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(entry)
    })
    .then(res => res.json())
    .then(data => {
        alert(data.msg)
        displayTodo()
    });
}

function editTodo(buttonEl, todoStr){
    let listItem = buttonEl.closest(".list-group-item")
    let todoTextEl = listItem.querySelector("#todo-text")

    let currentText = todoTextEl.textContent 

    todoTextEl.innerHTML = `
        <input type="text"
            id="edit-input" 
            class="edit-input"
            placeholder="${currentText}"
            >
        <button 
            class="btn btn-secondary btn-sm"
            onclick="updateTodo('${todoStr}')""
            type=
            >
            update
        </button>
        <button 
            class="btn btn-warning btn-sm"
            onclick="displayTodo()"
            >
            cancel
            </button>
    `
}

function updateTodo(originalTodoStr){
    const updatedTodoStr = document.getElementById("edit-input").value

    if (!updatedTodoStr) {
        alert("pls write your todo  item!")
        return
    }

    const entry = {
        original_todo_give: originalTodoStr,
        updated_todo_give: updatedTodoStr
    }

    fetch("/todo/edit", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(entry)
    })
    .then(res => res.json())
    .then(data => {
        alert(data.msg)
        displayTodo()
    })
}

function deleteTodo(todoStr){
    let entry = {
        todo_give: todoStr
    }

    fetch("todo/delete", {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(entry)
    })
    .then(res => res.json())
    .then(data => {
        console.log("delete-data", data)
        alert(data.msg)
        displayTodo()
    })
}