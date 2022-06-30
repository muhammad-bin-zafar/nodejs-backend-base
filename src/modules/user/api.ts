import {Request, Response} from "express"
import * as dto from '@src/dto'
import {service} from '@src/module'
import * as db from '@src/db'

export default {signup, login, list, single}

async function list (req:Request, res) {
	const {sort } = req.data(dto.user.list, 'query')
	let order
	if (sort) order = [[sort, 'ASC']]
	const userList = await db.user.findAll({limit: 10, order})
	res.status(200).send(userList)
}

async function signup (req:Request, res:Response) {
	const data = req.data(dto.user.signup, 'body')
	const result = await service.user.signup(data)
	res.status(200).send(result)
}

async function login (req, res) {
	res.status(200).send()
}

async function single (req, res) {
	res.status(200).send()
}

async function remove (req, res) {
	res.status(200).send()
}
