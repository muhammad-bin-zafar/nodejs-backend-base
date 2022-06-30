import express from 'express'
import endpoints from '@root/src/routes.js'

import appConfig from '@src/config/express-app.js'
import appReq from '@src/config/express-req.js'
import appRes from '@src/config/express-res.js'
import appErr from '@src/config/express-error.js'

const app = express()
app.use()
appReq(app)
appRes(app)
appConfig(app)
endpoints(app)
appErr(app)

export { app }
