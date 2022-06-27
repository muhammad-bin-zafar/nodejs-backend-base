import * as cron from 'cron'
import * as db from '../models/index.js'
import * as consts from '../constants/index.js'
import * as util from '../helpers/index.js'
import { read as metaRead } from '../modules/metadata.js'

util.logger('app', 'Configuring Cron.')

export default async function () {
	// every 20 minute: '*/20 00 00 * * *'
	const job = new cron.CronJob({
		onTick,
		cronTime: '00 00 00 * * *',
		timeZone: 'Asia/Kuala_Lumpur' /**, runOnInit: true*/,
	})

	job.start()
}

async function onTick () {
	util.logger('cron', { about: 'user-expiry-voucher-pokki', status: 'started' })

	const now = new Date()
	const voucExpDays = <number>await metaRead(consts.META.KEY.VOUCHEXP)
	const pokkiExpDays = <number>await metaRead(consts.META.KEY.POKKIEXP)
	let page = 1
	const limit = 100

	let hasMoreLeft = true
	while (hasMoreLeft) {
		const userList = await db.User.findAll({
			offset: (page - 1) * limit,
			limit,
			attributes: [ 'id' ],
			include: [ { model: db.PokkiHist, where: { action: 'EARNED' } }, { model: db.PurVouc } ],
		})
		let alteredCount = 0

		for (const user of userList) {
			// expire pokki
			if (user.PokkiHists) {
				for (const hist of user.PokkiHists) {
					const expireDate = hist.createdAt
					expireDate.setDate(expireDate.getDate() + pokkiExpDays)

					process.stdout.write(hist.id + ' ')
					// TODO optimize
					hist.update({
						expired: expireDate < now,
						expireAt: expireDate,
					})
				}
			}

			// expire voucher
			if (user.RedeemedVouchers) {
				for (const purvouc of user.RedeemedVouchers) {
					const expireDate = purvouc.createdAt
					expireDate.setDate(expireDate.getDate() + voucExpDays)

					process.stdout.write(purvouc.id + ' ')
					// TODO optimize
					purvouc.update({
						expired: expireDate < now,
						expireAt: expireDate,
					})
				}
			}
			alteredCount++
		}

		util.logger('cron', {
			about: 'user-expiry-voucher-pokki',
			status: 'in progress',
			page,
			limit,
			queriedUserCount: userList.length,
			alteredUserCount: alteredCount,
		})
		hasMoreLeft = userList.length > 0
		page++
	}

	util.logger('cron', {
		about: 'user-expiry-voucher-pokki',
		status: 'finished',
	})
}
