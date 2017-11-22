const express = require('express')
const http = require('http')
const execa = require('execa')
const path = require('path')

const port = process.env['PORT']
const app = express()
const server = http.Server(app)
const router = express.Router()

server.on('listening', () => {
  console.log('listening')
})

server.on('request', (req, res) => {
  console.log(req.method, req.url, res.statusCode)
})

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use('/css', express.static(path.join(__dirname, 'css')))
app.use(router)

router.route('/toggle')
.get((req, res, next) => {
  execa.shell('mpc toggle')
  .then(result => {
    res.status(200)
    .send(result)
  })
})

router.route('/next')
.get((req, res, next) => {
  execa.shell('mpc next')
  .then(result => {
    res.render('index', {
      data: result.stdout.split('[')[0]
    })
  })
})

router.route('/prev')
.get((req, res, next) => {
  execa.shell('mpc prev')
  .then(result => {
    res.render('index', {
      data: result.stdout.split('[')[0]
    })
  })
})

router.route('/')
.get((req, res, next) => {
  execa.shell('mpc')
  .then(result => {
    res.render('index', {
      data: result.stdout.split('[')[0]
    })
  })
})

server.listen(port)
