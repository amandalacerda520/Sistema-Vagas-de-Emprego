const initialJobs = [
    {
        id: 1,
        title: "Auxiliar Administrativo",
        company: "Comércio Local Ltda",
        type: "CLT",
        location: "São Paulo, SP",
        salary: "R$ 1.800,00",
        description: "Vaga para suporte em tarefas administrativas gerais, atendimento telefônico, organização de arquivos e digitação de documentos.",
        date: "Hoje"
    },
    {
        id: 2,
        title: "Estagiário de Comunicação e Marketing",
        company: "Agência Digital",
        type: "Estágio",
        location: "Rio de Janeiro, RJ",
        salary: "R$ 1.200,00",
        description: "Auxílio na criação de posts para redes sociais, redação de textos curtos e acompanhamento de métricas de campanhas.",
        date: "Ontem"
    },
    {
        id: 3,
        title: "Desenvolvedor Front-end Junior",
        company: "Tech Solutions",
        type: "Home Office",
        location: "Remoto",
        salary: "R$ 3.500,00",
        description: "Desenvolvimento e manutenção de interfaces web utilizando HTML, CSS, JavaScript e React. Trabalho 100% remoto.",
        date: "Há 2 dias"
    },
    {
        id: 4,
        title: "Entregador Autônomo / Bico",
        company: "Expresso Entregas",
        type: "Freelance",
        location: "Curitiba, PR",
        salary: "R$ 150,00 / dia",
        description: "Necessário ter moto ou bicicleta para entregas de pequenos pacotes na região central. Pagamento diário.",
        date: "Há 3 dias"
    }
];

let currentCategory = 'todos';

function getJobs() {
    const saved = localStorage.getItem('system_vagas_db');
    if (saved) {
        return JSON.parse(saved);
    } else {
        localStorage.setItem('system_vagas_db', JSON.stringify(initialJobs));
        return initialJobs;
    }
}

function saveJobs(jobs) {
    localStorage.setItem('system_vagas_db', JSON.stringify(jobs));
}

function renderJobs() {
    const jobs = getJobs();
    const jobList = document.getElementById('jobList');
    const noResults = document.getElementById('noResults');
    const searchVal = document.getElementById('searchInput').value.toLowerCase();
    const locationVal = document.getElementById('locationInput').value.toLowerCase();

    jobList.innerHTML = '';

    const filtered = jobs.filter(job => {
        const matchCategory = (currentCategory === 'todos' || job.type === currentCategory);
        const matchSearch = job.title.toLowerCase().includes(searchVal) || 
                            job.company.toLowerCase().includes(searchVal) ||
                            job.description.toLowerCase().includes(searchVal);
        const matchLocation = job.location.toLowerCase().includes(locationVal);

        return matchCategory && matchSearch && matchLocation;
    });

    document.getElementById('jobCount').innerText = filtered.length;

    if (filtered.length === 0) {
        noResults.classList.remove('hidden');
    } else {
        noResults.classList.add('hidden');
        filtered.forEach(job => {
            const card = document.createElement('div');
            card.className = "bg-white rounded-2xl p-6 border border-slate-200 hover:border-indigo-200 hover:shadow-lg transition-all flex flex-col justify-between";
            
            let typeBadgeClass = "bg-slate-100 text-slate-700";
            if (job.type === 'CLT') typeBadgeClass = "bg-blue-50 text-blue-700 border-blue-200";
            if (job.type === 'Estágio') typeBadgeClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
            if (job.type === 'Freelance') typeBadgeClass = "bg-amber-50 text-amber-700 border-amber-200";
            if (job.type === 'Home Office') typeBadgeClass = "bg-purple-50 text-purple-700 border-purple-200";

            card.innerHTML = `
                <div>
                    <div class="flex items-start justify-between gap-2 mb-3">
                        <span class="text-xs font-semibold px-2.5 py-1 rounded-md border ${typeBadgeClass}">
                            ${job.type}
                        </span>
                        <span class="text-xs text-slate-400">${job.date || 'Recente'}</span>
                    </div>
                    <h3 class="text-lg font-bold text-slate-900 mb-1 leading-snug">${job.title}</h3>
                    <p class="text-sm font-medium text-slate-600 mb-4">${job.company}</p>
                    
                    <p class="text-xs sm:text-sm text-slate-600 mb-6 line-clamp-3">${job.description}</p>
                </div>

                <div>
                    <div class="space-y-2 mb-4 pt-4 border-t border-slate-100">
                        <div class="flex items-center gap-2 text-xs text-slate-500">
                            <i data-lucide="map-pin" class="w-4 h-4 text-slate-400"></i>
                            <span>${job.location}</span>
                        </div>
                        <div class="flex items-center gap-2 text-xs text-slate-500">
                            <i data-lucide="dollar-sign" class="w-4 h-4 text-slate-400"></i>
                            <span>${job.salary || 'A combinar'}</span>
                        </div>
                    </div>

                    <button onclick="openApplyModal(${job.id})" class="w-full bg-slate-900 hover:bg-indigo-600 text-white text-sm font-medium py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2">
                        <span>Candidatar-se</span>
                        <i data-lucide="arrow-right" class="w-4 h-4"></i>
                    </button>
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
        if (btn.dataset.cat === cat) {
            btn.className = "cat-btn active bg-indigo-600 text-white font-medium px-4 py-2 rounded-full text-sm transition-colors";
        } else {
            btn.className = "cat-btn bg-white text-slate-600 hover:bg-slate-100 font-medium px-4 py-2 rounded-full text-sm border border-slate-200 transition-colors";
        }
    });
    renderJobs();
}

function applyFilters() {
    renderJobs();
}

function openModal(id) {
    document.getElementById(id).classList.remove('hidden');
}

function closeModal(id) {
    document.getElementById(id).classList.add('hidden');
}

function openApplyModal(jobId) {
    const jobs = getJobs();
    const job = jobs.find(j => j.id === jobId);
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
        date: "Hoje"
    };

    jobs.unshift(newJob);
    saveJobs(jobs);

    closeModal('modalPostJob');
    showToast("Vaga anunciada com sucesso!");
    e.target.reset();
    renderJobs();
}

function showToast(msg) {
    const toast = document.getElementById('toast');
    document.getElementById('toastMessage').innerText = msg;
    toast.classList.remove('opacity-0', 'pointer-events-none');
    setTimeout(() => {
        toast.classList.add('opacity-0', 'pointer-events-none');
    }, 3500);
}

document.getElementById('searchInput').addEventListener('input', renderJobs);
document.getElementById('locationInput').addEventListener('input', renderJobs);

document.addEventListener('DOMContentLoaded', () => {
    renderJobs();
});