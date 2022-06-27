import { Request, Response, Application } from 'express'
import _ from 'lodash'
import path from 'path'
import Joi from 'typesafe-joi'
import * as dto from '../validators/index.js'

export default function (app: Application) {
	app.use(mutateRequest)
}

/**
 * Extends the Express Request interface
 * by adding a `data` method. Function
 * signature is in TS declaration file.
 *
 * This function needs to be on same file
 * as `getFuncCallerFile()`.
 */
function mutateRequest (req: Request, res: Response, next) {
	req.data = (prop: '' | 'body' | 'param' | 'query' = 'body', schema: any = undefined) => {
		/** Typesafe-schema first, req[prop] second. */
		if (_.isObjectLike(prop) && (_.isUndefined(schema) || _.isString(schema))) {
			let tschema: string
			if (_.isUndefined(schema)) tschema = 'body'
			else tschema = schema

			const data = getRequestDataByJoi(req, prop, <any>tschema)
			return data
		}
		/** req[prop] first, schema-parent second. */
		else if (!schema) {
			const re = /(\w+)@|at (\w+) \(/g
			const st = <string>Error().stack
			let file = path.basename(getFuncCallerFile())
			const func = (<RegExpExecArray>re.exec(st))[2]
			file = file.slice(0, file.indexOf('.'))
			schema = dto[file][func]
		}
		return getRequestDataByJoi(req, schema, prop)
	}
	next()
}

/**
 * @param r  Request data, or request-data-parent.
 * @param v Joi validator scheme.
 * @param property Request field, if specified request-data-parent.
 *
 * Given req[body|query|param] or req, and given a validator
 * scheme - get the required & optional params
 * if they exist.
 *
 * Encapsulates the data. Much easier for ORM.
 */
function getRequestDataByJoi (r, v, property: '' | 'body' | 'query' | 'param' = '') {
	const err2 = 'Optional/Required not specified for Joi scheme.'
	const err3 = 'Cannot determine if required or optional.'
	const err4 = 'Validation scheme not found for given req property.'

	if (property) {
		r = r[property]
		v = v[property]
	}
	if (!v) throw Error(err4)

	const joiValidPresenceList = [ 'optional', 'required', 'ignore' ]
	let wrapped = false
	let schemaKeys = Object.keys(v)
	// Often the schema is wrapped as: Joi.object({... schema ...})
	// In that case, build the correct attrList.
	if (!v[schemaKeys[0]]?._flags?.presence && Array.isArray(v?._inner?.children)) {
		schemaKeys = v._inner.children.map(e => e.key)
		wrapped = true
	}

	const result: any = {}
	for (const key of schemaKeys) {
		const value = r[key]
		let presence
		try {
			presence = v[key]._flags.presence
		} catch (err) {
			if (!wrapped) throw Error(err3)
			presence = v._inner.children.find(e => e.key === key).schema._flags.presence
		}

		if (joiValidPresenceList.includes(presence)) {
			if (value !== null) result[key] = value
		}
		else if (v[key]._flags?.sparse === false) {
			if (value !== null) result[key] = value
		}
		else throw Error(err2)
	}
	return <Joi.Literal<typeof v>>result
}

function getFuncCallerFile () {
	const err = new Error()
	let filename, caller
	const pst = Error.prepareStackTrace
	Error.prepareStackTrace = (err, stack) => {
		return stack
	}
	// @ts-ignore
	const currentfile = err?.stack?.shift().getFileName()
	while (err?.stack?.length) {
		// @ts-ignore
		caller = err.stack.shift().getFileName()
		if (currentfile !== caller) {
			filename = caller
			break
		}
	}
	Error.prepareStackTrace = pst
	return filename
}
