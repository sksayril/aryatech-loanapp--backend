const express = require('express');
const ApplyNow = require('../../models/ApplyNow');
const ApplyNowUSA = require('../../models/ApplyNowUSA');
const ApplyNowIndia = require('../../models/ApplyNowindia');

const router = express.Router();

// Get Apply Now Status (Public - GET)
router.get('/', async (req, res) => {
  try {
    const applyNowSettings = await ApplyNow.getSettings();

    res.json({
      success: true,
      isActive: applyNowSettings.isActive,
      description: applyNowSettings.description || null
    });
  } catch (error) {
    console.error('Get public Apply Now status error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
});

router.get('/usa', async (req, res) => {
  try {
    const applyNowSettings = await ApplyNowUSA.getSettings();

    res.json({
      success: true,
      isActive: applyNowSettings.isActive,
      description: applyNowSettings.description || null
    });
  } catch (error) {
    console.error('Get public Apply Now status error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
});

router.get('/india', async (req, res) => {
  try {
    const applyNowSettings = await ApplyNowIndia.getSettings();

    res.json({
      success: true,
      isActive: applyNowSettings.isActive,
      description: applyNowSettings.description || null
    });
  } catch (error) {
    console.error('Get public Apply Now status error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
});

module.exports = router;
