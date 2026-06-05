// Estado atual dos sensores do satélite — valores iniciais representam condição nominal
const state = {
  temp:          23.4,
  tempExt:      -48.7,
  voltage:        7.82,
  charge:        84,
  solarA:         2.14,
  solarB:         1.67,  // painel B já começa levemente degradado
  pressure:      98.1,
  vibration:      0.020,
  signal:       -72,
  dataRate:       9.6,
  eventActive:    false,  // true quando tempestade solar está ativa
  critAlertFired: false,  // garante que o alert de emergência dispara só uma vez por evento
};

// Adiciona ruído aleatório ao valor — simula variação natural dos sensores
function jitter(val, delta) {
  return val + (Math.random() * 2 - 1) * delta;
}

// Mantém o valor dentro dos limites físicos do sensor
function clamp(val, min, max) {
  return Math.min(max, Math.max(min, val));
}

// Retorna 'ok', 'warn' ou 'crit' com base nos limites operacionais de cada sensor
function sensorStatus(sensor) {
  switch (sensor) {
    case 'temp':
      if (state.temp < -8   || state.temp > 38)    return 'crit';
      if (state.temp < -5   || state.temp > 35)    return 'warn';
      return 'ok';
    case 'voltage':
      if (state.voltage < 7.3  || state.voltage > 8.3)  return 'crit';
      if (state.voltage < 7.5  || state.voltage > 8.2)  return 'warn';
      return 'ok';
    case 'pressure':
      if (state.pressure < 96.5)  return 'crit';
      if (state.pressure < 99.0)  return 'warn';
      return 'ok';
    case 'signal':
      if (state.signal < -88)  return 'crit';
      if (state.signal < -85)  return 'warn';
      return 'ok';
    case 'solarB':
      if (state.solarB < 1.2)  return 'crit';
      if (state.solarB < 1.6)  return 'warn';
      return 'ok';
    default:
      return 'ok';
  }
}

// Status geral é o pior status entre os sensores principais
function overallStatus() {
  const statuses = ['temp', 'voltage', 'pressure', 'signal'].map(sensorStatus);
  if (statuses.includes('crit')) return 'crit';
  if (statuses.includes('warn')) return 'warn';
  return 'ok';
}

function setEl(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function setDot(id, status) {
  const el = document.getElementById(id);
  if (el) el.className = 'dot dot-' + status;
}

function fmtSigned(val, decimals) {
  return (val >= 0 ? '+' : '') + val.toFixed(decimals);
}

function nowUTC() {
  return new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
}

function timeHMS() {
  return new Date().toISOString().slice(11, 19) + ' UTC';
}

function renderStatusBar(status) {
  setDot('status-dot', status);
  const textEl = document.getElementById('status-text');
  if (!textEl) return;
  const map = {
    ok:   { text: 'OPERACIONAL',    color: 'var(--green)'  },
    warn: { text: '1 ALERTA ATIVO', color: 'var(--yellow)' },
    crit: { text: 'CRÍTICO',        color: 'var(--red)'    },
  };
  textEl.textContent  = map[status].text;
  textEl.style.color  = map[status].color;
}

function renderIndex() {
  setEl('val-temp', fmtSigned(state.temp, 1));
  setEl('val-volt', state.voltage.toFixed(2));
  setEl('val-pres', state.pressure.toFixed(1));
  setEl('val-sig',  state.signal.toFixed(0));
  setDot('dot-temp', sensorStatus('temp'));
  setDot('dot-volt', sensorStatus('voltage'));
  setDot('dot-pres', sensorStatus('pressure'));
  setDot('dot-sig',  sensorStatus('signal'));
  setEl('last-contact', nowUTC());
  renderStatusBar(overallStatus());
}

function renderDashboard() {
  setEl('rv-temp-int',     fmtSigned(state.temp,    1) + ' °C');
  setEl('rv-temp-ext',     fmtSigned(state.tempExt, 1) + ' °C');
  setEl('rv-voltage',      state.voltage.toFixed(2)   + ' V');
  setEl('rv-charge',       state.charge.toFixed(0)    + '%');
  setEl('rv-solar-a',      state.solarA.toFixed(2)    + ' W');
  setEl('rv-solar-b',      state.solarB.toFixed(2)    + ' W');
  setEl('rv-pressure',     state.pressure.toFixed(1)  + ' kPa');
  setEl('rv-vibration',    state.vibration.toFixed(3) + ' g');
  setEl('rv-signal',       state.signal.toFixed(0)    + ' dBm');
  setEl('rv-datarate',     state.dataRate.toFixed(1)  + ' kbps');
  setEl('rv-last-contact', timeHMS());
  setEl('dash-timestamp',  'Última atualização: ' + nowUTC());

  setDot('rd-temp-int', sensorStatus('temp'));
  setDot('rd-voltage',  sensorStatus('voltage'));
  setDot('rd-solar-b',  sensorStatus('solarB'));
  setDot('rd-pressure', sensorStatus('pressure'));
  setDot('rd-signal',   sensorStatus('signal'));

  renderStatusBar(overallStatus());
}

// Insere nova linha no topo da tabela de histórico a cada tick
function appendLogRow() {
  const tbody = document.getElementById('tlog-tbody');
  if (!tbody) return;

  const status = overallStatus();
  const badge = {
    ok:   '<span class="badge badge-ok">OK</span>',
    warn: '<span class="badge badge-warn">Atenção</span>',
    crit: '<span class="badge badge-crit">Crítico</span>',
  }[status];

  const tr = document.createElement('tr');
  tr.innerHTML =
    `<td class="mono">${timeHMS()}</td>` +
    `<td class="mono">${fmtSigned(state.temp, 1)} °C</td>` +
    `<td class="mono">${state.voltage.toFixed(2)} V</td>` +
    `<td class="mono">${state.pressure.toFixed(1)} kPa</td>` +
    `<td class="mono">${state.signal.toFixed(0)} dBm</td>` +
    `<td>${badge}</td>`;

  tbody.insertBefore(tr, tbody.firstChild);
  while (tbody.rows.length > 15) tbody.deleteRow(tbody.rows.length - 1); // limita a 15 registros
}

// Conta o tempo até a próxima janela de comunicação orbital (16:07 UTC)
function updateCountdown() {
  const el = document.getElementById('next-pass-countdown');
  if (!el) return;
  const now  = new Date();
  const next = new Date(now);
  next.setHours(16, 7, 0, 0);
  if (next <= now) next.setDate(next.getDate() + 1); // passa pro dia seguinte se já passou
  const diff = next - now;
  const m = Math.floor(diff / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  el.textContent = String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
}

// Chamado a cada 3s pelo setInterval — atualiza sensores e re-renderiza o painel
function tick() {
  if (state.eventActive) {
    state.pressure  = clamp(jitter(state.pressure,  0.3) - 0.20, 93.0, 101.3);
    state.signal    = clamp(jitter(state.signal,     1.5) - 0.60, -95,  -65);
    state.solarB    = clamp(jitter(state.solarB,     0.07) - 0.04, 0.8,  2.2);
    state.temp      = clamp(jitter(state.temp,       0.5),        -10,   40);
    state.voltage   = clamp(jitter(state.voltage,    0.05),        7.2,   8.4);
    state.charge    = clamp(jitter(state.charge,     0.3) - 0.15,  20,  100);
  } else {
    state.temp      = clamp(jitter(state.temp,      0.30),  -5,  36);
    state.tempExt   = clamp(jitter(state.tempExt,   1.20), -62,  10);
    state.voltage   = clamp(jitter(state.voltage,   0.04),  7.5,  8.2);
    state.charge    = clamp(jitter(state.charge,    0.20),  76,  94);
    state.solarA    = clamp(jitter(state.solarA,    0.06),  1.8,  2.5);
    state.solarB    = clamp(jitter(state.solarB,    0.05),  1.5,  1.9);
    state.pressure  = clamp(jitter(state.pressure,  0.15),  97.8, 101.0);
    state.signal    = clamp(jitter(state.signal,    1.00), -78,  -65);
    state.dataRate  = clamp(jitter(state.dataRate,  0.20),   9.0,  10.2);
    state.vibration = clamp(jitter(state.vibration, 0.005),  0.01,  0.05);
  }

  const status = overallStatus();
  // Dispara alerta de emergência do browser quando algum sensor entra em nível crítico
  if (status === 'crit' && !state.critAlertFired) {
    state.critAlertFired = true;
    setTimeout(() => {
      window.alert(
        'ALERTA CRÍTICO — FIAP-SAT 1\n\n' +
        'Parâmetros fora dos limites operacionais.\n' +
        'Acione protocolo de emergência imediatamente.'
      );
    }, 300);
  }

  render();
  appendLogRow();
}

function render() {
  if (document.getElementById('val-temp')) {
    renderIndex();
  } else {
    renderDashboard();
  }
}

// Ativa modo de tempestade solar — sensores começam a degradar progressivamente
function simulateStorm() {
  state.eventActive    = true;
  state.critAlertFired = false;
  const btn = document.getElementById('btn-storm');
  if (btn) btn.disabled = true;
}

// Volta tudo ao estado nominal e reabilita o botão de simulação
function resetSystem() {
  state.eventActive    = false;
  state.critAlertFired = false;
  state.pressure       = 99.8;
  state.signal         = -70;
  state.solarB         = 1.85;
  state.voltage        = 7.90;
  state.charge         = 88;
  const btn = document.getElementById('btn-storm');
  if (btn) btn.disabled = false;
  render();
}

// Inicializa tudo após o HTML carregar
document.addEventListener('DOMContentLoaded', () => {
  const stormBtn = document.getElementById('btn-storm');
  const resetBtn = document.getElementById('btn-reset');
  if (stormBtn) stormBtn.addEventListener('click', simulateStorm);
  if (resetBtn) resetBtn.addEventListener('click', resetSystem);

  render();
  setInterval(tick, 3000);        // atualiza telemetria a cada 3 segundos
  setInterval(updateCountdown, 1000); // countdown do próximo passe orbital a cada segundo
});
