import * as React from 'react'
import { useState, useEffect } from 'react'
import styled from 'styled-components'
import Table, { ColumnsType } from 'antd/lib/table'
import Message from 'antd/lib/message'
import 'antd/lib/table/style/css'
import 'antd/lib/message/style/css'

import * as hash from 'object-hash'
import { Icon } from 'parse-favicon'
import { IterableOperator } from 'iterable-operator/lib/es2018/style/chaining/iterable-operator'
import { setClipboard } from '@shared/set-clipboard'
import { getIcons } from '@shared/get-icons'
import { getMaxSize } from '@shared/get-max-size'

const Window = styled.div`
  width: 800px;
  max-width: 800px;
  max-height: 600px;
  overflow-x: hidden;
`

const Img = styled.img`
  max-width: 256px;
  max-height: 256px;
  background-image: linear-gradient(45deg, #b0b0b0 25%, transparent 25%),
                    linear-gradient(-45deg, #b0b0b0 25%, transparent 25%),
                    linear-gradient(45deg, transparent 75%, #b0b0b0 75%),
                    linear-gradient(-45deg, transparent 75%, #b0b0b0 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
`

export default function Popup() {
  const [loading, setLoading] = useState(true)
  const [icons, setIcons] = useState<Icon[]>([])

  useEffect(() => {
    setLoading(true)
    getIcons().then(observable => {
      observable.subscribe(
        icon => {
          setIcons(icons => [...icons, icon])
        }
      , e => {
          setLoading(false)
          console.error(e)
          Message.error(e.message, NaN)
        }
      , () => setLoading(false)
      )
    })
  }, [])

  const columns: ColumnsType<Icon> = [
    {
      title: browser.i18n.getMessage('titleIcon')
    , dataIndex: 'url'
    , key: 'icon'
    , render(url: string, icon: Icon) {
        const img = createImg()
        return <a onClick={() => copy(url, browser.i18n.getMessage('messageIconUrlCopied'))}>{img}</a>

        function createImg() {
          if (icon.size) {
            if (Array.isArray(icon.size)) {
              const size = getMaxSize(icon.size)
              return <Img src={url} width={size.width} height={size.height} />
            } else if (icon.size !== 'any') {
              return <Img src={url} width={icon.size.width} height={icon.size.height} />
            }
          }
          return <Img src={url} />
        }

        function copy(text: string, successText: string) {
          setClipboard(text)
          if (successText) Message.success(successText)
        }
      }
    }
  , {
      title: browser.i18n.getMessage('titleSize')
    , dataIndex: 'size'
    , key: 'size'
    , defaultSortOrder: 'ascend'
    , render(size: Icon['size']) {
        if (size === undefined) {
          return 'unknown'
        } else if (typeof size === 'string') {
          return size
        } else if (Array.isArray(size)) {
          return size.map(sizeToString).join(' ')
        } else {
          return sizeToString(size)
        }

        function sizeToString(size: { width: number, height: number }): string {
          return `${size.width}x${size.height}`
        }
      }
    , sorter(a: Icon, b: Icon) {
        return getArea(a.size) - getArea(b.size)

        function getArea(size: Icon['size']): number {
          if (size === undefined) {
            return 0
          } else if (typeof size === 'string') {
            return Infinity
          } else if (Array.isArray(size)) {
            return size.map(getArea).reduce((ret, cur) => Math.max(ret, cur))
          } else {
            return size.width * size.height
          }
        }
      }
    }
  , {
      title: browser.i18n.getMessage('titleType')
    , dataIndex: 'type'
    , key: 'type'
    , render(type: Icon['type'] ) {
        if (type === undefined) return 'unknown'
        return type
      }
    , filters: new IterableOperator(icons)
        .map(x => x.type)
        .filter<string>(x => !!x)
        .uniq()
        .map(x => ({ text: x, value: x }))
        .toArray()
    , onFilter(value, record) {
        return record.type === value
      }
    }
  , {
      title: browser.i18n.getMessage('titleReference')
    , dataIndex: 'reference'
    , key: 'reference'
    }
  ]

  return (
    <Window>
      <Table<Icon>
        rowKey={record => hash(record)}
        loading={loading}
        pagination={false}
        columns={columns}
        dataSource={icons}
      />
    </Window>
  )
}
