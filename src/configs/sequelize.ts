import { Sequelize } from 'sequelize-typescript'
import { logger } from '../utils/logger.js'

export const sequelize = new Sequelize({
	dialect: 'sqlite',
	database: 'movies',
	storage: ':memory:',
	models: [ __dirname + '../models' ],
})
sequelize
.authenticate()
.then(() => logger.app('Configured ORM.'))
.catch(() => logger.error('Configuring ORM failed.'))
