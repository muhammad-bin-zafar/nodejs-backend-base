import {Request, Response} from "express"
import * as dto from '@src/dto'
import {service} from '@src/module'
import * as db from '@src/db'

export default {signup, login, list, single}

async function list (req:Request, res) {
	const {sort } = req.data(dto.user.list, 'query')
	let order
	if (sort) order = [[sort, 'ASC']]
	return db.user.findAll({limit: 10, order})
}

async function signup (req:Request, res:Response) {
	const data = req.data(dto.user.signup, 'body')
	const result = await service.user.signup(data)
	res.status(200).end(result)
}

async function login (req, res) {
	res.status(200).end()
}

async function single (req, res) {
	res.status(200).end()
}

async function remove (req, res) {
	res.status(200).end()
}
