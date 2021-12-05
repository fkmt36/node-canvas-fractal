import express from 'express'
import { drawLorenz, drawGumowskiMira } from './fractal.mjs'

const app = express()
const port = 3000

app.get('/', (req, res) => {
  const img = drawGumowskiMira()
  res.contentType('png')
  res.send(img)
})

app.listen(port, () => {
  console.log(`http://localhost:${port}`)
})