const express = require('express');
const { body, validationResult } = require('express-validator');
const Loan = require('../../models/Loan');
const Category = require('../../models/Category');
const authMiddleware = require('../../middleware/auth');
const { upload, uploadToS3, deleteFromS3 } = require('../../utils/s3Upload');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Create Loan
router.post('/', upload.single('bankLogo'), [
  body('category').notEmpty().withMessage('Category ID is required'),
  body('loanTitle').trim().notEmpty().withMessage('Loan title is required'),
  body('loanCompany').trim().notEmpty().withMessage('Loan company is required'),
  body('bankName').trim().notEmpty().withMessage('Bank name is required'),
  body('loanDescription').trim().notEmpty().withMessage('Loan description is required'),
  body('loanQuote').trim().notEmpty().withMessage('Loan quote is required'),
  body('link').trim().notEmpty().withMessage('Link is required').isURL().withMessage('Link must be a valid URL')
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

    const { category, loanTitle, loanCompany, bankName, loanDescription, loanQuote, link } = req.body;

    // Verify category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(404).json({ 
        success: false, 
        message: 'Category not found' 
      });
    }

    // Upload bank logo to S3 if provided
    let bankLogoUrl = null;
    if (req.file) {
      try {
        bankLogoUrl = await uploadToS3(req.file, 'bank-logos');
      } catch (uploadError) {
        return res.status(500).json({ 
          success: false, 
          message: 'Failed to upload bank logo',
          error: uploadError.message 
        });
      }
    }

    const loan = new Loan({
      category,
      loanTitle,
      loanCompany,
      bankName,
      bankLogo: bankLogoUrl,
      loanDescription,
      loanQuote,
      link
    });
    await loan.save();

    await loan.populate('category', 'name description');

    res.status(201).json({
      success: true,
      message: 'Loan created successfully',
      loan
    });
  } catch (error) {
    console.error('Create loan error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Get All Loans
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const query = {};
    if (category) {
      query.category = category;
    }

    const loans = await Loan.find(query)
      .populate('category', 'name description')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: loans.length,
      loans
    });
  } catch (error) {
    console.error('Get loans error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Get Single Loan
router.get('/:id', async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id)
      .populate('category', 'name description');
    
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
    console.error('Get loan error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Update Loan
router.put('/:id', upload.single('bankLogo'), [
  body('category').optional().notEmpty().withMessage('Category ID cannot be empty'),
  body('loanTitle').optional().trim().notEmpty().withMessage('Loan title cannot be empty'),
  body('loanCompany').optional().trim().notEmpty().withMessage('Loan company cannot be empty'),
  body('bankName').optional().trim().notEmpty().withMessage('Bank name cannot be empty'),
  body('loanDescription').optional().trim().notEmpty().withMessage('Loan description cannot be empty'),
  body('loanQuote').optional().trim().notEmpty().withMessage('Loan quote cannot be empty'),
  body('link').optional().trim().notEmpty().withMessage('Link cannot be empty').isURL().withMessage('Link must be a valid URL')
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

    // Get existing loan to check for old logo
    const existingLoan = await Loan.findById(req.params.id);
    if (!existingLoan) {
      return res.status(404).json({ 
        success: false, 
        message: 'Loan not found' 
      });
    }

    const { category, loanTitle, loanCompany, bankName, loanDescription, loanQuote, link, isActive } = req.body;
    const updateData = {};

    if (category) {
      // Verify category exists
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(404).json({ 
          success: false, 
          message: 'Category not found' 
        });
      }
      updateData.category = category;
    }
    if (loanTitle) updateData.loanTitle = loanTitle;
    if (loanCompany) updateData.loanCompany = loanCompany;
    if (bankName) updateData.bankName = bankName;
    if (loanDescription) updateData.loanDescription = loanDescription;
    if (loanQuote) updateData.loanQuote = loanQuote;
    if (link) updateData.link = link;
    if (isActive !== undefined) updateData.isActive = isActive;

    // Handle bank logo upload
    if (req.file) {
      try {
        // Delete old logo from S3 if exists
        if (existingLoan.bankLogo) {
          await deleteFromS3(existingLoan.bankLogo);
        }
        // Upload new logo
        const bankLogoUrl = await uploadToS3(req.file, 'bank-logos');
        updateData.bankLogo = bankLogoUrl;
      } catch (uploadError) {
        return res.status(500).json({ 
          success: false, 
          message: 'Failed to upload bank logo',
          error: uploadError.message 
        });
      }
    }

    const loan = await Loan.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('category', 'name description');

    if (!loan) {
      return res.status(404).json({ 
        success: false, 
        message: 'Loan not found' 
      });
    }

    res.json({
      success: true,
      message: 'Loan updated successfully',
      loan
    });
  } catch (error) {
    console.error('Update loan error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Delete Loan
router.delete('/:id', async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);
    if (!loan) {
      return res.status(404).json({ 
        success: false, 
        message: 'Loan not found' 
      });
    }

    // Delete bank logo from S3 if exists
    if (loan.bankLogo) {
      await deleteFromS3(loan.bankLogo);
    }

    await Loan.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Loan deleted successfully'
    });
  } catch (error) {
    console.error('Delete loan error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
});

module.exports = router;

