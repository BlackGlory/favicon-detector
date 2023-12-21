import Table, { ColumnsType } from 'antd/lib/table'
import Message from 'antd/lib/message'
import { isArray, isNull, isString } from '@blackglory/prelude'
import hash from 'object-hash'
import { IIcon } from 'parse-favicon'
import { i18n } from '@utils/i18n'
import { getMaxSize } from '@utils/get-max-size'
import { computeIconArea } from '@utils/compute-icon-area'
import { getUniqueIconTypes } from '@utils/get-unique-icon-types'
import { twMerge } from 'tailwind-merge'
import { textToBlob } from 'extra-blob'

interface ISize {
  width: number
  height: number
}

interface IIconTableProps {
  icons: IIcon[]
}

export function IconTable({ icons }: IIconTableProps) {
  const columns: ColumnsType<IIcon> = [
    {
      title: i18n('titleIcon')
    , dataIndex: 'url'
    , key: 'icon'
    , render(_, icon: IIcon) {
        return <Icon icon={icon} />
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
      className='w-full h-full overflow-y-auto'
      rowKey={record => hash(record)}
      sticky={true}
      tableLayout='auto'
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

function Icon({ icon }: { icon: IIcon }) {
  if (icon.size) {
    if (isArray<ISize>(icon.size)) {
      const size = getMaxSize(icon.size)
      return <CopyableImage
        src={icon.url}
        width={size.width}
        height={size.height}
      />
    } else if (icon.size !== 'any') {
      return <CopyableImage
        src={icon.url}
        width={icon.size.width}
        height={icon.size.height}
      />
    }
  }

  return <CopyableImage src={icon.url} />
}

function CopyableImage(props: React.ComponentPropsWithoutRef<'img'>) {
  return <img
    {...props}
    className={twMerge(
      'bg-transparent-fake max-w-[256px] max-h-[256px]'
    , props.src && 'cursor-pointer'
    , props.className
    )}
    onClick={async () => {
      if (props.src) {
        try {
          await writeImageClipboard(props.src)
        } catch {
          await writeImageURLToClipboard(props.src)
        }
      }
    }}
  />

  async function writeImageClipboard(imageUrl: string): Promise<void> {
    const res = await fetch(imageUrl, { cache: 'force-cache' })
    const blob = await res.blob()

    const clipboardItem = new ClipboardItem({
      'text/plain': textToBlob(imageUrl)
    , 'text/html': textToBlob(createImgHTML(imageUrl), 'text/html')
    , [blob.type]: blob
    })
    await navigator.clipboard.write([clipboardItem])

    Message.success(i18n('messageImageCopied'))
  }

  async function writeImageURLToClipboard(imageUrl: string): Promise<void> {
    const clipboardItem = new ClipboardItem({
      'text/plain': textToBlob(imageUrl)
    , 'text/html': textToBlob(createImgHTML(imageUrl), 'text/html')
    })

    await navigator.clipboard.write([clipboardItem])

    Message.success(i18n('messageImageURLCopied'))
  }

  function createImgHTML(imageUrl: string): string {
    return `<img src="${imageUrl}" />`
  }
}
