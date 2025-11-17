const { readExcelFile,writeExcelFile,TEACHERS_EXCEL_FILE_PATH } = require('../../config/excelConfig');

const getTeachers = async(req,res) => {
    try{
        const teachersData = await readExcelFile(TEACHERS_EXCEL_FILE_PATH);
        const allTeachers = Object.values(teachersData).flat();
        res.json(allTeachers)
    } catch(error) {
        console.error('Error in getTeachers',error);
        res.status(500).json({error: 'Failed to retrieve teachers'});
    }
};

const addTeacher = async(req,res) => {
    const {firstName,lastName,email,phone,courses} = req.body;

    if(!firstName || !lastName || !email) {
        return res.status(400).json({error: 'First Name, Last Name,and Email are required'});
    }

    try {
        const teachersData = await readExcelFile(TEACHERS_EXCEL_FILE_PATH);
        const sheetName = 'Teachers';
        const newTeacher = {
            firstName,
            lastName,
            email,
            phone:phone || 'N/A',
            courses: courses || []
        };

        if(!teachersData[sheetName]) {
            teachersData[sheetName] = [];
        }

        teachersData[sheetName].push(newTeacher);

        await writeExcelFile(TEACHERS_EXCEL_FILE_PATH,teachersData);
        res.json({message: 'Teacher added successfully', data: newTeacher});
    } catch(error) {
        console.error('Error in addTeacher:',error);
        res.status(500).json({error:'Failed to add teacher'});
    }
};

const updateTeacher = async(req,res) => {
    const {email,updates} = req.body;

    if(!email || !updates) {
        return res.status(400).json({error: 'Email and updates are required'});
    }

    try {
        const teachersData = await readExcelFile(TEACHERS_EXCEL_FILE_PATH);
        const sheetName = 'Teachers';
        let updated = false;

        if(teachersData[sheetName]) {
            teachersData[sheetName] = teachersData[sheetName].map(teacher => {
                if(teacher.email === email) {
                    updated = true;
                    return {
                        firstName: updates.firstName || teacher.firstName,
                        lastName: updates.lastName ||teacher.lastName,
                        email: updates.email || teacher.email,
                        phone: updates.phone || teacher.phone,
                        courses: updates.courses || teacher.courses
                    };
                }
                return teacher;
            });

            if(updated) {
                await writeExcelFile(TEACHERS_EXCEL_FILE_PATH,teachersData);
                res.json({message:'Teacher updated successfully!',data:teachersData[sheetName]});
            } else {
                res.status(404).json({error:'Teacher not found'});
            }
        } else {
            res.status(404).json({error:'Teachers sheet not found'});
        }
    } catch(error) {
        console.error('Error in updateTeacher:',error);
        res.status(500).json({error:'Internal server error'});
    }
};

const deleteTeacher = async (req,res) => {
    const {email} = req.body;

    if(!email) {
        return res.status(400).json({error: 'Email is required'});
    }

    try {
        const teachersData = await readExcelFile(TEACHERS_EXCEL_FILE_PATH);
        const sheetName = 'Teachers';
        let deleted = false;

        if(teachersData[sheetName]) {
            const initialLength = teachersData[sheetName].length;
            teachersData[sheetName] = teachersData[sheetName].filter(teacher => teacher.email !== email);
            deleted = teachersData[sheetName].length < initialLength;

            if (deleted) {
                await writeExcelFile(TEACHERS_EXCEL_FILE_PATH,teachersData);
                res.json({message: `Teacher with email ${email} deleted successfully`});
            } else {
                res.status(404).json({error:'Teacher not found'});
            }
        } else {
            res.status(404).json({error:'Teachers sheet not found'});
        }
    } catch(error) {
        console.error('Error in deleteTeacher:',error);
        res.status(500).json({error: 'Internal server error'});
    }
};

module.exports = {
    getTeachers,
    addTeacher,
    updateTeacher,
    deleteTeacher
};