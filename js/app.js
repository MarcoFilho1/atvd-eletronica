function formatValue(value, unit) {
    if (value === 0) return `0 ${unit}`;
    
    const absValue = Math.abs(value);

    if (absValue < 1e-27) {
        return `${(value * 1e30).toFixed(2)} q${unit} (q - quecto)`;
    } else if (absValue < 1e-24) {
        return `${(value * 1e27).toFixed(2)} r${unit} (r - ronto)`;
    } else if (absValue < 1e-21) {
        return `${(value * 1e24).toFixed(2)} y${unit} (y - yocto)`;
    } else if (absValue < 1e-18) {
        return `${(value * 1e21).toFixed(2)} z${unit} (z - zepto)`;
    } else if (absValue < 1e-15) {
        return `${(value * 1e18).toFixed(2)} a${unit} (a - atto)`;
    } else if (absValue < 1e-12) {
        return `${(value * 1e15).toFixed(2)} f${unit} (f - femto)`;
    } else if (absValue < 1e-9) {
        return `${(value * 1e12).toFixed(2)} p${unit} (p - pico)`;
    } else if (absValue < 1e-6) {
        return `${(value * 1e9).toFixed(2)} n${unit} (n - nano)`;
    } else if (absValue < 1e-3) {
        return `${(value * 1e6).toFixed(2)} μ${unit} (μ - micro)`;
    } else if (absValue < 1) {
        return `${(value * 1e3).toFixed(2)} m${unit} (m - mili)`;
    } 
    else if (absValue < 1e3) {
        return `${value.toFixed(2)} ${unit}`;
    } 
    else if (absValue < 1e6) {
        return `${(value / 1e3).toFixed(2)} k${unit} (k - quilo)`;
    } else if (absValue < 1e9) {
        return `${(value / 1e6).toFixed(2)} M${unit} (M - mega)`;
    } else if (absValue < 1e12) {
        return `${(value / 1e9).toFixed(2)} G${unit} (G - giga)`;
    } else if (absValue < 1e15) {
        return `${(value / 1e12).toFixed(2)} T${unit} (T - tera)`;
    } else if (absValue < 1e18) {
        return `${(value / 1e15).toFixed(2)} P${unit} (P - peta)`;
    } else if (absValue < 1e21) {
        return `${(value / 1e18).toFixed(2)} E${unit} (E - exa)`;
    } else if (absValue < 1e24) {
        return `${(value / 1e21).toFixed(2)} Z${unit} (Z - zetta)`;
    } else if (absValue < 1e27) {
        return `${(value / 1e24).toFixed(2)} Y${unit} (Y - yotta)`;
    } else if (absValue < 1e30) {
        return `${(value / 1e27).toFixed(2)} R${unit} (R - ronna)`;
    } else {
        return `${(value / 1e30).toFixed(2)} Q${unit} (Q - quetta)`;
    }
}

const form = document.getElementById('bjtForm');

let aproximacaoSelecionada = 2; 
const botoesApprox = document.querySelectorAll('.btn-approx');
const grupoRi = document.getElementById('grupoRi');

botoesApprox.forEach(botao => {
    botao.addEventListener('click', function() {
        botoesApprox.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        aproximacaoSelecionada = parseInt(this.getAttribute('data-approx'));

        if (aproximacaoSelecionada === 3) {
            grupoRi.classList.remove('hidden');
        } else {
            grupoRi.classList.add('hidden');
        }
    });
});

const togglesPolaridade = document.querySelectorAll('.polarity-toggle');

togglesPolaridade.forEach(img => {
    img.addEventListener('click', function() {
        this.classList.toggle('inverted');
        
        if (this.getAttribute('data-polarity') === "1") {
            this.setAttribute('data-polarity', "-1");
        } else {
            this.setAttribute('data-polarity', "1");
        }
    });
});

form.addEventListener('submit', function(event) {
    event.preventDefault(); 

    const vbbRaw = parseFloat(document.getElementById('vbb').value);
    const vbbPol = parseFloat(document.getElementById('img-vbb-pol').getAttribute('data-polarity'));
    const vbb = vbbRaw * vbbPol;
    const vccRaw = parseFloat(document.getElementById('vcc').value);
    const vccPol = parseFloat(document.getElementById('img-vcc-pol').getAttribute('data-polarity'));
    const vcc = vccRaw * vccPol;
    const rb = parseFloat(document.getElementById('rb').value);
    const rc = parseFloat(document.getElementById('rc').value);
    const betaInput = document.getElementById('beta').value;
    const beta = betaInput === "" ? 100 : parseFloat(betaInput);



    if (isNaN(vbb) || isNaN(vcc) || isNaN(rb) || isNaN(rc) || isNaN(beta)) {
        alert("Por favor, preencha todos os campos obrigatórios com números válidos.");
        return;
    }

    // Captura o ri apenas se a aproximação 3 estiver selecionada
    let ri = 0;
    if (aproximacaoSelecionada === 3) {
        const riInput = parseFloat(document.getElementById('ri').value);
        if (isNaN(riInput)) {
            alert("Para a 3ª aproximação, informe a Resistência Interna.");
            return;
        }
        ri = riInput;
    }

    const resultado = calcularBJT(vbb, vcc, beta, rb, rc, aproximacaoSelecionada, ri);

    document.getElementById('ibTexto').innerText = formatValue(resultado.ib, 'A');
    document.getElementById('icTexto').innerText = formatValue(resultado.ic, 'A');
    document.getElementById('vceTexto').innerText = formatValue(resultado.vce, 'V');
    document.getElementById('potTexto').innerText = formatValue(resultado.potencia, 'W');

    const badge = document.getElementById('regiaoBadge');
    badge.innerText = `Região: ${resultado.regiao}`;
    document.getElementById('regiaoMotivo').innerText = resultado.motivo;
    
    badge.style.backgroundColor = ''; 
    if (resultado.regiao === 'Ativa') {
        badge.style.backgroundColor = 'var(--status-ativa)';
    } else if (resultado.regiao === 'Saturação') {
        badge.style.backgroundColor = 'var(--status-saturacao)';
    } else {
        badge.style.backgroundColor = 'var(--status-corte)';
    }

    document.getElementById('resultadoBox').classList.remove('hidden');
});