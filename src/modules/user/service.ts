import db from '@src/db'
import * as dto from '@src/dto'
export default {signup}

async function signup(data:getdto<typeof dto.user.signup.body>) {
	const dupUser = await isDup(data)
	if (dupUser) return Error('Already signed up.')

	db.user.create(data)
}

async function isDup (data) {
	return false
}
