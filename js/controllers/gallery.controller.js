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

// Render saved memes
function renderSavedMemes() {
  const savedMemes = loadFromStorage('savedMemes') || []
  const elGallery = document.querySelector('.memes-gallery-container')

  if (savedMemes.length === 0) {
    galleryContainer.innerHTML = '<p>No saved memes yet!</p>'
    return
  }


  savedMemes.forEach((meme, idx) => {
    const img = new Image()
    img.src = meme.selectedImgId // Assuming you store image URLs directly
    img.dataset.index = idx
    img.addEventListener('click', () => {
      loadMemeForEditing(meme)
    })

    const memeContainer = document.createElement('div')
    memeContainer.className = 'meme-thumbnail'
    memeContainer.appendChild(img)

    galleryContainer.appendChild(memeContainer)
  });

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
  const elGalleryCon = document.querySelector('.memes-gallery-container')
  const elEditor = document.querySelector('.meme-editor-page')
  elEditor.classList.add('hidden')
  elGalleryCon.classList.remove('hidden')
  elGallery.classList.remove('hidden')
  renderMeme()
  renderGallery()
  onToggleMenu()
}


function onOpenSavedMemes() {
  const elGallery = document.querySelector('.meme-gallery-page')
  const elEditor = document.querySelector('.meme-editor-page')
  const elMeme= document.querySelector('.memes-gallery-container') 
  const elGalleryCon = document.querySelector('.memes-gallery-container')

  elGalleryCon.classList.remove('hidden')
  elEditor.classList.add('hidden')
  elGallery.classList.remove('hidden')
  elMeme.classList.remove('hidden')
  renderSavedMemes() // Show saved memes
  onToggleMenu()
}




function onSelectSavedMeme(index) {
  const savedMemes = loadFromStorage('savedMemes') || []
  gMeme = savedMemes[index]
  renderMeme()
  flashMsg('Meme loaded for editing!')
}

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