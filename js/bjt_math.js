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
            ib: 0, ic: 0, vce: vcc, potencia: 0, teorico: false
        };
    }

    // faz o calculo teorico assumindo regiao ativa
    let ic_teorico = beta * ib;
    let vce_teorico = vcc - (ic_teorico * rc);

    // verifica se o calculo gerou uma impossibilidade fisica (transistor com tensão negativa)
    if (vce_teorico <= 0.2) {
        // Recalculamos para a realidade física
        let vce_real = 0.2; 
        let ic_real = (vcc - vce_real) / rc; 
        let potencia_real = vce_real * ic_real;
        let beta_sat = ic_real / ib;

        return {
            regiao: 'Saturação',
            motivo: 'A corrente IC atingiu o limite imposto pela malha do coletor. O transistor atua como uma chave fechada (VCE ≈ 0.2V).',
            ib: ib, 
            ic: ic_real, 
            vce: vce_real, 
            potencia: potencia_real,
            teorico: true,
            ic_teorico: ic_teorico,
            vce_teorico: vce_teorico,
            beta_real: beta_sat
        };
    }
    
    let potencia = vce_teorico * ic_teorico;
    return {
        regiao: 'Ativa', 
        motivo: 'A corrente IC é controlada pelo ganho (β × IB) e a tensão VCE é maior que 0.2V. O transistor atua como amplificador.', 
        ib: ib, 
        ic: ic_teorico, 
        vce: vce_teorico, 
        potencia: potencia, 
        teorico: false,
        beta_real: beta
    };
}