let express = require('express')
let app = express()
let path = require('path')
let morgan = require('morgan')
let bodyParser = require('body-parser')

let api = require('./app/routes/api')(app,express)

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization')
  next()
})

app.use(morgan('dev'))

app.use('/api', api)

app.listen(8085)
console.log('Servidor corriendo en puerto 8085')