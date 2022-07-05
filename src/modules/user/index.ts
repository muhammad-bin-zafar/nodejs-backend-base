import * as auth from '@src/config/auth.js'
import * as db from '@src/db'
import * as dto from '@src/dto'
import { $, logger } from '@src/util'
import { Request, Response, Router } from 'express'
import services from './service.js'

logger.app('Adding user routes.')
const router = Router()
router.get('/users', auth.admin, $(dto.user.list), list)
router.get('/users/:id', auth.verified, get)
router.post('/users/signup', auth.unverified, $(dto.user.signup), signup)
router.put('/users/:id', auth.verified, update)
router.delete('/users/:id', auth.verified, remove)

async function list (req: Request, res) {
	const { sort } = req.data(dto.user.list, 'query')
	let order
	if (sort) order = [ [ sort, 'ASC' ] ]
	const userList = await db.user.findAll({ limit: 10, order })
	res.status(200).send(userList)
}

async function signup (req: Request, res: Response) {
	const data = req.data(dto.user.signup, 'body')
	const result = await services.signup(data)
	res.status(200).send(result)
}

async function login (req, res) {
	res.status(200).send()
}

async function get (req, res: Response) {
	const { id } = req.params
	const user = await db.user.findByPk(id)
	res.status(200).send(user)
}

async function remove (req, res) {
	const { id } = req.params
	db.user.destroy({ where: { id } })
	res.status(200).send()
}

async function update (req, res) {
	res.status(200).send()
}

export { router }
export { services }
