const router = require('express').Router()
const UCI = require('../controllers/UCIController')

router.get('/', UCI.GetAll)

module.exports = router;