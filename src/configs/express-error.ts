import { ValidationError } from 'express-validation'
import { sendDevMail } from '../helpers/mail.js'
import express from 'express'

export default function (app: express.Application) {
	app.use(errorHandler)
}

/**
 * Errors returned:
 * 		- joi validation error
 * 		- json entity parse error
 * 		- application/business logic error
 * Errors not returned:
 * 		- rejected promises
 * 		- any thrown error
 *
 * Some fatal errors thrown from Express,
 * might still be returned. Usually those
 * are so fatal that, they don't even reach
 * this error handler middleware.
 */
export async function errorHandler (err, req, res, next) {
	if (err instanceof ValidationError) {
		let resultMsg = ''
		err.errors.forEach(e => {
			resultMsg += e.message + '. '
			//resultMsg += e.messages[0] + '. '
		})
		return res.err(resultMsg, 200)
	}

	if (err.type === `entity.parse.failed`) {
		return res.err('Entity parse failed.')
	}

	sendDevMail({ type: 'errorHandler', meta: req.meta, err })
	res.err('Something went wrong! Engineers are reported.', 500)
}
