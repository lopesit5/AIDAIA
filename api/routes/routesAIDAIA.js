const router = require('express').Router()
const AIDAIA = require('../controllers/AIDAIAController')

router.get('/:id/', AIDAIA.runScript)

module.exports = router;