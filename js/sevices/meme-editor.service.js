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
    
    },
  ],
}

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
    if (property === 'borderColor') {
      selectedLine.borderColor = value
    } else if (property === 'color') {
      selectedLine.color = value
    }
  }
}


