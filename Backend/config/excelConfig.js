const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs').promises;

const STUDENTS_EXCEL_FILE_PATH = path.join(__dirname,'..','documents','all_students.xlsx');
const TEACHERS_EXCEL_FILE_PATH = path.join(__dirname, '..','documents','all_teachers.xlsx');

const initializeExcelFile = async(filePath) => {
    try {
        const exists = await fs.access(filePath).then(() => true).catch(() => false);
        if(!exists) {
            const workbook = XLSX.utils.book_new();
            XLSX.writeFile(workbook,filePath);
        }
    } catch(error) {
        console.error(`Error initializing file ${filePath}:`,error);
        throw error;

    }
};

const normalizeColumnName = (colName) => {
    const lowerName = colName.toLowerCase().replace(/[_-\s]/g,'');
    if(lowerName.includes('firstname')) return 'First Name';
    if(lowerName.includes('lastname')) return 'Last Name';
    if(lowerName.includes('email')) return 'Email';
    if(lowerName.includes('phonenumber')) return 'Phone Number'
    if(lowerName.includes('gender')) return 'Gender';
    if(lowerName.includes('courses')) return 'Courses';

    return colName;
};

const readExcelFile = async(filePath) => {
    await initializeExcelFile(filePath);
    const workbook = XLSX.readFile(filePath);
    const data = {};

    const sortedSheetNames = workbook.SheetNames.sort((a,b) => a.localCompare(b));

    sortedSheetNames.forEach(sheetName => {
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, {header:1});


        if(jsonData.length === 0)  {
            console.log(`Sheet ${sheetName} is empty,intializing with empty data`);
            data[sheetName] = [];
            return;
        }

        const headers = jsonData[0].map(normalizeColumnName);

        const requiredHeaders = requireHeaders.filter(header => !headers.includes(header));
        if(missingHeaders.length > 0) {
            console.log(`Skipping sheet ${sheetName} due to missing required columns: ${missingHeaders.join(', ')}`);
            return;
        }

        const rows = jsonData.slice(1).map(row => {
            const rowData = {};
            headers.forEach((header,index) => {
                rowData[header] = row[index] || 'N/A';
            });

            return rowData;
        });

        if(filePath === STUDENTS_EXCEL_FILE_PATH) {
            data[sheetName] = rows.map(item => ({
                firstName: item['FirstName'],
                lastName: item['Last Name'],
                email: item['Email'],
                gender: item['Gender']
            }));
        } else if(filePath === TEACHERS_EXCEL_FILE_PATH) {
            data[sheetName] = rows.map((teacher,index) => ({
                id:index +1,
                firstName: teacher['First Name'],
                lastName:teacher['Last Name'],
                email:teacher['Email'],
                phone:teacher['Phone Number'],
                courses: teacher['Courses'] ? String(teacher['Courses']).split(',').map(c => c.trim()) : []
            }));
        }
        console.log(`Processed data for sheet ${sheetName} in ${filePath}`, data[sheetName]);
    });
    return data;
};

const writeExcelFile = async(filePath,data) => {
    try {
        console.log(`Writing to Excel file ${filePath} with data:`,data);
        const workbook = XLSX.utils.book_new();

        for(const [sheetName,sheetData] of Object.entries(data)) {
            let worksheetData;
            if (filePath === STUDENTS_EXCEL_FILE_PATH) {
                worksheetData = sheetData.map(student => ({
                    'First Name': student.firstName || 'N/A',
                    'Last Name': student.lastName || 'N/A',
                    'Email':student.email || 'N/A',
                    'Gender':student.gender || 'N/A'
                }));
            }else if(filePath === TEACHERS_EXCEL_FILE_PATH) {
                worksheetData = sheetData.map(teacher => ({
                    'First Name':teacher.firstName || 'N/A',
                    'Last Name':teacher.lastName || 'N/A',
                    'Email':teacher.email || 'N/A',
                    'Phone Number':teacher.phone || 'N/A',
                    'Courses': teacher.courses ? teacher.courses.join(', ') :'N/A'
                }));
            }
            const worksheet = XLSX.utils.json_to_sheet(worksheetData, {header: ['First Name','Last Name','Email','Gender']});
            XLSX.utils.book_append_sheet(workbook,worksheet,sheetName);
        }

        XLSX.writeFile(workbook,filePath);
        console.log(`Successfully wrote to ${filePath}`);
    } catch(error) {
        console.error(`Detailed error in writeExcelFile for ${filePath}:`, error);
        throw error;
    }
};

module.exports = {
    STUDENTS_EXCEL_FILE_PATH,
    TEACHERS_EXCEL_FILE_PATH,
    initializeExcelFile,
    normalizeColumnName,
    readExcelFile,
    writeExcelFile
};

