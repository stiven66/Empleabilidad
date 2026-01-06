// Configuración
const CONFIG = {
  BASE_URL: 'http://localhost:3000/api', // Cambia si tu backend está en otro host/puerto
  API_KEY: 'super-secret-api-key', // Se puede setear desde el input en la vista Auth
};

const API_URL = "http://localhost:3000/api"; // Ajusta si tu backend corre en otro puerto
const API_KEY = "super-secret-api-key";            // pon aquí tu api-key real
let token = "";                          // guarda aquí el JWT después de login

function getHeaders(auth = true) {
  const headers = { "Content-Type": "application/json", "x-api-key": CONFIG.API_KEY };
  if (auth && session.token) {
    headers["Authorization"] = `Bearer ${session.token}`;
  }
  return headers;
}


// Estado de sesión
const session = {
  token: null,
  role: null, // 'coder' | 'gestor' | 'administrador'
};

// Utilidad: headers con JWT + API Key
function authHeaders() {
  const headers = {
    'Content-Type': 'application/json',
    'x-api-key': CONFIG.API_KEY || '',
  };
  if (session.token) headers['Authorization'] = `Bearer ${session.token}`;
  return headers;
}

// Utilidad: manejar respuesta estándar del backend y errores
function handleResponse(res) {
  return res.json().then((body) => {
    if (!res.ok) {
      const msg = body?.message || 'Error en la solicitud';
      throw new Error(Array.isArray(msg) ? msg.join(', ') : msg);
    }
    return body; // Se asume interceptor: { success, data, message }
  });
}

// Navegación simple
document.querySelectorAll('.nav-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-target');
    document.querySelectorAll('.view').forEach((v) => v.classList.remove('active'));
    document.getElementById(target).classList.add('active');
  });
});

// Actualizar UI de sesión
function updateSessionUI() {
  document.getElementById('sessionRole').textContent = session.role || 'N/A';
  document.getElementById('sessionToken').textContent = session.token ? 'Asignado' : 'N/A';
}

// API: Registro (coder)
function registerUser({ name, email, password }) {
  return fetch(`${CONFIG.BASE_URL}/auth/register`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ name, email, password }),
  }).then(handleResponse);
}

// API: Login (coder/gestor/admin)
function loginUser({ email, password }) {
  return fetch(`${CONFIG.BASE_URL}/auth/login`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ email, password }),
  })
    .then(handleResponse)
    .then((resp) => {
      // Se asume resp.data = { access_token, user: { role, ... } }
      const token = resp?.data?.access_token;
      const role = resp?.data?.user?.role;
      if (!token) throw new Error('Token no recibido');
      session.token = token;
      session.role = role || 'coder';
      updateSessionUI();
      return resp;
    });
}

// API: Vacantes (listar con filtros opcionales)
function getVacancies({ technology, seniority, location } = {}) {
  const params = new URLSearchParams();
  if (technology) params.append('technology', technology);
  if (seniority) params.append('seniority', seniority);
  if (location) params.append('location', location);
  const url = `${CONFIG.BASE_URL}/vacancies${params.toString() ? `?${params}` : ''}`;
  return fetch(url, { headers: authHeaders() }).then(handleResponse);
}

// API: Postularse a vacante
function applyToVacancy(vacancyId) {
  return fetch(`${CONFIG.BASE_URL}/applications`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ vacancyId }),
  }).then(handleResponse);
}

// API: Listar postulaciones (opcional: por vacante o propias)
function listApplications({ vacancyId } = {}) {
  const url = vacancyId
    ? `${CONFIG.BASE_URL}/applications/vacancy/${vacancyId}` // 👈 ruta correcta
    : `${CONFIG.BASE_URL}/applications/me`;
  return fetch(url, { headers: authHeaders() }).then(handleResponse);
}

    
  


// API: Crear vacante (gestor/admin)
function createVacancy(payload) {
  return fetch(`${CONFIG.BASE_URL}/vacancies`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  }).then(handleResponse);
}

// API: Actualizar cupo máximo (gestor/admin)
function updateVacancyMaxApplicants({ id, maxApplicants }) {
  return fetch(`${CONFIG.BASE_URL}/vacancies/${id}`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ maxApplicants }),
  }).then(handleResponse);
}

updateVacancyMaxApplicants({ id: 1, maxApplicants: 10 })
  .then(resp => console.log("Vacante actualizada:", resp))
  .catch(err => console.error(err.message));


// API: Activar/Inactivar vacante (gestor/admin)
function toggleVacancy({ id, active }) {
  return fetch(`${CONFIG.BASE_URL}/vacancies/${id}/status`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ active }),
  }).then(handleResponse);
}

// --------- Eventos de formularios ---------

// Set API Key
document.getElementById('apiKeyInput').addEventListener('input', (e) => {
  CONFIG.API_KEY = e.target.value.trim();
});

// Registro
document.getElementById('registerForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const form = e.target;
  const result = document.getElementById('registerResult');
  result.className = 'result';
  const payload = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    password: form.password.value,
  };
  registerUser(payload)
    .then((resp) => {
      result.textContent = resp.message || 'Registro exitoso';
      result.classList.add('success');
      form.reset();
    })
    .catch((err) => {
      result.textContent = err.message;
      result.classList.add('error');
    });
});

// Login
document.getElementById('loginForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const form = e.target;
  const result = document.getElementById('loginResult');
  result.className = 'result';
  loginUser({ email: form.email.value.trim(), password: form.password.value })
    .then((resp) => {
      result.textContent = resp.message || 'Login exitoso';
      result.classList.add('success');
    })
    .catch((err) => {
      result.textContent = err.message;
      result.classList.add('error');
    });
});

// Logout
document.getElementById('logoutBtn').addEventListener('click', () => {
  session.token = null;
  session.role = null;
  updateSessionUI();
});

// Cargar vacantes
document.getElementById('loadVacanciesBtn').addEventListener('click', () => {
  const tech = document.getElementById('filterTech').value.trim();
  const seniority = document.getElementById('filterSeniority').value.trim();
  const location = document.getElementById('filterLocation').value;
  const result = document.getElementById('vacanciesResult');
  result.className = 'result';
  getVacancies({ technology: tech, seniority, location })
    .then((resp) => {
      const list = document.getElementById('vacancyList');
      list.innerHTML = '';
      const vacancies = resp.data || [];
      if (!vacancies.length) {
        result.textContent = 'Sin resultados';
        return;
      }
      vacancies.forEach((v) => {
        const card = document.createElement('div');
        card.className = 'vacancy-card';
        card.innerHTML = `
          <h4>${v.title} — ${v.company}</h4>
          <div class="vacancy-meta">
            <span><strong>Ubicación:</strong> ${v.location}</span>
            <span><strong>Modalidad:</strong> ${v.modality}</span>
            <span><strong>Seniority:</strong> ${v.seniority}</span>
            <span><strong>Tecnologías:</strong> ${Array.isArray(v.technologies) ? v.technologies.join(', ') : v.technologies}</span>
            <span><strong>Salario:</strong> ${v.salaryRange}</span>
            <span><strong>Cupo máx:</strong> ${v.maxApplicants}</span>
            <span><strong>Creada:</strong> ${new Date(v.createdAt).toLocaleString()}</span>
          </div>
          <p>${v.description}</p>
          <div class="vacancy-actions">
            <button data-apply="${v.id}">Postular</button>
          </div>
        `;
        list.appendChild(card);

        // Botón postular
        card.querySelector('[data-apply]').addEventListener('click', () => {
          const applyResult = document.getElementById('applyResult');
          applyResult.className = 'result';
          applyToVacancy(v.id)
            .then((r) => {
              applyResult.textContent = r.message || 'Postulación exitosa';
              applyResult.classList.add('success');
            })
            .catch((err) => {
              applyResult.textContent = err.message;
              applyResult.classList.add('error');
            });
        });
      });
    })
    .catch((err) => {
      result.textContent = err.message;
      result.classList.add('error');
    });
});

// Postularse con ID manual
document.getElementById('applyForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const id = Number(document.getElementById('applyVacancyId').value);
  const result = document.getElementById('applyResult');
  result.className = 'result';
  applyToVacancy(id)
    .then((r) => {
      result.textContent = r.message || 'Postulación exitosa';
      result.classList.add('success');
    })
    .catch((err) => {
      result.textContent = err.message;
      result.classList.add('error');
    });
});

// Listar mis postulaciones (Coder)
document.getElementById('listMyApplicationsBtn').addEventListener('click', () => {
  const container = document.getElementById('myApplications');
  container.innerHTML = '';
  listApplications()
    .then((resp) => {
      const apps = resp.data || [];
      if (!apps.length) {
        container.innerHTML = '<p class="result">No tienes postulaciones</p>';
        return;
      }
      apps.forEach((a) => {
        const c = document.createElement('div');
        c.className = 'application-card';
        c.innerHTML = `
          <strong>Vacante #${a.vacancyId}</strong>
          <div class="vacancy-meta">
            <span><strong>Postulado:</strong> ${new Date(a.appliedAt).toLocaleString()}</span>
          </div>
        `;
        container.appendChild(c);
      });
    })
    .catch((err) => {
      container.innerHTML = `<p class="result error">${err.message}</p>`;
    });
});

// Crear vacante
document.getElementById('createVacancyForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const form = e.target;
  const result = document.getElementById('createVacancyResult');
  result.className = 'result';

  
  const payload = { 
    title: form.title.value.trim(), 
    description: form.description.value.trim(), 
    seniority: form.seniority.value.trim() || undefined, 
    softSkills: form.softSkills.value.trim(), // string obligatorio 
    location: form.location.value.trim(), 
    modality: form.modality.value, // "REMOTO" | "HIBRIDO" | "PRESENCIAL" 
    salaryRange: form.salaryRange.value.trim(), 
    company: form.company.value.trim(), 
    maxApplicants: Number(form.maxApplicants.value), 
    technologies: form.technologies.value 
      .split(',') 
      .map(t => t.trim()) 
      .filter(Boolean), 
    active: true
  };

  createVacancy(payload)
    .then((resp) => {
      result.textContent = resp.message || 'Vacante creada';
      result.classList.add('success');
      form.reset();
    })
    .catch((err) => {
      result.textContent = err.message;
      result.classList.add('error');
    });
});

// Actualizar cupo
document.getElementById('updateVacancyForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const form = e.target;
  const id = Number(form.id.value);
  const maxApplicants = Number(form.maxApplicants.value);
  const result = document.getElementById('updateVacancyResult');
  result.className = 'result';

  updateVacancyMaxApplicants({ id, maxApplicants })
    .then((resp) => {
      result.textContent = resp.message || 'Cupo actualizado';
      result.classList.add('success');
      form.reset();
    })
    .catch((err) => {
      result.textContent = err.message;
      result.classList.add('error');
    });
});

// Activar/Inactivar
document.getElementById('toggleVacancyForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const form = e.target;
  const id = Number(form.id.value);
  const active = form.active.value === 'true';
  const result = document.getElementById('toggleVacancyResult');
  result.className = 'result';

  toggleVacancy(id, active )
    .then((resp) => {
      result.textContent = resp.message || 'Estado actualizado';
      result.classList.add('success');
      form.reset();
    })
    .catch((err) => {
      result.textContent = err.message;
      result.classList.add('error');
    });
});

// Listar postulaciones por vacante (Gestor/Admin)
document.getElementById('listApplicationsForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const form = e.target;
  const vacancyId = Number(form.vacancyId.value);
  const result = document.getElementById('listApplicationsResult');
  const container = document.getElementById('applicationsList');
  result.className = 'result';
  container.innerHTML = '';

  listApplications({ vacancyId })
    .then((resp) => {
      const apps = resp.data || [];
      if (!apps.length) {
        result.textContent = 'Sin postulaciones para esta vacante';
        return;
      }
      result.textContent = `Postulaciones encontradas: ${apps.length}`;
      result.classList.add('success');
      apps.forEach((a) => {
        const c = document.createElement('div');
        c.className = 'application-card';
        c.innerHTML = `
          <strong>Aplicación #${a.id}</strong>
          <div class="vacancy-meta">
            <span><strong>UserID:</strong> ${a.userId}</span>
            <span><strong>VacancyID:</strong> ${a.vacancyId}</span>
            <span><strong>Fecha:</strong> ${new Date(a.appliedAt).toLocaleString()}</span>
          </div>
        `;
        container.appendChild(c);
      });
    })
    .catch((err) => {
      result.textContent = err.message;
      result.classList.add('error');
    });
});

// Listar postulaciones de la vacante con id=1
listApplications({ vacancyId: 1 })
  .then(data => console.log("Postulaciones de la vacante:", data))
  .catch(err => console.error(err));

// Listar postulaciones propias del usuario autenticado
listApplications()
  .then(data => console.log("Mis postulaciones:", data))
  .catch(err => console.error(err));


toggleVacancy(1, true)   // activa la vacante con id 1
toggleVacancy(1, false)  // desactiva la vacante con id 1


// Listar todas las vacantes
getVacancies()
  .then(vacancies => console.log("Vacantes disponibles:", vacancies))
  .catch(err => console.error(err));

// Filtrar por tecnología
getVacancies({ technology: "JavaScript" })
  .then(vacancies => console.log("Vacantes JS:", vacancies))
  .catch(err => console.error(err));

// Filtrar por seniority
getVacancies({ seniority: "Senior" })
  .then(vacancies => console.log("Vacantes Senior:", vacancies))
  .catch(err => console.error(err));


// Estado inicial
updateSessionUI();










async function registerUser(payload) {
  const resp = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: getHeaders(false),
    body: JSON.stringify(payload)
  });
  if (!resp.ok) throw new Error("Error al registrar usuario");
  return resp.json();
}

// Función para decodificar el JWT y extraer el payload
function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

async function loginUser(payload) {
  const resp = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: getHeaders(false),
    body: JSON.stringify(payload)
  });
  if (!resp.ok) throw new Error("Error al iniciar sesión");
  const data = await resp.json();

  // Guardar token en session
  session.token = data.data.access_token;

  // Decodificar el JWT para obtener el rol
  const decoded = parseJwt(session.token);
  session.role = decoded?.role || "N/A";

  // Persistir en localStorage (opcional)
  localStorage.setItem("token", session.token);
  localStorage.setItem("role", session.role);

  console.log("Token guardado:", session.token);
  console.log("Rol guardado:", session.role);

  updateSessionUI();
  return data;
}



async function getVacancies({ technology, seniority } = {}) {
  const query = new URLSearchParams();
  if (technology) query.append("technology", technology);
  if (seniority) query.append("seniority", seniority);

  const resp = await fetch(`${API_URL}/vacancies?${query.toString()}`, {
    headers: getHeaders(false)
  });
  if (!resp.ok) throw new Error("Error al listar vacantes");
  return resp.json();
}

async function getVacancy(id) {
  const resp = await fetch(`${API_URL}/vacancies/${id}`, {
    headers: getHeaders(false)
  });
  if (!resp.ok) throw new Error("Error al obtener vacante");
  return resp.json();
}

async function createVacancy(payload) {
  const resp = await fetch(`${API_URL}/vacancies`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": CONFIG.API_KEY,                 // 👈 tu API Key
      "Authorization": `Bearer ${session.token}`   // 👈 el JWT que recibiste al hacer login
    },
    body: JSON.stringify(payload)
  });

  // Manejo de errores más claro
  if (!resp.ok) {
    const errorText = await resp.text();
    throw new Error(`Error ${resp.status}: ${errorText || resp.statusText}`);
  }

  return resp.json();
}

async function updateVacancy(id, payload) {
  
  const resp = await fetch(`${API_URL}/vacancies/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": CONFIG.API_KEY,                 // 👈 tu API Key
      "Authorization": `Bearer ${session.token}`   // 👈 el JWT que recibiste al hacer login
    },
    body: JSON.stringify(payload)
  });

  // Manejo de errores más claro
  if (!resp.ok) {
    const errorText = await resp.text();
    throw new Error(`Error ${resp.status}: ${errorText || resp.statusText}`);
  }

  return resp.json();
}

async function toggleVacancy(id, active) {
  const resp = await fetch(`${API_URL}/vacancies/${id}/active`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,              // tu API Key
      "Authorization": `Bearer ${session.token}` // el JWT que recibiste al hacer login
    },
    body: JSON.stringify({ active })
  });

  if (!resp.ok) {
    const errorText = await resp.text();
    throw new Error(`Error ${resp.status}: ${errorText || resp.statusText}`);
  }

  return resp.json();
}













async function applyToVacancy(vacancyId) {
  const resp = await fetch(`${API_URL}/applications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,              // tu API Key
      "Authorization": `Bearer ${session.token}` // el JWT que recibiste al hacer login
    },
    body: JSON.stringify({ vacancyId })
  });
  if (!resp.ok) throw new Error("Error al postularse");
  return resp.json();
}

async function listApplicationsByVacancy(id) {
  const resp = await fetch(`${API_URL}/applications/vacancy/${id}`, {
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,              // tu API Key
      "Authorization": `Bearer ${session.token}` // el JWT que recibiste al hacer login
    },
  });
  if (!resp.ok) throw new Error("Error al listar postulaciones por vacante");
  return resp.json();
}

async function listMyApplications() {
  const resp = await fetch(`${API_URL}/applications/me`, {
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,              // tu API Key
      "Authorization": `Bearer ${session.token}` // el JWT que recibiste al hacer login
    },
  });
  if (!resp.ok) throw new Error("Error al listar mis postulaciones");
  return resp.json();
}
