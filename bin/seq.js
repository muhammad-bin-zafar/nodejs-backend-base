import { $, cd } from 'zx'
import 'dotenv/config'
import { promises as fs } from 'fs'
import chalk from 'chalk'
import { exit } from 'process'
const log = (tag, msg) => console.log(chalk.cyan(tag + ':'), msg)

if (!(await isProjectRoot())) {
	log('sequelize-cli', 'must run from project root.')
	exit()
}
const { env, argv } = process
const connUrl =
	env.DB_DIALECT + '://' + env.DB_USER + ':' + env.DB_PASS + '@' + env.DB_HOST + ':' + env.DB_PORT + '/' + env.DB_NAME
const args = argv.slice(2)

cd('src')
await $`npx sequelize --url ${connUrl} ${args}`

async function isProjectRoot () {
	try {
		await fs.access('.env')
		await fs.access('src')
		return true
	} catch (err) {
		return false
	}
}
