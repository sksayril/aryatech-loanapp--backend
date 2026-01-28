const express = require('express');
const { body, validationResult } = require('express-validator');
const ApplyNow = require('../../models/ApplyNow');
const ApplyNowUSA = require('../../models/ApplyNowUSA');
const authMiddleware = require('../../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Create or Update Apply Now Settings (POST)
router.post('/', [
  body('isActive').isBoolean().withMessage('isActive must be a boolean value'),
  body('description').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { isActive, description } = req.body;

    // Get existing settings or create new one
    let applyNowSettings = await ApplyNow.findOne();
    
    if (applyNowSettings) {
      // Update existing settings
      applyNowSettings.isActive = isActive;
      if (description !== undefined) {
        applyNowSettings.description = description;
      }
      await applyNowSettings.save();
    } else {
      // Create new settings
      applyNowSettings = new ApplyNow({
        isActive,
        description: description || ''
      });
      await applyNowSettings.save();
    }

    res.status(201).json({
      success: true,
      message: 'Apply Now settings updated successfully',
      applyNow: applyNowSettings
    });
  } catch (error) {
    console.error('Create/Update Apply Now error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Get Apply Now Settings (GET)
router.get('/', async (req, res) => {
  try {
    const applyNowSettings = await ApplyNow.getSettings();

    res.json({
      success: true,
      applyNow: applyNowSettings
    });
  } catch (error) {
    console.error('Get Apply Now settings error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Update Apply Now Settings (PUT)
router.put('/', [
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean value'),
  body('description').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { isActive, description } = req.body;

    // Get existing settings or create new one
    let applyNowSettings = await ApplyNow.findOne();
    
    if (!applyNowSettings) {
      applyNowSettings = new ApplyNow({
        isActive: isActive !== undefined ? isActive : true,
        description: description || ''
      });
    } else {
      if (isActive !== undefined) {
        applyNowSettings.isActive = isActive;
      }
      if (description !== undefined) {
        applyNowSettings.description = description;
      }
    }
    
    await applyNowSettings.save();

    res.json({
      success: true,
      message: 'Apply Now settings updated successfully',
      applyNow: applyNowSettings
    });
  } catch (error) {
    console.error('Update Apply Now error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
});

// --------------------------------------USA-------------------------------- 

router.post('/usa', [
  body('isActive').isBoolean().withMessage('isActive must be a boolean value'),
  body('description').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { isActive, description } = req.body;

    // Get existing settings or create new one (USA collection)
    let applyNowSettings = await ApplyNowUSA.findOne();
    
    if (applyNowSettings) {
      // Update existing settings
      applyNowSettings.isActive = isActive;
      if (description !== undefined) {
        applyNowSettings.description = description;
      }
      await applyNowSettings.save();
    } else {
      // Create new settings
      applyNowSettings = new ApplyNowUSA({
        isActive,
        description: description || ''
      });
      await applyNowSettings.save();
    }

    res.status(201).json({
      success: true,
      message: 'Apply Now settings updated successfully',
      applyNow: applyNowSettings
    });
  } catch (error) {
    console.error('Create/Update Apply Now error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Get Apply Now Settings (GET) - USA
router.get('/usa', async (req, res) => {
  try {
    const applyNowSettings = await ApplyNowUSA.getSettings();

    res.json({
      success: true,
      applyNow: applyNowSettings
    });
  } catch (error) {
    console.error('Get Apply Now settings error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Update Apply Now Settings (PUT) - USA
router.put('/usa', [
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean value'),
  body('description').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { isActive, description } = req.body;

    // Get existing settings or create new one (USA collection)
    let applyNowSettings = await ApplyNowUSA.findOne();
    
    if (!applyNowSettings) {
      applyNowSettings = new ApplyNowUSA({
        isActive: isActive !== undefined ? isActive : true,
        description: description || ''
      });
    } else {
      if (isActive !== undefined) {
        applyNowSettings.isActive = isActive;
      }
      if (description !== undefined) {
        applyNowSettings.description = description;
      }
    }
    
    await applyNowSettings.save();

    res.json({
      success: true,
      message: 'Apply Now settings updated successfully',
      applyNow: applyNowSettings
    });
  } catch (error) {
    console.error('Update Apply Now error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
});









module.exports = router;
