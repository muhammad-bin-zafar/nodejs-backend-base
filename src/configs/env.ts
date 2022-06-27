import 'dotenv/config'

// NOTE:
// As of now, each of the env vars are necessary.
// Try to avoid having an env var to be null/undefined,
// If not possible to avoid, please create an
// issue in github.

const ENV = process.env
const nenv = <'development' | 'test' | 'production'>ENV.NODE_ENV
const devEnvMap = {
	dbUser: <string>ENV.DB_USER,
	dbPasswd: <string>ENV.DB_PASS,
	dbName: <string>ENV.DB_NAME,
	dbHost: <string>ENV.DB_HOST,
	dbDialect: <string>ENV.DB_DIALECT,
	dbPort: Number(ENV.DB_PORT),
	dbLogging: false,

	nenv,
	secret: <string>ENV.SECRET,

	devmailServer: <string>ENV.DEVMAIL_SERVER,
	devmailSender: <string>ENV.DEVMAIL_USER,
	devmailPasswd: <string>ENV.DEVMAIL_PASS,
	devmailRecvList: <string>ENV.DEVMAIL_RECV,
}

for (const [ key, value ] of Object.entries(devEnvMap)) {
	if (value === undefined) throw Error(`[dev] Env var "${key}" not specified.`)
}

/**
 * To change variables for any env:
 * ```
 * const testEnvMap = structuredClone(devEnvMap)
 * testEnvMap.dbLogging=true
 * ```
 */
const envMap = {
	development: devEnvMap,
	test: devEnvMap,
	production: devEnvMap,
}

/**
 * Environment variables for
 * the current NODE_ENV.
 */
export const env = envMap[nenv]
