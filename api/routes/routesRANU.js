const router = require('express').Router()
const XML = require('../controllers/xmlparser')

router.get('/:seg', XML.xmlparser)

module.exports = router;    
