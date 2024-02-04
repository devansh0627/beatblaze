let currentSong = new Audio();
var prevVolume='25';
let defaultVolumeCounter=false;//inorder to set the volume of the first played song as by default it will inherit system's volume level 100 rather than following our 25
let isPlaying = false;
let autoPlay='repeat-all'
let shuffle=false;
async function getSongs() {
  let a = await fetch("/songs/");
  let response = await a.text();
  console.log(response);
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  let songs = [];
  for (let i = 0; i < as.length; i++) {
    const e = as[i];

    if (e.href.endsWith(".mp3")) {
      songs.push(e.href);
    }
  }
  return songs;
}

function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}
const playMusic = (track) => {
  currentSong.src = "/songs/" + track + ".mp3";
  console.log(currentSong.src);
  currentSong.play();
  if(defaultVolumeCounter==false){
    defaultVolumeCounter=true;
    updateVolume();
  }
  isPlaying = true;
  playy.src = "images/pause.svg";
  document.querySelector(".songInfo").innerHTML = track;
  document.querySelector(".songTime").innerHTML = "00:00 / 00:00";
  const p2 = "playNow_" + currentSong.src;
  document.getElementById(currentSong.src).style.color = `#dcc8b5 `;
  document.getElementById("img_" + currentSong.src).src = "images/music2.svg";
  console.log(document.getElementById(p2).innerHTML);
  document.getElementById(
    p2
  ).innerHTML = `<div class="contaVis" id="visualizer">
    <div class="bar"></div>
    <div class="bar"></div>
    <div class="bar"></div>
    <div class="bar"></div>
  </div>`;
  visuals();
};
const pauseMusic = () => {
  if (currentSong) {
    currentSong.pause();
    const p2 = "playNow_" + currentSong.src;
    const playNowElement = document.getElementById(p2);
    const x = document.getElementById(currentSong.src);
    const y = document.getElementById("img_" + currentSong.src);
    console.log(x);
    if (x && y) { x.style.color = `white`; y.src = "images/music.svg"; }
    if (playNowElement) {
      playNowElement.innerHTML = `<span>Play Now</span>
                <img src="images/play_button_bottom.svg" alt="">`;
    }

    isPlaying = false;
    playy.src = "images/play_button_bottom.svg";
  } else
    console.error("currentSong is not defined.");
};
// update volume function
const updateVolume=(volumeString='25')=>{
  const volumeIcon = document.getElementById("volumeIcon");
  const volumeLevelDisplay = document.querySelector('.volume-level');
  let volumeInt=parseInt(volumeString);
  currentSong.volume=volumeInt/100;
  volumeLevelDisplay.textContent = volumeInt;
  if(volumeInt==0){
    volumeIcon.src = 'images/volume_mute.svg';
  }
  else if (volumeInt < 30) {
    volumeIcon.src = 'images/volume_low.svg';
  } else if (volumeInt >= 30 && volumeInt <= 60) {
    volumeIcon.src = 'images/volume_medium.svg';
  } else {
    volumeIcon.src = 'images/volume_high.svg';
  }
}
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}
function songUrlToSongName(url){
  //Spliting to get song name
  const parts = url.split("/");
  const encodedFilename = parts[parts.length - 1];
  const filename = decodeURIComponent(encodedFilename.replace(/\+/g, " "));
  const songName = filename.replace(".mp3", ""); // Remove the '.mp3' extension
  return songName;
}

const visuals = () => {
  const container = document.getElementById("visualizer");
  const bars = Array.from(container.getElementsByClassName("bar"));

  bars.forEach((bar, index) => {
    // Adjust these values based on your preference
    const duration = '0.7s';  // Fixed duration
    const delay = index * 0.1 + 's';  // Add a small delay for each bar

    bar.style.animation = `raiseBar ${duration} infinite cubic-bezier(.13,.44,1,.62)`;
    bar.style.animationDelay = delay;
  });
};
async function main() {
  //Get list of all songs
  let songs = await getSongs();
  let playbar = document.querySelector(".playbar");
  console.log(songs);
  let songUl = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
  // Show all the songs
  for (const song of songs) {
    const songName=songUrlToSongName(song);
    // Generate a unique id for each playnow div
    const playNowId = "playNow_" + song;
    const imgId = "img_" + song;
    songUl.innerHTML += `<li>
        <img id="${imgId}" src="images/music.svg" alt="">
        <div class="info">
            <div id="${song}">${songName}</div>
        </div>
        <div class="playnow" id="${playNowId}">
            <span>Play Now</span>
            <img src="images/play_button_bottom.svg" alt="">
        </div>
    </li>`;
  }
  //Attach an event listener to each song and then create a playMusic function to play
  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      console.log(e.querySelector(".info").firstElementChild.innerHTML);
      pauseMusic();
      playMusic(e.querySelector(".info").firstElementChild.innerHTML);
      playbar.style.visibility = "visible"; // Show the playbar when selecting a song
    });
  });
  //Attach an event listener to prev,playy and next
  playy.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      playy.src = "images/pause.svg";
      playbar.style.visibility = "visible";
      const p2 = "playNow_" + currentSong.src;
      document.getElementById("img_" + currentSong.src).src = "images/music2.svg";
      document.getElementById(currentSong.src).style.color = `#dcc8b5 `;
      document.getElementById(
        p2
      ).innerHTML = `<div class="contaVis" id="visualizer">
    <div class="bar"></div>
    <div class="bar"></div>
    <div class="bar"></div>
    <div class="bar"></div>
  </div>`;
      visuals();
    } else {
      currentSong.pause();
      playy.src = "images/play_button_bottom.svg";
      const p2 = "playNow_" + currentSong.src;
      document.getElementById(currentSong.src).style.color = `white`;
      const imgId = "img_" + currentSong.src;
      document.getElementById(imgId).src = "images/music.svg";
      document.getElementById(p2).innerHTML = `<span>Play Now</span>
            <img src="images/play_button_bottom.svg" alt="">`;
    }
  });
  //if current song paused with the external device so that's why event added to currentSong rather than only for play button
  currentSong.addEventListener("play", () => {
    isPlaying = true;
    playy.src = "images/pause.svg";
    const p2 = "playNow_" + currentSong.src;
    document.getElementById(currentSong.src).style.color = `#dcc8b5 `;
    document.getElementById("img_" + currentSong.src).src = "images/music2.svg";
    document.getElementById(
      p2
    ).innerHTML = `<div class="contaVis" id="visualizer">
    <div class="bar"></div>
    <div class="bar"></div>
    <div class="bar"></div>
    <div class="bar"></div>
  </div>`;
    visuals();
  });

  currentSong.addEventListener("pause", () => {
    isPlaying = false;
    playy.src = "images/play_button_bottom.svg";
    const p2 = "playNow_" + currentSong.src;
    document.getElementById(currentSong.src).style.color = `white`;
    document.getElementById("img_" + currentSong.src).src = "images/music.svg";
    document.getElementById(p2).innerHTML = `<span>Play Now</span>
            <img src="images/play_button_bottom.svg" alt="">`;
  });
  // autoPlay and shuffling
  currentSong.addEventListener("ended",()=>{
    pauseMusic();
    if(autoPlay=='repeat-none')
    return;
    else if(autoPlay=='repeat-one'){
      const songName =songUrlToSongName(currentSong.src);
      playMusic(songName);
    }
    else{
      let idx=songs.indexOf(currentSong.src);
      if(shuffle==false && idx+1<songs.length){
      const songName =songUrlToSongName(songs[idx+1]);
      playMusic(songName);
      }
      else if(shuffle==true){
        let mini=0,maxi=songs.length-1;
        let newIdx=songs.indexOf(currentSong.src),currIdx=songs.indexOf(currentSong.src);
        let cnt=0;//just for hypothetical case that it's not able to find random number within our desired time complexity
        while(newIdx==currIdx || newIdx==currIdx+1){
        newIdx=Math.floor(Math.random()*(maxi-mini+1)+mini);
        cnt++;
        if(cnt==1e5)
        {
          if(songs.length==2)// for song length 2 
          newIdx=currIdx==1?0:1;
          else if(currIdx+2<songs.length)
          newIdx=currIdx+2;
          else
          newIdx=0;
          break;
        }
        }
        const songName=songUrlToSongName(songs[newIdx]);
        playMusic(songName);
      }
    }
  });
  //autoplay icon operations
  document.getElementById('autoPlay').addEventListener("click",() => {
    let x=document.getElementById('autoPlay');
    if(autoPlay=='repeat-all'){
      x.src='images/repeat_one.svg';
      autoPlay='repeat-one';
      console.log(autoPlay);
    }
    else if(autoPlay=='repeat-one'){
      x.src='images/repeat_none.svg';
      autoPlay='repeat-none';
      console.log(autoPlay);
    }
    else{
      x.src='images/repeat_all.svg';
      autoPlay='repeat-all';
      console.log(autoPlay);
    }
  }
  );
  //shuffle icon
  document.getElementById('shuffle').addEventListener('click',() => {
    let x=document.getElementById('shuffle');
    if(shuffle==true){
      shuffle=false;
      x.src='images/shuffle2.svg';
    }
    else{
      shuffle=true;
      x.src='images/shuffle.svg';
    }
  }
  );
  //Listen for timeupdate event
  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songTime").innerHTML = `${secondsToMinutesSeconds(
      currentSong.currentTime
    )} / ${secondsToMinutesSeconds(currentSong.duration)}`;
    let percent= (currentSong.currentTime / currentSong.duration) * 100;
    document.querySelector(".circle").style.left =percent + "%";
    let x=document.querySelector('.seekbar');
    x.style.background=`linear-gradient(to right, white ${percent}%, grey ${percent}%)`;
    //check documentation for linear gradient if interested or needed.
  });
  // Add an event listener to seekbar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    let x=document.querySelector('.seekbar');
    document.querySelector(".circle").style.left = percent + "%";
    x.style.background=`linear-gradient(to right, white ${percent}%, grey ${percent}%)`;
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });
  // Add an event listener for hamburger
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });
  // Add an event listener for close button
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
  });
  // Add an event listener to previous
  prev.addEventListener("click", () => {
    console.log("Previous clicked")
    let index;
    if(currentSong)
    index = songs.indexOf(currentSong.src)
    if(index==0)
    return;
    else if ((index - 1) >= 0) {
      pauseMusic();
      const songName =songUrlToSongName(songs[index-1]);
      playMusic(songName);
    }
  })

  // Add an event listener to next
  next.addEventListener("click", () => {
    console.log("Next clicked")
    let index;
    if(currentSong)
    index = songs.indexOf(currentSong.src);
    if(index==songs.length-1)
    return;
    else if ((index + 1) < songs.length) {
      pauseMusic();
      const songName =songUrlToSongName(songs[index+1]);
      playMusic(songName);
    }
  });
  // Volume levels
  const volumeSlider = document.querySelector('.volume-slider');
  volumeSlider.addEventListener('input',()=>{
    updateVolume(volumeSlider.value);
  });
  // event when volume icon is clicked
  let volume_icon=document.getElementById("volumeIcon");
  volume_icon.addEventListener("click",()=>{
    if(volumeSlider.value==0){
    updateVolume(prevVolume);
    volumeSlider.value=prevVolume;
    }
    else
    {
      prevVolume=volumeSlider.value;
      updateVolume('0');
      volumeSlider.value='0';
    }
  });
  // dynamically styling for range
  const range = document.querySelector('.volume-slider');
  range.addEventListener('input', (e) => {
    const percent = (e.target.value - e.target.min) / (e.target.max - e.target.min) * 100;
    range.style.background = `linear-gradient(to right, white ${percent}%, grey ${percent}%)`;
  });
  window.addEventListener('load',()=>{
    const percent = (prevVolume - 0) / (100) * 100;
    range.style.background = `linear-gradient(to right, white ${percent}%, grey ${percent}%)`;
  });
}
main();
