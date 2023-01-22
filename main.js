//Working on Window.getSelection() object
//Object has base and extent nodes to account for selection spanning multiple HTML elements
//Initial work: Get highlighting to function assuming highlight is contained within single element
//Use 

document.addEventListener('keydown', (e) => {
    if (e.code === 'Backquote') { //use left arrow for now

      const currSelection = window.getSelection();
      const newText = currSelection.toString();
      let highlightNode = document.createElement('span');
      highlightNode.classList.add('highlight');
      const currSelectionRange = currSelection.getRangeAt(0);
      let workSelection = currSelectionRange.extractContents();
      highlightNode.appendChild(workSelection);
      currSelectionRange.insertNode(highlightNode);


      

      //lines 21 - 35 adds notes to popup.html/local storage
      let websiteURL = window.location.hostname
      let storageArr;
      chrome.storage.local.get(function(data) {
        if (data[websiteURL] === undefined) {
          storageArr = [];
        } 
        else if (data[websiteURL] !== undefined) {
          storageArr = data[websiteURL]
        }
        storageArr.push(newText)
        let storageObj = {}
        storageObj[websiteURL] = storageArr;
        chrome.storage.local.set(storageObj);
      })


        console.log('currSelectionRange', currSelectionRange)
        console.log('workSelection', workSelection)
        console.log('highlightNode', highlightNode)
    }
})

