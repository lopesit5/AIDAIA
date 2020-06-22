const router = require('express').Router()
const MW = require('../controllers/MWController')


router.post('/WS1/:app', MW.callWS1)
router.get('/WS1/:app', MW.callWSget)

module.exports = router;    
