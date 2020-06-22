const router = require('express').Router()
const Voice = require('../controllers/Voiceparser')

router.get('/:id/', Voice.GetID)
router.get('/', Voice.GetAll)

module.exports = router;