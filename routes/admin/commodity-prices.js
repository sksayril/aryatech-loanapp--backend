const express = require('express');
const { body, validationResult, query } = require('express-validator');
const CommodityPrice = require('../../models/CommodityPrice');
const authMiddleware = require('../../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Create Commodity Price
router.post('/', [
  body('commodityType').trim().notEmpty().isIn(['Silver', 'INR', 'Petrol', 'Diesel', 'LP Gas']).withMessage('Commodity type must be one of: Silver, INR, Petrol, Diesel, LP Gas'),
  body('state').trim().notEmpty().withMessage('State is required'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('unit').optional().trim(),
  body('isActive').optional().isBoolean()
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

    const { commodityType, state, city, price, unit, isActive } = req.body;

    // Check if commodity price already exists for this combination
    const existingPrice = await CommodityPrice.findOne({ 
      commodityType, 
      state, 
      city 
    });
    
    if (existingPrice) {
      return res.status(400).json({ 
        success: false, 
        message: 'Commodity price for this type, state, and city combination already exists' 
      });
    }

    const commodityPrice = new CommodityPrice({ 
      commodityType, 
      state, 
      city, 
      price, 
      unit: unit || 'per unit',
      isActive: isActive !== undefined ? isActive : true
    });
    await commodityPrice.save();

    res.status(201).json({
      success: true,
      message: 'Commodity price created successfully',
      commodityPrice
    });
  } catch (error) {
    console.error('Create commodity price error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        message: 'Commodity price for this type, state, and city combination already exists' 
      });
    }
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Get All Commodity Prices
router.get('/', [
  query('commodityType').optional().isIn(['Silver', 'INR', 'Petrol', 'Diesel', 'LP Gas']),
  query('state').optional().trim(),
  query('city').optional().trim(),
  query('isActive').optional().isBoolean()
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

    const { commodityType, state, city, isActive } = req.query;
    const filter = {};

    if (commodityType) filter.commodityType = commodityType;
    if (state) filter.state = new RegExp(state, 'i');
    if (city) filter.city = new RegExp(city, 'i');
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const commodityPrices = await CommodityPrice.find(filter)
      .sort({ commodityType: 1, state: 1, city: 1, createdAt: -1 });

    res.json({
      success: true,
      count: commodityPrices.length,
      commodityPrices
    });
  } catch (error) {
    console.error('Get commodity prices error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Get Single Commodity Price
router.get('/:id', async (req, res) => {
  try {
    const commodityPrice = await CommodityPrice.findById(req.params.id);
    if (!commodityPrice) {
      return res.status(404).json({ 
        success: false, 
        message: 'Commodity price not found' 
      });
    }
    res.json({
      success: true,
      commodityPrice
    });
  } catch (error) {
    console.error('Get commodity price error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Update Commodity Price
router.put('/:id', [
  body('commodityType').optional().trim().isIn(['Silver', 'INR', 'Petrol', 'Diesel', 'LP Gas']).withMessage('Commodity type must be one of: Silver, INR, Petrol, Diesel, LP Gas'),
  body('state').optional().trim().notEmpty().withMessage('State cannot be empty'),
  body('city').optional().trim().notEmpty().withMessage('City cannot be empty'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('unit').optional().trim(),
  body('isActive').optional().isBoolean()
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

    const { commodityType, state, city, price, unit, isActive } = req.body;
    const updateData = {};
    
    if (commodityType) updateData.commodityType = commodityType;
    if (state) updateData.state = state;
    if (city) updateData.city = city;
    if (price !== undefined) updateData.price = price;
    if (unit !== undefined) updateData.unit = unit;
    if (isActive !== undefined) updateData.isActive = isActive;

    // Check if the new combination already exists (if updating commodityType, state, or city)
    if (commodityType || state || city) {
      const currentPrice = await CommodityPrice.findById(req.params.id);
      if (!currentPrice) {
        return res.status(404).json({ 
          success: false, 
          message: 'Commodity price not found' 
        });
      }

      const checkCommodityType = commodityType || currentPrice.commodityType;
      const checkState = state || currentPrice.state;
      const checkCity = city || currentPrice.city;

      const existingPrice = await CommodityPrice.findOne({ 
        commodityType: checkCommodityType,
        state: checkState,
        city: checkCity,
        _id: { $ne: req.params.id }
      });

      if (existingPrice) {
        return res.status(400).json({ 
          success: false, 
          message: 'Commodity price for this type, state, and city combination already exists' 
        });
      }
    }

    const commodityPrice = await CommodityPrice.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!commodityPrice) {
      return res.status(404).json({ 
        success: false, 
        message: 'Commodity price not found' 
      });
    }

    res.json({
      success: true,
      message: 'Commodity price updated successfully',
      commodityPrice
    });
  } catch (error) {
    console.error('Update commodity price error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        message: 'Commodity price for this type, state, and city combination already exists' 
      });
    }
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Delete Commodity Price
router.delete('/:id', async (req, res) => {
  try {
    const commodityPrice = await CommodityPrice.findByIdAndDelete(req.params.id);
    if (!commodityPrice) {
      return res.status(404).json({ 
        success: false, 
        message: 'Commodity price not found' 
      });
    }
    res.json({
      success: true,
      message: 'Commodity price deleted successfully'
    });
  } catch (error) {
    console.error('Delete commodity price error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
});

module.exports = router;

