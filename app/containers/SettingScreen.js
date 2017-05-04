import React, { Component } from 'react'
import { View, Text, Switch, ListView, TouchableHighlight, WebView, ProgressViewIOS } from 'react-native'
import { connect } from 'react-redux'
import { BlurView } from 'react-native-blur'
import { styles } from '../styles'
import { strings } from '../resources/strings'
import { createAction, ACTION_SHOW_LICENSE, ACTION_CRYPTO_DB, ACTION_ENTER_PIN } from '../actions'
import LicensePopup from '../components/LicensePopup'
import PinPopup from '../components/PinPopup'

const ITEM_TYPE_NORMAL = 0
const ITEM_TYPE_SWITCH = 1

let listItems = [
  {id: 0, type: ITEM_TYPE_SWITCH, title: strings.Crypto, content: strings.CryptoContent, action: ACTION_CRYPTO_DB, data: false, progress: 0.0 },
  {id: 1, type: ITEM_TYPE_NORMAL, title: "License", content: undefined, action: ACTION_SHOW_LICENSE, data: true },
  {id: 2, type: ITEM_TYPE_NORMAL, title: "App Version", content: "0.0.1", data: undefined}
]

class SettingScreen extends Component {
  static navigationOptions = {
    title: strings.Settings,
    header: ({ state, setParam }) => ({
      style: styles.navigationBar,
    }),
  }

  constructor(props) {
    super(props)
    this.renderRow = this.renderRow.bind(this)
    this.setProgress = this.setProgress.bind(this)
    this.state = {
      dataSource:
        new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2 || r1.data !== r2.data})
        .cloneWithRows(listItems),
      progress: 1.0
    }
  }

  render() {
    const { dispatch, settings } = this.props;
    console.log("render setting " + this.state.progress)
    return (
      <View style={styles.container}>
        <ListView
          enableEmptySections={true}
          dataSource={this.state.dataSource}
          renderRow={this.renderRow} />
        {(() => {
          if (settings.license) {
            return (
              <View style={styles.popupParent} pointerEvents="box-none">
                <LicensePopup
                  onOK={() => {
                    dispatch(createAction(ACTION_SHOW_LICENSE, false, null))
                  }}/>
              </View>
            )
          }
          if (settings.enterPin) {
            return (
              <BlurView blurType="light" blurAmount={5} style={styles.popupParent}>
              <View style={styles.popupParent} pointerEvents="box-none">
                <PinPopup
                  onOK={() => {
                    dispatch(createAction(ACTION_ENTER_PIN, false, null))
                  }}
                  onCancel={() =>{
                    dispatch(createAction(ACTION_ENTER_PIN, false, null))
                  }}/>
              </View>
              </BlurView>
            )
          }
          if (settings.crypto && this.state.progress < 1.0) {
            return (
              <BlurView blurType="light" blurAmount={5} style={styles.popupParent}>
                <View style={styles.popupParent} pointerEvents="box-none">
                  <ProgressViewIOS style={styles.popup} progress={this.state.progress}/>
                </View>
              </BlurView>
            )
          }
        })()}
      </View>
    );
  }

  setProgress(p) {
    this.setState({progress: p})
  }

  setCrypto() {

  }

  renderRow(rowData) {
    const { dispatch } = this.props;
    var callback = rowData.progress == 0.0 ? this.setProgress : null
    if (rowData.content != undefined) {
      return (
        <TouchableHighlight style={styles.settingItem}
          underlayColor="#AAAAAAAA"
          onPress={() => {
            if (rowData.action) {
              if (rowData.action == ACTION_CRYPTO_DB && !listItems[rowData.id].data) {
                dispatch(createAction(ACTION_ENTER_PIN, true, null))
              } else if (rowData.type == ITEM_TYPE_SWITCH) {
                var value = listItems[rowData.id].data ? false : true
                listItems[rowData.id].data = value
                this.setState({dataSource:
                  new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2 || r1.data !== r2.data})
                  .cloneWithRows(listItems)
                })
                dispatch(createAction(rowData.action, value, callback))
              } else {
                dispatch(createAction(rowData.action, rowData.data, callback))
              }
            }
          }}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View>
              <Text style={styles.settingItem1stText}>{rowData.title}</Text>
              <Text style={styles.settingItem2ndText}>{rowData.content}</Text>
            </View>
            {(() => {
              if (rowData.type == ITEM_TYPE_SWITCH) {
                return (<Switch onValueChange={(value) => {
                  if (rowData.action == ACTION_CRYPTO_DB && value) {
                    dispatch(createAction(ACTION_ENTER_PIN, true, null))
                  } else {
                    listItems[rowData.id].data = value
                    this.setState({dataSource:
                      new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2 || r1.data !== r2.data})
                      .cloneWithRows(listItems)
                    })
                    dispatch(createAction(rowData.action, value, callback))
                  }
                }}
                value={rowData.data} />)
              }
            })()}
          </View>
        </TouchableHighlight>
      )
    } else {
      return (
        <TouchableHighlight style={styles.settingItem}
          underlayColor="#AAAAAAAA"
          onPress={() => {
            if (rowData.action) {
              dispatch(createAction(rowData.action, rowData.data, callback))
            }
          }}>
          <Text style={styles.settingItemSingleText}>{rowData.title}</Text>
        </TouchableHighlight>
      )
    }
  }
}

function mapStateToProps(state) {
  return {
    settings: state.settings
  }
}

export default connect(mapStateToProps)(SettingScreen)
