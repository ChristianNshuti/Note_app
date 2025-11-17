const fs = require('fs')
const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const Users = require('../../models/user')
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')
const xlsx = require('xlsx')

const generateAccessToken = (payload) => {
    return jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:'15m'});
};

const generateRefreshToken = (payload) => {
    return jwt.sign(payload,process.env.REFRESH_TOKEN_SECRET, {expiresIn:'7d'});
};

const isEmailInExcel = (email,filePath) => {
    if(!fs.existsSync(filePath)) {
        return false;
    }

    const workbook = xlsx.readFile(filePath);
    const emailLower = email.toLowerCase();

    for (const sheetName of workbook.SheetNames) {
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet, { header: 1});

        for (const row of data) {
            for(const cell of row) {
                if(typeof cell === 'string' && cell.toLowerCase() === emailLower) {
                    return true;
                }
            }
        }
    }

    return false;
};

const login = async(req,res) => {
    const {email,password} = req.body;
    const normalizedEmail = email.toLowerCase();

    try {
        const userExist = await Users.findOne({ email: normalizedEmail});
        if(!userExist) {
            return res.status(404).json({message:"User does not exist!"});
        }

        const isMatch = await argon2.verify(userExist.password,password);
        if(!isMatch) {
            return res.status(401).json({message:"Incorrect credentials"});
        }

        const roleList = userExist.role;
        const verifiedRoles = [];

        const basePath = path.resolve(__dirname, '../../documents');

        if(roleList.includes("student") && 
            isEmailInExcel(normalizedEmail,path.join(basePath,'all_students.xlsx'))) {
                verifiedRoles.push("student");
        }

        if(roleList.includes("teacher") && 
            isEmailInExcel(normalizedEmail, path.join(basePath, 'all_teachers.xlsx'))) {
                verifiedRoles.push("teacher");
        }

        if(roleList.includes("admin") && 
            isEmailInExcel(normalizedEmail,path.join(basePath,'all_admins.xlsx'))) {
                verifiedRoles.push("admin");
        }

        if (verifiedRoles.length === 1) {
            userExist.role = [verifiedRoles[0]];
            await userExist.save();
        }

        if(verifiedRoles.length > 1) {
            const roleTokenPayload = {
                email,
                roles: verifiedRoles,
            };

            const roleToken = jwt.sign(roleTokenPayload,process.env.JWT_SECRET,{expiresIn:'15m'});
            return res.status(200).send({
                roleToken,
                redirectTo:`http://localhost:5173/chooseRole?roleToken=${encodedURIComponent(roleToken)}&verified=true&email=${encodedURIComponent(email)}`
            });
        }

        const AccessTokenPayload = {
            userId:userExist._id,
            email:userExist.email,
            username:userExist.username,
            role:userExist.role[0],
            courses:userExist.courses
        };


        const refreshTokenPayload = {
            userId: userExist._id,
            role:userExist.role[0]
        };

        const accessToken = generateAccessToken(AccessTokenPayload);
        const refreshToken = generateRefreshToken(refreshTokenPayload);

        res.cookie("refreshToken",refreshToken, {
            httpOnly:true,
            secure:false,
            expires:new Date(Date.now() + 7 * 24 * 60 * 60 * 100)
        });


        return res.status(200).json({message: "Logged in successfully",accessToken});
    }catch(error) {
        console.error("Login error:",error);
        return res.status(500).json({message:error.message});
    }
};

module.exports = login;