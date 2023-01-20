//Working on Window.getSelection() object
//Object has base and extent nodes to account for selection spanning multiple HTML elements
//Initial work: Get highlighting to function assuming highlight is contained within single element
//Use 
deleteButton = document.querySelector('#delete-notes')
document.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowLeft') { //use left arrow for now
      // chrome.storage.local.get(function(result) {
      //   console.log('storage: ', result)
      // })
      const currSelection = window.getSelection();
      let childNodesVar = currSelection.anchorNode.parentNode.childNodes
      const parentNodeVar = currSelection.anchorNode.parentNode;
      const newText = currSelection.toString()

      console.log('currSelection: ', currSelection);
      console.log('anchor node: ', currSelection.anchorNode);
      console.log('focus node', currSelection.focusNode)
      console.log('currSelection parent node: ', currSelection.anchorNode.parentNode)

      //lines 21 - 38 adds notes to popup.html/local storage---------------------------
      let websiteURL = window.location.hostname
      let storageArr;
      chrome.storage.local.get(function(data) {
        // console.log('get request: ', data[websiteURL])
        if (data[websiteURL] === undefined) {
          storageArr = [];
        } 
        else if (data[websiteURL] !== undefined) {
          storageArr = data[websiteURL]
        }
        storageArr.push(newText)
        // console.log('storageArr: ', storageArr)
        let storageObj = {}
        storageObj[websiteURL] = storageArr;
        // console.log(storageObj)
        chrome.storage.local.set(storageObj);
      })
      //------------------------------------------------------------------

      let numOfChildNodes = new Map();
      let count = false
      for (let i = 0; i < childNodesVar.length; i++) {
        if (childNodesVar[i].data === currSelection.anchorNode.data || (childNodesVar[i].data === undefined && childNodesVar.innerHTML === currSelection.anchorNode.data)) {
          count = true
        } 
        if (count === true) {
          // numOfChildNodes.push(childNodesVar[i]);
          numOfChildNodes.set(childNodesVar[i], childNodesVar[i].parentNode);
        }
        if (childNodesVar[i].data === currSelection.focusNode.data|| (childNodesVar[i].data === undefined && childNodesVar[i].innerHTML === currSelection.focusNode.data)) {
          count = false;
        }
      }
      console.log('numofNOde array: ', numOfChildNodes)

      let i = 0;
      if (numOfChildNodes.size > 1) {
        for (let [key, value] of numOfChildNodes) {
          console.log(i);
          console.log('numofNOde at index i: ', numOfChildNodes[i])
          let testSib = key.nextSibling;
          if (i === 0) {
            let firstHalfAnchor = document.createElement('span');
            let secondHalfAnchor = document.createElement('span');
            let firstHalfAnchorText = currSelection.anchorNode.data.slice(0, currSelection.anchorOffset);
            let secondHalfAnchorText = currSelection.anchorNode.data.slice(currSelection.anchorOffset, currSelection.anchorNode.data.length)
            firstHalfAnchor.innerHTML = firstHalfAnchorText
            secondHalfAnchor.innerHTML = secondHalfAnchorText
            secondHalfAnchor.classList.add('highlight')
            value.removeChild(key)
            currSelection.anchorNode.insertBefore(firstHalfAnchor, testSib)
            currSelection.anchorNode.insertBefore(secondHalfAnchor, testSib)
          }
          else if (i === numOfChildNodes.size - 1) {
            let secondHalfFocus = document.createElement('span');
            let firstHalfFocus = document.createElement('span');
            let secondHalfFocusText = currSelection.focusNode.data.slice(currSelection.focusOffset, currSelection.focusNode.data.length);
            const firstHalfFocusText = currSelection.focusNode.data.slice(0, currSelection.focusOffset)
            secondHalfFocus.innerHTML = secondHalfFocusText
            firstHalfFocus.innerHTML = firstHalfFocusText
            firstHalfFocus.classList.add('highlight')
            value.removeChild(key)
            currSelection.anchorNode.insertBefore(firstHalfFocus, testSib)
            currSelection.anchorNode.insertBefore(secondHalfFocus, testSib)
          }
          else {
            let newMiddle = document.createElement('span');
            let newMiddleText = key.data
            if (key.data === undefined) newMiddleText = key.innerHTML
            newMiddle.innerText = newMiddleText
            newMiddle.classList.add('highlight')
            console.log(value);
            value.removeChild(key)
            // currSelection.anchorNode.parentNode.insertBefore(newMiddle, testSib)
            value.insertBefore(newMiddle, testSib);
          }
          i++;
        }
      } 
      else {
        let htmlElement = document.createElement('span')
        const nextSibling = currSelection.anchorNode.nextSibling;
        const firstHalfText = currSelection.anchorNode.data.slice(0, currSelection.anchorOffset);
        const secondHalfText = currSelection.anchorNode.data.slice(currSelection.focusOffset, currSelection.anchorNode.data.length);
        const firstHalf = document.createElement('span')
        const secondHalf = document.createElement('span')
        firstHalf.innerHTML = firstHalfText
        secondHalf.innerHTML = secondHalfText
        htmlElement.innerHTML = newText
        htmlElement.classList.add('highlight')
        currSelection.anchorNode.parentNode.removeChild(currSelection.anchorNode)
        currSelection.anchorNode.insertBefore(firstHalf, nextSibling)
        currSelection.anchorNode.insertBefore(htmlElement, nextSibling)
        currSelection.anchorNode.insertBefore(secondHalf, nextSibling)
      }
    }
})

// deleteButton.addEventListener('click', (e) => {
//   chrome.storage.local.clear()
//   const main = document.querySelector('.popup-main')
//   main.innerHTML = '';
// })
