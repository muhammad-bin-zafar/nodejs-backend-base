import { Application, Request, Response } from 'express'
import _ from 'lodash'

export default function (app: Application) {
	app.use(mutateResponse)
}
