//Working on Window.getSelection() object
//Object has base and extent nodes to account for selection spanning multiple HTML elements
//Initial work: Get highlighting to function assuming highlight is contained within single element
//Use 
deleteButton = document.querySelector('#delete-notes')
document.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowLeft') { //use left arrow for now
      chrome.storage.local.get(function(result) {
        console.log('storage: ', result)
      })
      const currSelection = window.getSelection();
      let childNodesVar = currSelection.anchorNode.parentNode.childNodes
      const parentNodeVar = currSelection.anchorNode.parentNode;
      const newText = currSelection.toString()

      console.log('currSelection: ', currSelection);
      console.log('anchor node: ', currSelection.anchorNode);
      console.log('focus node', currSelection.focusNode)
      console.log('currSelection parent node: ', currSelection.anchorNode.parentNode)

      let numOfChildNodes = [];
      let count = false
      for (let i = 0; i < childNodesVar.length; i++) {
        if (childNodesVar[i].data === currSelection.anchorNode.data || (childNodesVar[i].data === undefined && childNodesVar.innerHTML === currSelection.anchorNode.data)) {
          count = true
        } 
        if (count === true) {
          numOfChildNodes.push(childNodesVar[i]);
        }
        if (childNodesVar[i].data === currSelection.focusNode.data|| (childNodesVar[i].data === undefined && childNodesVar[i].innerHTML === currSelection.focusNode.data)) {
          count = false;
        }
      }
      console.log('numofNOde array: ', numOfChildNodes)
      const nextSibling = currSelection.anchorNode.nextSibling;
      const firstHalfText = currSelection.anchorNode.data.slice(0, currSelection.anchorOffset);
      const secondHalfText = currSelection.anchorNode.data.slice(currSelection.focusOffset, currSelection.anchorNode.data.length);
      
      const firstHalf = document.createElement('span')
      const secondHalf = document.createElement('span')

      firstHalf.innerHTML = firstHalfText
      secondHalf.innerHTML = secondHalfText
//-----------------------------------------------------------------
      let websiteURL = window.location.hostname

      let storageArr;
      chrome.storage.local.get(function(data) {
        console.log('get request: ', data[websiteURL])
        if (data[websiteURL] === undefined) {
          storageArr = [];
        } 
        else if (data[websiteURL] !== undefined) {
          storageArr = data[websiteURL]
        }
        
        storageArr.push(newText)
        console.log('storageArr: ', storageArr)
  
        let storageObj = {}
        storageObj[websiteURL] = storageArr;
  
        console.log(storageObj)
        chrome.storage.local.set(storageObj);
      })
//------------------------------------------------------------------

      // chrome.runtime.sendMessage({greeting: newText}, function(response) {
      //   //console.log(response.farewell) 
      // })


      let htmlElement = document.createElement('span')
      htmlElement.innerHTML = newText
      htmlElement.classList.add('highlight')

      if (numOfChildNodes.length > 1) {
        for (let i = 0; i < numOfChildNodes.length; i++) {
          let testSib = numOfChildNodes[i].nextSibling;
          if (i === 0) {
            let firstHalfAnchor = document.createElement('span');
            let secondHalfAnchor = document.createElement('span');
            let firstHalfAnchorText = currSelection.anchorNode.data.slice(0, currSelection.anchorOffset);
            let secondHalfAnchorText = currSelection.anchorNode.data.slice(currSelection.anchorOffset, currSelection.anchorNode.data.length)
            firstHalfAnchor.innerHTML = firstHalfAnchorText
            secondHalfAnchor.innerHTML = secondHalfAnchorText
            secondHalfAnchor.classList.add('highlight')
            parentNodeVar.removeChild(numOfChildNodes[i])
            currSelection.anchorNode.insertBefore(firstHalfAnchor, testSib)
            currSelection.anchorNode.insertBefore(secondHalfAnchor, testSib)
          }
          if (i === numOfChildNodes.length - 1) {
            let secondHalfFocus = document.createElement('span');
            let firstHalfFocus = document.createElement('span');
            let secondHalfFocusText = currSelection.focusNode.data.slice(currSelection.focusOffset, currSelection.focusNode.data.length);
            const firstHalfFocusText = currSelection.focusNode.data.slice(0, currSelection.focusOffset)
            secondHalfFocus.innerHTML = secondHalfFocusText
            firstHalfFocus.innerHTML = firstHalfFocusText
            firstHalfFocus.classList.add('highlight')
            parentNodeVar.removeChild(numOfChildNodes[i])
            currSelection.anchorNode.insertBefore(firstHalfFocus, testSib)
            currSelection.anchorNode.insertBefore(secondHalfFocus, testSib)
          }
          else {
            let newMiddle = document.createElement('span');
            let newMiddleText = numOfChildNodes[i].data
            if (numOfChildNodes[i].data === undefined) newMiddleText = numOfChildNodes[i].innerHTML
            newMiddle.innerText = newMiddleText
            parentNodeVar.parentNode.removeChild(numOfChildNodes[i])
            currSelection.anchorNode.parentNode.insertBefore(newMiddle, testSib)
          }
        }
      } 
      else {
        currSelection.anchorNode.parentNode.removeChild(currSelection.anchorNode)
        currSelection.anchorNode.insertBefore(firstHalf, nextSibling)
        currSelection.anchorNode.insertBefore(htmlElement, nextSibling)
        currSelection.anchorNode.insertBefore(secondHalf, nextSibling)
      }
    }
})

deleteButton.addEventListener('click', (e) => {
  chrome.storage.local.clear()
  const main = document.querySelector('.popup-main')
  main.innerHTML = '';
})
// document.addEventListener('keydown', (e) => {
//   if (e.code === 'ArrowLeft') { //use left arrow for now
//       // console.log(window.getSelection()); //check if you can access window here
//     const currSelection = window.getSelection();
//     let parentNodeText = currSelection.anchorNode.parentNode.innerHTML
//     let htmlElement = document.createElement('span')
//     htmlElement.innerText = 'THIS IS A SPAN'
//       //currSelection.anchorNode.parentNode.parentNode.removeChild(currSelection.anchorNode.parentNode)
//       //currSelection.anchorNode.parentNode.parentNode.appendChild(htmlElement)
//     currSelection.anchorNode.parentNode.insertAdjacentHTML("beforebegin", htmlElement);
//       // parentNodeText = parentNodeText.slice(0, 5);
//       // console.log(parentNodeText)
//     currSelection.anchorNode.parentNode.style.backgroundColor = '#FFFF00'
//       // currSelection.anchorNode.style.backgroundColor = 'FFFF00';
//     console.log(currSelection);
//     console.log(currSelection.anchorNode);
//       // console.log(currSelection.anchorNode.parentNode.innerText);
//     console.log(currSelection.anchorNode.parentElement)
    
//       // console.log(typeof currSelection.anchorNode);
//       // console.log(Object.keys(currSelection.anchorNode));
//     console.log(parentNodeText);
// }
// })