let audio, ctx, analyser, source, array, logo;

logo  = document.getElementById('logo');
audio = document.getElementById('audio');

window.onclick = function() {
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
    console.log("Prepare");
    ctx = new AudioContext();
    analyser = ctx.createAnalyser();
    source = ctx.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(ctx.destination);
    loop();
}

function loop() {
    if (!audio.paused) {
        window.requestAnimationFrame(loop);
    }
    array = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(array);

    logo.height = (array[40]) + 'px';
    logo.width = (array[40]) + 'px';
}
