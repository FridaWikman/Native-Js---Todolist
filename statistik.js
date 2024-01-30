document.addEventListener('DOMContentLoaded', getStoredDropdownValue)
let bar = document.getElementById('barChart')
let doughnut = document.getElementById('myChart')
let dropdown = document.querySelector('#chartTypes')

dropdown.addEventListener('change', storeDropdownValue)

init()

// Hämta listan med tasks

function init() {
  fetch('https://api.todoist.com/rest/v2/tasks', {
    headers: {
      Authorization: 'Bearer ff4ab5d15ba8770be9e878bf5c6c05b67e7446e6',
    },
  })
    .then((resp) => resp.json())
    .then((tasksArray) => {
      let priorityArray = []
      for (let index = 0; index < tasksArray.length; index++) {
        priorityArray.push(tasksArray[index].priority)
      }
      devidePriorityInArrays(priorityArray)
    })
}

// Dela in prioriteterna i fyra listor
// Skapar två olika charts som visar hur många task det är med varje prioritet

function devidePriorityInArrays(priority) {
  let arrayPrioOne = []
  let arrayPrioTwo = []
  let arrayPrioThree = []
  let arrayPrioFour = []

  for (let i = 0; i < priority.length; i++) {
    if (priority[i] === 1) {
      arrayPrioOne.push(1)
    }
    if (priority[i] === 2) {
      arrayPrioTwo.push(2)
    }
    if (priority[i] === 3) {
      arrayPrioThree.push(3)
    }
    if (priority[i] === 4) {
      arrayPrioFour.push(4)
    }
  }

  new Chart(doughnut, {
    type: 'doughnut',
    data: {
      labels: ['Priority: 1', 'Priority: 2', 'Priority: 3', 'Priority: 4'],
      datasets: [
        {
          label: 'Number of tasks',
          data: [
            arrayPrioOne.length,
            arrayPrioTwo.length,
            arrayPrioThree.length,
            arrayPrioFour.length,
          ],
          backgroundColor: ['#F8839D', '#E3A5FA', '#E751CE', '#C758E5'],
          hoverOffset: 4,
        },
      ],
    },
  })

  new Chart(bar, {
    type: 'bar',
    data: {
      labels: ['Priority: 1', 'Priority: 2', 'Priority: 3', 'Priority: 4'],
      datasets: [
        {
          label: '# of Tasks',
          data: [
            arrayPrioOne.length,
            arrayPrioTwo.length,
            arrayPrioThree.length,
            arrayPrioFour.length,
          ],
          backgroundColor: ['#E3A5FA'],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  })
  getOption()
}

// Spara val av chart i localStorage

function storeDropdownValue() {
  selectedOption = dropdown.options[dropdown.selectedIndex].value

  localStorage.setItem('selectedOption', selectedOption)
  getStoredDropdownValue()
}

// Hämta sparat val av chart och sätt doughnut chart som initian chart om ingen är vald

function getStoredDropdownValue() {
  let selectedOptionFromStorage = localStorage.getItem('selectedOption')
  console.log(selectedOptionFromStorage)

  if (selectedOptionFromStorage === null) {
    localStorage.setItem('selectedOption', 'doughnut')
  }
  dropdown.value = selectedOptionFromStorage

  getOptionDisplayChart()
}

// Hämta de valda värdet från dropdown-menu och visa rätt chart

function getOptionDisplayChart() {
  let selectedOption = dropdown.options[dropdown.selectedIndex].value

  if (selectedOption === 'bar') {
    bar.style.display = 'block'
    doughnut.style.display = 'none'
  }
  if (selectedOption === 'doughnut') {
    bar.style.display = 'none'
    doughnut.style.display = 'block'
  }
}
