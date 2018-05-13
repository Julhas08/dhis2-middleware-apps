let express = require('express');
let router = express.Router();

// DHIS Blank field App
let blankFields = require('../src/app/controllers/FacilityBlankFields');
router.get('/blank-fields-app', blankFields.facilityDropdownLevelOne);
router.post('/facility-blank-fields-dropdown', blankFields.facilityDropdownLevelTwo);
router.post('/facility-blank-fields-search', blankFields.facilityBlankFieldsSearch);
router.get('/blank-facility-update', blankFields.blankFieldsFacilityUpdateInfoDisplay);
router.post('/blank-fields-facility-update', blankFields.blankFieldsFacilityEdit);

// Multiple DHIS Interoperability 
let multipleDHISInteroperability = require('../src/app/controllers/MultipleDHISInteroperability');
router.get('/multiple-dhis-interoperability', multipleDHISInteroperability.multipleDhisInteroperabilityDashboard);
router.post('/multiple-dhis-sync-type-search', multipleDHISInteroperability.multipleDHISSearchResultDisplay);
router.post('/multiple-dhis-sync-submit', multipleDHISInteroperability.multipleDHISSearchResultSubmit);

module.exports = router;