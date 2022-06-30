// @ts-ignore
import { $ } from 'zx'
// @ts-ignore
import { spinner } from 'zx/experimental'
import path from 'path'
import chalk from 'chalk'
import glob from 'glob'
import { promises as fs } from 'fs'
$.verbose = false

const log = msg => console.log(chalk.cyan('code-formatter: ') + msg)
const g = pattern => glob.sync(pattern, { absolute: true })

// Config and arguments by dirnames.
const ConfigList = [
	{
		dir: [ g('src/configs/*'), g('src/utils/*'), g('src/modules/**/*'), g('bin/*'), g('tests/**/*'), g('types/*') ],
		conf: `-w --config .prettierrc.json`.split(' '),
	},
	{
		dir: [ g('src/constants/**/*'), g('src/dto/**/*') ],
		conf: `-w --print-width 120 --align-object-properties true --break-long-method-chains false`.split(' '),
	},
	{
		dir: [ g('src/*'), g('src/migrations/**/*') ],
		conf: `-w --print-width 150`.split(' '),
	},
	{
		dir: [ g('src/db/*') ],
		conf: `-w --print-width 200 --align-object-properties true`.split(' '),
	},
]

// Runtime
const { stdout: _staged } = await $`git diff --staged --name-only`
const staged = await Promise.all(
	_staged
	.split('\n')
	.slice(0, -1)
	.map(async filename => {
		if (await access(filename)) return filename
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
	const absFilename = path.resolve(filename)
	const config = ConfigList.find(config => {
		return config.dir.find(fileList => fileList.includes(absFilename))
	})
	if (!config) return null
	return config.conf
}
