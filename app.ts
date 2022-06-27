import express from 'express'
import 'express-async-errors'
import 'express-group-routes'
import * as loaders from './src/loaders/index.js'
import initEndpoints from './src/routes/index.js'

const app = express()

loaders.express.config( app )

loaders.express.mutateRequest( app )

loaders.express.mutateResponse( app )

loaders.firebase.config()

loaders.cron()

initEndpoints( app )

loaders.express.handleError(app)

export { app }
