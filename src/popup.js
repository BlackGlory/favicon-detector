'use strict'

import React, { Component } from 'react'
import styled from 'styled-components'
import parseFavicon from 'parse-favicon'
import hash from 'object-hash'
import Table from 'antd/lib/table'
import Message from 'antd/lib/message'
import 'antd/lib/table/style/css'
import 'antd/lib/message/style/css'
import {
  computeArea
, getPageInfo
, setClipboard
, getRemoteImageSize
} from './utils'

const Window = styled.div`
  width: 800px;
  max-width: 800px;
  max-height: 600px;
  overflow-x: hidden;
`

const Img = styled.img`
  max-width: 256px;
`

function copy(text, successText) {
  setClipboard(text)
  if (successText) {
    Message.success(successText)
  }
}

export default class Popup extends Component {
  columns = [
    {
      title: browser.i18n.getMessage('titleIcon')
    , dataIndex: 'url'
    , key: 'icon'
    , render: url => <a onClick={ () => copy(url, browser.i18n.getMessage('messageIconUrlCopied')) }><Img src={ url } /></a>
    }
  , {
      title: browser.i18n.getMessage('titleSize')
    , dataIndex: 'size'
    , key: 'size'
    , sorter: (a, b) => computeArea(a.size) - computeArea(b.size)
    }
  , {
      title: browser.i18n.getMessage('titleType')
    , dataIndex: 'type'
    , key: 'type'
    }
  , {
      title: browser.i18n.getMessage('titleReference')
    , dataIndex: 'refer'
    , key: 'refer'
    }
  ]

  state = {
    loading: true
  , data: []
  }

  async componentDidMount() {
    try {
      const { url, html } = await getPageInfo()
      const icons = await parseFavicon(html, {
        baseURI: url
      , allowUseNetwork: true
      , allowParseImage: true
      }, true)
      for (const i in icons) {
        if (!icons[i].size) {
          try {
            icons[i].size = await getRemoteImageSize(icons[i].url)
          } catch(e) {
            void(0)
          }
        }
      }
      this.setState({
        loading: false
      , data: icons
      })
    } catch(e) {
      this.setState({
        loading: false
      })
      Message.error(e.message, NaN)
    }
  }

  render() {
    return (
      <Window>
        <Table
          rowKey={ record => hash(record) }
          loading={ this.state.loading }
          pagination={ false }
          columns={ this.columns }
          dataSource={ this.state.data }
        />
      </Window>
    )
  }
}
