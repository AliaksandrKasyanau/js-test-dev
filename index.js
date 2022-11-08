window.addEventListener('DOMContentLoaded', function () {
    let addTask = document.getElementById('add-task');
    let taskTitle = document.getElementById('task-title');
    let table = document.getElementById('task-table');
    let completedTable = document.getElementById('completed-task-table');

    let taskList = [];

    addTask.addEventListener('click', function (event) {
        event.preventDefault();
        let task = {
            id: taskList.length + 1,
            title: taskTitle.value,
            done: false
        }
        if (task.title) {
            taskList.push(task)
            taskTitle.value = ''
            updateTable(taskList);
        }
    });

    document.addEventListener('click', function(event) {
        if (Array.from(event.target.classList).includes('fa-trash')) {
            let delete_id = Number(event.target.closest('.delete-button').dataset.id);
            taskList.delete(delete_id);
            updateTable(taskList);
        }

        if (Array.from(event.target.classList).includes('form-check-input')) {
            let checkedId = Number(event.target.dataset.id);
            let task = taskList.find(el => el.id === checkedId);
            task.done = event.target.checked;
            updateTable(taskList);
        }

        if (event.target.closest('#remove-action') !== null && !!event.target.closest('#remove-action').dataset.taskId) {
            let deleteId = Number(event.target.closest('#remove-action').dataset.taskId);
            taskList.splice(taskList.findIndex(el => el.id === deleteId), 1);
            updateTable(taskList);
        }

        if (event.target.closest('#edit-action') !== null && !!event.target.closest('#edit-action').dataset.taskId) {
            let taskId = Number(event.target.closest('#edit-action').dataset.taskId);
            let input = Array.from(document.querySelectorAll(`[data-input-id]`)).find(el => Number(el.dataset.inputId) === taskId);
            let task = taskList.find(el => el.id === taskId)

            input.disabled = false;
            input.focus()
            input.addEventListener('blur', () => {
               if (task.title !== input.value) {
                   task.title = input.value
                   updateTable(taskList)
               }
               input.disabled = true
            })
        }

        if (event.target === document.getElementById('sort-list-button')) {
            updateTable(taskList.sort((a, b) => a.title.localeCompare(b.title)))
        }

        if (event.target === document.getElementById('search-button')) {
            let input = document.getElementById('search-input');
            let searchResult = [];
            taskList.forEach(el => {
                if (el.title.includes(input.value)) {
                    searchResult.push(el)
                }
            })
            if (searchResult.length) {
                if (input.value !== '') {
                    document.querySelector('.search-count').innerText = `Search: ${input.value} Total count: ${searchResult.length}`
                } else {
                    document.querySelector('.search-count').innerText = ''
                }
            } else {
                document.querySelector('.search-count').innerText = `Search: No results`
            }

            updateTable(searchResult)
            input.value = ''
            searchResult = []
        }

    });

    let updateTable = (tasks) => {
        while(table.firstElementChild) table.firstElementChild.parentNode.removeChild(table.firstElementChild);
        let rows = '';
        let completedRows = '';
        tasks.forEach((task) => {
            let done = task.done ? `<span class="badge bg-success">done</span>` : `<span class="badge bg-danger">not-done</span>`;
            let checked = task.done ? `<input type="checkbox" data-id="${task.id}" checked class="form-check-input">`:`<input type="checkbox" data-id="${task.id}" class="form-check-input">`;
            !task.done ? rows += `
            <tr>
            <th scope="row">${task.id}</th>
            <td><input class="task-title" type="text" value="${task.title}" data-input-id="${task.id}" disabled></td>
            <td>
                ${done}
            </td>
            <td>
                ${checked}
                <span class="text-danger delete-button" data-id="${task.id}"><i class="fa fa-trash"></i></span>
            </td>
            <td class="action-icon" id="edit-action" data-task-id="${task.id}"><span><img src="./assets/Vector.svg" alt="Edit Task"></span></td>
            <td class="action-icon" id="remove-action" data-task-id="${task.id}">
            <span>
            <img src="./assets/bx_trash.svg" alt="Remove Task"">
            </span>
            </td>
          </tr>
            ` : completedRows += `
            <tr>
            <th scope="row">${task.id}</th>
            <td class="task-title">${task.title}</td>
            <td>
            <td>
                ${done}
            </td>
            <td>
                ${checked}
                <span class="text-danger delete-button" data-id="${task.id}"><i class="fa fa-trash"></i></span>
            </td>
            <td class="action-icon" id="remove-action" data-task-id="${task.id}"><span><img src="./assets/bx_trash.svg" alt="Remove Task"></span></td>
          </tr>
            `
        });
        table.innerHTML = rows;
        completedTable.innerHTML = completedRows;
    }
});
