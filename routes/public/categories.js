const express = require('express');
const Category = require('../../models/Category');
const Loan = require('../../models/Loan');

const router = express.Router();

// Get All Active Categories (Public)
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .sort({ name: 1 })
      .select('-__v');
    
    // Get loan counts for each category
    const categoriesWithLoanCounts = await Promise.all(
      categories.map(async (category) => {
        const loanCount = await Loan.countDocuments({ 
          category: category._id, 
          isActive: true 
        });
        return {
          ...category.toObject(),
          loanCount
        };
      })
    );
    
    res.json({
      success: true,
      count: categoriesWithLoanCounts.length,
      categories: categoriesWithLoanCounts
    });
  } catch (error) {
    console.error('Get public categories error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Get Single Category (Public)
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findOne({ 
      _id: req.params.id, 
      isActive: true 
    }).select('-__v');
    
    if (!category) {
      return res.status(404).json({ 
        success: false, 
        message: 'Category not found' 
      });
    }
    
    // Get loan count for this category
    const loanCount = await Loan.countDocuments({ 
      category: category._id, 
      isActive: true 
    });
    
    const categoryWithLoanCount = {
      ...category.toObject(),
      loanCount
    };
    
    res.json({
      success: true,
      category: categoryWithLoanCount
    });
  } catch (error) {
    console.error('Get public category error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
});

module.exports = router;

