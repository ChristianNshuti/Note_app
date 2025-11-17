const http = require('http');
const express = require('express')
const dotenv = require('dotenv')
const notelyDb = require('./config/db')
const cors = require('cors')
const noteRoute = require('./routes/noteRoutes')
const testsRoute = require('./routes/testsRoutes')
const filteredTestRoute = require('./routes/filteredTestRoutes')
const saveAndUpload = require('./routes/saveAndUploadRoutes')
const cookieParser = require('cookie-parser')
const authRoutes = require('./routes/authRoutes')
const noteSaveRoutes = require('./routes/noteSaveRoutes')
const contactRoutes = require('./routes/contactRoutes')
const deleteRoutes = require('./routes/deleteRoutes');
const updateNARoutes = require('./routes/updateNARoutes')
const adminRoutes = require('./routes/adminRoutes/adminRoutes')
const profileRoutes = require('./routes/profileImageRoutes');

const app=express();
const server = http.createServer(app);

dotenv.config();
notelyDb();

app.use(express.json())
app.use(express.urlencoded({extended: true}));

app.use(cors({
    origin: ['http://localhost:5173','http://localhost:5174','https://frontend-4nucupqu1-chrisnshuti943-2374s-projects.vercel.app'],
    credentials:true
}));

app.use(cookieParser());

app.get('/',(req,res) => {
    res.status(200).json({message:"Server is healthy!"})
})

app.use('/auth',authRoutes);
app.use('/noteSaved',noteSaveRoutes);
app.use('/get-notes',noteRoute);
app.use('/get-assessments',testsRoute);
app.use('/filtered-assessments',filteredTestRoute);
app.use('/upload-document',saveAndUpload);
app.use('/contacts',contactRoutes);
app.use('/delete',deleteRoutes);
app.use('/update',updateNARoutes);
app.use('/adminactions',adminRoutes);
app.use('/profile',profileRoutes);


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on Port ${PORT}`);
});