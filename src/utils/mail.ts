import mail from '@src/loader/mail.js'
import ansiHTML from 'ansi-html-community'
import nodemailer from 'nodemailer'
import { expand, isDevEnv } from './basic.js'
import { logger } from './logger.js'

export async function sendDevMail (error: Record<string, any> | string) {
	error = typeof error === 'object' ? expand(error) : error

	let html = ansiHTML(error)
	.replace(/\n/g, '<br>')
	.replace(/\t/g, ' '.repeat(4))
	html = `<code>${html}</code>`

	logger('error', error)
	if (isDevEnv()) return

	const { devmailRecvList } = mail
	const mailOpt: nodemailer.SendMailOptions = {
		from: '"Segwitz DevMail" <alerts@segwitz.com>',
		to: devmailRecvList,
		subject: 'Server crashed.',
		text: '',
		html,
	}
	mail.devMailer
	.sendMail(mailOpt)
	.then(info => logger('app', `DevMail sent: ` + expand(info)))
	.catch(err => logger('error', `DevMail not sent: ` + err.toString()))
}
