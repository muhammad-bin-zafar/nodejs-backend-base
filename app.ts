import express from 'express'
import expressConfig from '@src/config/express-app.js'
import expressError from '@src/config/express-error.js'
import {routers} from '@src/module'

const app = express()
expressConfig(app)

// All application endpoints.
app.use('/v1/', routers.user)

// Error handler must be the last.
expressError(app)
export { app }
