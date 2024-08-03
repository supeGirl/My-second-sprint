'use strict'

var gImgs = [
    {id: 1, url: 'img/1.jpg', keywords: ['funny', 'angry']},
    {id: 2, url: 'img/2.jpg', keywords: ['cute', 'dog']},

]


var gMeme = {
 selectedImgId: 1,
 selectedLineIdx: 0,
 lines: [
 {
 txt: '',
 size: 20,
 color: 'red'
 }
 ]
}

function getMeme(){
return gMeme

}
