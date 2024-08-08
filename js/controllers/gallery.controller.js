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

function onOpenSavedMemes(){
  const elGallery = document.querySelector('.meme-gallery-page')
  const elSavedGallery = document.querySelector('.saved-meme-gallery-page')
  const elEditor = document.querySelector('.meme-editor-page')
  elSavedGallery.classList.remove('hidden')
  elEditor.classList.add('hidden')
  elGallery.classList.add('hidden')
  console.log('elSavedGallery',elSavedGallery )
  
  
  renderSaved()
  onToggleMenu()
}


function renderSaved() {
  const savedMemes = getLoadedMemes()
  
  if (savedMemes.length === 0) {
    console.log('No saved memes available')
    const savedMemesContainer = document.querySelector('.saved-memes-gallery-container')
    savedMemesContainer.innerHTML = '<p>No saved memes available.</p>'
    return;
  }

  const savedItemsHTML = savedMemes
    .map((meme, index) => `
      <article class="meme-list-image">
        <img class="saved-image" src="${meme.selectedImgId}" alt="meme" 
          data-index="${index}" onclick="onLoadFromSaved(this)"/>
        <button data-index="${index}" class="btn delete-saved-button" onclick="onDeleteSaved(this)">Delete</button>
      </article>`)
    .join('')

  const savedMemesContainer = document.querySelector('.saved-memes-gallery-container')
  if (savedMemesContainer) {
    savedMemesContainer.innerHTML = savedItemsHTML
  } else {
    console.error('The container for saved memes is missing from the DOM.')
  }

}

function onLoadFromSaved(elImg) {
  const loadedMemes = getLoadedMemes()
  const selectedMeme = loadedMemes[elImg.dataset.index]
  loadMeme(selectedMeme)
  openEditor()
}


// USER_HELPER
function onInfoCanvas() {
  const elModal = document.querySelector('.info-modal')

  elModal.showModal()
}

function flashMsg(msg) {
  const el = document.querySelector('.user-msg')

  el.innerText = msg
  el.classList.add('open')
  setTimeout(() => el.classList.remove('open'), 3000)
}
