const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');
const exportToExcel = require('../utils/excel');
const path = require('path');
const fs = require('fs');

router.get('/', async (req, res) => {
    try {
        // Pass req.query to find() to support filtered exports (e.g., ?referredBy=AgentName)
        const leadsResult = await Lead.find(req.query);
        const leads = leadsResult.lean();

        const dataForExcel = leads.map(lead => ({
            "Student Name": lead.studentName || "",
            "Date of Birth": lead.dob || "",
            "Gender": lead.gender || "",
            "Aadhaar": lead.aadhaar || "",
            "Email": lead.email || "",
            "Mobile": lead.mobile || "",
            "Alt Mobile": lead.altMobile || "",
            "Blood Group": lead.bloodGroup || "",
            "Marital Status": lead.maritalStatus || "",
            "Religion": lead.religion || "",
            "Nationality": lead.nationality || "",
            "Community": lead.community || "",
            "Sub Caste": lead.subCaste || "",
            "Mother Tongue": lead.motherTongue || "",
            "First Graduate": lead.firstGraduate || "",
            "Tenth %": lead.tenthPercent || "",
            "Twelfth %": lead.twelfthPercent || "",
            "Course": lead.preferredCourse || "",
            "Program": lead.program || "",
            "Branch": lead.branch || "",
            "Preferred College": lead.preferredCollege || "",
            "Referred By": lead.referredBy || "",
            "Lead Status": lead.status || "New Lead",
            "Date": lead.createdAt ? lead.createdAt.toISOString().split('T')[0] : ''
        }));

        const filePath = path.join(__dirname, `../leads_export_${Date.now()}.xlsx`);
        exportToExcel(dataForExcel, filePath);

        res.download(filePath, 'leads_export.xlsx', (err) => {
            if (err) {
                console.error("Error downloading file", err);
            }
            // Cleanup the file after sending
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
