'use strict'
var gElCanvas
var gCtx

let gCurrentMeme
let gCurrentText = 'Add Text Here'

function onInit() {
  gElCanvas = document.querySelector('canvas')
  gCtx = gElCanvas.getContext('2d', {willReadFrequently: true})
  renderGallery()
  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)
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

function onAddTxt(elTxt) {
  if (elTxt.trim() === '') {
    setLineTxt('Add Text Here')
  } else {
    setLineTxt(elTxt)
  }
  gCurrentText = elTxt
  renderMeme()
}

function onAddLine() {
  const newLine = {
    txt: 'Add Text Here',
    size: 20,
    borderColor: '#15C1B5',
    color: 'white',
    x: gElCanvas.width / 2,
    y: gElCanvas.height - (40 + gMeme.lines.length * 30),
  }
  gMeme.lines.push(newLine);
  gMeme.selectedLineIdx = gMeme.lines.length - 1
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
  const meme = getMeme()
  const selectedLineIdx = meme.selectedLineIdx

    meme.lines.forEach((line, idx) => {
      gCtx.font = `${line.size}px Arial`
      gCtx.textAlign = 'center'
      gCtx.textBaseline = 'bottom'

      gCtx.strokeStyle = line.borderColor
      gCtx.fillStyle = line.color || 'white'
      gCtx.lineWidth = 2

      gCtx.strokeText(line.txt, line.x, line.y)
      gCtx.fillText(line.txt, line.x, line.y)

      if (idx === selectedLineIdx) {
        drawFrame(line)
      }
    })

}

function resizeCanvas() {
  const elContainer = document.querySelector('.meme-editor-canvas')
  const aspectRatio = gElCanvas.width / gElCanvas.height
  const newWidth = elContainer.clientWidth - 10
  const newHeight = newWidth / aspectRatio

  // Save the current image data
  const imageData = gCtx.getImageData(0, 0, gElCanvas.width, gElCanvas.height)

  // Resize the canvas
  gElCanvas.width = newWidth
  gElCanvas.height = newHeight

  // Clear the canvas
  gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)

  // Create a new canvas to draw the scaled image data
  const tempCanvas = document.createElement('canvas')
  tempCanvas.width = imageData.width
  tempCanvas.height = imageData.height
  const tempCtx = tempCanvas.getContext('2d')
  tempCtx.putImageData(imageData, 0, 0)

  // Draw the scaled image data on the resized canvas
  gCtx.drawImage(tempCanvas, 0, 0, tempCanvas.width, tempCanvas.height, 0, 0, gElCanvas.width, gElCanvas.height)

  renderMeme()
}

function onChangeBorderColor(borderColor) {
  updateLineProperty('borderColor', borderColor)
  document.documentElement.style.setProperty('--border-icon-color', borderColor)
  renderMeme()
  console.log('borderColor', borderColor)
}

function onChangeFillColor(fillColor) {
  updateLineProperty('color', fillColor)
  document.documentElement.style.setProperty('--fill-icon-color', fillColor)
  renderMeme()
  // console.log('fillColor', fillColor)
}

function onUpdateLineSize(diff) {
  const selectedLine = getSelectedLine()
  if (selectedLine) {
    selectedLine.size += diff
    if (selectedLine.size < 10) selectedLine.size = 10 // Ensure font size doesn't go too small
    renderMeme()
  }
}

function drawFrame(line) {
  gCtx.strokeStyle = 'black'
  gCtx.lineWidth = 2
  const textWidth = gCtx.measureText(line.txt).width
  gCtx.strokeRect(line.x - textWidth / 2 - 5, line.y - line.size, textWidth + 10, line.size + 5)
}

function onSwitchLine() {
  gMeme.selectedLineIdx = (gMeme.selectedLineIdx + 1) % gMeme.lines.length
  renderMeme()
}

function onToggleMenu() {
  document.body.classList.toggle('menu-open')
}

function onDownloadCanvas(elLink) {
  const imgContent = gElCanvas.toDataURL('image/jpeg')
  elLink.href = imgContent
}
