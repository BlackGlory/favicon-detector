import React from 'react'
import { createRoot } from 'react-dom/client'
import 'antd/dist/reset.css'
import { Popup } from '@components/popup'
import { assert } from '@blackglory/prelude'

const main = document.querySelector('main')
assert(main, 'The main element not found')

const root = createRoot(main)
root.render(<Popup />)
