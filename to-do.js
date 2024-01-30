// Navigera lättast genom att hålla ner Ctrl och klicka på functionen/variabeln du vill gå till

const tasks = document.querySelector('#tasks')
const updateBtn = document.querySelector('#createChange')
const upToTopBtn = document.querySelector('#goToTopBtn')
const ulForTasks = document.querySelector('#ulForTasks')
const createButton = document.querySelector('#create')
const deleteButton = document.querySelectorAll('.deleteButton')
const createTaskBox = document.querySelector('#createTask')
const textfieldTask = document.querySelector('#textfieldTask')
const linksInNavbar = document.querySelector('#ulLinks')
const btnToCreateTask = document.querySelector('#btnToCreateTask')
let idNumber = document.querySelector('#id')
let prioValue = document.querySelector('input[name="prio"]:checked')
let prioRadioChecked = document.querySelector(
  'input[name="prioRadioChangeBox"]:checked'
).value
let textfieldTaskChange = document.querySelector('#textfieldTaskChange')

tasks.addEventListener('click', saveIdnumberOrErase)
tasks.addEventListener('click', onClickMarkTaskAsDone)
tasks.addEventListener('click', PutValuesInChangeBox)
idNumber.addEventListener('input', onInputEnableBtn)
updateBtn.addEventListener('click', onClickUpdateTask)
upToTopBtn.addEventListener('click', onClickScrollToTop)
createButton.addEventListener('click', onClickPostTask)
textfieldTask.addEventListener('input', onTextInputCreateTask)
btnToCreateTask.addEventListener('click', onClickScroll)

idNumber.value = ''
textfieldTask.value = ''
updateBtn.disabled = true
createButton.disabled = true
textfieldTaskChange.value = ''

init()

// Vid klick på "Up"- knapp (längst ner på sidan) scroll up till toppen

function onClickScrollToTop() {
  linksInNavbar.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

// Rutan Create Task. Gör knappen enabled vid input

function onTextInputCreateTask() {
  if (textfieldTask.value === '') {
    createButton.disabled = true
  } else {
    createButton.disabled = false
  }
}

// Vid klick sker POST-anrop. Ny task läggs till i listan och funtionen
// Display task ritar ut den så den dyker upp direkt i listan.

function onClickPostTask() {
  prioValue = document.querySelector('input[name="prio"]:checked')

  fetch('https://api.todoist.com/rest/v2/tasks', {
    body: JSON.stringify({
      content: textfieldTask.value,
      priority: prioValue.value,
    }),
    headers: {
      Authorization: 'Bearer ff4ab5d15ba8770be9e878bf5c6c05b67e7446e6',
      'Content-Type': 'application/json',
    },
    method: 'POST',
  })
    .then((response) => response.json())
    .then((result) => {
      console.log(result.priority)
      displayTask(result.content, result.priority, result.id)
      registerTasksBtn()
    })

  textfieldTask.value = ''
  createButton.disabled = true
}

// Vid klick på knappen Create task scrollas man ner till diven för Create task

function onClickScroll() {
  btnToCreateTask.addEventListener('click', function () {
    createTaskBox.scrollIntoView({ behavior: 'smooth', block: 'center' })
  })
}

// Ritar ut ny task och lägger till i listan.

function displayTask(content, priority, id) {
  ulForTasks.innerHTML += `<li id = 'newTask'>
  <span id = 'flexContainerContentPriority'>
  <p id = 'contentP-element' class = 'getValue'>${content}</p>
  <p id = 'priorityP-element' class = 'getValue'>${priority}</p>
  </span>
  <p class = 'getValue' id = 'idDisplayNone'>${id}</p>
  <span class = 'EraseChangeButtons'>
  <input class = 'deleteButton' type = 'button' value = 'Delete'>
  <input class = 'changeButton' type = 'button' value = 'Update'>
  </span></li>`

  getStoredtextDecoration()
}

//Vid event, leta upp vilken delete-knapp som klickats på
// Gör DELETE-anrop.
// Ta bort Task från listan med en gång, innan man uppdaterar sidan

function deleteTask(event) {
  const targetId = event.target

  if (targetId.classList.contains('deleteButton')) {
    const findnewTaskDiv = targetId.closest('#newTask')
    const idNumberToDelete =
      findnewTaskDiv.querySelector('#idDisplayNone').textContent

    console.log(idNumberToDelete)

    fetch(`https://api.todoist.com/rest/v2/tasks/${idNumberToDelete}`, {
      headers: {
        Authorization: 'Bearer ff4ab5d15ba8770be9e878bf5c6c05b67e7446e6',
      },
      method: 'DELETE',
    }).then((response) => {
      console.log(response)
    })
    findnewTaskDiv.remove()
  }
}

// Jämför sparat idnummer med listan av tasks -
// vid match sätt textdekoration, backgrundfärg och disabled button

function getStoredtextDecoration() {
  const divnewTasks = document.querySelectorAll('#newTask')

  let idArray = JSON.parse(localStorage.getItem('id')) || []

  divnewTasks.forEach((divnewTask) => {
    let idForStorage = divnewTask.querySelector('#idDisplayNone').textContent
    let changeButton = divnewTask.querySelector('.changeButton')
    if (idArray.includes(idForStorage)) {
      let contentText = divnewTask.querySelector('.getValue:first-child')
      contentText.style.textDecoration = 'line-through'
      divnewTask.style.backgroundColor = '#9AADBF'
      changeButton.disabled = true
    } else {
      let contentText = divnewTask.querySelector('.getValue:first-child')
      contentText.style.textDecoration = 'none'
      divnewTask.style.backgroundColor = 'rgb(254, 225, 230, 0.6)'
      changeButton.disabled = false
    }
  })
}

// Vid klick för att strycka över en task, hitta tillhörande idnummer
// Spara i localStorage
// Om Idnummret redan finns där, ta bort det istället

function saveIdnumberOrErase(event) {
  const targetPelement = event.target

  if (targetPelement.classList.contains('getValue')) {
    const findnewTask = targetPelement.closest('#newTask')

    let idForStorage = findnewTask.querySelector('#idDisplayNone').textContent

    if (localStorage.getItem('id') === null) {
      localStorage.setItem('id', '[]')
      let idArray = JSON.parse(localStorage.getItem('id'))
      idArray.push(idForStorage)
      localStorage.setItem('id', JSON.stringify(idArray))
    } else {
      let idArray = JSON.parse(localStorage.getItem('id'))

      if (idArray.includes(idForStorage)) {
        idArray = idArray.filter((id) => id !== idForStorage)
      } else {
        idArray.push(idForStorage)
      }

      localStorage.setItem('id', JSON.stringify(idArray))
    }
  }
}

// Vid klick på tasks text, leta upp rätt task
// Gör den överstrykan, grå och disabled ändra-knapp

function onClickMarkTaskAsDone(event) {
  const targetPelement = event.target

  if (targetPelement.classList.contains('getValue')) {
    const findnewTask = targetPelement.closest('#newTask')
    const contentText = findnewTask.querySelector('.getValue:first-child')
    const changeButton = findnewTask.querySelector('.changeButton')

    if (
      contentText.style.textDecoration !== 'line-through' &&
      findnewTask.style.backgroundColor !== '#9AADBF'
    ) {
      contentText.style.textDecoration = 'line-through'
      findnewTask.style.backgroundColor = '#9AADBF'
      changeButton.disabled = true
    } else {
      contentText.style.textDecoration = 'none'
      findnewTask.style.backgroundColor = 'rgb(254, 225, 230, 0.6)'
      changeButton.disabled = false
    }
  }
}

// Vid klick på changeButton, leta upp rätt task
// Hitta dess värden och skicka visa de i Change task fältet

function PutValuesInChangeBox(event) {
  const target = event.target

  if (target.classList.contains('changeButton')) {
    const taskElement = target.closest('#newTask')
    const contentTask = taskElement.querySelector(
      '.getValue:first-child'
    ).textContent
    const taskPriority = taskElement.querySelector(
      '.getValue:nth-child(2)'
    ).textContent
    const id = taskElement.querySelector('#idDisplayNone').textContent

    // Sätt de hämtade värdena i Ändra task-boxen

    let idValue = document.querySelector('#id'),
      textfieldTask = document.querySelector('#textfieldTaskChange')

    idValue.value = id
    textfieldTask.value = contentTask

    const radioButtons = document.querySelectorAll(
      'input[name="prioRadioChangeBox"]'
    )

    radioButtons.forEach((radioButton) => {
      if (radioButton.value === taskPriority) {
        radioButton.checked = true
      }
    })
    onInputEnableBtn()
  }
}

function onInputEnableBtn() {
  if (idNumber.value === '') {
    updateBtn.disabled = true
  } else {
    updateBtn.disabled = false
  }
}

// Detta api använder POST vid ändring av task,
// jag har pratat med Vanja om detta, han sa att det var okej då man gör samma sak som vid PUT

// Vid klick, leta upp rätt värden, gör ett Fetch-anrop för att ändra task.
// Ritar sedan ut den direkt i listan så man inte behöver ladda om sidan först

function onClickUpdateTask() {
  prioRadioChecked = document.querySelector(
    'input[name="prioRadioChangeBox"]:checked'
  ).value
  idNumberValue = document.querySelector('#id').value
  const textfieldTaskChangeValue = document.querySelector(
    '#textfieldTaskChange'
  ).value

  fetch(`https://api.todoist.com/rest/v2/tasks/${idNumberValue}`, {
    body: JSON.stringify({
      content: textfieldTaskChangeValue,
      priority: prioRadioChecked,
    }),
    headers: {
      Authorization: 'Bearer ff4ab5d15ba8770be9e878bf5c6c05b67e7446e6',
      'Content-Type': 'application/json',
    },
    method: 'POST',
  })
    .then((response) => response.json())
    .then((result) => {
      const getValueElements = document.querySelectorAll('.getValue')

      getValueElements.forEach((element) => {
        if (element.textContent === idNumberValue) {
          const divToUpdate = element.closest('#newTask')

          divToUpdate.scrollIntoView({ behavior: 'smooth', block: 'center' })

          divToUpdate.innerHTML = `
          <span id = 'flexContainerContentPriority'>
          <p id = 'contentP-element' class = 'getValue'>${result.content}</p>
          <p id = 'priorityP-element' class = 'getValue'>${result.priority}</p>
          </span>
          <p class = 'getValue' id = 'idDisplayNone'>${result.id}</p>
          <span class = 'EraseChangeButtons'>
          <input class = 'deleteButton' type = 'button' value = 'Delete'>
          <input class = 'changeButton' type = 'button' value = 'Update'>
          </span>`
        }
      })
      registerTasksBtn()

      updateBtn.disabled = true
      textfieldTaskChange.value = ''

      document.querySelector('#id').value = ''
    })
}

// GET-anrop för att hämta listan
// DisplayTask ritar ut varje list element

function init() {
  fetch('https://api.todoist.com/rest/v2/tasks', {
    headers: {
      Authorization: 'Bearer ff4ab5d15ba8770be9e878bf5c6c05b67e7446e6',
    },
  })
    .then((resp) => resp.json())
    .then((tasksArray) => {
      for (let index = 0; index < tasksArray.length; index++) {
        displayTask(
          tasksArray[index].content,
          tasksArray[index].priority,
          tasksArray[index].id
        )
      }

      registerTasksBtn()
    })
}

// Gör så att Delete och Update knapparna fungerar
function registerTasksBtn() {
  tasks.addEventListener('click', deleteTask)

  const changeButtons = document.querySelectorAll('.changeButton'),
    changeTaskBox = document.querySelector('#changeTask')

  changeButtons.forEach((changeButton) => {
    changeButton.addEventListener('click', () => {
      changeTaskBox.scrollIntoView({ behavior: 'smooth' })
    })
  })
}
