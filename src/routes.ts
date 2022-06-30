import express from 'express'
import validate from 'express-validation'
import { logger } from './utils/logger.js'
import { api as c } from '@src/module'
import * as a from '@src/config/auth.js'
import * as v from '@src/dto'

/**
 * To validate request data, using Joi schemes.
 * Disallows any unknown body/query/params by default.
 *
 * Unknown body/query/params may be required to be
 * allowed when having multiple schemes, as in:
 * `router.post('/users', $(bodySchema), $(querySchema))`
 */
function $ (dto, disallow=true) {
	const options = { allowUnknownBody: false, allowUnknownQuery: false, allowUnknownParams: false }
	return validate({...dto, ...(disallow && {options})})
}

logger.app('Configuring API endpoints.')
const r = express.Router()
r.get('/users', a.admin, $(v.user.list), c.user.list)
r.post('/users/signup', a.unverified, $(v.user.signup), c.user.signup)
r.get('/users/:id', a.verified, c.user.single)

export default (app: express.Express) => app.use('/v1', r)
