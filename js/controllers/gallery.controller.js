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
  setImg(id)
  renderMeme()
}

function onSearchMeme(search) {
  console.log('your search', search)
}
