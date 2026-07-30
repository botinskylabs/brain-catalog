/* Rendering und Interaktion für Das Digitale Immobilienbüro. */
(function () {
  'use strict';

  var agents = window.AGENTS || [];
  var grid = document.getElementById('teamGrid');
  var roster = document.getElementById('heroRoster');
  var modal = document.getElementById('modal');
  var modalBody = document.getElementById('modalBody');
  var lastFocused = null;

  function esc(value) {
    return String(value).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }

  function photo(agent) {
    // In der Einzeldatei-Fassung liegen die Bilder als Data-URI vor.
    var inlined = window.AGENT_IMAGES;
    return (inlined && inlined[agent.id]) || 'assets/agents/' + agent.id + '.svg';
  }

  function list(items) {
    return items.map(function (item) { return '<li>' + esc(item) + '</li>'; }).join('');
  }

  function block(title, intro, items) {
    if (!items || !items.length) return '';
    return '<div class="detail-block">' +
      '<h3>' + esc(title) + '</h3>' +
      (intro ? '<p class="detail-intro">' + esc(intro) + '</p>' : '') +
      '<ul>' + list(items) + '</ul>' +
      '</div>';
  }

  /* ---------------------------------------------------------- Karten */

  function renderCards() {
    grid.innerHTML = agents.map(function (agent) {
      return '<button class="agent-card' + (agent.lead ? ' is-lead' : '') + '" type="button" data-id="' + esc(agent.id) + '">' +
        (agent.lead ? '<span class="lead-badge">Leitung</span>' : '') +
        '<div class="agent-top">' +
          '<img class="agent-photo" src="' + photo(agent) + '" alt="Profilbild ' + esc(agent.name) + '" width="84" height="84" loading="lazy">' +
          '<div class="agent-heading">' +
            '<span class="agent-nr">' + esc(agent.nr) + '</span>' +
            '<h3 class="agent-name">' + esc(agent.name) + '</h3>' +
            '<span class="agent-role">„' + esc(agent.role) + '“</span>' +
          '</div>' +
        '</div>' +
        '<p class="agent-mission">' + esc(agent.mission) + '</p>' +
        '<div class="agent-tags">' + agent.tags.map(function (tag) {
          return '<span>' + esc(tag) + '</span>';
        }).join('') + '</div>' +
        '<span class="agent-more">Profil ansehen' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>' +
        '</span>' +
      '</button>';
    }).join('');
  }

  function renderRoster() {
    roster.innerHTML = agents.map(function (agent) {
      return '<img src="' + photo(agent) + '" alt="" width="62" height="62">';
    }).join('');
  }

  /* ----------------------------------------------------------- Dialog */

  function openModal(id) {
    var agent = agents.filter(function (a) { return a.id === id; })[0];
    if (!agent) return;

    modalBody.innerHTML =
      '<div class="modal-head">' +
        '<img src="' + photo(agent) + '" alt="Profilbild ' + esc(agent.name) + '" width="108" height="108">' +
        '<div>' +
          '<span class="agent-nr">Agent ' + esc(agent.nr) + '</span>' +
          '<h2 id="modalName">' + esc(agent.name) + '</h2>' +
          '<span class="agent-role">„' + esc(agent.role) + '“</span>' +
        '</div>' +
      '</div>' +
      '<p class="modal-mission">' + esc(agent.mission) + '</p>' +
      '<div class="detail-grid">' +
        block('Verantwortlichkeiten', agent.dutiesIntro, agent.duties) +
        block('Fähigkeiten', agent.skillsIntro, agent.skills) +
        block('Output', agent.outputIntro, agent.output) +
        '<div class="detail-block why">' +
          '<h3>Warum dieser Agent wichtig ist</h3>' +
          '<p>' + esc(agent.why) + '</p>' +
        '</div>' +
      '</div>';

    lastFocused = document.activeElement;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    modal.querySelector('.modal-close').focus();
  }

  function closeModal() {
    modal.hidden = true;
    modalBody.innerHTML = '';
    document.body.style.overflow = '';
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  /* --------------------------------------------------------- Bindings */

  grid.addEventListener('click', function (event) {
    var card = event.target.closest('.agent-card');
    if (card) openModal(card.dataset.id);
  });

  modal.addEventListener('click', function (event) {
    if (event.target.closest('[data-close]')) closeModal();
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && !modal.hidden) closeModal();
  });

  renderCards();
  renderRoster();
})();
