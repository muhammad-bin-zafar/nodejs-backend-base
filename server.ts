const primaryProcInfo = { name: '#', deployedAt: new Date(), pid: process.pid }
await import('reflect-metadata')
const {writeFile, readFile} = await import('fs/promises')
const { default: cluster } = await import( 'cluster' )
const { default: os } = await import( 'os' )
await import( 'dotenv/config' )
const {logger} = await import('./src/helpers/logger.js')
if (cluster.isPrimary) logger.procInfo = primaryProcInfo
if (cluster.isWorker) {
	const forkList = JSON.parse(await readFile('.app-init.json', 'utf8'))
	logger.procInfo = forkList.find(f => f.pid === process.pid)
}
const { sendDevMail, expand, isDevEnv,uniqueDate2 } = await import( './src/helpers/index.js' )

// Catch all errors, and send to DevMail.
// - unhandled errors
// - unhandled unawaited promise rejections
process.on( 'uncaughtException', error => sendDevMail( { error } ) )
process.on( 'unhandledRejection', ( reason, promise) => sendDevMail( { reason, promise } ) )

if ( cluster.isPrimary && !isDevEnv()) {
	// eslint-disable-next-line no-var
	var forkList:any = []

	const cpus = os.cpus().length
	logger( 'app', `Deploying ${cpus} forks.` )
	for ( let i = 0; i < cpus; i++ ) {
		const worker = cluster.fork()
		addForkRecord(worker.process.pid)
	}
	await writeFile(`.app-init.json`, JSON.stringify(forkList))

	cluster.on( 'online', worker => {
		const {pid} = worker.process
		logger( 'app', `Fork ${pid} is online.` )
	} )
	cluster.on( 'exit', ( worker, c, s ) => {
		const pid = worker.process.pid
		logger( 'app', `Fork ${pid} exited. Code: ${c}. Signal: ${s}. Deploying new fork.` )
		cluster.fork()
	} )
}

if (cluster.isWorker) {
	// Each is a fork
	const {env: {APP_PORT}} = process
	
	const { app } = await import( './app.js' )
	const port = APP_PORT || 3000
	app.listen( port, () => logger('app', `Listening at PORT ${port}.` ) )
}

/**
 * Stores app instance information,
 * and assigns single alphabet names.
 */
function addForkRecord(pid) {
	//const {forkList} = app.locals
	const _forkData = {pid, deployedAt: new Date()}

	if (!forkList.length) {
		const forkData = {name: 'A', ..._forkData}
		forkList.push(forkData)
		return
	}

	const forkNames:any[] = forkList.map(fork => fork.name)
	const lastNameCodepoint = forkNames[forkNames.length-1].codePointAt(0)
	const nextName = String.fromCodePoint(lastNameCodepoint + 1)
	const forkData = {name: nextName, ..._forkData}
	forkList.push(forkData)
}

export {}
