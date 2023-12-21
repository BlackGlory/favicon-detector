import ProgressBar from '@badrap/bar-of-progress'
import Message from 'antd/lib/message'
import { IconTable } from '@components/icon-table'
import { useImmer } from 'use-immer'
import hash from 'object-hash'
import { IIcon } from 'parse-favicon'
import { getIconsFromPage } from '@utils/get-icons-from-page'
import { useMountAsync } from 'extra-react-hooks'

export function Popup() {
  const [iconByHash, updateIconByHash] = useImmer<Record<string, IIcon>>({})
  const icons: IIcon[] = Object.values(iconByHash)

  useMountAsync(async () => {
    const progress = new ProgressBar()
    progress.start()

    try {
      const observable = await getIconsFromPage()
      observable.subscribe({
        next(icon) {
          updateIconByHash(icons => {
            icons[hash(icon)] = icon
          })
        }
      , error(err) {
          progress.finish()
          console.error(err)
          Message.error(err.message, 0)
        }
      , complete() {
          progress.finish()
        }
      })
    } catch (e) {
      progress.finish()

      throw e
    }
  })

  return (
    <div className='w-[800px] h-[600px]'>
      <IconTable icons={icons} />
    </div>
  )
}
