const express = require('express')
const mongoose = require('mongoose')
const saved = require('../../models/savedModel')
const notes = require('../../models/notesModel')

const getSavedNotes = async (req,res) => {
    const year1SavedNotes = [];
    const year2SavedNotes = [];
    const year3SavedNotes = [];
    const recentlySavedNotes = [];
    const saver_id = req.user.userId;
    try {
        const savedDBNotes = await saved
            .find({saver_id,type:'Notes'},{document_id:1,createdAt:1})
            .sort({createdAt:-1})
            .lean();

        const SavedNoteIds = savedDBNotes.map((n) => n.document_id);

        const allMySavedNotes = await notes.find({_id: {$in:SavedNoteIds}}).lean();

        const notesMap = new Map();
        allMySavedNotes.forEach((note) => {
            notesMap.set(note._id.toString(),note);
        });

        for(const savedNote of savedDBNotes) {
            const note = notesMap.get(savedNote.document_id.toString());
            if(!note) continue;

            if(note.grade === 1) {
                year1SavedNotes.push(note);
            } else if(note.grade === 2) {
                year2SavedNotes.push(note);
            } else if(note.grade === 3) {
                year3SavedNotes.push(note);
            }

            if(recentlySavedNotes.length < 2) {
                recentlySavedNotes.push(note);
            }
        }

        return res.status(200).json({
            year1SavedNotes,
            year2SavedNotes,
            year3SavedNotes,
            recentlySavedNotes,
        });
    } catch(error) {
        console.log(error.message);
        return res.status(500).json({message:error.message});
    }
};

module.exports = getSavedNotes;