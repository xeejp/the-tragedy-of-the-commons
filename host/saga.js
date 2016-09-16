import { fork, take, call } from 'redux-saga/effects'
import { takeEvery } from 'redux-saga'

import { fetchContents } from 'shared/actions'
import { changePage, match, updateConfig } from './actions'

function* fetchContentsSaga() {
  yield call(sendData, 'fetch contents')
}

function* changePageSaga(action) {
  const { payload } = action
  yield call(sendData, 'change page', payload)
}

function* updateConfigSaga(action) {
  const { payload } = action
  yield call(sendData, 'update config', payload)
}

function* matchSaga() {
  yield call(sendData, 'match')
}

function* saga() {
  yield fork(takeEvery, fetchContents.getType(), fetchContentsSaga)
  yield fork(takeEvery, changePage.getType(), changePageSaga)
  yield fork(takeEvery, updateConfig.getType(), updateConfigSaga)
  yield fork(takeEvery, match.getType(), matchSaga)
}

export default saga
