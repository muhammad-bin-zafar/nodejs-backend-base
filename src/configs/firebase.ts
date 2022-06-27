import firebase from 'firebase-admin'
import { USER, CREDS_FIREBASE } from '../constants/index.js'
import { logger, sendDevMail } from '@src/util'

logger('app', 'Configuring Firebase.')
const firebaseRepo: { [x: string]: firebase.app.App } = {}

function initWithCred (cert: string | firebase.ServiceAccount, name: string): firebase.app.App {
	const cred = { credential: firebase.credential.cert(cert) }
	const app = firebase.initializeApp(cred, name)
	return app
}

export function config () {
	try {
		firebaseRepo[USER.CUST] = initWithCred(CREDS_FIREBASE[USER.CUST], 'mdt-user')
		firebaseRepo[USER.SHOP] = initWithCred(CREDS_FIREBASE[USER.SHOP], 'mdt-shop')
		firebaseRepo[USER.RID] = initWithCred(CREDS_FIREBASE[USER.RID], 'mdt-rider')
	} catch (err) {
		const error = err as Error
		logger('error', 'Configuring Firebase: ' + error.toString())
		sendDevMail(error)
	}
}

export { firebaseRepo as FirebaseAppRepo }
