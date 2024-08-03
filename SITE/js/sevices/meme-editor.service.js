'use strict'

var gImgs = [
  {id: 1, url: 'img/1.jpg', keywords: ['funny', 'angry']},
  {id: 2, url: 'img/2.jpg', keywords: ['cute', 'dog']},
  {id: 3, url: 'img/3.jpg', keywords: ['cute', 'dog']},
  {id: 4, url: 'img/4.jpg', keywords: ['cute', 'dog']},
]

var gMeme = {
  selectedImgId: 1,
  selectedLineIdx: 0,
  lines: [
    {
      txt: 'Add Text Here',
      size: 20,
      color: 'white',
    },
  ],
}

function getMeme() {
  return gMeme
}

function getSelectedLine() {
  return gMeme.lines[gMeme.selectedLineIdx]
}

function setLineTxt(txt) {
  const selectedLine = getSelectedLine()

  console.log('txt', txt)
  console.log('selectedLine', selectedLine)

  if (!selectedLine) {
    selectedLine.txt = 'Add Text Here'
  } else {
    selectedLine.txt = txt
  }
}

function setImg(id) {
  gMeme.selectedImgId = id
}
