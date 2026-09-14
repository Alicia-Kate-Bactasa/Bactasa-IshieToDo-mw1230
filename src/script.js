const playBtn = document.getElementById('playBtn');

if (playBtn) {
  playBtn.addEventListener('click', () => {
    playBtn.style.display = 'none';
    maze.style.display = 'flex';
    generateBubbles();
  });
}