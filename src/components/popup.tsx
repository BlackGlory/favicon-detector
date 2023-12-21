import Message from 'antd/lib/message'
import { IconTable } from '@components/icon-table'
import { useState } from 'react'
import { useImmer } from 'use-immer'
import hash from 'object-hash'
import { IIcon } from 'parse-favicon'
import { getIconsFromPage } from '@utils/get-icons-from-page'
import { useMountAsync } from 'extra-react-hooks'

export function Popup() {
  const [loading, setLoading] = useState(true)
  const [iconByHash, updateIconByHash] = useImmer<Record<string, IIcon>>({})
  const icons: IIcon[] = Object.values(iconByHash)

  useMountAsync(async () => {
    const observable = await getIconsFromPage()

    observable.subscribe({
      next(icon) {
        updateIconByHash(icons => {
          icons[hash(icon)] = icon
        })
      }
    , error(err) {
        setLoading(false)
        console.error(err)
        Message.error(err.message, NaN)
      }
    , complete() {
        setLoading(false)
      }
    })
  })

  return (
    <div className='w-[700px] h-[500px]'>
      <IconTable
        loading={loading}
        icons={icons}
      />
    </div>
  )
}
