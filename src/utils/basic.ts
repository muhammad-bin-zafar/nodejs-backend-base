import crypto from 'node:crypto'
import util from 'node:util'

export const sleep = ms => new Promise( r => setTimeout( r, ms ) )

/** Checks if NODE_ENV is "development". */
export const isDevEnv = () => process.env.NODE_ENV === 'development'

export function expand ( obj, depth = 20, showHidden = false ) {
	return util.inspect( obj, {
		indentationLvl: 2,
		colors: true,
		depth,
		showHidden,
		sorted: true,
	} )
}

/**
 * Given a string, prepends `pad`
 * enough times, to have the whole be
 * of length `totalLen`.
 *
 * @returns A padded string.
 */
export function padString ( string, totalLen = 5, pad = '0' ) {
	if ( typeof string === 'number' ) string = string.toString()

	if ( string.length < totalLen ) string = string.padStart( totalLen, pad )
	return string
}

/**
 * Generate a unique timestamp of
 * the current/given date & time.
 */
export function genUniqTimestamp ( includeTime = false, includeMs = false, D=new Date() ) {
	const year = D.getFullYear()
	.toString()
	.substring( 2 )
	const time = padString( D.getHours(), 2 ) + padString( D.getMinutes(), 2 ) + padString( D.getSeconds(), 2 )
	const date = year + padString( D.getMonth() + 1, 2 ) + padString( D.getDate(), 2 )
	const ms = padString( D.getMilliseconds(), 6 )

	if ( includeTime && !includeMs ) return date + time
	if ( includeTime && includeMs ) return date + time + ms
	// If time isn't included, there's no point of including MS.
	else return date
}

export function hash ( string, algo = 'md5' ) {
	return crypto
	.createHash( algo )
	.update( string )
	.digest( 'hex' )
}
