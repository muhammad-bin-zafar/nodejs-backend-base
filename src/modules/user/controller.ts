import {Request, Response} from "express"
import * as dto from '@src/dto'

export default {signup, login, remove}

async function signup (req:Request, res:Response) {
	const data = req.data(dto.user.signup, 'body')
	res.status(200).end(data)
}

async function login (req, res) {
	res.status(200).end()
}

async function remove (req, res) {
	res.status(200).end()
}
