'use strict'

import React, { Component } from 'react'
import styled from 'styled-components'
import parseFavicon from 'parse-favicon'
import hash from 'object-hash'
import Table from 'antd/lib/table'
import message from 'antd/lib/message'
import 'antd/lib/table/style/css'
import 'antd/lib/message/style/css'

const Window = styled.div`
  width: 800px;
  max-width: 800px;
  max-height: 600px;
  overflow-x: hidden;
`

const Img = styled.img`
  max-width: 256px;
`

function computeArea(size) {
  const sizeRegexp = /^\d+x\d+$/ // example: 16x16
  if (sizeRegexp.test(size)) {
    return size.split('x').map(Number).reduce((m, n) => m * n, 1)
  } else {
    return 0
  }
}

function getPageInfo() {
  return new Promise((resolve, reject) => {
    try {
      chrome.tabs.executeScript({
        code: `({
          url: document.URL
        , html: document.querySelector('html').outerHTML
        })`
      }, (result) => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError)
        }
        return resolve(result[0])
      })
    } catch(e) {
      return reject(e)
    }
  })
}

function setClipboard(text, successText) {
  let textarea = document.createElement('textarea')
  textarea.textContent = text
  let body = document.querySelector('body')
  body.appendChild(textarea)
  textarea.select()
  document.execCommand('Copy', false, null)
  body.removeChild(textarea)
  message.success(successText)
}

function getImageSize(url) {
  return new Promise((resolve, reject) => {
    let img = new Image()
    img.addEventListener('load', () => {
      resolve(`${ img.width }x${ img.height }`)
    })
    img.addEventListener('error', reject)
    img.src = url
  })
}

export default class Popup extends Component {
  columns = [
    {
      title: 'Icon'
    , dataIndex: 'url'
    , key: 'icon'
    , render: url => <a onClick={ () => setClipboard(url, 'Icon url copied!') }><Img src={ url } /></a>
    }
  , {
      title: 'Size'
    , dataIndex: 'size'
    , key: 'size'
    , sorter: (a, b) => computeArea(a.size) - computeArea(b.size)
    }
  , {
      title: 'Type'
    , dataIndex: 'type'
    , key: 'type'
    }
  , {
      title: 'Reference'
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
      let { url, html } = await getPageInfo()
        , icons = await parseFavicon(html, {
            baseURI: url
          , allowUseNetwork: true
          , allowParseImage: true
          }, true)
      for (let i in icons) {
        if (!icons[i].size) {
          try {
            icons[i].size = await getImageSize(icons[i].url)
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
      message.error(e.message, NaN)
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
