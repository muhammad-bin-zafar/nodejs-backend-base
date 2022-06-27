// @ts-ignore
import { $ } from 'zx'
// @ts-ignore
import { spinner } from 'zx/experimental'
import path from 'path'
import chalk from 'chalk'
import { promises as fs } from 'fs'

const log = msg => console.log(chalk.cyan('code-formatter: ') + msg)
$.verbose = false

// Config and arguments by dirnames.
const ConfigList = [
	{
		dir: [ 'src/configs', 'src/utils', 'src/modules', 'src/loaders', 'bin', 'tests', 'types' ],
		conf: `-w --config .prettierrc.json`.split(' '),
	},
	{
		dir: [ 'src/constants', 'src/dto' ],
		conf: `-w --print-width 120 --align-object-properties true --break-long-method-chains false`.split(' '),
	},
	{
		dir: [ 'src/routes', 'src/migrations' ],
		conf: `-w --print-width 150`.split(' '),
	},
	{
		dir: [ 'src/db' ],
		conf: `-w --print-width 200 --align-object-properties true`.split(' '),
	},
]

// Runtime
const { stdout: _staged } = await $`git diff --staged --name-status`
const staged = await Promise.all(
	_staged
	.split('\n')
	.slice(0, -1)
	.map(async line => {
		const arrData = line.split('\t')
		const status = arrData[0]
		const filename = arrData[1]
		if (status !== 'D') {
			if (!(await access(filename))) {
				log('parse error, file not found in line ' + chalk.yellow(line))
				return
			}
			return filename
		}
	})
)

for (const file of staged) {
	if (!file) continue
	const conf = getConfig(file)
	const _file = chalk.yellow(file)

	if (!(await access(file))) {
		log(`not found file ` + _file)
		continue
	}
	if (!conf) {
		log(`config not found for file ` + _file)
		continue
	}

	const cmd = $`npx prettierx ${conf} ${file}`.then(prettierxOut => {
		log(prettierxOut.stdout.slice(0, -1))
		$`git add ${file}`
	})
	await spinner('formatting file ' + _file, async () => await cmd)
}

function access (filename) {
	return fs
	.access(filename)
	.then(_ => true)
	.catch(_ => false)
}

function getConfig (filename) {
	const fdir = path.dirname(filename)
	const config = ConfigList.find(config => config.dir.includes(fdir))
	if (!config) return null
	return config.conf
}
