import { Sequelize } from 'sequelize-typescript'
import { logger } from '../utils/logger.js'
import { env } from './env.js'
export { Op } from 'sequelize'
export { user }

import user from '../db/user.js'

const sequelize = new Sequelize({
	dialect: <any>env.dbDialect,
	port: env.dbPort,
	database: env.dbName,
	models: [ user ],
	logging: env.dbLogging,
	password: env.dbPasswd,
})

sequelize
.authenticate()
.then(async () => {
	logger.app('Configured ORM.')
	sequelize.getQueryInterface().createTable(user.tableName, user.getAttributes())
	user.create({ password: '12345678', firstName: 'Muhammad', email: 'muhammad@segwitz.com' })
	user.findOne({ where: { firstName: 'Muhammad' } })
})
.catch(err => logger.error('Configuring ORM failed: ' + err.toString()))
