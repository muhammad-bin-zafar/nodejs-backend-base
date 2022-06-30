import { env } from '@src/config/env.js'
import * as util from '@src/util'
import lodash from 'lodash'
import joi from 'typesafe-joi'
import nodemailer from 'nodemailer'

const user = env.devmailSender
const pass = env.devmailPasswd

export const devMailer = nodemailer.createTransport({
	name: env.devmailServer,
	host: env.devmailServer,
	port: 465,
	secure: true,
	auth: { user, pass },
})
const idemptFn1 = () => devMailer.verify()
retryCredVerify(idemptFn1, 'DevMailer')

// FIXME Don't use devmail creds :)
export const userMailer = nodemailer.createTransport({
	name: env.devmailServer,
	host: env.devmailServer,
	port: 465,
	secure: true,
	auth: { user, pass },
})
const idemptFn2 = () => userMailer.verify()
retryCredVerify(idemptFn2, 'UserMailer')

/** List of validated dev email addresses. */
export const devmailRecvList = env.devmailRecvList
.split(',')
.map(email => email.trim())
.filter(email => isEmail(email))
util.logger.app('Configured ' + devmailRecvList.length + ' dev emails.')

export default { devMailer, userMailer, devmailRecvList }

function isEmail (email) {
	const result = joi.validate(email, joi.string().email())
	return !lodash.isError(result.error)
}

/**
 * Retries to verify email credentials.
 *
 * @param promiseFunc
 * Idempotent promise-returning function.
 */
async function retryCredVerify<T extends Function> (
	promiseFunc: T,
	tag: string
): Promise<typeof promiseFunc | undefined> {
	let error
	const retryMsg = tag + ` retrying to verify.`
	const errMsg = tag + ` failed to verify.`
	const thenResult = result => {
		if (result) util.logger.app(tag + ` verified.`)
		else if (result === false) util.logger.error(tag + ` incorrect.`)
	}

	for (let i = 0; i < 3; i++) {
		try {
			return await promiseFunc().then(thenResult)
		} catch (err: any) {
			error = err
			if (err.errno === -111) {
				util.logger.error(retryMsg)
				await util.sleep(30000)
				continue
			}
		}
	}
	util.logger.error(errMsg + ': ' + error.toString())
}
