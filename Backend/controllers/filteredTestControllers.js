const Assessments = require('../models/assessmentsModel');
const Saved = require('../models/savedModel');
const Notes = require('../models/notesModel');

const getFilteredTest = async(req,res) => {
    try {
        const { savedVisited,type,grade,subject,term,category,year } = req.body;
        const saver_id = req.user.userId;

        const query = {};

        if(subject !== 'Any') query.lesson = subject;
        if(grade !== 'Any') query.grade = grade;
        if(term !== 'Any') query.term = term;
        if(category !== 'Any') query.category = category;

        let filteredTests;

        if(!savedVisited) {
            if(year !== 'Any') query.year = year;
            filteredTests = await Assessments.find(query).lean();
        } else {
            if(type==='Assessments') {
                const savedAssessments = await Saved.find({type:'Assessments',saver_id}).lean();
                if(savedAssessments.length === 0) {
                    return res.status(200).json({success:true, filteredTests:[]});
                }
                const savedAssessmentIds = savedAssessments.map(item => item.document_id);

                if(year!=='Any') query.year = year;

                filteredTests = await Assessments.find({
                    ...query,
                    _id:{$in: savedAssessmentIds}
                }).lean();
            } else {
                 const savedNotes = await Saved.find({type:'Notes',saver_id}).lean();
                 const savedNotesIds = savedNotes.map(item => item.document_id);

                 if(year !== 'Any') {
                    const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
                    const endDate = new Date(`${parseInt(year) + 1}-01-01T00:00:00.000Z`);
                    query.createdAt = {$gte:startDate,$lt:endDate};
                 }
                 else {}
                 filteredTests = await Notes.find({
                    ...query,
                    _id:{$in:savedNotesIds}
                 }).lean();
            }
        }
        return res.status(200).json({success:true,filteredTests});
    }catch(error) {
        console.error('Error filtering tests:',error);
        return res.status(500).json({success:false,message:'Server error'});
    }
};

module.exports = { getFilteredTest };