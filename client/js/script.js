// Base API URL
const API_URL = '/api';

// --- AUTHENTICATION ---
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('loginError');

        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('crmToken', data.token);
                localStorage.setItem('crmRole', data.role);
                localStorage.setItem('crmName', data.name);
                window.location.href = 'dashboard.html';
            } else {
                errorDiv.textContent = data.message || 'Login failed';
                errorDiv.classList.remove('hidden');
            }
        } catch (err) {
            errorDiv.textContent = 'Server connection error';
            errorDiv.classList.remove('hidden');
        }
    });
}

const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (localStorage.getItem('crmRole') !== 'Admin') {
            alert('Action Denied: Only Admins can create new accounts');
            return;
        }
        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;
        const role = document.getElementById('regRole').value;
        const msgDiv = document.getElementById('registerMsg');

        try {
            const res = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, role })
            });
            const data = await res.json();

            if (res.ok) {
                msgDiv.textContent = 'Account created successfully!';
                msgDiv.className = 'mb-4 text-center p-2 rounded bg-green-100 text-green-700 block';
                registerForm.reset();
                if (typeof loadAgentsTable === 'function') loadAgentsTable();
            } else {
                msgDiv.textContent = data.message || 'Registration failed';

                msgDiv.className = 'mb-4 text-center p-2 rounded bg-red-100 text-red-700 block';
            }
        } catch (err) {
            msgDiv.textContent = 'Server connection error';
            msgDiv.className = 'mb-4 text-center p-2 rounded bg-red-100 text-red-700 block';
        }
    });
}

function logout() {
    localStorage.removeItem('crmToken');
    localStorage.removeItem('crmRole');
    localStorage.removeItem('crmName');
    window.location.href = 'login.html';
}

// --- ADMISSION FORM ---
async function loadReferencesDropdown() {
    const dropdown = document.getElementById('referredBy');
    if (!dropdown) return;
    try {
        const res = await fetch(`${API_URL}/references`);
        const references = await res.json();
        references.forEach(ref => {
            const option = document.createElement('option');
            option.value = ref.name;
            option.textContent = ref.name;
            dropdown.appendChild(option);
        });

        // Add Other
        const otherOpt = document.createElement('option');
        otherOpt.value = 'Other';
        otherOpt.textContent = 'Other';
        dropdown.appendChild(otherOpt);

        dropdown.addEventListener('change', (e) => {
            const otherInput = document.getElementById('referredByOther');
            if (e.target.value === 'Other') {
                otherInput?.classList.remove('hidden');
            } else {
                otherInput?.classList.add('hidden');
                if (otherInput) otherInput.value = '';
            }
        });
    } catch (err) { console.error('Failed to load references', err); }
}
if (document.getElementById('referredBy') || window.location.pathname.includes('admission-form')) loadReferencesDropdown();

async function loadFormChecklists() {
    const selects = document.querySelectorAll('.dynamic-select, #course');
    if (selects.length === 0) return;
    try {
        const promises = Array.from(selects).map(async (select) => {
            const category = select.getAttribute('data-category');
            if (category) {
                const res = await fetch(`${API_URL}/formOptions/${category}`);
                const options = await res.json();
                options.forEach(opt => {
                    const el = document.createElement('option');
                    el.value = opt.value;
                    el.textContent = opt.value;
                    select.appendChild(el);
                });
            }

            // Add Other option to all
            const otherOpt = document.createElement('option');
            otherOpt.value = 'Other';
            otherOpt.textContent = 'Other';
            select.appendChild(otherOpt);

            // Handle Visibility
            select.addEventListener('change', (e) => {
                const otherInput = document.getElementById(`${select.id}Other`);
                if (e.target.value === 'Other') {
                    otherInput?.classList.remove('hidden');
                    otherInput?.setAttribute('required', 'required');
                } else {
                    otherInput?.classList.add('hidden');
                    otherInput?.removeAttribute('required');
                    if (otherInput) otherInput.value = '';
                }
            });
        });
        await Promise.all(promises);
    } catch (err) { console.error('Failed to load form options', err); }
}
if (window.location.pathname.includes('admission-form')) {
    loadFormChecklists();

    // Photo Preview Logic
    const photoInput = document.getElementById('studentPhoto');
    const photoPreview = document.getElementById('photoPreview');
    const previewImg = document.getElementById('previewImg');

    if (photoInput) {
        photoInput.addEventListener('change', function () {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    previewImg.src = e.target.result;
                    photoPreview.classList.remove('hidden');
                }
                reader.readAsDataURL(file);
            } else {
                photoPreview.classList.add('hidden');
            }
        });
    }

    // Auto-Correction Intelligence for Inputs
    const aadhaarInput = document.getElementById('aadhaar');
    if (aadhaarInput) {
        aadhaarInput.addEventListener('input', function(e) {
            let val = e.target.value.replace(/\D/g, ''); // Remove all non-digits
            if (val.length > 12) val = val.substring(0, 12);
            // Format as XXXX XXXX XXXX
            let formatted = val.match(/.{1,4}/g);
            e.target.value = formatted ? formatted.join(' ') : val;
        });
    }

    const mobileInputs = ['mobile', 'altMobile'];
    mobileInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', function(e) {
                let val = e.target.value.replace(/\D/g, ''); // Remove non-digits
                if (val.length > 10) val = val.substring(0, 10);
                e.target.value = val;
            });
        }
    });
}

const admissionForm = document.getElementById('admissionForm');
if (admissionForm) {
    admissionForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Helper to convert file to base64
        const toBase64 = file => new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });

        // Safe getter tool
        const getVal = (id) => { const el = document.getElementById(id); return el ? el.value : ''; };

        const getOtherVal = (id) => {
            const sel = document.getElementById(id);
            if (sel && sel.value === 'Other') {
                return document.getElementById(`${id}Other`)?.value || 'Other';
            }
            return sel ? sel.value : '';
        };

        const payload = {
            studentName: getVal('studentName'),
            dob: getVal('dob'),
            gender: getOtherVal('gender'),
            aadhaar: getVal('aadhaar'),
            mobile: getVal('mobile'),
            altMobile: getVal('altMobile'),
            email: getVal('studentEmail'),
            address: getVal('address'),
            bloodGroup: getOtherVal('bloodGroup'),
            maritalStatus: getOtherVal('maritalStatus'),
            religion: getOtherVal('religion'),
            nationality: getOtherVal('nationality'),
            community: getVal('community'),
            subCaste: getVal('subCaste'),
            motherTongue: getOtherVal('motherTongue'),
            firstGraduate: getVal('firstGraduate'),
            tenthPercent: getVal('tenth'),
            twelfthPercent: getVal('twelfth'),
            preferredCourse: getOtherVal('course'),
            preferredCollege: getOtherVal('college'),
            program: getVal('program'),
            branch: getVal('branch'),
            referredBy: getOtherVal('referredBy'),
            studentPhoto: "" // Placeholder
        };

        // Handle Photo if exists
        const photoFile = document.getElementById('studentPhoto')?.files[0];
        if (photoFile) {
            try {
                payload.studentPhoto = await toBase64(photoFile);
            } catch (err) {
                console.error("Photo conversion failed", err);
            }
        }

        const msgDiv = document.getElementById('formMessage');

        try {
            const res = await fetch(`${API_URL}/leads`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                const sName = getVal('studentName');
                window.location.href = `success.html?name=${encodeURIComponent(sName)}`;
            } else {
                msgDiv.textContent = 'Failed to submit application. Please try again.';
                msgDiv.className = 'mb-6 p-4 rounded text-center font-semibold bg-red-100 text-red-800 block';
            }
        } catch (err) {
            msgDiv.textContent = 'Server connection error. Please try again.';
            msgDiv.className = 'mb-6 p-4 rounded text-center font-semibold bg-red-100 text-red-800 block';
        }
    });
}

// --- DASHBOARD LOGIC ---
let charts = {};
let pollInterval;

function startSmartPolling() {
    if(pollInterval) clearInterval(pollInterval);
    pollInterval = setInterval(async () => {
        const activeNav = document.querySelector('.bg-blue-800');
        if(!activeNav) return;
        if(activeNav.id === 'nav-dashboard') await loadAnalytics(true);
        if(activeNav.id === 'nav-leads') await loadLeadsTable(true);
    }, 15000); // Smart 15s adaptive polling
}

async function initDashboard() {
    startSmartPolling();

    // Setup Admin UI Elements
    const role = localStorage.getItem('crmRole');
    const name = localStorage.getItem('crmName');

    document.getElementById('userRoleDisplay').textContent = role;
    document.getElementById('userNameDisplay').textContent = `Welcome, ${name}`;

    if (role === 'Admin') {
        document.getElementById('exportBtn').classList.remove('hidden');
        document.getElementById('nav-agents').classList.remove('hidden');
        const navRef = document.getElementById('nav-references');
        if (navRef) navRef.classList.remove('hidden');
        const navOpt = document.getElementById('nav-formOptions');
        if (navOpt) navOpt.classList.remove('hidden');
    } else {
        // STRICT LOCKDOWN FOR AGENTS
        const navLeads = document.getElementById('nav-leads');
        if (navLeads) navLeads.textContent = 'My Leads';

        // Hide Total Leads count and rename others for Agents
        const labels = document.querySelectorAll('h3.uppercase.tracking-wider');
        labels.forEach(label => {
            if (label.textContent.includes('Total Leads')) {
                label.parentElement.classList.add('hidden'); // Hide total lead count box
            }
            if (label.textContent.includes('Admissions Confirmed')) label.textContent = 'My Admissions';
            if (label.textContent.includes('New Leads')) label.textContent = 'Awaiting Follow-up';
        });

        // Ensure charts are also labeled as 'My Trends'
        const chartTitles = document.querySelectorAll('#view-dashboard h3.font-semibold');
        chartTitles.forEach(title => {
            if (title.textContent.includes('Course Wise Leads')) title.textContent = 'My Course Statistics';
            if (title.textContent.includes('Admission Funnel')) title.textContent = 'My Performance Funnel';
        });
    }

    // Nav Listeners
    document.getElementById('nav-dashboard').addEventListener('click', () => switchTab('dashboard'));
    document.getElementById('nav-leads').addEventListener('click', () => {
        switchTab('leads');
        loadLeadsTable();
    });
    document.getElementById('nav-agents').addEventListener('click', () => {
        switchTab('agents');
        loadAgentsTable();
    });
    const navRef = document.getElementById('nav-references');
    if (navRef) {
        navRef.addEventListener('click', () => {
            switchTab('references');
            loadReferencesTable();
        });
    }
    const navOpt = document.getElementById('nav-formOptions');
    if (navOpt) {
        navOpt.addEventListener('click', () => {
            switchTab('formOptions');
            loadFormOptionsTable();
        });
    }
    const navCP = document.getElementById('nav-changePassword');
    if (navCP) {
        navCP.addEventListener('click', () => switchTab('changePassword'));
    }

    // Change Password Form Handler
    const changePasswordForm = document.getElementById('changePasswordForm');
    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const msg = document.getElementById('changePasswordMsg');
            const currentPwd = document.getElementById('currentPassword').value;
            const newPwd = document.getElementById('newPassword').value;
            const confirmPwd = document.getElementById('confirmPassword').value;

            if (newPwd !== confirmPwd) {
                msg.textContent = 'New passwords do not match!';
                msg.className = 'text-sm mb-4 text-center p-2 rounded bg-red-100 text-red-700';
                msg.classList.remove('hidden');
                return;
            }
            if (newPwd.length < 6) {
                msg.textContent = 'New password must be at least 6 characters.';
                msg.className = 'text-sm mb-4 text-center p-2 rounded bg-red-100 text-red-700';
                msg.classList.remove('hidden');
                return;
            }

            try {
                const token = localStorage.getItem('crmToken');
                const res = await fetch(`${API_URL}/auth/change-password`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ currentPassword: currentPwd, newPassword: newPwd })
                });
                const data = await res.json();
                if (res.ok) {
                    msg.textContent = '✅ Password updated successfully!';
                    msg.className = 'text-sm mb-4 text-center p-2 rounded bg-green-100 text-green-700';
                    msg.classList.remove('hidden');
                    changePasswordForm.reset();
                } else {
                    msg.textContent = data.message || 'Failed to update password.';
                    msg.className = 'text-sm mb-4 text-center p-2 rounded bg-red-100 text-red-700';
                    msg.classList.remove('hidden');
                }
            } catch (err) {
                msg.textContent = 'Server error. Please try again.';
                msg.className = 'text-sm mb-4 text-center p-2 rounded bg-red-100 text-red-700';
                msg.classList.remove('hidden');
            }
        });
    }

    // Initial Load
    await loadAnalytics();
}

function switchTab(tab) {
    const role = localStorage.getItem('crmRole');
    // Security check for Agents
    if (role !== 'Admin' && ['agents', 'references', 'formOptions'].includes(tab)) {
        tab = 'dashboard';
    }

    const views = ['dashboard', 'leads', 'agents', 'references', 'formOptions', 'changePassword'];
    views.forEach(v => {
        const el = document.getElementById(`view-${v}`);
        if (el) el.classList.add('hidden');
        const nav = document.getElementById(`nav-${v}`);
        if (nav) nav.classList.remove('bg-blue-800');
    });

    if (tab === 'dashboard') {
        document.getElementById('view-dashboard').classList.remove('hidden');
        document.getElementById('nav-dashboard').classList.add('bg-blue-800');
        document.getElementById('pageTitle').textContent = role === 'Admin' ? 'Dashboard Overview' : 'Lead Statistics';
        loadAnalytics(false);
    } else if (tab === 'leads') {
        document.getElementById('view-leads').classList.remove('hidden');
        document.getElementById('nav-leads').classList.add('bg-blue-800');
        document.getElementById('pageTitle').textContent = role === 'Admin' ? 'All Leads Management' : 'Student Pipeline';
        loadLeadsTable(false);
    } else if (tab === 'agents') {
        document.getElementById('view-agents').classList.remove('hidden');
        document.getElementById('nav-agents').classList.add('bg-blue-800');
        document.getElementById('pageTitle').textContent = 'Manage Agents';
    } else if (tab === 'references') {
        document.getElementById('view-references').classList.remove('hidden');
        document.getElementById('nav-references').classList.add('bg-blue-800');
        document.getElementById('pageTitle').textContent = 'Manage References';
    } else if (tab === 'formOptions') {
        document.getElementById('view-formOptions').classList.remove('hidden');
        document.getElementById('nav-formOptions').classList.add('bg-blue-800');
        document.getElementById('pageTitle').textContent = 'Manage Checklists Options';
    } else if (tab === 'changePassword') {
        document.getElementById('view-changePassword').classList.remove('hidden');
        document.getElementById('nav-changePassword').classList.add('bg-blue-800');
        document.getElementById('pageTitle').textContent = 'Security Settings';
        // Reset the message on tab open
        const msg = document.getElementById('changePasswordMsg');
        if (msg) { msg.classList.add('hidden'); msg.textContent = ''; }
    }
}

async function loadAnalytics(silent = false) {
    try {
        const role = localStorage.getItem('crmRole');
        const name = localStorage.getItem('crmName');
        let query = '';
        if (role !== 'Admin') {
            query = `?referredBy=${encodeURIComponent(name)}`;
        }

        const res = await fetch(`${API_URL}/leads/analytics${query}`);
        const data = await res.json();

        // Update stats
        document.getElementById('statTotalLeads').textContent = data.totalLeads;

        let cfs = 0, nls = 0;
        data.funnel.forEach(f => {
            if (f._id === 'Admission Confirmed') cfs = f.count;
            if (f._id === 'New Lead') nls = f.count;
        });
        document.getElementById('statConfirmed').textContent = cfs;
        document.getElementById('statNew').textContent = nls;

        // Render Charts
        renderCharts(data.courseDistribution, data.funnel);
    } catch (err) {
        console.error("Failed to load analytics");
    }
}

function renderCharts(courseData, funnelData) {
    if (charts.course) charts.course.destroy();
    if (charts.funnel) charts.funnel.destroy();

    const courseCtx = document.getElementById('courseChart').getContext('2d');
    const funnelCtx = document.getElementById('funnelChart').getContext('2d');

    charts.course = new Chart(courseCtx, {
        type: 'pie',
        data: {
            labels: courseData.map(c => c._id),
            datasets: [{
                data: courseData.map(c => c.count),
                backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']
            }]
        }
    });

    charts.funnel = new Chart(funnelCtx, {
        type: 'bar',
        data: {
            labels: funnelData.map(f => f._id),
            datasets: [{
                label: 'Status Funnel',
                data: funnelData.map(f => f.count),
                backgroundColor: '#6366F1'
            }]
        },
        options: {
            scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
        }
    });
}

function getStatusClass(status) {
    switch (status) {
        case 'New Lead': return 'status-new';
        case 'Contacted': return 'status-contacted';
        case 'Documents Pending': return 'status-docs';
        case 'Applied to College': return 'status-applied';
        case 'Admission Confirmed': return 'status-confirmed';
        default: return 'bg-gray-200 text-gray-800';
    }
}

async function loadLeadsTable(silent = false) {
    const tbody = document.getElementById('leadsTableBody');
    if (!silent) {
        tbody.innerHTML = Array(3).fill(`
            <tr class="animate-pulse">
                <td class="px-6 py-4"><div class="flex items-center"><div class="w-10 h-10 bg-gray-200 rounded-full mr-3"></div><div class="h-4 bg-gray-200 rounded w-24"></div></div></td>
                <td class="px-6 py-4"><div class="h-4 bg-gray-200 rounded w-32 mb-2"></div><div class="h-3 bg-gray-100 rounded w-20"></div></td>
                <td class="px-6 py-4"><div class="h-4 bg-gray-200 rounded w-24 mb-2"></div><div class="h-3 bg-gray-100 rounded w-16"></div></td>
                <td class="px-6 py-4"><div class="h-6 bg-gray-200 rounded-full w-20"></div></td>
                <td class="px-6 py-4 space-y-2"><div class="h-8 bg-gray-200 rounded w-full"></div></td>
            </tr>
        `).join('');
    }

    try {
        const role = localStorage.getItem('crmRole');
        const isAdmin = role === 'Admin';
        const currentUserName = localStorage.getItem('crmName');

        let url = `${API_URL}/leads`;
        if (!isAdmin) {
            url += `?referredBy=${encodeURIComponent(currentUserName)}`;
        }

        const res = await fetch(url);
        const leads = await res.json();

        tbody.innerHTML = '';

        if (leads.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" class="px-6 py-4 text-center text-gray-500">No leads assigned to you.</td></tr>`;
            return;
        }

        leads.forEach(lead => {
            const date = new Date(lead.createdAt).toLocaleDateString();
            const tr = document.createElement('tr');
            tr.className = 'lead-row';

            // Search data logic
            tr.setAttribute('data-search', `${lead.studentName} ${lead.mobile} ${lead.email}`.toLowerCase());

            tr.innerHTML = `
                <td class="px-6 py-4">
                    <div class="flex items-center">
                        ${lead.studentPhoto ? `<img src="${lead.studentPhoto}" class="w-10 h-10 rounded-full object-cover mr-3 border shadow-sm">` : `<div class="w-10 h-10 rounded-full bg-gray-200 mr-3 flex items-center justify-center text-gray-400 text-xs">No Pic</div>`}
                        <div>
                            <div class="font-medium text-gray-900">${lead.studentName}</div>
                            <div class="text-xs text-gray-500">${lead.mobile}</div>
                            <div class="text-[10px] text-gray-400 mt-1">Date: ${date}</div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4">
                    <div class="text-sm">10th: ${lead.tenthPercent || 'N/A'}% | 12th: ${lead.twelfthPercent || 'N/A'}%</div>
                    <div class="text-xs text-gray-500 mt-1">Comm: ${lead.community || 'N/A'} | Caste: ${lead.subCaste || 'N/A'}</div>
                </td>
                <td class="px-6 py-4">
                    <div class="font-medium text-gray-800">${lead.preferredCourse}</div>
                    <div class="text-xs text-gray-600">${lead.program || ''} ${lead.branch ? `(${lead.branch})` : ''}</div>
                    <div class="text-xs text-gray-500">${lead.preferredCollege}</div>
                    ${lead.referredBy ? `<div class="text-[10px] text-blue-600 mt-1 font-semibold italic">Ref: ${lead.referredBy}</div>` : ''}
                </td>
                <td class="px-6 py-4">
                    <span class="status-badge ${getStatusClass(lead.status)}" id="status-span-${lead._id}">${lead.status}</span>
                </td>
                <td class="px-6 py-4 space-y-2">
                    ${isAdmin ? `
                    <select onchange="updateStatus('${lead._id}', this.value)" class="w-full text-sm border rounded p-1 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500">
                        <option value="" disabled selected>Status...</option>
                        <option value="New Lead">New Lead</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Documents Pending">Docs Pending</option>
                        <option value="Applied to College">Applied to Col.</option>
                        <option value="Admission Confirmed">Confirmed</option>
                    </select>
                    <button onclick="deleteLead('${lead._id}', '${lead.studentName}')" 
                        class="w-full text-xs bg-red-50 text-red-600 hover:bg-red-100 py-1 rounded font-bold border border-red-100 transition">
                        Delete Lead
                    </button>
                    ` : '<span class="text-xs text-gray-400 font-medium block text-center mb-1">Status Locked</span>'}
                    <button onclick="window.open('view-application.html?id=${lead._id}', '_blank')" 
                        class="w-full text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 py-1 rounded font-bold border border-blue-200 transition">
                        Download PDF
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        tbody.innerHTML = '<tr><td colspan="5" class="px-6 py-4 text-center text-red-500">Failed to load leads</td></tr>';
    }
}

function filterLeads() {
    const search = document.getElementById('leadSearch').value.toLowerCase();
    const rows = document.querySelectorAll('.lead-row');
    rows.forEach(row => {
        const searchData = row.getAttribute('data-search');
        if (searchData.includes(search)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

async function updateStatus(id, newStatus) {
    if (localStorage.getItem('crmRole') !== 'Admin') {
        alert('Action Denied: Only Admins can update lead status');
        return;
    }
    if (!newStatus) return;
    try {
        const res = await fetch(`${API_URL}/leads/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });
        if (res.ok) {
            const span = document.getElementById(`status-span-${id}`);
            span.textContent = newStatus;
            span.className = `status-badge ${getStatusClass(newStatus)}`;
        } else {
            alert('Failed to update status');
        }
    } catch (err) {
        alert('Server error while updating status');
    }
}

async function deleteLead(id, name) {
    if (localStorage.getItem('crmRole') !== 'Admin') {
        alert('Action Denied: Only Admins can delete student leads');
        return;
    }
    if (!confirm(`Are you sure you want to PERMANENTLY delete the record for ${name}? This action cannot be undone.`)) return;

    try {
        const res = await fetch(`${API_URL}/leads/${id}`, { method: 'DELETE' });
        if (res.ok) {
            alert('Lead deleted successfully');
            loadLeadsTable();
            loadAnalytics();
        } else {
            alert('Failed to delete lead');
        }
    } catch (err) {
        alert('Server error while deleting lead');
    }
}

function exportExcel() {
    const role = localStorage.getItem('crmRole');
    const name = localStorage.getItem('crmName');
    let url = `${API_URL}/export`;
    if (role !== 'Admin') {
        url += `?referredBy=${encodeURIComponent(name)}`;
    }
    window.location.href = url;
}

async function loadAgentsTable() {
    const tbody = document.getElementById('agentsTableBody');
    if (!tbody) return;
    tbody.innerHTML = '<tr><td colspan="4" class="px-6 py-4 text-center">Loading agents...</td></tr>';

    try {
        const res = await fetch(`${API_URL}/auth/users`);
        const users = await res.json();

        tbody.innerHTML = '';
        users.forEach(user => {
            const tr = document.createElement('tr');
            tr.className = 'agent-row';
            tr.innerHTML = `
                <td class="px-6 py-4 font-medium text-gray-900 agent-name">${user.name}</td>
                <td class="px-6 py-4 text-sm text-gray-500 agent-email">${user.email}</td>
                <td class="px-6 py-4 text-sm text-gray-500">${user.role}</td>
                <td class="px-6 py-4">
                    <button onclick="deleteAgent('${user._id}', '${user.name}')" class="text-sm bg-red-100 text-red-600 hover:bg-red-200 px-3 py-1 rounded transition">Remove Access</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        tbody.innerHTML = '<tr><td colspan="4" class="px-6 py-4 text-center text-red-500">Failed to load agents</td></tr>';
    }
}

function filterAgents() {
    const search = document.getElementById('agentSearch').value.toLowerCase();
    const rows = document.querySelectorAll('.agent-row');
    rows.forEach(row => {
        const name = row.querySelector('.agent-name').textContent.toLowerCase();
        const email = row.querySelector('.agent-email').textContent.toLowerCase();
        if (name.includes(search) || email.includes(search)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

async function deleteAgent(id, name) {
    if (localStorage.getItem('crmRole') !== 'Admin') {
        alert('Action Denied: Only Admins can remove agents');
        return;
    }
    if (!confirm(`Are you sure you want to completely remove access for ${name}?`)) return;

    try {
        const res = await fetch(`${API_URL}/auth/users/${id}`, { method: 'DELETE' });
        if (res.ok) {
            alert('Agent access removed successfully');
            loadAgentsTable();
        } else {
            alert('Failed to remove agent');
        }
    } catch (err) {
        alert('Server connection error. Failed to delete.');
    }
}

// --- REFERENCES LOGIC ---
const referenceForm = document.getElementById('referenceForm');
if (referenceForm) {
    referenceForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (localStorage.getItem('crmRole') !== 'Admin') {
            alert('Action Denied: Only Admins can add references');
            return;
        }
        const name = document.getElementById('refName').value;
        const msgDiv = document.getElementById('referenceMsg');

        try {
            const res = await fetch(`${API_URL}/references`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name })
            });

            if (res.ok) {
                msgDiv.textContent = 'Reference added successfully!';
                msgDiv.className = 'mb-4 text-center p-2 rounded bg-green-100 text-green-700 block';
                referenceForm.reset();
                loadReferencesTable();
            } else {
                msgDiv.textContent = 'Failed to add reference';
                msgDiv.className = 'mb-4 text-center p-2 rounded bg-red-100 text-red-700 block';
            }
        } catch (err) {
            msgDiv.textContent = 'Server connection error';
            msgDiv.className = 'mb-4 text-center p-2 rounded bg-red-100 text-red-700 block';
        }
    });
}

async function loadReferencesTable() {
    const tbody = document.getElementById('referencesTableBody');
    if (!tbody) return;
    tbody.innerHTML = '<tr><td colspan="2" class="px-6 py-4 text-center">Loading references...</td></tr>';

    try {
        const res = await fetch(`${API_URL}/references`);
        const references = await res.json();

        tbody.innerHTML = '';
        if (references.length === 0) {
            tbody.innerHTML = '<tr><td colspan="2" class="px-6 py-4 text-center text-gray-500">No references found.</td></tr>';
        }
        references.forEach(ref => {
            const tr = document.createElement('tr');
            tr.className = 'ref-row';
            tr.innerHTML = `
                <td class="px-6 py-4 font-medium text-gray-900 ref-name">${ref.name}</td>
                <td class="px-6 py-4">
                    <button onclick="deleteReference('${ref._id}')" class="text-sm bg-red-100 text-red-600 hover:bg-red-200 px-3 py-1 rounded transition">Delete</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        tbody.innerHTML = '<tr><td colspan="2" class="px-6 py-4 text-center text-red-500">Failed to load references</td></tr>';
    }
}

function filterReferences() {
    const search = document.getElementById('refSearch').value.toLowerCase();
    const rows = document.querySelectorAll('.ref-row');
    rows.forEach(row => {
        const name = row.querySelector('.ref-name').textContent.toLowerCase();
        if (name.includes(search)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

async function deleteReference(id) {
    if (localStorage.getItem('crmRole') !== 'Admin') {
        alert('Action Denied: Only Admins can delete references');
        return;
    }
    if (!confirm('Are you sure you want to delete this reference source?')) return;
    try {
        const res = await fetch(`${API_URL}/references/${id}`, { method: 'DELETE' });
        if (res.ok) {
            loadReferencesTable();
        } else {
            alert('Failed to delete reference');
        }
    } catch (err) {
        alert('Server error while deleting reference');
    }
}

// --- FORM OPTIONS LOGIC ---
const formOptionForm = document.getElementById('formOptionForm');
if (formOptionForm) {
    formOptionForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (localStorage.getItem('crmRole') !== 'Admin') {
            alert('Action Denied: Only Admins can manage checklists');
            return;
        }
        const category = document.getElementById('dropdownCat').value;
        const value = document.getElementById('dropdownVal').value;
        const msgDiv = document.getElementById('formOptionMsg');

        try {
            const res = await fetch(`${API_URL}/formOptions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ category, value })
            });

            if (res.ok) {
                msgDiv.textContent = 'Option added successfully!';
                msgDiv.className = 'mb-4 text-center p-2 rounded bg-green-100 text-green-700 block';
                document.getElementById('dropdownVal').value = '';

                // Automatically switch table filter to show the newly added set
                document.getElementById('filterDropdownCat').value = category;
                loadFormOptionsTable();
            } else {
                const errorData = await res.json();
                console.error('Failed to add option:', errorData);
                msgDiv.textContent = `Failed to add option: ${errorData.message || 'Unknown error'}`;
                msgDiv.className = 'mb-4 text-center p-2 rounded bg-red-100 text-red-700 block';
            }
        } catch (err) {
            console.error('Fetch error:', err);
            msgDiv.textContent = 'Server connection error';
            msgDiv.className = 'mb-4 text-center p-2 rounded bg-red-100 text-red-700 block';
        }
    });
}

async function loadFormOptionsTable() {
    const filterCat = document.getElementById('filterDropdownCat');
    if (!filterCat) return;
    const category = filterCat.value;

    const tbody = document.getElementById('formOptionsTableBody');
    if (!tbody) return;
    tbody.innerHTML = `<tr><td colspan="3" class="px-6 py-4 text-center">Loading ${category}...</td></tr>`;

    try {
        const res = await fetch(`${API_URL}/formOptions/${category}`);
        const options = await res.json();

        tbody.innerHTML = '';
        if (options.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3" class="px-6 py-4 text-center text-gray-500">No options found.</td></tr>';
        }
        options.forEach(opt => {
            const tr = document.createElement('tr');
            tr.className = 'option-row';
            tr.innerHTML = `
                <td class="px-6 py-4 font-medium text-gray-500">${opt.category}</td>
                <td class="px-6 py-4 font-bold text-gray-900 option-val">${opt.value}</td>
                <td class="px-6 py-4">
                    <button onclick="deleteFormOption('${opt._id}')" class="text-sm bg-red-100 text-red-600 hover:bg-red-200 px-3 py-1 rounded transition">Delete</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        tbody.innerHTML = '<tr><td colspan="3" class="px-6 py-4 text-center text-red-500">Failed to load options</td></tr>';
    }
}

function filterOptions() {
    const search = document.getElementById('optionSearch').value.toLowerCase();
    const rows = document.querySelectorAll('.option-row');
    rows.forEach(row => {
        const val = row.querySelector('.option-val').textContent.toLowerCase();
        if (val.includes(search)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

async function deleteFormOption(id) {
    if (localStorage.getItem('crmRole') !== 'Admin') {
        alert('Action Denied: Only Admins can delete options');
        return;
    }
    if (!confirm('Are you sure you want to delete this option? It will be removed from all dropdowns.')) return;
    try {
        const res = await fetch(`${API_URL}/formOptions/${id}`, { method: 'DELETE' });
        if (res.ok) {
            loadFormOptionsTable();
        } else {
            alert('Failed to delete option');
        }
    } catch (err) {
        alert('Server error while deleting option');
    }
}
