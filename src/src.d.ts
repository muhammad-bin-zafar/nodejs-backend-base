import joi from 'typesafe-joi'

type ReqFields = 'body' | 'param' | 'query'

declare global {
	type getdto<T> = joi.Literal<T>

	namespace Express {
		export interface Request {
			/** Get request data, *through* Joi schema. */
			data<T extends joi.SchemaMap, U extends ReqFields>(schema: T, reqField: U): joi.Literal<T[U]>
		}
		export interface Response {
			/** Server responds success. */
			ok(msg: string | Record<string, any>): void

			/** Server responds error. */
			err(msg: string | Record<string, any>, code: number): void
		}
	}
}
