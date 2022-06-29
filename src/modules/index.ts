import userapi from './user/api.js'
import usersvc from './user/service.js'

const user = {
	api: userapi,
	service: usersvc,
}

export default { user }

/** APIs from all modules. */
export const api = {
	user: user.api,
}

/** Services from all modules. */
export const service = {
	user: user.service,
}
