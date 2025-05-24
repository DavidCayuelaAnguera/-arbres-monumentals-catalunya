// Variables globals
let arbresData = {};
let votacionsData = {};
let currentProvince = '';
let currentComarca = '';

// Inicialització de l'aplicació
document.addEventListener('DOMContentLoaded', function() {
    loadData();
});

// Carrega les dades des dels fitxers JSON
async function loadData() {
    try {
        // Carregar dades dels arbres
        const arbresResponse = await fetch('data/arbres_data.json');
        arbresData = await arbresResponse.json();
        
        // Carregar dades de votacions
        const votacionsResponse = await fetch('data/votacions.json');
        votacionsData = await votacionsResponse.json();
        
        console.log('Dades carregades correctament');
        console.log('Províncies:', Object.keys(arbresData));
        
    } catch (error) {
        console.error('Error carregant dades:', error);
        showError('Error carregant les dades. Verifica que els fitxers JSON existeixin.');
    }
}

// Mostra una pàgina específica
function showPage(pageId) {
    // Amagar totes les pàgines
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Mostrar la pàgina seleccionada
    const targetPage = document.getElementById(pageId + '-page');
    if (targetPage) {
        targetPage.classList.add('active');
        
        // Carregar contingut específic segons la pàgina
        if (pageId === 'voting') {
            loadVotingPage();
        }
    }
}

// Mostra les comarques d'una província
function showProvinceComarcas(province) {
    currentProvince = province;
    
    const comarcaList = document.getElementById('comarca-list');
    const provinceTitle = document.getElementById('comarca-province-title');
    
    provinceTitle.textContent = `Comarques de ${province}`;
    comarcaList.innerHTML = '';
    
    if (arbresData[province]) {
        const comarques = Object.keys(arbresData[province]);
        
        comarques.forEach(comarca => {
            const arbresCount = arbresData[province][comarca].length;
            
            const comarcaCard = document.createElement('div');
            comarcaCard.className = 'comarca-card';
            comarcaCard.onclick = () => showComarcaArbres(comarca);
            
            comarcaCard.innerHTML = `
                <h3>${comarca}</h3>
                <p>${arbresCount} ${arbresCount === 1 ? 'arbre monumental' : 'arbres monumentals'}</p>
                <div class="card-arrow">
                    <i class="fas fa-arrow-right"></i>
                </div>
            `;
            
            comarcaList.appendChild(comarcaCard);
        });
    }
    
    showPage('comarcas');
}

// Mostra els arbres d'una comarca
function showComarcaArbres(comarca) {
    currentComarca = comarca;
    
    const treesList = document.getElementById('trees-list');
    const comarcaTitle = document.getElementById('trees-comarca-title');
    
    comarcaTitle.textContent = `Arbres de ${comarca}`;
    treesList.innerHTML = '';
    
    if (arbresData[currentProvince] && arbresData[currentProvince][comarca]) {
        const arbres = arbresData[currentProvince][comarca];
        
        arbres.forEach((arbre, index) => {
            const treeCard = document.createElement('div');
            treeCard.className = 'tree-card';
            treeCard.onclick = () => showTreeDetail(arbre, index);
            
            treeCard.innerHTML = `
                <h3>${arbre['Nom de l\'arbre']}</h3>
                <div class="tree-info">
                    <p><strong>Matrícula:</strong> ${arbre['Matrícula']}</p>
                    <p><strong>Tàxon:</strong> ${arbre['Tàxon']}</p>
                    <p><strong>Terme municipal:</strong> ${arbre['Terme municipal']}</p>
                    <p><strong>Tipologia:</strong> ${arbre['Tipologia']}</p>
                </div>
            `;
            
            treesList.appendChild(treeCard);
        });
    }
    
    showPage('trees');
}

// Mostra el detall d'un arbre
function showTreeDetail(arbre, index) {
    const detailTitle = document.getElementById('tree-detail-title');
    const detailInfo = document.getElementById('tree-detail-info');
    
    detailTitle.textContent = arbre['Nom de l\'arbre'];
    
    // Carregar observacions existents des de localStorage (simulat)
    const observacionsCau = `observacions_${arbre['Matrícula']}`;
    const observacionsExistents = JSON.parse(localStorage.getItem(observacionsCau) || '[]');
    
    detailInfo.innerHTML = `
        <div class="tree-detail-card">
            <h2>${arbre['Nom de l\'arbre']}</h2>
            
            <div class="tree-info-grid">
                <div class="tree-info-item">
                    <strong>Matrícula:</strong>
                    ${arbre['Matrícula']}
                </div>
                <div class="tree-info-item">
                    <strong>Tàxon:</strong>
                    ${arbre['Tàxon']}
                </div>
                <div class="tree-info-item">
                    <strong>Tipologia:</strong>
                    ${arbre['Tipologia']}
                </div>
                <div class="tree-info-item">
                    <strong>Solitari o Arbreda:</strong>
                    ${arbre['Solitari o Arbreda']}
                </div>
                <div class="tree-info-item">
                    <strong>Terme municipal:</strong>
                    ${arbre['Terme municipal']}
                </div>
                <div class="tree-info-item">
                    <strong>Comarca:</strong>
                    ${arbre['Comarca']}
                </div>
                <div class="tree-info-item">
                    <strong>Propietat:</strong>
                    ${arbre['Propietat']}
                </div>
                <div class="tree-info-item">
                    <strong>Informació Etnoecològica:</strong>
                    ${arbre['Informació Etnoecològica']}
                </div>
                <div class="tree-info-item">
                    <strong>Bibliografia:</strong>
                    ${arbre['Bibliografia']}
                </div>
                <div class="tree-info-item">
                    <strong>Classificació Etnoecològica:</strong>
                    ${arbre['Classificació Etnoecològica']}
                </div>
            </div>
            
            <div class="observations-section">
                <h3><i class="fas fa-comments"></i> Observacions</h3>
                
                <div class="observation-form">
                    <textarea 
                        id="new-observation-${arbre['Matrícula']}" 
                        placeholder="Comparteix les teves observacions sobre aquest arbre monumental..."
                    ></textarea>
                    <button 
                        class="submit-observation" 
                        onclick="addObservation('${arbre['Matrícula']}')"
                    >
                        <i class="fas fa-plus"></i> Afegir Observació
                    </button>
                </div>
                
                <div class="existing-observations" id="observations-${arbre['Matrícula']}">
                    ${renderObservations(observacionsExistents)}
                </div>
            </div>
        </div>
    `;
    
    showPage('tree-detail');
}

// Renderitza les observacions existents
function renderObservations(observacions) {
    if (observacions.length === 0) {
        return '<p style="color: #666; font-style: italic;">Encara no hi ha observacions per aquest arbre.</p>';
    }
    
    return observacions.map(obs => `
        <div class="observation-item">
            <div class="observation-date">${obs.data}</div>
            <div class="observation-text">${obs.text}</div>
        </div>
    `).join('');
}

// Afegeix una nova observació
function addObservation(matricula) {
    const textarea = document.getElementById(`new-observation-${matricula}`);
    const observationText = textarea.value.trim();
    
    if (observationText === '') {
        alert('Si us plau, escriu una observació abans d\'enviar.');
        return;
    }
    
    // Crear nova observació
    const novaObservacio = {
        text: observationText,
        data: new Date().toLocaleDateString('ca-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    };
    
    // Carregar observacions existents
    const observacionsCau = `observacions_${matricula}`;
    const observacionsExistents = JSON.parse(localStorage.getItem(observacionsCau) || '[]');
    
    // Afegir nova observació
    observacionsExistents.unshift(novaObservacio);
    
    // Guardar
    localStorage.setItem(observacionsCau, JSON.stringify(observacionsExistents));
    
    // Actualitzar visualització
    const observationsContainer = document.getElementById(`observations-${matricula}`);
    observationsContainer.innerHTML = renderObservations(observacionsExistents);
    
    // Netejar textarea
    textarea.value = '';
    
    // Mostrar confirmació
    showNotification('Observació afegida correctament!');
}

// Carrega la pàgina de votacions
function loadVotingPage() {
    const votingList = document.getElementById('voting-list');
    votingList.innerHTML = '';
    
    // Convertir objecte de votacions a array i ordenar per vots
    const votingArray = Object.entries(votacionsData)
        .map(([matricula, data]) => ({
            matricula,
            ...data
        }))
        .sort((a, b) => b.vots - a.vots);
    
    votingArray.forEach(arbre => {
        const votingCard = document.createElement('div');
        votingCard.className = 'voting-card';
        
        votingCard.innerHTML = `
            <h4>${arbre.nom}</h4>
            <div class="comarca-info">
                <i class="fas fa-map-marker-alt"></i> ${arbre.comarca}
            </div>
            <div class="vote-section">
                <div class="vote-count">
                    <i class="fas fa-heart"></i> ${arbre.vots} ${arbre.vots === 1 ? 'vot' : 'vots'}
                </div>
                <button class="vote-button" onclick="voteForTree('${arbre.matricula}')">
                    <i class="fas fa-thumbs-up"></i> Votar
                </button>
            </div>
        `;
        
        votingList.appendChild(votingCard);
    });
}

// Vota per un arbre
function voteForTree(matricula) {
    if (votacionsData[matricula]) {
        votacionsData[matricula].vots++;
        
        // Guardar al localStorage (simulant persistència)
        localStorage.setItem('votacions_data', JSON.stringify(votacionsData));
        
        // Recarregar la pàgina de votacions
        loadVotingPage();
        
        showNotification(`Has votat per ${votacionsData[matricula].nom}!`);
    }
}

// Funcions de navegació amb context
function goBackToComarcas() {
    showProvinceComarcas(currentProvince);
}

function goBackToTrees() {
    showComarcaArbres(currentComarca);
}

// Mostra notificacions
function showNotification(message) {
    // Crear element de notificació
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--uab-lighter-green);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        font-weight: 600;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Eliminar després de 3 segons
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Mostra errors
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #f44336;
        color: white;
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 8px 25px rgba(0,0,0,0.3);
        z-index: 1000;
        max-width: 400px;
        text-align: center;
    `;
    errorDiv.innerHTML = `
        <h3>Error</h3>
        <p>${message}</p>
        <button onclick="this.parentElement.remove()" style="
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 6px;
            margin-top: 1rem;
            cursor: pointer;
        ">Tancar</button>
    `;
    
    document.body.appendChild(errorDiv);
}

// Carregar votacions del localStorage si existeixen
document.addEventListener('DOMContentLoaded', function() {
    const savedVotacions = localStorage.getItem('votacions_data');
    if (savedVotacions) {
        votacionsData = JSON.parse(savedVotacions);
    }
});

// Funcions d'utilitat per debugging
function debugInfo() {
    console.log('Estat actual:');
    console.log('- Província actual:', currentProvince);
    console.log('- Comarca actual:', currentComarca);
    console.log('- Dades d\'arbres:', arbresData);
    console.log('- Dades de votacions:', votacionsData);
}

// Exposar funcions globals per poder-les usar des de la consola
window.debugInfo = debugInfo;
window.showPage = showPage;
window.showProvinceComarcas = showProvinceComarcas;