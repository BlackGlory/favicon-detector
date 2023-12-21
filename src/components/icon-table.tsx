import Table, { ColumnsType } from 'antd/lib/table'
import Message from 'antd/lib/message'
import { isArray, isNull, isString } from '@blackglory/prelude'
import hash from 'object-hash'
import { IIcon } from 'parse-favicon'
import { i18n } from '@utils/i18n'
import { getMaxSize } from '@utils/get-max-size'
import { setClipboard } from '@utils/set-clipboard'
import { computeIconArea } from '@utils/compute-icon-area'
import { getUniqueIconTypes } from '@utils/get-unique-icon-types'

interface ISize {
  width: number
  height: number
}

interface IIconTableProps {
  icons: IIcon[]
  loading: boolean
}

export function IconTable(props: IIconTableProps) {
  const { icons, loading } = props
  const columns: ColumnsType<IIcon> = [
    {
      title: i18n('titleIcon')
    , dataIndex: 'url'
    , key: 'icon'
    , render(_, icon: IIcon) {
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
    <Table
      rowKey={record => hash(record)}
      loading={loading}
      pagination={false}
      dataSource={icons}
      columns={columns}
    />
  )
}

function toFilter(x: string): {
  text: string
  value: string
} {
  return {
    text: x
  , value: x
  }
}

function iconTypeToString(icon: IIcon): string {
  const type = icon.type
  return type ?? 'unknown'
}

function iconSizeToString(icon: IIcon): string {
  if (isNull(icon.size)) {
    return 'unknown'
  } else if (isString(icon.size)) {
    return icon.size
  } else if (isArray<ISize>(icon.size)) {
    return icon.size.map(sizeToString).join(' ')
  } else {
    return sizeToString(icon.size)
  }

  function sizeToString(size: { width: number; height: number }): string {
    return `${size.width}x${size.height}`
  }
}

function createIconImage(icon: IIcon) {
  if (icon.size) {
    if (isArray<ISize>(icon.size)) {
      const size = getMaxSize(icon.size)
      return <IconImage
        src={icon.url}
        width={size.width}
        height={size.height}
      />
    } else if (icon.size !== 'any') {
      return <IconImage
        src={icon.url}
        width={icon.size.width}
        height={icon.size.height}
      />
    }
  }
  return <img src={icon.url} />
}

function copyIconUrl(icon: IIcon): void {
  setClipboard(icon.url)
  Message.success(i18n('messageIconUrlCopied'))
}

function IconImage(props: React.ComponentPropsWithoutRef<'img'>) {
  return <img
    {...props}
    className='bg-transparent-fake max-w-[256px] max-h-[256px]'
  />
}
