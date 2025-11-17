const XLSX = require('xlsx');
const fs = require('fs').promises;
const { normalizeColumnName } = require('../../config/excelConfig');

const validateHeaders = async(req,res,next) => {
    if(!req.file) {
        return res.status(400).json({error: 'No file uploaded'});
    }
    
    const filePath = req.file.path;
    try {
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.sheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1});

        if (jsonData.length === 0) {
            await fs.unlink(filePath).catch(()=> {});
            return res.status(400).json({error: 'Uploaded file is empty'});
        }

        const excelHeaders = jsonData[0].map(normalizeColumnName);
        const requiredHeaders = ['First Name','Last Name','Email','Gender'];
        const missingHeaders = requiredHeaders.filter(header => !excelHeaders.includes(header));

        if(missingHeaders.length > 0) {
            await fs.unlink(filePath).catch(() => {});
            return res.status(400).json({error: `File column mismatch: Missing required columns ${missingHeaders.join(', ')}`});
        }

        req.sheetName = sheetName;
        req.jsonData = jsonData;
        req.excelHeaders = excelHeaders;
        next();
    } catch(error) {
        console.error('Error in validateHeaders middleware:', error);
        await fs.unlink(filePath).catch(()=> {});
        return res.status(500).json({error:'Failed to process uploaded file'});
    }
};

module.exports = validateHeaders;