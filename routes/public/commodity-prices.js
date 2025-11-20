const express = require('express');
const { query, validationResult } = require('express-validator');
const CommodityPrice = require('../../models/CommodityPrice');

const router = express.Router();

// Get All Active Commodity Prices (Public)
router.get('/', [
  query('commodityType').optional().isIn(['Silver', 'INR', 'Petrol', 'Diesel', 'LP Gas']),
  query('state').optional().trim(),
  query('city').optional().trim()
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

    const { commodityType, state, city } = req.query;
    const filter = { isActive: true };

    if (commodityType) filter.commodityType = commodityType;
    if (state) filter.state = new RegExp(state, 'i');
    if (city) filter.city = new RegExp(city, 'i');

    const commodityPrices = await CommodityPrice.find(filter)
      .select('-__v')
      .sort({ commodityType: 1, state: 1, city: 1 });
    
    res.json({
      success: true,
      count: commodityPrices.length,
      commodityPrices
    });
  } catch (error) {
    console.error('Get public commodity prices error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Get All Commodity Prices Grouped by State and City (Public)
router.get('/grouped', async (req, res) => {
  try {
    const commodityPrices = await CommodityPrice.find({ isActive: true })
      .select('-__v')
      .sort({ state: 1, city: 1, commodityType: 1 });

    // Group by state and city
    const grouped = {};
    
    commodityPrices.forEach(item => {
      const state = item.state;
      const city = item.city;
      
      if (!grouped[state]) {
        grouped[state] = {};
      }
      
      if (!grouped[state][city]) {
        grouped[state][city] = [];
      }
      
      grouped[state][city].push({
        _id: item._id,
        commodityType: item.commodityType,
        price: item.price,
        unit: item.unit,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      });
    });

    // Convert to array format
    const result = Object.keys(grouped).map(state => ({
      state,
      cities: Object.keys(grouped[state]).map(city => ({
        city,
        commodities: grouped[state][city]
      }))
    }));

    res.json({
      success: true,
      count: commodityPrices.length,
      statesCount: result.length,
      data: result
    });
  } catch (error) {
    console.error('Get grouped commodity prices error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Get Single Commodity Price (Public)
router.get('/:id', async (req, res) => {
  try {
    const commodityPrice = await CommodityPrice.findOne({ 
      _id: req.params.id, 
      isActive: true 
    }).select('-__v');
    
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
    console.error('Get public commodity price error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Get Commodity Prices by Type (Public)
router.get('/type/:commodityType', [
  query('state').optional().trim(),
  query('city').optional().trim()
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

    const { commodityType } = req.params;
    const { state, city } = req.query;

    if (!['Silver', 'INR', 'Petrol', 'Diesel', 'LP Gas'].includes(commodityType)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid commodity type. Must be one of: Silver, INR, Petrol, Diesel, LP Gas' 
      });
    }

    const filter = { 
      commodityType, 
      isActive: true 
    };

    if (state) filter.state = new RegExp(state, 'i');
    if (city) filter.city = new RegExp(city, 'i');

    const commodityPrices = await CommodityPrice.find(filter)
      .select('-__v')
      .sort({ state: 1, city: 1 });
    
    res.json({
      success: true,
      count: commodityPrices.length,
      commodityType,
      commodityPrices
    });
  } catch (error) {
    console.error('Get commodity prices by type error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
});

module.exports = router;

