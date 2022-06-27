import $ from 'express-validation'
import express from 'express'
import {logger} from './utils/logger.js'
//import {upload} from './config/file.js'
import * as c from './controllers.js'
import * as a from '@src/config/auth.js'
import * as v from '@src/dto'

logger.app('Configuring API endpoints.')

const r = express.Router()
r.get('/users', a.admin,  $(v.user.list), c.user.list)
r.post('/users/signup', a.public, $(v.user.signup), c.user.signup)
r.get('/users/:id', a.verified, $(v.user.single), c.user.single)

export default (app:express.Express) => app.use('/v1', r)
