import * as React from 'react'
import Table, { ColumnsType } from 'antd/lib/table'
import 'antd/lib/table/style/css'
import Message from 'antd/lib/message'
import 'antd/lib/message/style/css'
import { IconImage } from '@components/icon-image'
import { isNull, isStringPrimitive } from '@blackglory/types'
import * as hash from 'object-hash'
import { Icon } from 'parse-favicon'
import { i18n } from '@shared/i18n'
import { getMaxSize } from '@shared/get-max-size'
import { setClipboard } from '@shared/set-clipboard'
import { computeIconArea } from '@shared/compute-icon-area'
import { getUniqueIconTypes } from '@shared/get-unique-icon-types'

interface IconTableProps {
  icons: Icon[]
  loading: boolean
}

export const IconTable: React.FC<IconTableProps> = ({ icons, loading }) => {
  const columns: ColumnsType<Icon> = [
    {
      title: i18n('titleIcon')
    , dataIndex: 'url'
    , key: 'icon'
    , render(_, icon: Icon) {
        return <a onClick={() => copyIconUrl(icon)}>
          {createIconImage(icon)}
        </a>
      }
    }
  , {
      title: i18n('titleSize')
    , dataIndex: 'size'
    , key: 'size'
    , defaultSortOrder: 'ascend'
    , render(_, icon) {
        return iconSizeToString(icon)
      }
    , sorter(a, b) {
        return computeIconArea(a) - computeIconArea(b)
      }
    }
  , {
      title: i18n('titleType')
    , dataIndex: 'type'
    , key: 'type'
    , render(_, icon) {
        return iconTypeToString(icon)
      }
    , filters: getUniqueIconTypes(icons).map(toFilter)
    , onFilter(value, record) {
        return record.type === value
      }
    }
  , {
      title: i18n('titleReference')
    , dataIndex: 'reference'
    , key: 'reference'
    }
  ]

  return (
    <Table<Icon>
      rowKey={record => hash(record)}
      loading={loading}
      pagination={false}
      dataSource={icons}
      columns={columns}
    />
  )
}

function toFilter(x: string) {
  return { text: x, value: x }
}

function iconTypeToString(icon: Icon): string {
  const type = icon.type
  return type ?? 'unknown'
}

function iconSizeToString(icon: Icon): string {
  const size = icon.size
  if (isNull(size)) {
    return 'unknown'
  } else if (isStringPrimitive(size)) {
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

function createIconImage(icon: Icon) {
  if (icon.size) {
    if (Array.isArray(icon.size)) {
      const size = getMaxSize(icon.size)
      return <IconImage src={icon.url} width={size.width} height={size.height} />
    } else if (icon.size !== 'any') {
      return <IconImage src={icon.url} width={icon.size.width} height={icon.size.height} />
    }
  }
  return <IconImage src={icon.url} />
}

function copyIconUrl(icon: Icon) {
  setClipboard(icon.url)
  Message.success(i18n('messageIconUrlCopied'))
}
