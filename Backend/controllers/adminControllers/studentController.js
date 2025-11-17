const fs = require('fs').promises;
const { readExcelFile, writeExcelFile, STUDENTS_EXCEL_FILE_PATH} = require('../../config/excelConfig');

const getStudents = async(req,res) => {
    try {
        const studentsByYear = await readExcelFile(STUDENTS_EXCEL_FILE_PATH);
        res.json(studentsByYear);
    }   catch(error) {
        console.error('Error in getStudents:',error);
        res.status(500).json({error: 'Failed to retrieve students'});
    }
};

const addStudent = async(req,res) => {
    const { class: className,firstName,lastName,email,gender } = req.body;

    if(!className || !firstName || !lastName || !email || !gender) {
        return res.status(400).json({error: 'Class, firstName, lastName,email and gender are required'});
    }

    try {
        const studentsByYear = await readExcelFile(STUDENTS_EXCEL_FILE_PATH);
        const newStudent = { firstName,lastName,email,gender };

        if(!studentsByYear[className]) {
            studentsByYear[className] = [];
        }
        studentsByYear[className].push(newStudent);
        
        await writeExcelFile(STUDENTS_EXCEL_FILE_PATH,studentsByYear);
        res.json({message: `Student addded to class ${className} successfully`, data: newStudent});
    }catch(error) {
        console.error('Error in addStudent:',error);
        res.status(500).json({error: 'Failed to add student'});
    }
};

const updateStudent = async (req,res) => {
    const { class: className, email, updates} = req.body;

    if(!className || !email || !updates) {
        return res.status(400).json({error: 'Class, email, and updates are required'});
    }

    try {
        const studentsByYear = await readExcelFile(STUDENTS_EXCEL_FILE_PATH);
        let updated = false;

        if(studentsByYear[className]) {
            studentsByYear[className] = studentsByYear[className].map(student => {
                if(student.email === email) {
                    updated:true;
                    return {
                        firstName: updates.firstName || student.firstName,
                        lastName: updates.lastName || student.lastName,
                        email :updates.email || student.email,
                        gender: updates.gender || student.gender
                    };
                }
                return student;
            });

            if(updated) {
                await writeExcelFile(STUDENTS_EXCEL_FILE_PATH,studentsByYear);
                res.json({message:'Student updated successfully', data: studentsByYear[className]});
            } else {
                res.status(404).json({error: 'Student not found'});
            } 
        } else {
            res.status(404).json({error:'Class not found'});
        }
    } catch(error) {
        console.error('Error in updateStudent:',error);
        res.status(500).json({error:'Internal server error '});
    }
};

const deleteStudent = async (req,res) => {
    const {class: className,email} = req.body;

    if(!className || !email) {
        return res.status(400).json({error:'Class and email are required'});
    }

    try {
        const studentsByYear = await readExcelFile(STUDENTS_EXCEL_FILE_PATH);
        let deleted = false;

        if(studentsByYear[className]) {
            const initialLength = studentsByYear[className].length;
            studentsByYear[className] = studentsByYear[className].filter(student => student.email !== email);
            deleted = studentsByYear[className].length < initialLength;

            if(deleted) {
                await writeExcelFile(STUDENTS_EXCEL_FILE_PATH,studentsByYear);
                res.json({message:`Student with email ${email} deleted from class ${className} successfully`});
            } else {
                res.status(404).json({error:'Student not found'});
            }
        } else {
            res.status(404).json({error:'Class not found'});
        }
    } catch(error) {
        console.error('Error in deleteStudent:',error);
        res.status(500).json({error:'Internal server error'});
    }
};

const createClass = async(req,res) => {
    const filePath = req.file.path;
    try {
        const newClassData = req.jsonData.slice(1).map(row => ({
            firstName: row[req.excelHeaders.indexOf('First Name')] || 'N/A',
            lastName: row[req.excelHeaders.indexOf('Last Name')] || 'N/A',
            email: row[req.excelHeaders.indexOf('Email')] || 'N/A',
            gender: row[req.excelHeaders.indexOf('Gender')] || 'N/A'
        }));

        const studentsByYear = await readExcelFile(STUDENTS_EXCEL_FILE_PATH);
        studentsByYear[req.sheetName] = newClassData;
        await writeExcelFile(STUDENTS_EXCEL_FILE_PATH,studentsByYear);

        await fs.unlink(filePath);
        res.json({ message:`Class ${req.sheetName} created successfully`,data: newClassData});
    } catch(error) {
        console.error('Error in createClass', error);
        await fs.unlink(filePath).catch(() => {});
        res.status(500).json({error:'Failed to create class'});
    }
};

const replaceClass = async(req,res) => {
    const className = req.headers['x-class-name'];
    if(!className) {
        await fs.unlink(req.file.path).catch(()=>{});
        return res.status(400).json({error:'Class name is required in X-Class-Name header'});
    }

    const filePath = req.file.path;

    try {
        const newClassData = req.jsonData.slice(1).map(row => ({
            firstName: row[req.excelHeaders.indexOf('First Name')] || 'N/A',
            lastName: row[req.excelHeaders.indexOf('Last Name')] || 'N/A',
            email: row[req.excelHeaders.indexOf('Email')] || 'N/A',
            gender: row[req.excelHeaders.indexOf('Gender')] || 'N/A'
        }));

        const studentsByYear = await readExcelFile(STUDENTS_EXCEL_FILE_PATH);
        if(!studentsByYear[className]) {
            await fs.unlink(filePath).catch(() => {});
            return res.status(404).json({error: `Class ${className} not found`});
        }

        studentsByYear[className] = newClassData;
        await writeExcelFile(STUDENTS_EXCEL_FILE_PATH,studentsByYear);

        await fs.unlink(filePath);
        res.json({message:`Class ${className} replaced successfully`,data: newClassData});
    }   catch(error) {
        console.error('Error in replaceClass:', error);
        await fs.unlink(filePath).catch(() => {});
        res.status(500).json({error: 'Failed to replace class'});
    }
};

const deleteClass = async (req,res) => {
    const {className} = req.body;

    if(!className) {
        return res.status(400).json({error: 'Class name is required'});
    }

    try {
        const studentsByYear = await readExcelFile(STUDENTS_EXCEL_FILE_PATH);
        if(!studentsByYear[className]) {
            return res.status(404).json({error:`Class ${className} not found`});
        }

        delete studentsByYear[className];
        await writeExcelFile(STUDENTS_EXCEL_FILE_PATH,studentsByYear);
        res.json({message: `Class ${className} deleted successfully`});
    } catch(error) {    
        console.error('Error in deleteClass:',error);
        res.status(500).json({error:'Failed to delete class'});
    }
};

const addClass = async(req,res) => {
    const {className} = req.body;

    try {
        const studentsByYear = await readExcelFile(STUDENTS_EXCEL_FILE_PATH);
        console.log('Current sheets before add:',Object.keys(studentsByYear));

        if(studentsByYear[className]) {
            return res.status(400).json({error:`Class ${className} already exists`});
        }

        studentsByYear[className] = [];
        console.log(`Adding class ${className} with default headers`);

        await writeExcelFile(STUDENTS_EXCEL_FILE_PATH,studentsByYear);
        console.log('File written successfully, updated sheets:',Object.keys(studentsByYear));

        res.json({message: `Class ${className} created successfully`});
    } catch(error) {
        console.error('Error in addClass:',error);
        if(error.code === 'ENOENT' || error.message.includes('permission')) {
            return res.status(500).json({error:'Failed to write to Excel file due to permissions or file access issues'});
        }
        res.status(500).json({error: 'Failed to add class'});
    }
};

module.exports = {
    getStudents,
    addStudent,
    updateStudent,
    deleteStudent,
    createClass,
    replaceClass,
    deleteClass,
    addClass
};