const xlsx = require('xlsx');
const path = require('path');

const getContacts = async(req,res) => {
    try {
        const workbook = xlsx.readFile(path.join(__dirname,'../documents/all_teachers.xlsx'));
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(worksheet);
        return res.status(200).json({data});
    } catch(error) {
        return res.status(500).json({message:"Internal server error"})
    }
}

module.exports = { getContacts }