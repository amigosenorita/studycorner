const express = require('express');
const { query } = require('../config/db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

function leadFromRow(row) {
    return {
        _id: String(row.id),
        studentName: row.student_name,
        dob: row.dob,
        gender: row.gender,
        aadhaar: row.aadhaar,
        mobile: row.mobile,
        altMobile: row.alt_mobile,
        email: row.email,
        address: row.address,
        bloodGroup: row.blood_group,
        maritalStatus: row.marital_status,
        religion: row.religion,
        nationality: row.nationality,
        community: row.community,
        subCaste: row.sub_caste,
        motherTongue: row.mother_tongue,
        firstGraduate: row.first_graduate,
        tenthPercent: row.tenth_percent,
        twelfthPercent: row.twelfth_percent,
        preferredCourse: row.preferred_course,
        preferredCollege: row.preferred_college,
        program: row.program,
        branch: row.branch,
        referredBy: row.referred_by,
        studentPhoto: row.student_photo,
        aadhaarPhoto: row.aadhaar_photo,
        tenthMarksheetPhoto: row.tenth_marksheet_photo,
        twelfthMarksheetPhoto: row.twelfth_marksheet_photo,
        status: row.status,
        createdAt: row.created_at,
        updatedAt: row.updated_at
    };
}

router.post('/', async (req, res, next) => {
    try {
        const b = req.body;
        if (!/^[0-9]{12}$/.test(b.aadhaar || '')) {
            return res.status(400).json({ message: 'Please enter a valid 12-digit Aadhaar number.' });
        }

        const result = await query(
            `INSERT INTO leads (
                student_name, dob, gender, aadhaar, mobile, alt_mobile, email, address,
                blood_group, marital_status, religion, nationality, community, sub_caste,
                mother_tongue, first_graduate, tenth_percent, twelfth_percent,
                preferred_course, preferred_college, program, branch, referred_by,
                student_photo, aadhaar_photo, tenth_marksheet_photo, twelfth_marksheet_photo
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27)
            RETURNING id`,
            [
                b.studentName, b.dob || null, b.gender, b.aadhaar, b.mobile, b.altMobile, b.email, b.address,
                b.bloodGroup, b.maritalStatus, b.religion, b.nationality, b.community, b.subCaste,
                b.motherTongue, b.firstGraduate, b.tenthPercent, b.twelfthPercent,
                b.preferredCourse, b.preferredCollege, b.program, b.branch, b.referredBy,
                b.studentPhoto, b.aadhaarPhoto, b.tenthMarksheetPhoto, b.twelfthMarksheetPhoto
            ]
        );

        res.status(201).json({ message: 'Admission form submitted successfully', leadId: result[0].id });
    } catch (err) {
        next(err);
    }
});

router.get('/', requireAuth, async (req, res, next) => {
    try {
        const rows = await query('SELECT * FROM leads ORDER BY created_at DESC');
        res.json(rows.map(leadFromRow));
    } catch (err) {
        next(err);
    }
});

router.get('/analytics', requireAuth, async (req, res, next) => {
    try {
        const totalRows = await query('SELECT COUNT(*) AS count FROM leads');
        const funnel = await query('SELECT status AS _id, COUNT(*) AS count FROM leads GROUP BY status');
        const courseDistribution = await query('SELECT COALESCE(preferred_course, "Unknown") AS _id, COUNT(*) AS count FROM leads GROUP BY preferred_course');

        res.json({
            totalLeads: totalRows[0].count,
            funnel,
            courseDistribution
        });
    } catch (err) {
        next(err);
    }
});

router.put('/:id', requireAuth, async (req, res, next) => {
    try {
        await query('UPDATE leads SET status = $1, updated_at = NOW() WHERE id = $2', [req.body.status, req.params.id]);
        res.json({ message: 'Lead updated successfully' });
    } catch (err) {
        next(err);
    }
});

router.delete('/:id', requireAuth, async (req, res, next) => {
    try {
        await query('DELETE FROM leads WHERE id = $1', [req.params.id]);
        res.json({ message: 'Lead deleted successfully' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
