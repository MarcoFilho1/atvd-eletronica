function calcularBJT(vbb, vcc, beta, rb, rc, approx, ri) {
    let vbe = 0;
    let rb_total = rb;

    if (approx === 1) {
        vbe = 0; 
    } else if (approx === 2) {
        vbe = 0.7; 
    } else if (approx === 3) {
        vbe = 0.7;
        rb_total = rb + ri; 
    }

    let ib = (vbb - vbe) / rb_total;
    
    if (ib <= 0) {
        return {
            regiao: 'Corte',
            motivo: 'A tensão na base não é suficiente para polarizar a junção (IB ≤ 0). O transistor atua como uma chave aberta.',
            ib: 0, ic: 0, vce: vcc, potencia: 0
        };
    }

    let ic = beta * ib;
    let vce = vcc - (ic * rc);
    let regiao = 'Ativa';
    let motivo = 'A corrente IC é controlada pelo ganho (β × IB) e a tensão VCE é maior que 0.2V. O transistor atua como amplificador.';

    if (vce <= 0.2) {
        regiao = 'Saturação';
        motivo = 'A corrente IC atingiu o limite máximo imposto pelo circuito (VCC e RC). O transistor atua como uma chave fechada (VCE ≈ 0.2V).';
        vce = 0.2; 
        ic = (vcc - vce) / rc; 
    }
    
    let potencia = vce * ic;

    return {
        regiao: regiao, motivo: motivo, ib: ib, ic: ic, vce: vce, potencia: potencia
    };
}