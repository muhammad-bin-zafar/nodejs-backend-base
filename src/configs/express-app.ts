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
}

const hideFields = [ 'password', 'pass', 'token', 'auth', 'secret', 'passphrase', 'authorization' ]
const blueText = str => chalk.whiteBright.bgCyan(str)

// TODO benchmark requests, and record time taken to response.
function logRequests (req, res, next) {
	const { protocol, method, url } = req

	let result = [
		chalk.white.bgBlueBright(`Fork ${process.pid}`),
		chalk.black.bgGreenBright([ protocol, method, url ].join(' ')),
	].join(' ')

	for (const field of [ 'headers', 'params', 'query', 'body' ]) {
		const expanded = expand(hide(req[field], hideFields))
		result += '\n' + blueText(` ${field.toUpperCase()} `) + ' ' + expanded
	}

	req.meta = { route: ansiHTML(result) }
	logger.http(result + '\n\n')
	next()
}
