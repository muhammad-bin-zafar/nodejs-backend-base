import { Request, Response, Application } from 'express'
import _ from 'lodash'
import path from 'path'
import Joi from 'typesafe-joi'
import * as dto from '@src/dto'

export default function (app: Application) {
	app.use((req: Request, res: Response, next) => {
		req.data = (schema, prop) => req[prop]
		next()
	})
}
