import ansiHTML from 'ansi-html-community'
import chalk from 'chalk'
import compression from 'compression'
import cors from 'cors'
import express from 'express'
import 'express-async-errors'
import helmet from 'helmet'
import hide from 'hide-secrets'
import { expand, logger } from '@src/util'

logger.app('Configuring Express.')

export default function (app: express.Application) {
	app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }))
	app.use(compression())
	app.use(cors())
	app.use(express.urlencoded({ extended: true }))
	app.use(express.json())
	app.use(logRequests)
	app.use(reqShorthand)
	app.use(resShorthand)
}

const hideFields = [ 'password', 'pass', 'token', 'auth', 'secret', 'passphrase', 'authorization' ]
const blueText = str => chalk.whiteBright.bgCyan(str)

function reqShorthand (req, res, next) {
	req.data = (schema, reqField) => req[reqField]
	next()
}

function resShorthand (req, res, next) {
	res.ok = function (data = 'OK') {
		let result = {}
		if (typeof data == 'string') result['message'] = data
		else result = data

		res.status(200).send({ data: result, ok: true })
	}

	res.err = function (data = 'Error', code = 200) {
		res.status(200).send({ data, ok: false })
	}

	next()
}

// TODO benchmark requests, and record time taken to response.
function logRequests (req, res, next) {
	const { protocol, method, url } = req

	let result = chalk.black.bgGreenBright([ method, url ].join(' '))

	for (const field of [ 'headers', 'params', 'query', 'body' ]) {
		const expanded = expand(hide(req[field], hideFields))
		result += '\n' + blueText(` ${field.toUpperCase()} `) + ' ' + expanded
	}

	req.meta = { route: ansiHTML(result) }
	logger.http(result + '\n\n')
	next()
}
