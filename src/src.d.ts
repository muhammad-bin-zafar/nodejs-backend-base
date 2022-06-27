import joi from 'typesafe-joi'

type ReqFields = 'body' | 'param' | 'query'

declare global {
	type getdto< T > = joi.Literal<T>

	namespace Express {
		export interface Request {
			data<T extends joi.SchemaMap, U extends ReqFields>(schema: T, reqField: U): joi.Literal<T[U]>
		}
	}
}
