const initialJobs = [
    {
        id: 1,
        title: "Auxiliar Administrativo",
        company: "Comércio Local Ltda",
        type: "CLT",
        location: "São Paulo, SP",
        salary: "R$ 1.850,00 + Benefícios",
        description: "Suporte em rotinas administrativas gerais, atendimento telefônico, organização de arquivos físicos e digitais, emissão de notas e planilhas de controle.\n\nRequisitos: Ensino médio completo e conhecimentos básicos em Excel.",
        date: "Hoje"
    },
    {
        id: 2,
        title: "Estagiário de Marketing Digital",
        company: "Agência Pulso",
        type: "Estágio",
        location: "Rio de Janeiro, RJ",
        salary: "R$ 1.250,00 + VT",
        description: "Auxílio na criação de calendário editorial para redes sociais, redação criativa, edição básica no Canva/CapCut e acompanhamento de métricas.\n\nRequisitos: Cursando Publicidade, Marketing ou Jornalismo.",
        date: "Ontem"
    },
    {
        id: 3,
        title: "Desenvolvedor Front-end Júnior",
        company: "NovaTech Solutions",
        type: "Home Office",
        location: "100% Remoto",
        salary: "R$ 3.600,00",
        description: "Desenvolvimento e manutenção de interfaces web responsivas utilizando HTML, Tailwind CSS, JavaScript moderno e React.\n\nDiferenciais: Experiência com consumo de APIs REST e Git.",
        date: "Há 2 dias"
    },
    {
        id: 4,
        title: "Entregador Parceiro / Bico",
        company: "Expresso Rápido",
        type: "Freelance",
        location: "Curitiba, PR",
        salary: "R$ 160,00 / diária",
        description: "Entregas de pequenos pacotes e documentos na região central em horário comercial. Pagamento realizado via Pix ao final de cada dia trabalhado.\n\nRequisitos: Moto ou bicicleta própria e smartphone com internet.",
        date: "Há 3 dias"
    }
];

let currentCategory = 'todos';

function getJobs() {
    const saved = localStorage.getItem('system_vagas_db');
    if (saved) return JSON.parse(saved);
    localStorage.setItem('system_vagas_db', JSON.stringify(initialJobs));
    return initialJobs;
}

function saveJobs(jobs) {
    localStorage.setItem('system_vagas_db', JSON.stringify(jobs));
}

function getSavedIds() {
    return JSON.parse(localStorage.getItem('system_vagas_saved') || '[]');
}

function toggleSaveJob(id, event) {
    event.stopPropagation();
    let saved = getSavedIds();
    if (saved.includes(id)) {
        saved = saved.filter(item => item !== id);
        showToast("Vaga removida dos salvos.");
    } else {
        saved.push(id);
        showToast("Vaga salva nos seus favoritos!");
    }
    localStorage.setItem('system_vagas_saved', JSON.stringify(saved));
    updateSavedBadge();
    renderJobs();
}

function updateSavedBadge() {
    const count = getSavedIds().length;
    const badge = document.getElementById('savedCountBadge');
    if (badge) badge.innerText = count;
}

function getBadgeStyle(type) {
    const styles = {
        'CLT': 'bg-blue-50 text-blue-700 border-blue-200',
        'Estágio': 'bg-emerald-50 text-emerald-700 border-emerald-200',
        'Freelance': 'bg-amber-50 text-amber-700 border-amber-200',
        'Home Office': 'bg-purple-50 text-purple-700 border-purple-200'
    };
    return styles[type] || 'bg-slate-100 text-slate-700 border-slate-200';
}

function getCompanyInitials(name) {
    return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

function renderJobs() {
    const jobs = getJobs();
    const savedIds = getSavedIds();
    const jobList = document.getElementById('jobList');
    const noResults = document.getElementById('noResults');
    const searchVal = document.getElementById('searchInput').value.toLowerCase();
    const locationVal = document.getElementById('locationInput').value.toLowerCase();
    const sortVal = document.getElementById('sortSelect').value;

    jobList.innerHTML = '';

    let filtered = jobs.filter(job => {
        const matchCategory = currentCategory === 'todos' 
            ? true 
            : currentCategory === 'salvas' 
                ? savedIds.includes(job.id) 
                : job.type === currentCategory;

        const matchSearch = job.title.toLowerCase().includes(searchVal) || 
                            job.company.toLowerCase().includes(searchVal) ||
                            job.description.toLowerCase().includes(searchVal);
        const matchLocation = job.location.toLowerCase().includes(locationVal);

        return matchCategory && matchSearch && matchLocation;
    });

    if (sortVal === 'az') {
        filtered.sort((a, b) => a.title.localeCompare(b.title));
    }

    document.getElementById('jobCount').innerText = filtered.length;

    if (filtered.length === 0) {
        noResults.classList.remove('hidden');
    } else {
        noResults.classList.add('hidden');
        filtered.forEach(job => {
            const isSaved = savedIds.includes(job.id);
            const card = document.createElement('div');
            card.className = "group bg-white rounded-2xl p-6 border border-slate-200/90 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-950/5 hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between";

            card.innerHTML = `
                <div>
                    <div class="flex items-center justify-between gap-2 mb-4">
                        <span class="text-xs font-bold px-2.5 py-1 rounded-lg border ${getBadgeStyle(job.type)}">
                            ${job.type}
                        </span>
                        <div class="flex items-center gap-2">
                            <span class="text-xs font-medium text-slate-400">${job.date || 'Recente'}</span>
                            <button onclick="toggleSaveJob(${job.id}, event)" title="Salvar vaga" class="p-1.5 rounded-lg hover:bg-rose-50 transition-colors ${isSaved ? 'text-rose-500' : 'text-slate-400 hover:text-rose-500'}">
                                <i data-lucide="heart" class="w-4 h-4 ${isSaved ? 'fill-rose-500' : ''}"></i>
                            </button>
                        </div>
                    </div>

                    <div class="flex items-center gap-3 mb-3">
                        <div class="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0 border border-slate-200">
                            ${getCompanyInitials(job.company)}
                        </div>
                        <div class="min-w-0">
                            <h3 onclick="openDetailsModal(${job.id})" class="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug cursor-pointer truncate">
                                ${job.title}
                            </h3>
                            <p class="text-sm font-medium text-slate-500 truncate">${job.company}</p>
                        </div>
                    </div>
                    
                    <p class="text-sm text-slate-600 mb-5 line-clamp-2 leading-relaxed">${job.description}</p>
                </div>

                <div>
                    <div class="flex flex-wrap gap-2 mb-5 pt-4 border-t border-slate-100">
                        <span class="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                            <i data-lucide="map-pin" class="w-3.5 h-3.5 text-slate-400"></i>
                            ${job.location}
                        </span>
                        <span class="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                            <i data-lucide="banknote" class="w-3.5 h-3.5 text-emerald-600"></i>
                            ${job.salary || 'A combinar'}
                        </span>
                    </div>

                    <div class="flex gap-2">
                        <button onclick="openDetailsModal(${job.id})" class="px-3.5 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-xl transition-colors">
                            Detalhes
                        </button>
                        <button onclick="openApplyModal(${job.id})" class="flex-1 bg-slate-900 hover:bg-indigo-600 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5">
                            <span>Candidatar-se</span>
                            <i data-lucide="arrow-right" class="w-4 h-4"></i>
                        </button>
                    </div>
                </div>
            `;
            jobList.appendChild(card);
        });
    }

    lucide.createIcons();
}

function filterCategory(cat) {
    currentCategory = cat;
    document.querySelectorAll('.cat-btn').forEach(btn => {
        const isActive = btn.dataset.cat === cat;
        if (cat === 'salvas' && isActive) {
            btn.className = "cat-btn active bg-rose-600 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-all inline-flex items-center gap-1.5";
        } else if (isActive) {
            btn.className = "cat-btn active bg-slate-900 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-all";
        } else if (btn.dataset.cat === 'salvas') {
            btn.className = "cat-btn bg-white text-rose-600 hover:bg-rose-50 font-medium px-4 py-2 rounded-xl text-sm border border-slate-200 transition-all inline-flex items-center gap-1.5";
        } else {
            btn.className = "cat-btn bg-white text-slate-600 hover:bg-slate-100 font-medium px-4 py-2 rounded-xl text-sm border border-slate-200 transition-all";
        }
    });
    renderJobs();
}

function resetAllFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('locationInput').value = '';
    document.getElementById('sortSelect').value = 'recent';
    filterCategory('todos');
}

function openModal(id) {
    document.getElementById(id).classList.remove('hidden');
}

function closeModal(id) {
    document.getElementById(id).classList.add('hidden');
}

function closeOnBackdrop(event, id) {
    if (event.target.id === id) closeModal(id);
}

function openDetailsModal(jobId) {
    const job = getJobs().find(j => j.id === jobId);
    if (!job) return;

    const badge = document.getElementById('detailBadge');
    badge.className = `inline-block text-xs font-bold px-3 py-1 rounded-lg border mb-3 ${getBadgeStyle(job.type)}`;
    badge.innerText = job.type;

    document.getElementById('detailTitle').innerText = job.title;
    document.getElementById('detailCompany').innerText = job.company;
    document.getElementById('detailLocation').innerText = job.location;
    document.getElementById('detailSalary').innerText = job.salary || 'A combinar';
    document.getElementById('detailDescription').innerText = job.description;

    document.getElementById('detailApplyBtn').onclick = () => {
        closeModal('modalDetails');
        openApplyModal(job.id);
    };

    openModal('modalDetails');
}

function openApplyModal(jobId) {
    const job = getJobs().find(j => j.id === jobId);
    if (!job) return;

    document.getElementById('applyJobId').value = job.id;
    document.getElementById('applyJobTitle').innerText = job.title;
    document.getElementById('applyJobCompany').innerText = `${job.company} • ${job.location}`;
    openModal('modalApply');
}

function handleApply(e) {
    e.preventDefault();
    closeModal('modalApply');
    showToast("Candidatura enviada com sucesso! Boa sorte!");
    e.target.reset();
}

function handlePostJob(e) {
    e.preventDefault();
    const jobs = getJobs();

    const newJob = {
        id: Date.now(),
        title: document.getElementById('postTitle').value,
        company: document.getElementById('postCompany').value,
        type: document.getElementById('postType').value,
        location: document.getElementById('postLocation').value,
        salary: document.getElementById('postSalary').value || "A combinar",
        description: document.getElementById('postDescription').value,
        date: "Agora mesmo"
    };

    jobs.unshift(newJob);
    saveJobs(jobs);

    closeModal('modalPostJob');
    showToast("Vaga publicada com sucesso!");
    e.target.reset();
    renderJobs();
}

function showToast(msg) {
    const toast = document.getElementById('toast');
    document.getElementById('toastMessage').innerText = msg;
    toast.classList.remove('opacity-0', 'translate-y-4', 'pointer-events-none');
    setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-4', 'pointer-events-none');
    }, 3500);
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        ['modalDetails', 'modalApply', 'modalPostJob'].forEach(closeModal);
    }
});

document.getElementById('searchInput').addEventListener('input', renderJobs);
document.getElementById('locationInput').addEventListener('input', renderJobs);

document.addEventListener('DOMContentLoaded', () => {
    updateSavedBadge();
    renderJobs();
});