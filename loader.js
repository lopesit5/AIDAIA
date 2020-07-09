const s = require('./api/config/server')
const routerAIDAIA = require('./api/routes/routesAIDAIA')
s.server.use('/AIDAIA', routerAIDAIA)