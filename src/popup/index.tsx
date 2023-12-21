import '@src/globals.css'
import 'antd/dist/reset.css'
import { createRoot } from 'react-dom/client'
import { Popup } from '@components/popup'
import { assert } from '@blackglory/prelude'

const main = document.querySelector('main')
assert(main, 'The main element not found')

const root = createRoot(main)
root.render(<Popup />)
