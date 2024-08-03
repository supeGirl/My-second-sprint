'use strict'
var gElCanvas
var gCtx

let gCurrentMeme
let gCurrentText = 'Add Text Here'

function onInit() {
  gElCanvas = document.querySelector('canvas')
  gCtx = gElCanvas.getContext('2d')
  resizeCanvas()

  window.addEventListener('resize', resizeCanvas)
}

function onSearchMeme(search) {
  console.log('your search', search)
}

function onAddTxt(elTxt) {
  console.log('your txt', elTxt)
  gCurrentText = elTxt
  renderMeme()
}

function onSelectMeme(elMeme) {
  gCurrentMeme = elMeme.src
  coverCanvasWithMeme(elMeme)
}

function coverCanvasWithMeme(elMeme) {
  gElCanvas.height = (elMeme.naturalHeight / elMeme.naturalWidth) * gElCanvas.width
  gCtx.drawImage(elMeme, 0, 0, gElCanvas.width, gElCanvas.height)
  renderTxt()
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
  if (!gCurrentMeme) return

  const elMeme = new Image()
  elMeme.src = gCurrentMeme

  elMeme.onload = () => coverCanvasWithMeme(elMeme)
}

function renderTxt() {
  if (!gCurrentText) {
    return
  }
  
  gCtx.font = '30px Arial'
  gCtx.fillStyle = 'white'
  gCtx.textAlign = 'center'


  const txtOffsetFromTop = 20
  const txtPositionY = txtOffsetFromTop + 30

  gCtx.fillText(gCurrentText, gElCanvas.width / 2.5, txtPositionY)
}
