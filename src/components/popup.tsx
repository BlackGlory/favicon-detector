import * as React from 'react'
import Message from 'antd/lib/message'
import 'antd/lib/message/style/css'
import { IconTable } from '@components/icon-table'
import { Window } from '@components/window'

import { useState, useEffect } from 'react'
import { useImmer } from 'use-immer'

import * as hash from 'object-hash'
import { Icon } from 'parse-favicon'
import { getIconsFromPage } from '@shared/get-icons-from-page'

export const Popup: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [iconByHash, updateIconByHash] = useImmer<{ [index: string]: Icon }>({})
  const icons: Icon[] = Object.values(iconByHash)

  useEffect(() => {
    getIconsFromPage().then(observable => {
      observable.subscribe(
        icon => updateIconByHash(icons => {
          icons[hash(icon)] = icon
        })
      , err => {
          setLoading(false)
          console.error(err)
          Message.error(err.message, NaN)
        }
      , () => setLoading(false)
      )
    })
  }, [])

  return (
    <Window>
      <IconTable
        loading={loading}
        icons={icons}
      ></IconTable>
    </Window>
  )
}
