const listsContainter = document.querySelector('[data-lists]')
const listForm = document.querySelector('[data-list-form]')
const listInput = document.querySelector('[data-list-input]')
const deleteListBtn = document.querySelector('#deleteListBtn')
const clearTaskBtn = document.querySelector('#clearTaskBtn')

const taskDisplayContainer = document.querySelector('[data-task-display-container]')
const taskTitle = document.querySelector('[data-task-title]')
const taskCount = document.querySelector('[data-task-count]')
const taskList = document.querySelector('[data-task-list]')

const newTaskForm = document.querySelector('[data-new-task-form]')
const newTaskInput = document.querySelector('[data-newtask-input]')

const LOCAL_STORAGE_LIST_KEY = 'task.lists'
const LOCAL_STORAGE_SELECTED_LIST_KEY = 'task.selectedListId'



let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || []
let selectedListId =  localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_KEY)

listsContainter.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'li'){
        selectedListId = e.target.dataset.listId
        console.log(selectedListId)
        saveAndRender()
    }
})


taskList.addEventListener('click', e => {
    const selectedList = lists.find((list) => list.id === selectedListId)
    if (e.target.tagName.toLowerCase() === 'input'){
        const selectedTask = selectedList.tasks.find((task) => task.id === e.target.id)
        selectedTask.complete = e.target.checked;
      
        save()
        renderTaskCount(selectedList)
    }
    if (e.target.classList[0] == 'deleteTask') {
        const item = e.target.previousSibling.previousSibling
        const selectedTask = selectedList.tasks.find((task) => task.id === item.id)
        selectedList.tasks = selectedList.tasks.filter(task => task.id !== selectedTask.id)
        saveAndRender()
        console.log(selectedList.tasks)
    }
   
})

clearTaskBtn.addEventListener('click', (e) => {
    const selectedList = lists.find((list) => list.id === selectedListId)
    selectedList.tasks = selectedList.tasks.filter(task => task.complete !== true)
    saveAndRender()
})



deleteListBtn.addEventListener('click', (e) => {
    lists = lists.filter((list) => list.id !== selectedListId)
    selectedListId = null
    saveAndRender()
})

listForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (listInput.value == null || listInput.value == '') {
        listInput.classList.add('error')
        setTimeout(() => {
            listInput.classList.remove('error')
        }, 1500)
        return
    }
    const list = createList(listInput.value)
    listInput.value = null
    lists.push(list)
    saveAndRender()
})

newTaskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (newTaskInput.value == null || newTaskInput.value  == '') {
        newTaskInput.classList.add('error')
        setTimeout(() => {
            newTaskInput.classList.remove('error')
        }, 1500)
        return
    }
    const task = createTask(newTaskInput.value)
    newTaskInput.value = null
    const selectedList = lists.find(list => list.id === selectedListId)
    selectedList.tasks.push(task)
    saveAndRender()
})



const createList = (name) => {
   return { id: Date.now().toString(), name: name, date: new Date().toDateString(), tasks: []}
}

const createTask = (name) => {
    return { id: Date.now().toString(), name: name, complete: false}
}

const saveAndRender = () => {
    save()
    render()
}

const save = () => {
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists))
    localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_KEY, selectedListId)
}

const render = () => {
    clearElement(listsContainter)
    renderList()
    const selectedList = lists.find(list => list.id === selectedListId)

    if (selectedListId == null) {
        taskDisplayContainer.style.display = 'none'
    }
    else {
        taskDisplayContainer.style.display = ''
        taskTitle.innerText = selectedList.name
        renderTaskCount(selectedList)
        clearElement(taskList)
        renderTasks(selectedList)
    }
    
}

{/* <div class="task">
<input type="checkbox" id="task-1">
<label for="task-1">
    <span class="customCheckbox"></span>
    Record todo list video
</label>
<button class="deleteTask">—</button>
</div> */}

const renderTasks = (selectedList) => {
    selectedList.tasks.forEach((task) => {
       const taskContainer = document.createElement('div')
       taskContainer.classList.add('task')

       const taskCheckbox = document.createElement('input')
       taskCheckbox.setAttribute("type", "checkbox")
       taskCheckbox.id = task.id
       taskContainer.appendChild(taskCheckbox)
       taskCheckbox.checked = task.complete

       const taskLabel = document.createElement('label')
       taskLabel.htmlFor = task.id
       taskContainer.appendChild(taskLabel)

       const taskSpan = document.createElement('span')
       taskSpan.classList.add('customCheckbox')
       taskLabel.innerHTML = task.name;
       taskLabel.appendChild(taskSpan)

       const removeTaskButton = document.createElement('button')
       removeTaskButton.classList.add('deleteTask')
       removeTaskButton.innerHTML = '—'
       taskContainer.appendChild(removeTaskButton)

       taskList.appendChild(taskContainer)
    })
}

const renderTaskCount = (selectedList) => {
    const incompleteTasksCount = selectedList.tasks.filter((task) => !task.complete).length
    const taskString = incompleteTasksCount === 1 ? 'task' : 'tasks'
    taskCount.innerText = `${incompleteTasksCount} ${taskString} remaining`
}

const renderList = () => {
    lists.forEach( (list) => {
        const listElement = document.createElement('li');
        listElement.dataset.listId = list.id;
        listElement.classList.add('listItem');
        listElement.innerText = list.name;
        const listDate = document.createElement('span')
        listDate.classList.add('listDate');
        listDate.innerHTML = '</br>' + list.date;
        if (list.id === selectedListId){
            listElement.classList.add('selectedList')
        }
        listElement.appendChild(listDate)
        listsContainter.appendChild(listElement);
    })
}

const clearElement = (element) => {
    while (element.firstChild) {
        element.removeChild(element.firstChild)
    }
}

render()