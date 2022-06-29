import chalk from 'chalk'
import winston from 'winston'
import { expand, isDevEnv } from './basic.js'
const {
	loggers,
	transports: { Console },
	format: { colorize, combine, timestamp, printf },
} = winston
let fileProcInfo: any = {}
const commonFormat = [
	timestamp( { format: 'DD MMM YYYY HH:mm:ss:ms' } ),
	printf( info => {
		const { timestamp, level, message } = info as any
		const procThis = fileProcInfo
		const procInfo = procThis.name ? [procThis.name, procThis.pid].join( ' ' ) : process.pid + ''
		const logStrip = [procInfo, timestamp, level].map( e => chalk.inverse( e ) )
		return logStrip.concat( message ).join( ' ' )
	} ),
]

loggers.add( 'app', {
	levels: { app: 1 },
	transports: [new Console( { level: 'app' } )],
	format: combine( colorize( { colors: { app: 'cyan' } } ), ...commonFormat ),
} )

loggers.add( 'http', {
	levels: { http: 1 },
	transports: [new Console( { level: 'http' } )],
	format: combine( colorize( { colors: { http: 'green' } } ), ...commonFormat ),
} )

loggers.add( 'cron', {
	levels: { cron: 1 },
	transports: [new Console( { level: 'cron' } )],
	format: combine( colorize( { colors: { cron: 'yellow' } } ), ...commonFormat ),
} )

loggers.add( 'error', {
	levels: { error: 0 },
	transports: [new Console( { level: 'error' } )],
	format: combine( colorize( { colors: { error: 'red' } } ), ...commonFormat ),
} )

loggers.add( 'dev', {
	levels: { dev: 1 },
	transports: isDevEnv() ? [new Console( { level: 'dev' } )] : [],
	format: combine( colorize( { colors: { dev: 'blue' } } ), ...commonFormat ),
} )

type LoggerFunc = (msg:string) => winston.Logger
type Logger = {
	procInfo: any,
	error: LoggerFunc
	dev: LoggerFunc
	cron: LoggerFunc
	http: LoggerFunc
	app: LoggerFunc
}

export const logger = {
	set procInfo (v) {fileProcInfo=v},
	error: msg => loggers.get('error').log('error', msg),
	dev: msg => loggers.get('dev').log('dev', msg),
	app: msg => loggers.get('app').log('app', msg),
	http: msg => loggers.get('http').log('http', msg),
} as any as Logger
