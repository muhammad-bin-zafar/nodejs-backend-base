import { Sequelize } from 'sequelize-typescript'
import { logger } from '../utils/logger.js'
export { Op } from 'sequelize'

import user from '../db/user.js'
import {env} from './env.js'

const sequelize = new Sequelize({
	dialect: 'sqlite',
	database: 'movies',
	storage: ':memory:',
	models: [ user ],
	logging: env.dbLogging
})

export {user}

sequelize
.authenticate()
.then(async () => {
	logger.app('Configured ORM.')
	sequelize.getQueryInterface().createTable(user.tableName, user.getAttributes())
	user.create({ "password":"12345678", "firstName": "Muhammad", "email": "muhammad@segwitz.com"})
	user.findOne({where:{firstName: 'Muhammad'}})
})
.catch(err => logger.error('Configuring ORM failed: '+ err.toString()))
