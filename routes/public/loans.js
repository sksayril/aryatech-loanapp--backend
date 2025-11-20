const express = require('express');
const Loan = require('../../models/Loan');
const Category = require('../../models/Category');

const router = express.Router();

// Get All Active Loans (Public)
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const query = { isActive: true };
    
    if (category) {
      // Check if category exists and is active
      const categoryExists = await Category.findOne({ 
        _id: category, 
        isActive: true 
      });
      if (!categoryExists) {
        return res.status(404).json({ 
          success: false, 
          message: 'Category not found or inactive' 
        });
      }
      query.category = category;
    }

    const loans = await Loan.find(query)
      .populate('category', 'name description')
      .sort({ createdAt: -1 })
      .select('-__v');

    res.json({
      success: true,
      count: loans.length,
      loans
    });
  } catch (error) {
    console.error('Get public loans error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Get Loans by Category (Public)
router.get('/category/:categoryId', async (req, res) => {
  try {
    const { categoryId } = req.params;

    // Check if category exists and is active
    const category = await Category.findOne({ 
      _id: categoryId, 
      isActive: true 
    });
    
    if (!category) {
      return res.status(404).json({ 
        success: false, 
        message: 'Category not found or inactive' 
      });
    }

    const loans = await Loan.find({ 
      category: categoryId, 
      isActive: true 
    })
      .populate('category', 'name description')
      .sort({ createdAt: -1 })
      .select('-__v');

    res.json({
      success: true,
      count: loans.length,
      category: {
        id: category._id,
        name: category.name,
        description: category.description
      },
      loans
    });
  } catch (error) {
    console.error('Get loans by category error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Get Single Loan (Public)
router.get('/:id', async (req, res) => {
  try {
    const loan = await Loan.findOne({ 
      _id: req.params.id, 
      isActive: true 
    })
      .populate('category', 'name description')
      .select('-__v');
    
    if (!loan) {
      return res.status(404).json({ 
        success: false, 
        message: 'Loan not found' 
      });
    }
    
    res.json({
      success: true,
      loan
    });
  } catch (error) {
    console.error('Get public loan error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
});

module.exports = router;

