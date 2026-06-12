document.addEventListener('DOMContentLoaded', () => {
    const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const API_URL = isDevelopment ? 'http://localhost:5000/api' : 'https://your-backend-name.onrender.com/api';

    const loginSection = document.getElementById('login-section');
    const dashboardSection = document.getElementById('dashboard-section');
    const loginForm = document.getElementById('login-form');
    const logoutBtn = document.getElementById('logout-btn');
    
    const projectForm = document.getElementById('project-form');
    const adminProjectsList = document.getElementById('admin-projects-list');
    const formTitle = document.getElementById('form-title');
    const cancelEditBtn = document.getElementById('cancel-edit');

    // Check auth on load
    const token = localStorage.getItem('adminToken');
    if (token) {
        showDashboard();
    }

    // Login logic
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();
            
            if (res.ok) {
                localStorage.setItem('adminToken', data.token);
                showDashboard();
            } else {
                alert(data.error || 'Login failed');
            }
        } catch (error) {
            console.error(error);
            alert('Cannot reach server');
        }
    });

    // Logout logic
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('adminToken');
        dashboardSection.classList.add('hidden');
        loginSection.classList.remove('hidden');
    });

    function showDashboard() {
        loginSection.classList.add('hidden');
        dashboardSection.classList.remove('hidden');
        loadProjects();
    }

    // Projects CRUD
    async function loadProjects() {
        try {
            const res = await fetch(`${API_URL}/projects`);
            const projects = await res.json();
            
            adminProjectsList.innerHTML = projects.map(p => `
                <div class="bg-secondary/50 border border-white/5 p-4 rounded-lg flex justify-between items-center">
                    <div>
                        <h4 class="text-white font-bold">${p.title}</h4>
                        <p class="text-gray-400 text-sm truncate w-64">${p.description}</p>
                    </div>
                    <div class="flex gap-2">
                        <button onclick="editProject('${p._id}')" class="text-blue-400 hover:text-blue-300 p-2"><i class="fas fa-edit"></i></button>
                        <button onclick="deleteProject('${p._id}')" class="text-red-400 hover:text-red-300 p-2"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            `).join('');
        } catch (error) {
            console.error(error);
        }
    }

    // Add or Update
    projectForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const id = document.getElementById('project-id').value;
        const payload = {
            title: document.getElementById('proj-title').value,
            description: document.getElementById('proj-desc').value,
            techStack: document.getElementById('proj-tech').value.split(',').map(s => s.trim()).filter(Boolean),
            iconClass: document.getElementById('proj-icon').value,
            colorTheme: document.getElementById('proj-color').value
        };

        const method = id ? 'PUT' : 'POST';
        const url = id ? `${API_URL}/projects/${id}` : `${API_URL}/projects`;

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                projectForm.reset();
                document.getElementById('project-id').value = '';
                formTitle.textContent = 'Add Project';
                cancelEditBtn.classList.add('hidden');
                loadProjects();
            } else {
                if(res.status === 401) { logoutBtn.click(); }
                alert('Failed to save');
            }
        } catch (error) {
            console.error(error);
        }
    });

    window.editProject = async (id) => {
        try {
            const res = await fetch(`${API_URL}/projects`);
            const projects = await res.json();
            const project = projects.find(p => p._id === id);
            
            if (project) {
                document.getElementById('project-id').value = project._id;
                document.getElementById('proj-title').value = project.title;
                document.getElementById('proj-desc').value = project.description;
                document.getElementById('proj-tech').value = (project.techStack || []).join(', ');
                document.getElementById('proj-icon').value = project.iconClass || '';
                document.getElementById('proj-color').value = project.colorTheme || 'blue';
                
                formTitle.textContent = 'Edit Project';
                cancelEditBtn.classList.remove('hidden');
            }
        } catch (error) {
            console.error(error);
        }
    };

    window.deleteProject = async (id) => {
        if (!confirm('Delete this project?')) return;
        
        try {
            const res = await fetch(`${API_URL}/projects/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
            });
            if (res.ok) {
                loadProjects();
            } else {
                if(res.status === 401) { logoutBtn.click(); }
                alert('Delete failed');
            }
        } catch (error) {
            console.error(error);
        }
    };

    cancelEditBtn.addEventListener('click', () => {
        projectForm.reset();
        document.getElementById('project-id').value = '';
        formTitle.textContent = 'Add Project';
        cancelEditBtn.classList.add('hidden');
    });
});
