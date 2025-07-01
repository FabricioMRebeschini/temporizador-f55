const timers = Array.from({ length: 4 }, (_, i) => {
  const saved = localStorage.getItem(`timer${i}`);
  return {
    start: null,
    interval: null,
    elapsed: saved ? parseInt(saved) : 0
  };
});

window.onload = () => {
  timers.forEach((t, i) => {
    document.getElementById(`display${i + 1}`).value = formatTime(t.elapsed);
  });
  atualizarTotal();
};

function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const h = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const s = String(totalSeconds % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

function toggleTimer(index) {
  const timer = timers[index];
  const display = document.getElementById(`display${index + 1}`);

  if (timer.interval) {
    clearInterval(timer.interval);
    timer.elapsed += Date.now() - timer.start;
    timer.interval = null;
    localStorage.setItem(`timer${index}`, timer.elapsed);
    atualizarTotal();
  } else {
    timer.start = Date.now();
    timer.interval = setInterval(() => {
      const now = Date.now() - timer.start + timer.elapsed;
      display.value = formatTime(now);
      localStorage.setItem(`timer${index}`, now);
      atualizarTotal();
    }, 1000);
  }
}

function resetTimer(index) {
  const timer = timers[index];
  clearInterval(timer.interval);
  timer.start = null;
  timer.elapsed = 0;
  timer.interval = null;
  localStorage.removeItem(`timer${index}`);
  document.getElementById(`display${index + 1}`).value = "00:00:00";
  atualizarTotal();
}

function atualizarTotal() {
  const total = timers.reduce((acc, t) => {
    const atual = t.interval ? (Date.now() - t.start + t.elapsed) : t.elapsed;
    return acc + atual;
  }, 0);
  document.getElementById("totalGeral").textContent = formatTime(total);
}

function enviarParaWhatsapp() {
  const labels = ["Abastecimento", "Deslocamento cheio", "Aplicação", "Deslocamento vazio"];
  const tempos = labels.map((label, i) => {
    const val = document.getElementById(`display${i + 1}`).value;
    return `${label}: ${val}`;
  }).join("%0A");

  const total = document.getElementById("totalGeral").textContent;
  const numero = document.getElementById("numeroDestino").value.trim();

 if (!numero.match(/^5567\d{8,9}$/)) {
  alert("Número inválido. Deve começar com 5567 e conter de 12 a 13 dígitos no total.");
  return;
}


  const mensagem = `Tempos registrados:%0A${tempos}%0A%0ATotal: ${total}`;
  const url = `https://wa.me/${numero}?text=${mensagem}`;
  window.open(url, '_blank');
}

