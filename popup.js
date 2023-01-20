
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

    // chrome.storage.local.get(function(result) {
    //   console.log(result)
    // })

      let highlightedText = request.greeting;
      let websiteURL = sender.origin.slice(8)

      const main = document.querySelector('main')
      const newDiv = document.createElement('div')


      newDiv.classList.add('website-divs')

      let storageArr;
      chrome.storage.local.get(function(data) {
        console.log('get request: ', data[websiteURL])
        if (data[websiteURL] === undefined) {
          storageArr = [];
        } 
        else if (data[websiteURL] !== undefined) {
          storageArr = data[websiteURL]
        }
        
        storageArr.push(highlightedText)
        console.log('storageArr: ', storageArr)
  
        let storageObj = {}
        storageObj[websiteURL] = storageArr;
  
        console.log(storageObj)
        chrome.storage.local.set(storageObj);

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
      })
      sendResponse({farewell: 'goodbye'})
})
