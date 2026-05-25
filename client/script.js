const API_URL = '/api';

let charts = {};
let pollInterval;

function authHeaders() {
    const token = localStorage.getItem('crmToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
}

async function api(path, options = {}) {
    const headers = {
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...authHeaders(),
        ...(options.headers || {})
    };
    const res = await fetch(`${API_URL}${path}`, { ...options, headers });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || data.error || 'Request failed');
    return data;
}

function getVal(id) {
    return document.getElementById(id)?.value || '';
}

function getOtherVal(id) {
    const select = document.getElementById(id);
    if (select?.value === 'Other') return document.getElementById(`${id}Other`)?.value || 'Other';
    return select?.value || '';
}

function toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function logout() {
    localStorage.removeItem('crmToken');
    localStorage.removeItem('crmRole');
    localStorage.removeItem('crmName');
    window.location.href = 'login.html';
}

function normalizeDate(value) {
    if (!value) return new Date();
    return new Date(value);
}

function setMessage(el, text, type = 'error') {
    if (!el) return;
    const palette = type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';
    el.textContent = text;
    el.className = `mb-4 text-center p-2 rounded ${palette} block`;
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

async function loadReferencesDropdown() {
    const dropdown = document.getElementById('referredBy');
    if (!dropdown) return;
    try {
        const references = await api('/references');
        references.forEach(ref => {
            const option = document.createElement('option');
            option.value = ref.name;
            option.textContent = ref.name;
            dropdown.appendChild(option);
        });
        const otherOpt = document.createElement('option');
        otherOpt.value = 'Other';
        otherOpt.textContent = 'Other';
        dropdown.appendChild(otherOpt);

        dropdown.addEventListener('change', event => {
            const otherInput = document.getElementById('referredByOther');
            if (event.target.value === 'Other') {
                otherInput?.classList.remove('hidden');
            } else {
                otherInput?.classList.add('hidden');
                if (otherInput) otherInput.value = '';
            }
        });
    } catch (err) {
        console.error('Failed to load references', err);
    }
}

async function loadFormChecklists() {
    const selects = document.querySelectorAll('.dynamic-select');
    if (!selects.length) return;
    await Promise.all(Array.from(selects).map(async select => {
        const category = select.getAttribute('data-category');
        if (!category) return;
        const options = await api(`/formOptions/${encodeURIComponent(category)}`);
        options.forEach(opt => {
            const el = document.createElement('option');
            el.value = opt.value;
            el.textContent = opt.value;
            select.appendChild(el);
        });
        const otherOpt = document.createElement('option');
        otherOpt.value = 'Other';
        otherOpt.textContent = 'Other';
        select.appendChild(otherOpt);
        select.addEventListener('change', event => {
            const otherInput = document.getElementById(`${select.id}Other`);
            if (event.target.value === 'Other') {
                otherInput?.classList.remove('hidden');
                otherInput?.setAttribute('required', 'required');
            } else {
                otherInput?.classList.add('hidden');
                otherInput?.removeAttribute('required');
                if (otherInput) otherInput.value = '';
            }
        });
    }));
}

function setupAdmissionFormHelpers() {
    const photoInput = document.getElementById('studentPhoto');
    const photoPreview = document.getElementById('photoPreview');
    const previewImg = document.getElementById('previewImg');
    photoInput?.addEventListener('change', function () {
        const file = this.files[0];
        if (!file) return photoPreview?.classList.add('hidden');
        const reader = new FileReader();
        reader.onload = event => {
            previewImg.src = event.target.result;
            photoPreview?.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    });

    document.getElementById('aadhaar')?.addEventListener('input', event => {
        event.target.value = event.target.value.replace(/\D/g, '').substring(0, 12);
    });
    ['mobile', 'altMobile'].forEach(id => {
        document.getElementById(id)?.addEventListener('input', event => {
            event.target.value = event.target.value.replace(/\D/g, '').substring(0, 10);
        });
    });
}

async function handleAdmissionSubmit(event) {
    event.preventDefault();
    const msgDiv = document.getElementById('formMessage');
    try {
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
            referredBy: getOtherVal('referredBy')
        };

        for (const id of ['studentPhoto', 'aadhaarPhoto', 'tenthMarksheetPhoto', 'twelfthMarksheetPhoto']) {
            const file = document.getElementById(id)?.files[0];
            if (file) payload[id] = await toBase64(file);
        }

        await api('/leads', { method: 'POST', body: JSON.stringify(payload) });
        window.location.href = `success.html?name=${encodeURIComponent(payload.studentName)}`;
    } catch (err) {
        console.error(err);
        msgDiv.textContent = err.message || 'Unable to submit application. Please try again.';
        msgDiv.className = 'mb-6 p-4 rounded text-center font-semibold bg-red-100 text-red-800 block';
    }
}

async function handleLoginSubmit(event) {
    event.preventDefault();
    const errorDiv = document.getElementById('loginError');
    try {
        const data = await api('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email: getVal('email'), password: getVal('password') })
        });
        localStorage.setItem('crmToken', data.token);
        localStorage.setItem('crmRole', data.role);
        localStorage.setItem('crmName', data.name);
        window.location.href = 'dashboard.html';
    } catch (err) {
        errorDiv.textContent = err.message || 'Login failed';
        errorDiv.classList.remove('hidden');
    }
}

async function loadAnalytics() {
    try {
        const data = await api('/leads/analytics');
        document.getElementById('statTotalLeads').textContent = data.totalLeads;
        document.getElementById('statConfirmed').textContent = data.funnel.find(item => item._id === 'Admission Confirmed')?.count || 0;
        document.getElementById('statNew').textContent = data.funnel.find(item => item._id === 'New Lead')?.count || 0;
        renderCharts(data.courseDistribution, data.funnel);
    } catch (err) {
        console.error('Failed to load analytics', err);
    }
}

function renderCharts(courseData, funnelData) {
    if (!window.Chart) return;
    if (charts.course) charts.course.destroy();
    if (charts.funnel) charts.funnel.destroy();
    const courseCtx = document.getElementById('courseChart')?.getContext('2d');
    const funnelCtx = document.getElementById('funnelChart')?.getContext('2d');
    if (!courseCtx || !funnelCtx) return;
    charts.course = new Chart(courseCtx, {
        type: 'pie',
        data: {
            labels: courseData.map(item => item._id),
            datasets: [{ data: courseData.map(item => item.count), backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'] }]
        }
    });
    charts.funnel = new Chart(funnelCtx, {
        type: 'bar',
        data: {
            labels: funnelData.map(item => item._id),
            datasets: [{ label: 'Status Funnel', data: funnelData.map(item => item.count), backgroundColor: '#6366F1' }]
        },
        options: { scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }
    });
}

async function loadLeadsTable(silent = false) {
    const tbody = document.getElementById('leadsTableBody');
    if (!tbody) return;
    if (!silent) tbody.innerHTML = '<tr><td colspan="5" class="px-6 py-4 text-center">Loading leads...</td></tr>';
    try {
        const leads = await api('/leads');
        tbody.innerHTML = '';
        if (!leads.length) {
            tbody.innerHTML = '<tr><td colspan="5" class="px-6 py-4 text-center text-gray-500">No leads found.</td></tr>';
            return;
        }
        leads.forEach(lead => {
            const date = normalizeDate(lead.createdAt).toLocaleDateString();
            const photo = lead.studentPhoto || lead.studentPhotoUrl || '';
            const tr = document.createElement('tr');
            tr.className = 'lead-row';
            tr.setAttribute('data-search', `${lead.studentName || ''} ${lead.mobile || ''} ${lead.email || ''}`.toLowerCase());
            tr.innerHTML = `
                <td class="px-6 py-4">
                    <div class="flex items-center">
                        ${photo ? `<img src="${photo}" class="w-10 h-10 rounded-full object-cover mr-3 border shadow-sm">` : `<div class="w-10 h-10 rounded-full bg-gray-200 mr-3 flex items-center justify-center text-gray-400 text-xs">No Pic</div>`}
                        <div><div class="font-medium text-gray-900">${lead.studentName || 'N/A'}</div><div class="text-xs text-gray-500">${lead.mobile || 'N/A'}</div><div class="text-[10px] text-gray-400 mt-1">Date: ${date}</div></div>
                    </div>
                </td>
                <td class="px-6 py-4"><div class="text-sm">10th: ${lead.tenthPercent || 'N/A'}% | 12th: ${lead.twelfthPercent || 'N/A'}%</div><div class="text-xs text-gray-500 mt-1">Comm: ${lead.community || 'N/A'} | Caste: ${lead.subCaste || 'N/A'}</div></td>
                <td class="px-6 py-4"><div class="font-medium text-gray-800">${lead.preferredCourse || 'N/A'}</div><div class="text-xs text-gray-600">${lead.program || ''} ${lead.branch ? `(${lead.branch})` : ''}</div><div class="text-xs text-gray-500">${lead.preferredCollege || 'N/A'}</div>${lead.referredBy ? `<div class="text-[10px] text-blue-600 mt-1 font-semibold italic">Ref: ${lead.referredBy}</div>` : ''}</td>
                <td class="px-6 py-4"><span class="status-badge ${getStatusClass(lead.status)}" id="status-span-${lead._id}">${lead.status || 'New Lead'}</span></td>
                <td class="px-6 py-4 space-y-2">
                    <select onchange="updateStatus('${lead._id}', this.value)" class="w-full text-sm border rounded p-1 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500">
                        <option value="" disabled selected>Status...</option><option value="New Lead">New Lead</option><option value="Contacted">Contacted</option><option value="Documents Pending">Docs Pending</option><option value="Applied to College">Applied to Col.</option><option value="Admission Confirmed">Confirmed</option>
                    </select>
                    <button onclick="deleteLead('${lead._id}', '${lead.studentName || 'this lead'}')" class="w-full text-xs bg-red-50 text-red-600 hover:bg-red-100 py-1 rounded font-bold border border-red-100 transition">Delete Lead</button>
                    <button onclick="window.open('view-application.html?id=${lead._id}', '_blank')" class="w-full text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 py-1 rounded font-bold border border-blue-200 transition">Download PDF</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        tbody.innerHTML = '<tr><td colspan="5" class="px-6 py-4 text-center text-red-500">Failed to load leads. Please login again.</td></tr>';
    }
}

function filterLeads() {
    const search = document.getElementById('leadSearch').value.toLowerCase();
    document.querySelectorAll('.lead-row').forEach(row => {
        row.style.display = row.getAttribute('data-search').includes(search) ? '' : 'none';
    });
}

async function updateStatus(id, newStatus) {
    if (!newStatus) return;
    try {
        await api(`/leads/${id}`, { method: 'PUT', body: JSON.stringify({ status: newStatus }) });
        const span = document.getElementById(`status-span-${id}`);
        if (span) {
            span.textContent = newStatus;
            span.className = `status-badge ${getStatusClass(newStatus)}`;
        }
        await loadAnalytics();
    } catch (err) {
        alert(err.message || 'Unable to update status.');
    }
}

async function deleteLead(id, name) {
    if (!confirm(`Are you sure you want to delete the record for ${name}?`)) return;
    await api(`/leads/${id}`, { method: 'DELETE' });
    await loadLeadsTable();
    await loadAnalytics();
}

async function exportExcel() {
    const leads = await api('/leads');
    if (!leads.length) return alert('No data to export.');
    const headers = ['Name', 'Mobile', 'Email', 'Course', 'College', 'Status', 'Referred By', 'Date'];
    const rows = leads.map(lead => [`"${lead.studentName || ''}"`, `"${lead.mobile || ''}"`, `"${lead.email || ''}"`, `"${lead.preferredCourse || ''}"`, `"${lead.preferredCollege || ''}"`, `"${lead.status || ''}"`, `"${lead.referredBy || ''}"`, `"${normalizeDate(lead.createdAt).toLocaleDateString()}"`]);
    const csvContent = `data:text/csv;charset=utf-8,${headers.join(',')}\n${rows.map(row => row.join(',')).join('\n')}`;
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `Leads_Export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

async function loadAgentsTable() {
    const tbody = document.getElementById('agentsTableBody');
    if (!tbody) return;
    tbody.innerHTML = '<tr><td colspan="4" class="px-6 py-4 text-center">Loading users...</td></tr>';
    try {
        const users = await api('/auth/users');
        tbody.innerHTML = '';
        users.forEach(user => {
            const tr = document.createElement('tr');
            tr.className = 'agent-row';
            tr.innerHTML = `<td class="px-6 py-4 font-medium text-gray-900 agent-name">${user.name}</td><td class="px-6 py-4 text-sm text-gray-500 agent-email">${user.email}</td><td class="px-6 py-4 text-sm text-gray-500">${user.role}</td><td class="px-6 py-4"><button onclick="deleteAgent('${user._id}', '${user.name}')" class="text-sm bg-red-100 text-red-600 hover:bg-red-200 px-3 py-1 rounded transition">Remove Access</button></td>`;
            tbody.appendChild(tr);
        });
    } catch {
        tbody.innerHTML = '<tr><td colspan="4" class="px-6 py-4 text-center text-red-500">Failed to load users</td></tr>';
    }
}

function filterAgents() {
    const search = document.getElementById('agentSearch').value.toLowerCase();
    document.querySelectorAll('.agent-row').forEach(row => row.style.display = row.textContent.toLowerCase().includes(search) ? '' : 'none');
}

async function deleteAgent(id, name) {
    if (!confirm(`Remove access for ${name}?`)) return;
    await api(`/auth/users/${id}`, { method: 'DELETE' });
    await loadAgentsTable();
}

async function loadReferencesTable() {
    const tbody = document.getElementById('referencesTableBody');
    if (!tbody) return;
    const references = await api('/references');
    tbody.innerHTML = references.length ? '' : '<tr><td colspan="2" class="px-6 py-4 text-center text-gray-500">No references found.</td></tr>';
    references.forEach(ref => {
        const tr = document.createElement('tr');
        tr.className = 'ref-row';
        tr.innerHTML = `<td class="px-6 py-4 font-medium text-gray-900 ref-name">${ref.name}</td><td class="px-6 py-4"><button onclick="deleteReference('${ref._id}')" class="text-sm bg-red-100 text-red-600 hover:bg-red-200 px-3 py-1 rounded transition">Delete</button></td>`;
        tbody.appendChild(tr);
    });
}

function filterReferences() {
    const search = document.getElementById('refSearch').value.toLowerCase();
    document.querySelectorAll('.ref-row').forEach(row => row.style.display = row.textContent.toLowerCase().includes(search) ? '' : 'none');
}

async function deleteReference(id) {
    await api(`/references/${id}`, { method: 'DELETE' });
    await loadReferencesTable();
}

async function loadFormOptionsTable() {
    const filterCat = document.getElementById('filterDropdownCat');
    const tbody = document.getElementById('formOptionsTableBody');
    if (!filterCat || !tbody) return;
    const options = await api(`/formOptions/${encodeURIComponent(filterCat.value)}`);
    tbody.innerHTML = options.length ? '' : '<tr><td colspan="3" class="px-6 py-4 text-center text-gray-500">No options found.</td></tr>';
    options.forEach(opt => {
        const tr = document.createElement('tr');
        tr.className = 'option-row';
        tr.innerHTML = `<td class="px-6 py-4 font-medium text-gray-500">${opt.category}</td><td class="px-6 py-4 font-bold text-gray-900 option-val">${opt.value}</td><td class="px-6 py-4"><button onclick="deleteFormOption('${opt._id}')" class="text-sm bg-red-100 text-red-600 hover:bg-red-200 px-3 py-1 rounded transition">Delete</button></td>`;
        tbody.appendChild(tr);
    });
}

function filterOptions() {
    const search = document.getElementById('optionSearch').value.toLowerCase();
    document.querySelectorAll('.option-row').forEach(row => row.style.display = row.textContent.toLowerCase().includes(search) ? '' : 'none');
}

async function deleteFormOption(id) {
    await api(`/formOptions/${id}`, { method: 'DELETE' });
    await loadFormOptionsTable();
}

function switchTab(tab) {
    const views = ['dashboard', 'leads', 'agents', 'references', 'formOptions', 'changePassword'];
    views.forEach(view => {
        document.getElementById(`view-${view}`)?.classList.add('hidden');
        document.getElementById(`nav-${view}`)?.classList.remove('bg-blue-800');
    });
    document.getElementById(`view-${tab}`)?.classList.remove('hidden');
    document.getElementById(`nav-${tab}`)?.classList.add('bg-blue-800');
    const titles = { dashboard: 'Dashboard Overview', leads: 'All Leads Management', agents: 'Manage Agents', references: 'Manage References', formOptions: 'Manage Checklists Options', changePassword: 'Security Settings' };
    document.getElementById('pageTitle').textContent = titles[tab] || 'Dashboard';
    if (tab === 'dashboard') loadAnalytics();
    if (tab === 'leads') loadLeadsTable();
    if (tab === 'agents') loadAgentsTable();
    if (tab === 'references') loadReferencesTable();
    if (tab === 'formOptions') loadFormOptionsTable();
}

function startSmartPolling() {
    if (pollInterval) clearInterval(pollInterval);
    pollInterval = setInterval(() => {
        const activeNav = document.querySelector('.bg-blue-800');
        if (activeNav?.id === 'nav-dashboard') loadAnalytics();
        if (activeNav?.id === 'nav-leads') loadLeadsTable(true);
    }, 30000);
}

async function initDashboard() {
    if (!localStorage.getItem('crmToken')) {
        window.location.href = 'login.html';
        return;
    }
    document.getElementById('userRoleDisplay').textContent = localStorage.getItem('crmRole') || 'Admin';
    document.getElementById('userNameDisplay').textContent = `Welcome, ${localStorage.getItem('crmName') || 'Admin'}`;
    document.getElementById('exportBtn')?.classList.remove('hidden');
    ['nav-agents', 'nav-references', 'nav-formOptions'].forEach(id => document.getElementById(id)?.classList.remove('hidden'));
    document.getElementById('nav-dashboard')?.addEventListener('click', () => switchTab('dashboard'));
    document.getElementById('nav-leads')?.addEventListener('click', () => switchTab('leads'));
    document.getElementById('nav-agents')?.addEventListener('click', () => switchTab('agents'));
    document.getElementById('nav-references')?.addEventListener('click', () => switchTab('references'));
    document.getElementById('nav-formOptions')?.addEventListener('click', () => switchTab('formOptions'));
    document.getElementById('nav-changePassword')?.addEventListener('click', () => switchTab('changePassword'));
    document.getElementById('registerForm')?.addEventListener('submit', async event => {
        event.preventDefault();
        try {
            await api('/auth/register', { method: 'POST', body: JSON.stringify({ name: getVal('regName'), email: getVal('regEmail'), password: getVal('regPassword'), role: getVal('regRole') }) });
            setMessage(document.getElementById('registerMsg'), 'Account created successfully!', 'success');
            event.target.reset();
            await loadAgentsTable();
        } catch (err) {
            setMessage(document.getElementById('registerMsg'), err.message);
        }
    });
    document.getElementById('referenceForm')?.addEventListener('submit', async event => {
        event.preventDefault();
        await api('/references', { method: 'POST', body: JSON.stringify({ name: getVal('refName') }) });
        setMessage(document.getElementById('referenceMsg'), 'Reference added successfully!', 'success');
        event.target.reset();
        await loadReferencesTable();
    });
    document.getElementById('formOptionForm')?.addEventListener('submit', async event => {
        event.preventDefault();
        const category = getVal('dropdownCat');
        await api('/formOptions', { method: 'POST', body: JSON.stringify({ category, value: getVal('dropdownVal') }) });
        setMessage(document.getElementById('formOptionMsg'), 'Option added successfully!', 'success');
        document.getElementById('dropdownVal').value = '';
        document.getElementById('filterDropdownCat').value = category;
        await loadFormOptionsTable();
    });
    document.getElementById('changePasswordForm')?.addEventListener('submit', async event => {
        event.preventDefault();
        try {
            await api('/auth/change-password', { method: 'POST', body: JSON.stringify({ currentPassword: getVal('currentPassword'), newPassword: getVal('newPassword') }) });
            setMessage(document.getElementById('changePasswordMsg'), 'Password updated successfully!', 'success');
            event.target.reset();
        } catch (err) {
            setMessage(document.getElementById('changePasswordMsg'), err.message);
        }
    });
    startSmartPolling();
    await loadAnalytics();
}

async function boot() {
    document.getElementById('loginForm')?.addEventListener('submit', handleLoginSubmit);
    if (document.getElementById('admissionForm')) {
        setupAdmissionFormHelpers();
        await Promise.all([loadReferencesDropdown(), loadFormChecklists()]);
        document.getElementById('admissionForm').addEventListener('submit', handleAdmissionSubmit);
    }
    if (document.getElementById('view-dashboard')) await initDashboard();
}

document.addEventListener('DOMContentLoaded', boot);
