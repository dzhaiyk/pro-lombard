let currentLang = 'ru';
let texts = {};
let rates = {};

// Загрузка текстов и расценок
async function loadData() {
    texts.ru = await fetch('data/ru.json').then(res => res.json());
    texts.kz = await fetch('data/kz.json').then(res => res.json());
    rates = await fetch('data/rates.json').then(res => res.json());
    switchLang(currentLang);
}

function switchLang(lang) {
    currentLang = lang;
    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.getAttribute('data-key');
        el.innerHTML = texts[lang][key] || texts['ru'][key]; // Fallback to RU
    });
    // Обновить список филиалов
    const branchesList = document.getElementById('branches-list');
    branchesList.innerHTML = '';
    texts[lang].branches.forEach(branch => {
        const li = document.createElement('li');
        li.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${branch.address} (${branch.hours}) <a href="${branch.gis_link}">2GIS</a>`;
        branchesList.appendChild(li);
    });
    // Обновить документы
    const docsList = document.getElementById('documents');
    docsList.innerHTML = '';
    texts[lang].documents.forEach(doc => {
        const li = document.createElement('li');
        li.innerHTML = `<a href="/uploads/${doc.file}">${doc.name}</a>`;
        docsList.appendChild(li);
    });
}

function calculateLoan() {
    const proba = document.getElementById('proba').value;
    const weight = parseFloat(document.getElementById('weight').value);
    const days = parseInt(document.getElementById('days').value);
    if (isNaN(weight) || isNaN(days)) {
        document.getElementById('result').innerText = texts[currentLang].error || 'Ошибка ввода.';
        return;
    }
    const rate = rates[proba] || 0;
    const percent = rates.percent || 0.3;
    const summa = rate * weight;
    const komissiya = summa * (percent / 100) * days;
    const vozvrat = summa + komissiya;
    document.getElementById('result').innerText = `${texts[currentLang].loan_sum || 'Сумма займа'}: ${summa} тг. ${texts[currentLang].return_sum || 'К возврату'}: ${vozvrat} тг.`;
}

window.onload = loadData;