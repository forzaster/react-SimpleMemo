import { ListView } from 'react-native'
import { writeMemo, getMemo } from './model'
import { ACTION_ADD_MEMO, ACTION_UPDATE_MEMO } from '../actions'

let dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

const memos = (state = {memos:dataSource.cloneWithRows(getMemo())}, action) => {
  switch (action.type) {
    case ACTION_ADD_MEMO:
      writeMemo(action);
      console.log("memos write")
      console.log(getMemo().length)
      return Object.assign({}, state, {
        memos: dataSource.cloneWithRows(getMemo())
      })
    case ACTION_UPDATE_MEMO:
      return Object.assign({}, state, {
        memos: getMemo()
      })
    default:
      return state
  }
}

export default memos