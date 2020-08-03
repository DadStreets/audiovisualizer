let audio, ctx, analyser, source, array, count, barsCount, colorScheme;
let barFront, bar, barBack, barsBox, barsBoxFront, barsBoxBack, statusPlay, statusPause;
let openButton, menu, selectColorful, selectBgColor, rangeBackBars, rangeCentralBars, rangeFrontBars, range;
let frontBarsHeight, centralBarsHeight, backBarsHeight, overlayMulticolor, audioFile;

barsBoxFront        = document.querySelector('.bars-box-front');
barsBox             = document.querySelector('.bars-box');
barsBoxBack         = document.querySelector('.bars-box-back');
audioFile           = document.getElementById('audioUpload');
selectColorful      = document.getElementById('selectColorful');
selectBgColor       = document.getElementById('bgColor');
range               = document.querySelectorAll('.range');
rangeFrontBars      = document.getElementById('rangeFrontBars');
rangeCentralBars    = document.getElementById('rangeCentralBars');
rangeBackBars       = document.getElementById('rangeBackBars');
audio               = document.getElementById('audio');
audioUploadButton   = document.querySelector('.audio-upload-button');

count = 0;
frontBarsHeight = 1.5;
centralBarsHeight = 3;
backBarsHeight = 5;
barsCount = (window.innerWidth/10) + 1;

for (let i = 0; i < barsCount; i++) {
    let newBarFront = document.createElement('div');
    newBarFront.classList.add('bar-front');
    barsBoxFront.appendChild(newBarFront);
}

for (let i = 0; i < barsCount; i++) {
    let newBar = document.createElement('div');
    newBar.classList.add('bar');
    barsBox.appendChild(newBar);
}

for (let i = 0; i < barsCount; i++) {
    let newBarBack = document.createElement('div');
    newBarBack.classList.add('bar-back');
    barsBoxBack.appendChild(newBarBack);
}

audioFile.addEventListener('change', function() {
    let file = this.files[0];

    if (file) {
        let reader = new FileReader();

        reader.addEventListener('load', function() {
            audio.setAttribute('src', this.result);
            audioUploadButton.style.background = '#34BF41';
        });

        reader.readAsDataURL(file);
    } else {

    }
});

barsBoxFront.onclick = function() {
    if (!ctx) {
       preparation(); 
    }
    
    if (audio.paused) {
        audio.play();  
        loop();
    } else {
        audio.pause();
    }
    

}

function preparation() {
    ctx = new AudioContext();
    analyser = ctx.createAnalyser();
    source = ctx.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(ctx.destination);
    loop();
}

barFront = document.querySelectorAll('.bar-front');
bar = document.querySelectorAll('.bar');
barBack = document.querySelectorAll('.bar-back');
statusPlay = document.querySelector('.status-play');
statusPause = document.querySelector('.status-pause');
overlayMulticolor = document.querySelector('.overlay-multicolor');

selectColorful.addEventListener('change', () => {
    overlayMulticolor.style.display = 'none';
    selectBgColor.disabled = null;
    console.log(selectColorful.value);
    switch (selectColorful.value) {
        case 'default': 
            colorScheme = null;
            break;
        case 'orange': 
            colorScheme = 'rgb(240, 136, 16)';
            break;
        case 'green': 
            colorScheme = 'rgb(46, 248, 66)';
            break;
        case 'blue': 
            colorScheme = 'rgb(74, 104, 255)';
            break;
        case 'red': 
            colorScheme = 'rgb(255, 40, 40)';
            break;
        case 'cyan': 
            colorScheme = 'rgb(94, 255, 240)';
            break;
        case 'white': 
            colorScheme = 'rgb(240, 240, 245)';
            break;
        case 'black':
            colorScheme = 'rgb(0, 0, 0)';
            break;
        case 'multicolor':
            colorScheme = null;
            overlayMulticolor.style.display = 'block';
            selectBgColor.disabled = 'true';
            selectBgColor.value = '#0b0b0b';
            document.body.style.background = selectBgColor.value;
            break;
        case 'multicolor-self':
            colorScheme = 'rgb(255,40,40)';
            overlayMulticolor.style.display = 'block';
            selectBgColor.disabled = 'true';
            selectBgColor.value = '#0b0b0b';
            document.body.style.background = selectBgColor.value;
            break;
        default:
            colorScheme = null;
    }
});

selectBgColor.addEventListener('input', () => {
    document.body.style.background = selectBgColor.value;
});

for (let i = 0; i < range.length; i++) {
    let rangeFrontBarsValue, rangeCentralBarsValue, rangeBackBarsValue;
    rangeFrontBarsValue      = document.getElementById('rangeFrontBarsValue');
    rangeCentralBarsValue    = document.getElementById('rangeCentralBarsValue');
    rangeBackBarsValue       = document.getElementById('rangeBackBarsValue');

    range[i].addEventListener('input', () => {
        frontBarsHeight = Number(rangeFrontBars.value);
        centralBarsHeight = Number(rangeCentralBars.value);
        backBarsHeight = Number(rangeBackBars.value);
        rangeFrontBarsValue.textContent = rangeFrontBars.value;
        rangeCentralBarsValue.textContent = rangeCentralBars.value;
        rangeBackBarsValue.textContent = rangeBackBars.value;
    });
}

function loop() {
    if (!audio.paused) {
        window.requestAnimationFrame(loop);
        statusPlay.classList.add('active');
        statusPause.classList.remove('active');
    } else {
        statusPlay.classList.remove('active');
        statusPause.classList.add('active');
    }

    array = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(array);

    count = 0;
    for (let i = 0; i < barFront.length; i++) {
        barFront[i].style.height = (array[count] * frontBarsHeight) + 'px';
        if (!colorScheme) {
            barFront[i].style.background = 'rgb(' + (array[count]) + ', 40, 40)';
        } else {
            barFront[i].style.background = colorScheme;
        }
        count += 1;
    }

    for (let i = 0; i < bar.length; i++) {
        bar[i].style.height = (array[count] * centralBarsHeight) + 'px';
        if (!colorScheme) {
            bar[i].style.background = 'rgb(' + (array[count]) + ', 40, 40)';
        } else {
            bar[i].style.background = colorScheme;
        }
        count += 1;
    }

    for (let i = 0; i < barBack.length; i++) {
        barBack[i].style.height = (array[count] * backBarsHeight) + 'px';
        if (!colorScheme) {
            barBack[i].style.background = 'rgb(' + (array[count]) + ', 40, 40)';
        } else {
            barBack[i].style.background = colorScheme;
        }
        count += 1;
    }

}

openButton = document.querySelector('.open-button');
menu = document.querySelector('.setting-menu');

openButton.addEventListener('click', () => {
    menu.classList.toggle('active');
    openButton.classList.toggle('active');
});
