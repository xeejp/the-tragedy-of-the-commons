import { createAction } from 'redux-act'

export const changePage = createAction('change page', page => page)
export const openParticipantPage = createAction('open participant page')
