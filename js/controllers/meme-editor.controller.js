'use strict'
var gElCanvas
var gCtx

let gIsDragging = false
let gCurrentMeme
let gCurrentText = 'Add Text Here'

const TOUCH_EVS = ['touchstart', 'touchmove', 'touchend']

function onInit() {
  gElCanvas = document.querySelector('canvas')
  gCtx = gElCanvas.getContext('2d', {willReadFrequently: true})
  addListeners()
  renderGallery()
  resizeCanvas()
}

function onSelectMeme(elMeme) {
  gCurrentMeme = elMeme.src
  coverCanvasWithMeme(elMeme)
}

function onSelectRandomMeme() {
  const randomImg = getRandomImage()
  if (randomImg) {
    gCurrentMeme = randomImg.url
    const elMeme = new Image()
    elMeme.src = randomImg.url
    elMeme.onload = () => {
      gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
      gElCanvas.height = (elMeme.naturalHeight / elMeme.naturalWidth) * gElCanvas.width
      gCtx.drawImage(elMeme, 0, 0, gElCanvas.width, gElCanvas.height)
      renderTxt()
    }
    gMeme.selectedImgId = randomImg.id
  }
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
  gMeme.lines.push(newLine)
  gMeme.selectedLineIdx = gMeme.lines.length - 1
  renderMeme()
}

function resizeCanvas() {
  const elContainer = document.querySelector('.meme-editor-canvas')
  const newWidth = elContainer.clientWidth - 10
  const newHeight = (gElCanvas.height / gElCanvas.width) * newWidth

  const imageData = gCtx.getImageData(0, 0, gElCanvas.width, gElCanvas.height)

  gElCanvas.width = newWidth
  gElCanvas.height = newHeight

  gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)

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
  const meme = getMeme()
  const selectedLineIdx = meme.selectedLineIdx

  meme.lines.forEach((line, idx) => {
    gCtx.font = `${line.size}px  ${line.fontFamily ||'Arial'}`
    gCtx.textAlign =line.textAlign || 'center'
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

function onSelectTxtLine(ev) {
  const {offsetX, offsetY} = ev
  const selectedLineIdx = gMeme.lines.findIndex((line) => {
    const textWidth = gCtx.measureText(line.txt).width
    const textHeight = line.size
    const textX = gElCanvas.width / 2 - textWidth / 2
    const textY = 20 + line.size

    return offsetX >= textX && offsetX <= textX + textWidth && offsetY >= textY - textHeight && offsetY <= textY
  })

  if (selectedLineIdx !== -1) {
    gMeme.selectedLineIdx = selectedLineIdx
    renderMeme()
  }
}

function onChangeFontFamily(fontFamily) {
  updateLineProperty('fontFamily', fontFamily)
  renderMeme()
}

function onChangeTxtAlign(alignment) {
  updateLineProperty('textAlign', alignment);
  renderMeme()
}

function onUpdateLineSize(diff) {
  const selectedLine = getSelectedLine()
  if (selectedLine) {
    selectedLine.size += diff
    if (selectedLine.size < 10) selectedLine.size = 10 // Ensure font size doesn't go too small
    renderMeme()
  }
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

function drawFrame(line) {
  gCtx.strokeStyle = 'black'
  gCtx.lineWidth = 2
  const textWidth = gCtx.measureText(line.txt).width
  gCtx.strokeRect(line.x - textWidth / 2 - 5, line.y - line.size, textWidth + 10, line.size + 5)
}

function onDeleteLine() {
  const selectedLineIdx = gMeme.selectedLineIdx
  if (selectedLineIdx >= 0 && selectedLineIdx < gMeme.lines.length) {
    gMeme.lines.splice(selectedLineIdx, 1)
    gMeme.selectedLineIdx = Math.max(0, gMeme.selectedLineIdx - 1)
    renderMeme()
  }
}

function onSwitchLine() {
  gMeme.selectedLineIdx = (gMeme.selectedLineIdx + 1) % gMeme.lines.length
  renderMeme()
}

function onMoveLineUp() {
  const selectedLine = getSelectedLine()
  if (selectedLine) {
    selectedLine.y -= 10
    renderMeme()
  }
}

function onMoveLineDown() {
  const selectedLine = getSelectedLine()
  if (selectedLine) {
    selectedLine.y += 10 
    renderMeme()
  }
}

function onToggleMenu() {
  document.body.classList.toggle('menu-open')
}

function onDownloadCanvas(elLink) {
  const imgContent = gElCanvas.toDataURL('image/jpeg')
  elLink.href = imgContent
}

function addListeners() {
  addMouseListeners()
  addTouchListeners()
  window.addEventListener('resize', resizeCanvas)
  document.querySelectorAll('.color-input').forEach((input) => {
    input.addEventListener('touchend', (event) => {
      const color = event.target.value
      if (input.id === 'border-color') {
        onChangeBorderColor(color)
      } else if (input.id === 'fill-color') {
        onChangeFillColor(color)
      }
    })
  })
}

function addMouseListeners() {
  gElCanvas.addEventListener('mousedown', onDown)
  gElCanvas.addEventListener('mousemove', onMove)
  gElCanvas.addEventListener('click', onSelectTxtLine)
  document.addEventListener('mouseup', onUp)
}

function addTouchListeners() {
  gElCanvas.addEventListener('touchstart', onDown)
  gElCanvas.addEventListener('touchend', onSelectTxtLine)
  gElCanvas.addEventListener('touchmove', onMove)
  document.addEventListener('touchend', onUp)
}

function onDown(ev) {
  const pos = getEvPos(ev)
  gIsDragging = true
  handleMouseDown(pos)
}

function onMove(ev) {
  if (!gIsDragging) return
  const pos = getEvPos(ev)
  handleMouseMove(pos)
}

function onUp(ev) {
  gIsDragging = false
  handleMouseUp()
}

function handleMouseDown(pos) {
  gMeme.lines.forEach((line, idx) => {
    const textMetrics = gCtx.measureText(line.txt)
    const textHeight = line.size
    const lineX = line.x
    const lineY = line.y - textHeight / 2

    if (
      pos.x >= lineX - textMetrics.width / 2 &&
      pos.x <= lineX + textMetrics.width / 2 &&
      pos.y >= lineY &&
      pos.y <= lineY + textHeight
    ) {
      gMeme.selectedLineIdx = idx
      renderMeme()
    }
  })
}

function handleMouseMove(pos) {
  const selectedLine = getSelectedLine()
  if (selectedLine && gIsDragging) {
    selectedLine.x = pos.x
    selectedLine.y = pos.y
    renderMeme()
  }
}

function handleMouseUp() {
  gIsDragging = false
}

function getEvPos(ev) {
  let pos = {
    x: ev.offsetX,
    y: ev.offsetY,
  }

  if (TOUCH_EVS.includes(ev.type)) {
    // ev.preventDefault()
    ev = ev.changedTouches[0]
    pos = {
      x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
      y: ev.pageY - ev.target.offsetTop - ev.target.clientTop,
    }
  }
  return pos
}

function saveMemeToLocalStorage() {
  const memes = loadFromStorage('savedMemes') || []
  memes.push(gMeme)
  saveToStorage('savedMemes', memes)
  flashMsg('Meme saved successfully!')
}

