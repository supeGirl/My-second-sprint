'use strict'

function renderGallery() {
  const elGallery = document.querySelector('.memes-gallery-container')
  const imgsStr = gImgs
    .map(
      (img) => `
         <article class="meme-img">
      <img src="${img.url}" alt="${img.keywords.join(' ')}" onclick="onImgSelect(${img.id})" />
    </article>
        `
    )
    .join('')
  elGallery.innerHTML = imgsStr
}

function onImgSelect(id) {
  const elGallery = document.querySelector('.meme-gallery-page')
  const elEditor = document.querySelector('.meme-editor-page')
  setImg(id)
  elGallery.classList.add('hidden')
  elEditor.classList.remove('hidden')
  renderMeme()

}

function onSearchMeme(search) {
  console.log('your search', search)
}


function onOpenGallery(){
  const elGallery = document.querySelector('.meme-gallery-page')
  const elEditor = document.querySelector('.meme-editor-page')
  elEditor.classList.add('hidden')
  elGallery.classList.remove('hidden')
  renderMeme()
  renderGallery()
  onToggleMenu()
}