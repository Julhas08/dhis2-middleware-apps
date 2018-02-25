/**
* API Settings Form
* @method {GET} apiSettings.index
* @return facility blank fields app    
*/

let express = require('express');
let router = express.Router();
let blankFields = require('../src/app/controllers/FacilityBlankFields');

router.get('/blank-fields-app', blankFields.facilityDropdownLevelOne);
router.post('/facility-blank-fields-dropdown', blankFields.facilityDropdownLevelTwo);
router.post('/facility-blank-fields-search', blankFields.facilityBlankFieldsSearch);
router.get('/blank-facility-update', blankFields.blankFieldsFacilityUpdateInfoDisplay);
router.post('/blank-fields-facility-update', blankFields.blankFieldsFacilityEdit);

module.exports = router;
