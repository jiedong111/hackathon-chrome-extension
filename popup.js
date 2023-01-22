const deleteButton = document.createElement('button')

chrome.storage.local.get(function(data) {
  const main = document.querySelector('main')
  const newDiv = document.createElement('div')
  deleteButton.classList.add('delete-button')
  deleteButton.innerText = 'Delete Notes'
  for (const key in data) {
    main.innerHTML = '';
    const newTitle = document.createElement('h3');
    const newerUL = document.createElement('ul');
    newTitle.innerText = 'Notes from ' + key + ':'
    main.appendChild(newDiv)
    newDiv.appendChild(newTitle)
    newDiv.appendChild(newerUL)
    for (let i = 0; i < data[key].length; i++) {
      const newerLI = document.createElement('li')
      newerLI.innerText = data[key][i]
      newerUL.appendChild(newerLI)
    }
  }
  main.appendChild(deleteButton)
})

deleteButton.addEventListener('click', (e) => {
  chrome.storage.local.clear()
  const main = document.querySelector('.popup-main')
  main.innerHTML = '';
})

//     // chrome.storage.local.get(function(result) {
//     //   console.log(result)
//     // })