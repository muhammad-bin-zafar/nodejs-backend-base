import { Application, Request, Response } from 'express'
import _ from 'lodash'

export default function (app: Application) {
	app.use(mutateResponse)
}

function mutateResponse (req: Request, res: Response, next) {
	res.ok = function (data = 'OK') {
		let result = {}
		if (typeof data == 'string') result['message'] = data
		else result = data
		res.status(200).send({
			data: result,
			success: true,
		})
	}

	res.err = function (msg = 'Error', code = 200, errObject = {}, data = null) {
		if (_.isObject(msg)) msg = msg.message || ''

		res.status(code).send({
			success: false,
			data,
			errorMessage: msg,
			error: errObject,
		})
	}

	next()
}
