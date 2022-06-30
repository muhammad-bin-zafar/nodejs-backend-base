import { $ } from 'zx'
import os from 'node:os'
import child from 'node:child_process'
import soundplay from 'sound-play'

play()
await $`cp ./tsconfig.json dist`
await $`cp ./package.json dist`
await $`cp -r bin dist`
await $`cp .env dist`
await $`cd dist; npx tsc-alias -p tsconfig.json -v --dir .`
console.log(`$ cd dist; node server.js`)
const run = child.spawn('node', [ 'server.js' ], { cwd: './dist' })
run.stdout.on('data', data => process.stdout.write(data))
run.stderr.on('data', data => process.stderr.write(data))
//run.on('close', (code, signal) => console.log({code, signal}))

function play () {
	const path = './bin/ok.wav'
	if ([ 'darwin', 'win32' ].includes(os.platform())) {
		return soundplay.play(path)
	}
	else if (os.platform() === 'linux') {
		return $`mpv ${path} --no-terminal > /dev/null`
	}
}
