import { $, cd } from 'zx'
import os from 'node:os'
import child from 'node:child_process'
import soundplay from 'sound-play'

play()
await $`cp -r bin dist`
await $`cp .env dist`
await $`cp ./tsconfig.json dist`
await $`cp ./package.json dist`
await $`cp src/migrations/package.json dist/src/migrations`
await $`cd dist; npx tsc-alias -p tsconfig.json -v --dir .`
cd('dist')
await $`node server.js`
//const run = child.spawn('node', [ 'server.js' ], { cwd: './dist' })
//run.stdout.on('data', data => process.stdout.write(data))
//run.stderr.on('data', data => process.stderr.write(data))

function play () {
	const path = './bin/ok.wav'
	if ([ 'darwin', 'win32' ].includes(os.platform())) {
		return soundplay.play(path)
	}
	else if (os.platform() === 'linux') {
		return $`mpv ${path} --no-terminal > /dev/null`
	}
}

async function hasDiff (targetFile, destFile) {
	return await $`git diff ${targetFile} ${destFile}`
}
