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

  window.addEventListener('resize', resizeCanvas)
}

function onAddTxt(elTxt) {
  setLineTxt(elTxt)
  gCurrentText = elTxt
  console.log('Updated Text:', getSelectedLine().txt)
  renderMeme()
}

function onSelectMeme(elMeme) {
  gCurrentMeme = elMeme.src
  coverCanvasWithMeme(elMeme)
}

function onDownloadCanvas(elLink){
  const imgContent = gElCanvas.toDataURL('image/jpeg')
  elLink.href = imgContent
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
  const meme = getMeme()
  const img = gImgs.find((img) => img.id === meme.selectedImgId)

  if (img) {
    const elMeme = new Image()
    elMeme.src = img.url
    elMeme.onload = () =>  {
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
    gCtx.fillStyle = selectedLine.color || 'white'
    gCtx.textAlign = 'center'

    const txtOffsetFromTop = 20
    const txtPositionY = txtOffsetFromTop + selectedLine.size

    gCtx.fillText(gCurrentText, gElCanvas.width / 2, txtPositionY)
  }
}

function onToggleMenu() {
  document.body.classList.toggle('menu-open')
}
