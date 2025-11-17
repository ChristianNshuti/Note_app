const express = require('express')
const mongoose = require('mongoose')
const saved = require('../../models/savedModel');
const assessments = require('../../models/assessmentsModel');

const getSavedAssessments = async (req,res) => {
    const year1SavedAssessments = [];
    const year2SavedAssessments = [];
    const year3SavedAssessments = [];
    const recentlySavedAssessments = [];
    const saver_id = req.user.userId;

    try {
        const savedDBAssessments = await saved.find({type:'Assessments',saver_id})
        .sort({createdAt: -1});

        const SavedAssessmentIds = savedDBAssessments.map((item) => item.document_id);

        const allMySavedAssessments = await assessments.find
        ({ _id: { $in: SavedAssessmentsIds}})

        const assessmentMap = new Map();
        allMySavedAssessments.forEach((assessment) => {
            assessmentMap.set(assessment._id.toString(),assessment)
        });

        for(const savedAssessment of savedDBAssessments) {
            const assessment = assessmentMap.get(savedAssessment.document_id.toString());
            if(!assessment) continue;

            if(assessment.grade === 1) {
                year1SavedAssessments.push(assessment);
            } else if(assessment.grade === 2) {
                year2SavedAssessments.push(assessment);
            } else if(assessment.grade === 3) {
                year3SavedAssessments.push(assessment);
            }

            if(recentlySavedAssessments.length <2) {
                recentlySavedAssessments.push(assessment);
            }
        }

        res.status(200).json({
            year1SavedAssessments,
            year2SavedAssessments,
            year3SavedAssessments,
            recentlySavedAssessments,
        });
    } catch(error) {
        console.log(error)
        res.status(400).json({message: error.message});
    }
};

module.exports = getSavedAssessments;