import { currEnv } from '@src/config/env.js'
import * as util from '@src/util'
import Joi from 'joi'
import nodemailer from 'nodemailer'

const user = currEnv.devmailSender
const pass = currEnv.devmailPasswd

export const devMailer = nodemailer.createTransport({
	name: currEnv.devmailServer,
	host: currEnv.devmailServer,
	port: 465,
	secure: true,
	auth: { user, pass },
})
const idemptFn1 = () => devMailer.verify()
retryCredVerify(idemptFn1, 'DevMailer')

// FIXME Don't use devmail creds :)
export const userMailer = nodemailer.createTransport({
	name: currEnv.devmailServer,
	host: currEnv.devmailServer,
	port: 465,
	secure: true,
	auth: { user, pass },
})
const idemptFn2 = () => userMailer.verify()
retryCredVerify(idemptFn2, 'UserMailer')

/** List of validated dev email addresses. */
export const devmailRecvList = currEnv.devmailRecvList
.split(',')
.map(email => email.trim())
.filter(email => isEmail(email))
util.logger('app', 'Configured ' + devmailRecvList.length + ' dev emails.')

export default { devMailer, userMailer, devmailRecvList }

function isEmail (email) {
	const result = Joi.validate(email, Joi.string().email())
	return !util.isErr(result.error)
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
	const retryMsg = `[${tag}] Retrying to verify.`
	const errMsg = `[${tag}] Failed to verify`
	const thenResult = result => {
		if (result) util.logger('app', `[${tag}] Verified.`)
		else if (result === false) util.logger('error', `[${tag}] Incorrect.`)
	}

	for (let i = 0; i < 3; i++) {
		try {
			return await promiseFunc().then(thenResult)
		} catch (err: any) {
			error = err
			if (err.errno === -111) {
				util.logger('error', retryMsg)
				await util.sleep(30000)
				continue
			}
		}
	}
	util.logger('error', errMsg + ': ' + error.toString())
}
