import * as crm from './service.js'

const route = (method, pattern, handler) => ({ method, pattern, handler })

const bool = (v) => v === true || v === 'true' || v === '1'

export const routes = [
  route('GET', /^\/api\/health$/, () => ({
    ok: true,
    service: 'crm',
    version: 1,
    time: new Date().toISOString(),
  })),

  route('GET', /^\/api\/meta$/, () => ({
    statuses: crm.STATUSES,
    interaction_types: crm.INTERACTION_TYPES,
    sorts: ['last_contact', 'oldest_contact', 'name', 'company', 'created', 'next_follow_up'],
  })),

  route('GET', /^\/api\/stats$/, () => crm.stats()),

  route('GET', /^\/api\/tags$/, () => ({ items: crm.listTags() })),

  route('GET', /^\/api\/export$/, ({ query }) =>
    crm.exportAll({ include_interactions: query.include_interactions !== 'false' }),
  ),

  route('GET', /^\/api\/contacts$/, ({ query }) =>
    crm.listContacts({ ...query, due: bool(query.due) }),
  ),
  route('POST', /^\/api\/contacts$/, ({ body }) => crm.createContact(body)),
  route('GET', /^\/api\/contacts\/(?<id>\d+)$/, ({ params }) => crm.getContact(params.id)),
  route('PATCH', /^\/api\/contacts\/(?<id>\d+)$/, ({ params, body }) =>
    crm.updateContact(params.id, body),
  ),
  route('DELETE', /^\/api\/contacts\/(?<id>\d+)$/, ({ params }) => crm.deleteContact(params.id)),

  route('GET', /^\/api\/contacts\/(?<id>\d+)\/interactions$/, ({ params, query }) =>
    crm.listInteractions({ ...query, contact_id: params.id }),
  ),
  route('POST', /^\/api\/contacts\/(?<id>\d+)\/interactions$/, ({ params, body }) =>
    crm.logInteraction({ ...body, contact_id: params.id }),
  ),

  route('GET', /^\/api\/interactions$/, ({ query }) => crm.listInteractions(query)),
  route('POST', /^\/api\/interactions$/, ({ body }) => crm.logInteraction(body)),
  route('GET', /^\/api\/interactions\/(?<id>\d+)$/, ({ params }) => crm.getInteraction(params.id)),
  route('PATCH', /^\/api\/interactions\/(?<id>\d+)$/, ({ params, body }) =>
    crm.updateInteraction(params.id, body),
  ),
  route('DELETE', /^\/api\/interactions\/(?<id>\d+)$/, ({ params }) =>
    crm.deleteInteraction(params.id),
  ),
]
