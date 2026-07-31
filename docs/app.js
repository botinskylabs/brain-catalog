/* Rendering und Interaktion für Das Digitale Immobilienbüro. */
(function () {
  'use strict';

  var agents = window.AGENTS || [];
  var grid = document.getElementById('teamGrid');
  var strip = document.getElementById('filmstrip');
  var panel = document.getElementById('panel');
  var backdrop = document.getElementById('backdrop');
  var panelBody = document.getElementById('panelBody');
  var lastFocused = null;

  function esc(value) {
    return String(value).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }

  function photo(agent) {
    // Reihenfolge: eingebettet (Einzeldatei) > Foto > Platzhalter-Silhouette.
    var inlined = window.AGENT_IMAGES;
    if (inlined && inlined[agent.id]) return inlined[agent.id];
    var photos = window.AGENT_PHOTOS || {};
    return 'assets/agents/' + (photos[agent.id] || agent.photo || agent.id + '.svg');
  }

  function block(title, intro, items) {
    if (!items || !items.length) return '';
    return '<section>' +
      '<h3 class="label">' + esc(title) + '</h3>' +
      (intro ? '<p class="intro">' + esc(intro) + '</p>' : '') +
      '<ul>' + items.map(function (item) {
        return '<li>' + esc(item) + '</li>';
      }).join('') + '</ul>' +
      '</section>';
  }

  /* ------------------------------------------------------------ Aufbau */

  function renderTeam() {
    grid.innerHTML = agents.map(function (agent) {
      return '<button class="agent" type="button" data-id="' + esc(agent.id) + '">' +
        '<img class="agent-photo" src="' + photo(agent) + '" alt="Portrait ' + esc(agent.name) + '" width="300" height="400" loading="lazy">' +
        '<span class="agent-meta">' +
          '<span class="label num">' + esc(agent.nr) + '</span>' +
          '<span class="agent-name">' + esc(agent.name) + '</span>' +
          '<span class="agent-role">' + esc(agent.role) + '</span>' +
          '<span class="agent-mission">' + esc(agent.mission) + '</span>' +
        '</span>' +
      '</button>';
    }).join('');
  }

  function renderStrip() {
    strip.innerHTML = agents.map(function (agent) {
      return '<figure>' +
        '<img src="' + photo(agent) + '" alt="" width="300" height="400">' +
        '<figcaption class="num">' + esc(agent.nr) + '</figcaption>' +
      '</figure>';
    }).join('');
  }

  /* ------------------------------------------------------------- Panel */

  function openPanel(id) {
    var agent = agents.filter(function (a) { return a.id === id; })[0];
    if (!agent) return;

    panelBody.innerHTML =
      '<div class="panel-head">' +
        '<img src="' + photo(agent) + '" alt="Portrait ' + esc(agent.name) + '" width="300" height="400">' +
        '<span class="label num">Rolle ' + esc(agent.nr) + '</span>' +
        '<h2 id="panelName">' + esc(agent.name) + '</h2>' +
        '<span class="agent-role">' + esc(agent.role) + '</span>' +
      '</div>' +
      '<p class="panel-mission">' + esc(agent.mission) + '</p>' +
      '<div class="detail">' +
        block('Verantwortlichkeiten', agent.dutiesIntro, agent.duties) +
        block('Fähigkeiten', agent.skillsIntro, agent.skills) +
        block('Output', agent.outputIntro, agent.output) +
        '<section class="why">' +
          '<h3 class="label">Warum diese Rolle</h3>' +
          '<p>' + esc(agent.why) + '</p>' +
        '</section>' +
      '</div>';

    lastFocused = document.activeElement;
    panel.hidden = false;
    backdrop.hidden = false;
    // Erst im nächsten Frame öffnen, damit die Bewegung sichtbar wird.
    requestAnimationFrame(function () { document.body.classList.add('panel-open'); });
    document.body.style.overflow = 'hidden';
    document.getElementById('panelClose').focus();
  }

  function closePanel() {
    document.body.classList.remove('panel-open');
    document.body.style.overflow = '';
    window.setTimeout(function () {
      panel.hidden = true;
      backdrop.hidden = true;
      panelBody.innerHTML = '';
    }, 320);
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  /* ---------------------------------------------------------- Bindings */

  grid.addEventListener('click', function (event) {
    var card = event.target.closest('.agent');
    if (card) openPanel(card.dataset.id);
  });

  backdrop.addEventListener('click', closePanel);
  document.getElementById('panelClose').addEventListener('click', closePanel);

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && !panel.hidden) closePanel();
  });

  renderTeam();
  renderStrip();
})();
