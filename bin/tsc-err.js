import { $ } from 'zx'
import os from 'node:os'
import soundplay from 'sound-play'
const audioPath = './bin/err.wav'

play()

function play () {
	if ([ 'darwin', 'win32' ].includes(os.platform())) {
		return soundplay.play(audioPath)
	}
	else if (os.platform() === 'linux') {
		return $`mpv ${audioPath} --no-terminal > /dev/null`
	}
}
