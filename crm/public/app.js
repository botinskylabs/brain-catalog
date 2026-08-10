const $ = (sel) => document.querySelector(sel)

const state = {
  meta: { statuses: [], interaction_types: [] },
  contacts: [],
  selected: null,
}

const TYPE_LABELS = {
  call: '📞 Anruf',
  email: '✉️ E-Mail',
  meeting: '🤝 Meeting',
  message: '💬 Nachricht',
  note: '📝 Notiz',
  other: '• Sonstiges',
}

async function api(path, options = {}) {
  const res = await fetch(`/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  })
  const data = res.status === 204 ? null : await res.json()
  if (!res.ok) throw new Error(data?.error || `Fehler ${res.status}`)
  return data
}

function toast(message) {
  const el = document.createElement('div')
  el.className = 'toast'
  el.textContent = message
  document.body.append(el)
  setTimeout(() => el.remove(), 2600)
}

const fmtDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' }) : ''

const fmtDateTime = (iso) =>
  iso ? new Date(iso).toLocaleString('de-DE', { dateStyle: 'medium', timeStyle: 'short' }) : ''

function ageCell(contact) {
  if (!contact.last_contact_at) return '<span class="age never">nie</span>'
  const days = contact.days_since_contact
  const cls = days >= 90 ? 'cold' : days >= 30 ? 'warn' : ''
  const rel = days === 0 ? 'heute' : days === 1 ? 'gestern' : `vor ${days} Tagen`
  return `<span class="age ${cls}" title="${fmtDateTime(contact.last_contact_at)}">${rel}</span>`
}

const escape = (value) =>
  String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])

// ---------------------------------------------------------------- Liste

function currentFilter() {
  const filter = {
    q: $('#search').value.trim(),
    status: $('#status-filter').value,
    tag: $('#tag-filter').value,
    sort: $('#sort').value,
    limit: 200,
  }
  if ($('#due-only').checked) filter.due = 'true'
  if ($('#stale-only').checked) filter.stale_days = 30
  return Object.fromEntries(Object.entries(filter).filter(([, v]) => v !== '' && v !== undefined))
}

async function refresh() {
  const query = new URLSearchParams(currentFilter()).toString()
  const [list, stats, tags] = await Promise.all([
    api(`/contacts?${query}`),
    api('/stats'),
    api('/tags'),
  ])
  state.contacts = list.items
  renderStats(stats)
  renderTags(tags.items)
  renderRows(list)
}

function renderStats(stats) {
  const chips = [
    { label: 'Kontakte', value: stats.total_contacts },
    { label: 'Follow-ups fällig', value: stats.follow_ups_due, alert: stats.follow_ups_due > 0 },
    { label: '> 30 Tage still', value: stats.without_contact_30d, alert: stats.without_contact_30d > 0 },
    { label: 'Kontaktpunkte (30 T.)', value: stats.interactions_last_30d },
  ]
  $('#stats').innerHTML = chips
    .map((c) => `<span class="stat ${c.alert ? 'alert' : ''}">${c.label} <b>${c.value}</b></span>`)
    .join('')
}

function renderTags(tags) {
  const select = $('#tag-filter')
  const current = select.value
  select.innerHTML =
    '<option value="">Alle Tags</option>' +
    tags.map((t) => `<option value="${escape(t.tag)}">${escape(t.tag)} (${t.count})</option>`).join('')
  select.value = current
}

function renderRows(list) {
  const rows = list.items
    .map(
      (c) => `
      <tr data-id="${c.id}">
        <td>
          <div class="name">${escape(c.name)}</div>
          ${c.role ? `<div class="sub">${escape(c.role)}</div>` : ''}
        </td>
        <td>${escape(c.company ?? '')}</td>
        <td><span class="badge status-${escape(c.status)}">${escape(c.status)}</span></td>
        <td>${c.tags.map((t) => `<span class="tag">${escape(t)}</span>`).join('')}</td>
        <td>${ageCell(c)}</td>
        <td class="${c.follow_up_overdue ? 'due' : ''}">${fmtDate(c.next_follow_up)}</td>
        <td class="right">
          <button class="btn tiny log-btn" data-id="${c.id}">Kontakt loggen</button>
        </td>
      </tr>`,
    )
    .join('')
  $('#rows').innerHTML = rows
  $('#empty').hidden = list.items.length > 0
  $('#count').textContent = `${list.items.length} von ${list.total} Kontakten`
}

// ---------------------------------------------------------------- Drawer

function openDrawer(contact) {
  state.selected = contact
  const form = $('#contact-form')
  form.reset()
  $('#drawer-title').textContent = contact ? contact.name : 'Neuer Kontakt'
  $('#delete-contact').hidden = !contact
  $('#history-section').hidden = !contact

  if (contact) {
    for (const field of ['name', 'company', 'role', 'email', 'phone', 'website', 'notes', 'next_follow_up']) {
      if (form.elements[field]) form.elements[field].value = contact[field] ?? ''
    }
    form.elements.status.value = contact.status
    form.elements.tags.value = contact.tags.join(', ')
    renderTimeline(contact.interactions ?? [])
    $('#interaction-form').elements.occurred_at.value = localDateTime(new Date())
  }

  $('#drawer').hidden = false
  $('#backdrop').hidden = false
  form.elements.name.focus()
}

function closeDrawer() {
  $('#drawer').hidden = true
  $('#backdrop').hidden = true
  state.selected = null
}

function localDateTime(date) {
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function renderTimeline(interactions) {
  if (!interactions.length) {
    $('#timeline').innerHTML = '<li class="sub">Noch keine Einträge.</li>'
    return
  }
  $('#timeline').innerHTML = interactions
    .map(
      (i) => `
      <li>
        <div class="meta">
          <span>${TYPE_LABELS[i.type] ?? i.type}</span>
          <span>${fmtDateTime(i.occurred_at)}</span>
          <button class="btn tiny ghost del-interaction" data-id="${i.id}" title="Löschen">✕</button>
        </div>
        ${i.subject ? `<div class="subject">${escape(i.subject)}</div>` : ''}
        ${i.notes ? `<div class="notes">${escape(i.notes)}</div>` : ''}
      </li>`,
    )
    .join('')
}

function formValues(form) {
  const data = Object.fromEntries(new FormData(form))
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string' && value.trim() === '') data[key] = null
  }
  return data
}

// ---------------------------------------------------------------- Events

$('#new-contact').addEventListener('click', () => openDrawer(null))
$('#drawer-close').addEventListener('click', closeDrawer)
$('#backdrop').addEventListener('click', closeDrawer)
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !$('#drawer').hidden) closeDrawer()
})

let searchTimer
$('#search').addEventListener('input', () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(refresh, 200)
})
for (const id of ['#status-filter', '#tag-filter', '#sort', '#due-only', '#stale-only']) {
  $(id).addEventListener('change', refresh)
}

$('#rows').addEventListener('click', async (event) => {
  const logBtn = event.target.closest('.log-btn')
  const row = event.target.closest('tr[data-id]')
  if (!row) return
  const contact = await api(`/contacts/${row.dataset.id}`)
  openDrawer(contact)
  if (logBtn) $('#interaction-form').elements.subject.focus()
})

$('#contact-form').addEventListener('submit', async (event) => {
  event.preventDefault()
  const values = formValues(event.target)
  values.tags = values.tags ? values.tags.split(',').map((t) => t.trim()).filter(Boolean) : []
  try {
    if (state.selected) {
      const updated = await api(`/contacts/${state.selected.id}`, { method: 'PATCH', body: values })
      state.selected = updated
      $('#drawer-title').textContent = updated.name
      toast('Gespeichert')
    } else {
      const created = await api('/contacts', { method: 'POST', body: values })
      openDrawer(created)
      toast('Kontakt angelegt')
    }
    await refresh()
  } catch (err) {
    toast(err.message)
  }
})

$('#delete-contact').addEventListener('click', async () => {
  if (!state.selected) return
  if (!confirm(`"${state.selected.name}" wirklich löschen? Die Historie geht mit.`)) return
  try {
    await api(`/contacts/${state.selected.id}`, { method: 'DELETE' })
    closeDrawer()
    await refresh()
    toast('Gelöscht')
  } catch (err) {
    toast(err.message)
  }
})

$('#interaction-form').addEventListener('submit', async (event) => {
  event.preventDefault()
  if (!state.selected) return
  const values = formValues(event.target)
  if (values.occurred_at) values.occurred_at = new Date(values.occurred_at).toISOString()
  try {
    await api(`/contacts/${state.selected.id}/interactions`, { method: 'POST', body: values })
    const contact = await api(`/contacts/${state.selected.id}`)
    state.selected = contact
    renderTimeline(contact.interactions)
    event.target.reset()
    $('#interaction-form').elements.occurred_at.value = localDateTime(new Date())
    await refresh()
    toast('Kontaktpunkt eingetragen')
  } catch (err) {
    toast(err.message)
  }
})

$('#timeline').addEventListener('click', async (event) => {
  const btn = event.target.closest('.del-interaction')
  if (!btn || !state.selected) return
  await api(`/interactions/${btn.dataset.id}`, { method: 'DELETE' })
  const contact = await api(`/contacts/${state.selected.id}`)
  state.selected = contact
  renderTimeline(contact.interactions)
  await refresh()
})

// ---------------------------------------------------------------- Start

async function init() {
  state.meta = await api('/meta')
  $('#status-filter').innerHTML =
    '<option value="">Alle Status</option>' +
    state.meta.statuses.map((s) => `<option value="${s}">${s}</option>`).join('')
  $('#contact-form').elements.status.innerHTML = state.meta.statuses
    .map((s) => `<option value="${s}">${s}</option>`)
    .join('')
  $('#interaction-form').elements.type.innerHTML = state.meta.interaction_types
    .map((t) => `<option value="${t}"${t === 'call' ? ' selected' : ''}>${TYPE_LABELS[t] ?? t}</option>`)
    .join('')
  await refresh()
}

init().catch((err) => toast(err.message))
