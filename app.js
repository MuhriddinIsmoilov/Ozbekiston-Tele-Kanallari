// Telekanallar ro'yxati va zaxira embed havolalari
const channels = [
  { 
    name: "O'zbekiston 24", 
    stream: "https://stream.mtrk.uz/live/uzbekistan24/index.m3u8",
    embed: "https://famelack.com"
  },
  { 
    name: "Sport TV", 
    stream: "https://stream.mtrk.uz/live/sport/index.m3u8",
    embed: "https://famelack.com"
  },
  { 
    name: "O'zbekiston TV", 
    stream: "https://stream.mtrk.uz/live/uzbekistan/index.m3u8",
    embed: "https://famelack.com"
  },
  { 
    name: "Yoshlar TV", 
    stream: "https://stream.mtrk.uz/live/yoshlar/index.m3u8",
    embed: "https://famelack.com"
  },
  { 
    name: "Toshkent TV", 
    stream: "https://stream.mtrk.uz/live/toshkent/index.m3u8",
    embed: "https://famelack.com"
  },
  { 
    name: "Mahalla TV", 
    stream: "https://stream.mtrk.uz/live/mahalla/index.m3u8",
    embed: "https://famelack.com"
  }
];

const video = document.getElementById('videoPlayer');
const iframe = document.getElementById('iframePlayer');
const channelListEl = document.getElementById('channelList');
const currentTitleEl = document.getElementById('currentChannelTitle');
let hls = null;

function loadChannels(items) {
  channelListEl.innerHTML = '';
  items.forEach((ch, index) => {
    const div = document.createElement('div');
    div.className = `channel-item ${index === 0 ? 'active' : ''}`;
    div.innerHTML = `<i class="fa-solid fa-circle-play"></i> <span>${ch.name}</span>`;
    div.onclick = () => playChannel(ch, div);
    channelListEl.appendChild(div);
  });
}

function playChannel(channel, element) {
  document.querySelectorAll('.channel-item').forEach(el => el.classList.remove('active'));
  if (element) element.classList.add('active');
  
  currentTitleEl.textContent = channel.name;

  // HLS streamni yuklashga urinib ko'rish
  if (Hls.isSupported()) {
    if (hls) hls.destroy();
    hls = new Hls({
      enableWorker: true,
      lowLatencyMode: true
    });
    
    // CORS blokirovkasini aylanib o'tish uchun Proxy
    const proxyUrl = "https://corsproxy.io/?" + encodeURIComponent(channel.stream);
    
    hls.loadSource(proxyUrl);
    hls.attachMedia(video);
    
    iframe.style.display = 'none';
    video.style.display = 'block';

    hls.on(Hls.Events.MANIFEST_PARSED, function () {
      video.play().catch(() => {});
    });

    // Agar HLS yuklanmasa, zaxira iframe rejimiga o'tadi
    hls.on(Hls.Events.ERROR, function (event, data) {
      if (data.fatal) {
        showIframeFallback(channel.embed);
      }
    });

  } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    // Safari / iOS uchun
    video.src = channel.stream;
    iframe.style.display = 'none';
    video.style.display = 'block';
    video.play();
  } else {
    showIframeFallback(channel.embed);
  }
}

function showIframeFallback(embedUrl) {
  video.style.display = 'none';
  iframe.style.display = 'block';
  iframe.src = embedUrl;
}

function filterChannels() {
  const query = document.getElementById('searchInput').value.toLowerCase();
  const filtered = channels.filter(c => c.name.toLowerCase().includes(query));
  loadChannels(filtered);
}

// Boshlang'ich yuklash
loadChannels(channels);
playChannel(channels[0], null);
