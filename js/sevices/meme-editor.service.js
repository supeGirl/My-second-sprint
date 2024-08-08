'use strict'

var gMeme = {
  selectedImgId: 1,
  selectedLineIdx: 0,
  lines: [
    {
      txt: 'Add Text Here',
      size: 20,
      borderColor: '#15C1B5',
      color: 'white',
      fontFamily: 'Arial',
      x:150,
      y:50,
    
    },
  ],
}

const MEME_STORAGE_KEY = 'MEME'
const IMG_STORAGE_KEY = 'IMAGE'
const EDITED_IMG_STORAGE_KEY = 'EDITED_IMAGES'

function getMeme() {
  return gMeme
}


function setCanvasData(date) {
  gMeme = {...gMeme, ...date}
}

function getSelectedLine() {
  return gMeme.lines[gMeme.selectedLineIdx]
}

function setLineTxt(txt) {
  const selectedLine = getSelectedLine()
  if (selectedLine) {
    selectedLine.txt = txt
  } else {
    console.error('No line selected')
  }
}

function updateLineProperty(property, value) {
  const selectedLine = getSelectedLine()
  if (selectedLine) {
    selectedLine[property] = value
  }
}

function addEmoji(emoji) {
  const newEmoji = {
    txt: emoji,
    size: 40, 
    color: 'black', 
    x: gElCanvas.width / 2, 
    y: gElCanvas.height / 2, 
  }

  gMeme.lines.push(newEmoji)
  gMeme.selectedLineIdx = gMeme.lines.length - 1
  renderMeme()
}

function drawFrame(line) {
  gCtx.strokeStyle = 'black'
  gCtx.lineWidth = 2
  const textWidth = gCtx.measureText(line.txt).width
  gCtx.strokeRect(line.x - textWidth / 2 - 5, line.y - line.size, textWidth + 10, line.size + 10)
}


function getRandomImage() {
  const randomIndex = Math.floor(Math.random() * gImgs.length)
  return gImgs[randomIndex]
}

function saveMeme(meme, editedImg) {
  // Retrieve the existing memes and edited images from storage
  const memes = loadFromStorage(MEME_STORAGE_KEY) || []
  const editedImgs = loadFromStorage(EDITED_IMG_STORAGE_KEY) || []

  // Add the new meme to the list
  memes.push(meme)
  
  // Add the edited image to the list
  editedImgs.push(editedImg)

  // Save the updated lists back to storage
  saveToStorage(MEME_STORAGE_KEY, memes)
  saveToStorage(EDITED_IMG_STORAGE_KEY, editedImgs)

  console.log('Saved memes:', memes)
  console.log('Saved edited images:', editedImgs)
  
  // Notify the user
  flashMsg('Meme saved successfully!')
}

function deleteSaved(idx) {
  const memes = loadFromStorage(MEME_STORAGE_KEY) || []
  const editedImgs = loadFromStorage(EDITED_IMG_STORAGE_KEY) || []

  memes.splice(idx, 1)
  editedImgs.splice(idx, 1)

  saveToStorage(MEME_STORAGE_KEY, memes)
  saveToStorage(EDITED_IMG_STORAGE_KEY, editedImgs)
}

function getLoadedMemes() {
  const memes = loadFromStorage(MEME_STORAGE_KEY)
  console.log('Loaded memes:', memes)
  return memes
}

function getloadedEditedImgs() {
const imgs = loadFromStorage(EDITED_IMG_STORAGE_KEY) || []
console.log('Loaded imgs:', imgs)

  return imgs
}

function getEditedImage() {

  return 'path/to/edited-image.jpg'
}