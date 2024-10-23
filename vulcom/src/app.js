import 'dotenv/config'

import express, { json, urlencoded } from 'express'
import createError from 'http-errors'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

import indexRouter from './routes/index.js'
// import usersRouter from './routes/users.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()

// O pacote express-sanitizer faz a sanitização da entrada do usuário, neutralizando ataques XSS
import expressSanitizer from 'express-sanitizer'
app.use(expressSanitizer())

// view engine setup
app.set('views', join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(logger('dev'))
app.use(json())
app.use(urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(join(__dirname, '../public')))

/***************** ROTAS ****************************/

app.use('/', indexRouter)
//app.use('/users', usersRouter)

import sqlInjectionRouter from './routes/sql-injection.js'
app.use('/sql-injection', sqlInjectionRouter)

import xssRouter from './routes/xss.js'
app.use('/xss', xssRouter)

import usersRouter from './routes/users.js'
app.use('/users', usersRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

export default app
