'use strict'
var gElCanvas
var gCtx

let gCurrentMeme
let gCurrentText = 'Add Text Here'

function onInit() {
  gElCanvas = document.querySelector('canvas')
  gCtx = gElCanvas.getContext('2d')
  renderGallery()
  resizeCanvas()
  // insertInitFromDate()
  window.addEventListener('resize', resizeCanvas)

}

function onAddTxt(elTxt) {
  if (elTxt.trim() === '') {
    setLineTxt('Add Text Here') 
  } else {
    setLineTxt(elTxt) 
  }
  gCurrentText = elTxt 
  renderMeme() 
}

function onSelectMeme(elMeme) {
  gCurrentMeme = elMeme.src
  coverCanvasWithMeme(elMeme)
}

function onDownloadCanvas(elLink) {
  const imgContent = gElCanvas.toDataURL('image/jpeg')
  elLink.href = imgContent
}

function coverCanvasWithMeme(elMeme) {
  gElCanvas.height = (elMeme.naturalHeight / elMeme.naturalWidth) * gElCanvas.width
  gCtx.drawImage(elMeme, 0, 0, gElCanvas.width, gElCanvas.height)
  renderTxt()
}

function onChangeBorderColor(borderColor) {
  updateLineProperty('color', borderColor)
  document.documentElement.style.setProperty('--border-icon-color', borderColor)
  renderMeme()
  // console.log('borderColor', borderColor)
  
}

function onChangeFillColor(fillColor) {
  updateLineProperty('color', fillColor)
  document.documentElement.style.setProperty('--fill-icon-color', fillColor)
  renderMeme()
  // console.log('fillColor', fillColor)
}

function resizeCanvas() {
  const elContainer = document.querySelector('.meme-editor-canvas')
  const newWidth = elContainer.clientWidth - 10
  const newHeight = (gElCanvas.height / gElCanvas.width) * newWidth

  // Save the current image data
  const imageData = gCtx.getImageData(0, 0, gElCanvas.width, gElCanvas.height)

  // Resize the canvas
  gElCanvas.width = newWidth
  gElCanvas.height = newHeight

  // Clear the canvas
  gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)

  // Restore the canvas content with scaling
  gCtx.putImageData(imageData, 0, 0, 0, 0, newWidth, newHeight)

  renderMeme()
}

function renderMeme() {
  const meme = getMeme()
  const img = gImgs.find((img) => img.id === meme.selectedImgId)

  if (img) {
    const elMeme = new Image()
    elMeme.src = img.url
    elMeme.onload = () => {
      gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
      coverCanvasWithMeme(elMeme)
      renderTxt()
    }
  }
}

function renderTxt() {
  const selectedLine = getSelectedLine()
  if (selectedLine && selectedLine.txt) {
    gCtx.font = `${selectedLine.size}px Arial`

    
    gCtx.borderColor = selectedLine.borderColor
    gCtx.fillStyle = selectedLine.color || 'white'
    gCtx.textAlign = 'center'

    const txtOffsetFromTop = 20
    const txtPositionY = txtOffsetFromTop + selectedLine.size

    gCtx.strokeText(gCurrentText, gElCanvas.width / 2, txtPositionY)
    gCtx.fillText(gCurrentText, gElCanvas.width / 2, txtPositionY)
  }
}

function onToggleMenu() {
  document.body.classList.toggle('menu-open')
}

// function insertInitFromDate(){

//   const {selectedImgId, selectedLineIdx, lines} = getMeme()
//   if(lines && lines.length > 0 && selectedLineIdx < lines.length){
//     const [{txt, size, borderColor, fillColor}] = lines

    
//     document.getElementById('text-input').value = txt
//     document.getElementById('border-color').value = borderColor
//     document.getElementById('fill-color').style =fillColor
//     // document.getElementById('size-input').value = size
//   }else{
//     console.error('Invalid line index or no lines available')
//   }


// }