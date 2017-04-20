'use strict'

import React, { Component } from 'react'
import styled from 'styled-components'
import parseFavicon from 'parse-favicon'
import hash from 'object-hash'
import Table from 'antd/lib/table'
import 'antd/lib/table/style/css'

const Window = styled.div`
  width: 800px;
  max-width: 800px;
  max-height: 600px;
  overflow-x: hidden;
`

const Image = styled.img`
  max-width: 256px;
`

function computeArea(size) {
  return size.split('x').map(Number).reduce((m, n) => m * n, 1)
}

export default class Popup extends Component {
  columns = [
    {
      title: 'Icon'
    , dataIndex: 'url'
    , key: 'icon'
    , render: url => <Image src={ url } />
    }
  , {
      title: 'Size'
    , dataIndex: 'size'
    , key: 'size'
    , sorter: (a, b) => computeArea(a.size) - computeArea(b.size)
    , sortOrder: 'ascend'
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

  componentDidMount() {
    chrome.tabs.executeScript({
      code: `({
        url: document.URL
      , html: document.querySelector('html').outerHTML
      })`
    }, async ([{ url, html }]) => {
      let icons = await parseFavicon(html, {
        baseURI: url
      , allowUseNetwork: true
      , allowParseImage: true
      })

      this.setState({
        loading: false
      , data: icons
      })
    })
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
