const router = require('express').Router()
const OPT = require('../controllers/OPTparser')

router.get('/:doc/:segmento', OPT.OPTparser)

module.exports = router;    
