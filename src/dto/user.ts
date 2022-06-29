import joi from 'typesafe-joi'
import * as CONST from '@src/const'

const userTypeList = Object.values(CONST.USER.TYPE)

const dto = {
	mobile: joi.string().length(11),
	firstName: joi.string().min(2).max(16),
	lastName: joi.string().min(2).max(16),
	email: joi.string().email().max(320),
	password: joi.string().min(8).max(32)
}

const signup = {
	body: joi.object({
		userType: joi.string().required().valid(userTypeList),
		password: dto.password.required(),
		mobile: dto.mobile.optional(),
		firstName: dto.firstName.required(),
		email: dto.email.required(),
	}).required()
}

// TODO auth-based sort keys
const validSortKeys = ['createdAt', 'firstName', 'email']
// TODO auth-based search keys
const validSearchKeys = ['firstName', 'email']

const list = {
	query: joi.object({
		sort: joi.string().valid(validSortKeys),
		// search
		firstName: dto.firstName.optional(),
		email: dto.email.optional()
	}).required().unknown(false)
}

export default {list, signup}
