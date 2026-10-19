// O'zbekiston telekanallarining ochiq HLS oqimlari (Stream URL)
const channels = [
  { name: "O'zbekiston 24", url: "https://stream.mtrk.uz/live/uzbekistan24/index.m3u8" },
  { name: "Sport TV", url: "https://stream.mtrk.uz/live/sport/index.m3u8" },
  { name: "O'zbekiston TV", url: "https://stream.mtrk.uz/live/uzbekistan/index.m3u8" },
  { name: "Yoshlar TV", url: "https://stream.mtrk.uz/live/yoshlar/index.m3u8" },
  { name: "Toshkent TV", url: "https://stream.mtrk.uz/live/toshkent/index.m3u8" },
  { name: "Dunyo Bo'ylab", url: "https://stream.mtrk.uz/live/dunyoboylab/index.m3u8" },
  { name: "Madaniyat va Ma'rifat", url: "https://stream.mtrk.uz/live/madaniyat/index.m3u8" },
  { name: "Navo TV", url: "https://stream.mtrk.uz/live/navo/index.m3u8" },
  { name: "Kinoteatr TV", url: "https://stream.mtrk.uz/live/kinoteatr/index.m3u8" },
  { name: "Mahalla TV", url: "https://stream.mtrk.uz/live/mahalla/index.m3u8" }
];

const video = document.getElementById('videoPlayer');
const channelListEl = document.getElementById('channelList');
const currentTitleEl = document.getElementById('currentChannelTitle');
let hls = null;

// Kanallarni ro'yxatga chiqarish
function loadChannels(items) {
  channelListEl.innerHTML = '';
  items.forEach((ch, index) => {
    const div = document.createElement('div');
    div.className = `channel-item ${index === 0 ? 'active' : ''}`;
    div.innerHTML = `<i class="fa-solid fa-play-circle"></i> <span>${ch.name}</span>`;
    div.onclick = () => playChannel(ch, div);
    channelListEl.appendChild(div);
  });
}

// Kanalni pleyerga ulash va ijro etish
function playChannel(channel, element) {
  document.querySelectorAll('.channel-item').forEach(el => el.classList.remove('active'));
  if(element) element.classList.add('active');
  
  currentTitleEl.textContent = channel.name;

  if (Hls.isSupported()) {
    if (hls) hls.destroy();
    hls = new Hls();
    hls.loadSource(channel.url);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, function () {
      video.play();
    });
  } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    // Safari va iOS brauzerlari uchun
    video.src = channel.url;
    video.addEventListener('loadedmetadata', function () {
      video.play();
    });
  }
}

// Qidiruv funksiyasi
function filterChannels() {
  const query = document.getElementById('searchInput').value.toLowerCase();
  const filtered = channels.filter(c => c.name.toLowerCase().includes(query));
  loadChannels(filtered);
}

// Dastlabki yuklanish
loadChannels(channels);
playChannel(channels[0], null);
