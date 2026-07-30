// =========================================================
// ATHENA — gráfico de monitoramento (apresentacao.html)
// Exemplo com dados ilustrativos de um ciclo de 24h,
// simulando a leitura de sensores IoT de temperatura e umidade.
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('graficoMonitoramento');
  if (!canvas || typeof Chart === 'undefined') return;

  const horas = ['00h', '02h', '04h', '06h', '08h', '10h', '12h',
                 '14h', '16h', '18h', '20h', '22h'];

  const temperatura = [21.4, 20.8, 20.2, 20.5, 22.1, 24.6, 27.3,
                        28.9, 28.2, 26.4, 24.1, 22.5];

  const umidade = [58, 60, 63, 62, 57, 50, 44,
                    41, 43, 48, 53, 56];

  const estilo = getComputedStyle(document.documentElement);
  const corOuro = estilo.getPropertyValue('--ouro-forte').trim() || '#e8c37c';
  const corInfo = estilo.getPropertyValue('--info').trim() || '#8db4d6';
  const corTexto = estilo.getPropertyValue('--texto-secundario').trim() || '#b9c0cf';
  const corGrade = 'rgba(247, 239, 216, 0.08)';

  Chart.defaults.font.family = "'Inter', sans-serif";

  new Chart(canvas.getContext('2d'), {
    type: 'line',
    data: {
      labels: horas,
      datasets: [
        {
          label: 'Temperatura (°C)',
          data: temperatura,
          borderColor: corOuro,
          backgroundColor: 'rgba(232, 195, 124, 0.12)',
          pointBackgroundColor: corOuro,
          pointRadius: 3,
          pointHoverRadius: 5,
          borderWidth: 2.4,
          tension: 0.4,
          fill: true,
          yAxisID: 'y'
        },
        {
          label: 'Umidade (%)',
          data: umidade,
          borderColor: corInfo,
          backgroundColor: 'rgba(141, 180, 214, 0.1)',
          pointBackgroundColor: corInfo,
          pointRadius: 3,
          pointHoverRadius: 5,
          borderWidth: 2.4,
          tension: 0.4,
          fill: true,
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#1f2734',
          borderColor: 'rgba(247, 239, 216, 0.15)',
          borderWidth: 1,
          titleColor: '#f7efd8',
          bodyColor: '#b9c0cf',
          padding: 10,
          cornerRadius: 10,
          displayColors: true
        }
      },
      scales: {
        x: {
          grid: { color: corGrade },
          ticks: { color: corTexto }
        },
        y: {
          position: 'left',
          grid: { color: corGrade },
          ticks: { color: corTexto, callback: (v) => v + '°C' },
          title: { display: false }
        },
        y1: {
          position: 'right',
          grid: { display: false },
          ticks: { color: corTexto, callback: (v) => v + '%' }
        }
      }
    }
  });

  // estatísticas rápidas acima do gráfico
  const maxTemp = Math.max(...temperatura).toFixed(1);
  const minTemp = Math.min(...temperatura).toFixed(1);
  const mediaUmid = Math.round(umidade.reduce((a, b) => a + b, 0) / umidade.length);

  const setTexto = (id, texto) => {
    const el = document.getElementById(id);
    if (el) el.textContent = texto;
  };

  setTexto('statMaxTemp', maxTemp + '°C');
  setTexto('statMinTemp', minTemp + '°C');
  setTexto('statMediaUmid', mediaUmid + '%');
});
