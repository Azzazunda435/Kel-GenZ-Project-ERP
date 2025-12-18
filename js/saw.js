// SAW (Simple Additive Weighting) Calculator
let sawCriteria = [];
let sawAlternatives = [];

// Initialize with example data
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('saw-criteria')) {
        sawCriteria = [
            { id: generateId(), name: 'Harga', weight: 30, type: 'cost' },
            { id: generateId(), name: 'Kualitas', weight: 25, type: 'benefit' },
            { id: generateId(), name: 'Delivery Time', weight: 20, type: 'cost' },
            { id: generateId(), name: 'Garansi', weight: 15, type: 'benefit' },
            { id: generateId(), name: 'Reputasi', weight: 10, type: 'benefit' }
        ];
        
        sawAlternatives = [
            { 
                id: generateId(), 
                name: 'Supplier A',
                values: [5000000, 85, 7, 24, 8]
            },
            { 
                id: generateId(), 
                name: 'Supplier B',
                values: [4500000, 90, 5, 12, 9]
            },
            { 
                id: generateId(), 
                name: 'Supplier C',
                values: [6000000, 80, 10, 36, 7]
            },
            { 
                id: generateId(), 
                name: 'Supplier D',
                values: [5500000, 88, 6, 18, 8]
            }
        ];
        
        renderSAWCriteria();
        renderSAWAlternatives();
    }
});

function renderSAWCriteria() {
    const container = document.getElementById('saw-criteria');
    container.innerHTML = '';
    
    sawCriteria.forEach((criterion, index) => {
        const criterionDiv = document.createElement('div');
        criterionDiv.className = 'input-row';
        criterionDiv.style.marginBottom = '1rem';
        criterionDiv.innerHTML = `
            <div class="input-group">
                <label>Nama Kriteria:</label>
                <input type="text" value="${criterion.name}" 
                    onchange="updateCriterionName(${index}, this.value)"
                    placeholder="Kriteria ${index + 1}">
            </div>
            <div class="input-group">
                <label>Bobot (%):</label>
                <input type="number" value="${criterion.weight}" min="0" max="100"
                    onchange="updateCriterionWeight(${index}, this.value)">
            </div>
            <div class="input-group">
                <label>Tipe:</label>
                <select onchange="updateCriterionType(${index}, this.value)">
                    <option value="benefit" ${criterion.type === 'benefit' ? 'selected' : ''}>Benefit (Lebih tinggi lebih baik)</option>
                    <option value="cost" ${criterion.type === 'cost' ? 'selected' : ''}>Cost (Lebih rendah lebih baik)</option>
                </select>
            </div>
            <div class="input-group" style="display: flex; align-items: flex-end;">
                <button class="btn btn-danger btn-small" onclick="removeSAWCriterion(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        container.appendChild(criterionDiv);
    });
}

function renderSAWAlternatives() {
    const container = document.getElementById('saw-alternatives');
    container.innerHTML = '';
    
    sawAlternatives.forEach((alt, index) => {
        const altDiv = document.createElement('div');
        altDiv.className = 'component-card';
        altDiv.innerHTML = `
            <div class="component-header">
                <input type="text" class="component-title" value="${alt.name}" 
                    onchange="updateAlternativeName(${index}, this.value)" 
                    placeholder="Alternatif ${index + 1}">
                <button class="btn btn-danger btn-small" onclick="removeSAWAlternative(${index})">
                    <i class="fas fa-trash"></i> Hapus
                </button>
            </div>
            <div class="input-row">
                ${sawCriteria.map((criterion, critIndex) => `
                    <div class="input-group">
                        <label>${criterion.name}:</label>
                        <input type="number" value="${alt.values[critIndex] || 0}" min="0"
                            onchange="updateAlternativeValue(${index}, ${critIndex}, this.value)">
                    </div>
                `).join('')}
            </div>
        `;
        container.appendChild(altDiv);
    });
}

function addSAWCriterion() {
    sawCriteria.push({
        id: generateId(),
        name: `Kriteria ${sawCriteria.length + 1}`,
        weight: 0,
        type: 'benefit'
    });
    
    // Add empty value for this criterion to all alternatives
    sawAlternatives.forEach(alt => {
        alt.values.push(0);
    });
    
    renderSAWCriteria();
    renderSAWAlternatives();
}

function removeSAWCriterion(index) {
    if (sawCriteria.length <= 2) {
        showAlert('Minimal harus ada 2 kriteria!', 'warning');
        return;
    }
    sawCriteria.splice(index, 1);
    
    // Remove corresponding values from all alternatives
    sawAlternatives.forEach(alt => {
        alt.values.splice(index, 1);
    });
    
    renderSAWCriteria();
    renderSAWAlternatives();
}

function addSAWAlternative() {
    sawAlternatives.push({
        id: generateId(),
        name: `Alternatif ${sawAlternatives.length + 1}`,
        values: sawCriteria.map(() => 0)
    });
    renderSAWAlternatives();
}

function removeSAWAlternative(index) {
    if (sawAlternatives.length <= 2) {
        showAlert('Minimal harus ada 2 alternatif!', 'warning');
        return;
    }
    sawAlternatives.splice(index, 1);
    renderSAWAlternatives();
}

function updateCriterionName(index, value) {
    sawCriteria[index].name = value || `Kriteria ${index + 1}`;
    renderSAWAlternatives();
}

function updateCriterionWeight(index, value) {
    sawCriteria[index].weight = parseFloat(value) || 0;
}

function updateCriterionType(index, value) {
    sawCriteria[index].type = value;
}

function updateAlternativeName(index, value) {
    sawAlternatives[index].name = value || `Alternatif ${index + 1}`;
}

function updateAlternativeValue(altIndex, critIndex, value) {
    sawAlternatives[altIndex].values[critIndex] = parseFloat(value) || 0;
}

function calculateSAW() {
    if (sawCriteria.length < 2) {
        showAlert('Minimal harus ada 2 kriteria!', 'warning');
        return;
    }
    
    if (sawAlternatives.length < 2) {
        showAlert('Minimal harus ada 2 alternatif!', 'warning');
        return;
    }
    
    // Check if weights sum to 100
    const totalWeight = sawCriteria.reduce((sum, c) => sum + c.weight, 0);
    if (Math.abs(totalWeight - 100) > 0.01) {
        showAlert(`Total bobot harus 100%! Saat ini: ${totalWeight}%`, 'warning');
        return;
    }
    
    let resultHTML = '';
    
    // Step 1: Show input data
    resultHTML += `
        <div class="step-box">
            <h4>2. Data Kriteria dan Bobot</h4>
            <table class="calculation-table">
                <thead>
                    <tr>
                        <th>Kriteria</th>
                        <th>Bobot (%)</th>
                        <th>Bobot (Desimal)</th>
                        <th>Tipe</th>
                    </tr>
                </thead>
                <tbody>
                    ${sawCriteria.map(criterion => `
                        <tr>
                            <td><strong>${criterion.name}</strong></td>
                            <td>${criterion.weight}%</td>
                            <td>${formatNumber(criterion.weight / 100, 2)}</td>
                            <td><span class="badge ${criterion.type === 'benefit' ? 'badge-success' : 'badge-warning'}">${criterion.type === 'benefit' ? 'Benefit' : 'Cost'}</span></td>
                        </tr>
                    `).join('')}
                    <tr class="highlight-row">
                        <td><strong>Total</strong></td>
                        <td><strong>${totalWeight}%</strong></td>
                        <td><strong>${formatNumber(totalWeight / 100, 2)}</strong></td>
                        <td>-</td>
                    </tr>
                </tbody>
            </table>
            
            <h5 style="margin-top: 1.5rem; color: var(--primary-color); margin-bottom: 1rem;">Data Nilai Alternatif:</h5>
            <table class="calculation-table">
                <thead>
                    <tr>
                        <th>Alternatif</th>
                        ${sawCriteria.map(c => `<th>${c.name}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${sawAlternatives.map(alt => `
                        <tr>
                            <td><strong>${alt.name}</strong></td>
                            ${alt.values.map(v => `<td>${formatNumber(v, 2)}</td>`).join('')}
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
    
    // Step 2: Normalization
    resultHTML += `
        <div class="step-box">
            <h4>3. Normalisasi Matriks Keputusan</h4>
            <p style="margin-bottom: 1rem;"><strong>Rumus Normalisasi:</strong></p>
            <div style="background: white; padding: 1rem; border-radius: 6px; margin-bottom: 1rem;">
                <p><strong>Benefit (lebih tinggi lebih baik):</strong> rij = xij / max(xij)</p>
                <p><strong>Cost (lebih rendah lebih baik):</strong> rij = min(xij) / xij</p>
            </div>
    `;
    
    // Calculate min and max for each criterion
    let normalized = [];
    let normalizationSteps = [];
    
    sawCriteria.forEach((criterion, critIndex) => {
        const values = sawAlternatives.map(alt => alt.values[critIndex]);
        const maxValue = Math.max(...values);
        const minValue = Math.min(...values);
        
        normalizationSteps.push({
            criterion: criterion.name,
            type: criterion.type,
            max: maxValue,
            min: minValue
        });
        
        sawAlternatives.forEach((alt, altIndex) => {
            if (!normalized[altIndex]) normalized[altIndex] = [];
            
            if (criterion.type === 'benefit') {
                normalized[altIndex][critIndex] = alt.values[critIndex] / maxValue;
            } else {
                normalized[altIndex][critIndex] = minValue / alt.values[critIndex];
            }
        });
    });
    
    // Show normalization steps
    normalizationSteps.forEach((step, idx) => {
        resultHTML += `
            <div style="background: white; padding: 1rem; border-radius: 6px; margin-bottom: 0.75rem; border-left: 4px solid ${step.type === 'benefit' ? '#10b981' : '#f59e0b'};">
                <p style="font-weight: 600; color: ${step.type === 'benefit' ? '#10b981' : '#f59e0b'};">
                    ${step.criterion} (${step.type === 'benefit' ? 'Benefit' : 'Cost'}):
                </p>
                <p>• ${step.type === 'benefit' ? 'Nilai Maksimum' : 'Nilai Minimum'}: <strong>${formatNumber(step.type === 'benefit' ? step.max : step.min, 2)}</strong></p>
                <p>• Rumus: rij = ${step.type === 'benefit' ? `xij / ${formatNumber(step.max, 2)}` : `${formatNumber(step.min, 2)} / xij`}</p>
            </div>
        `;
    });
    
    resultHTML += `
            <h5 style="margin-top: 1.5rem; color: var(--secondary-color); margin-bottom: 1rem;">Hasil Normalisasi:</h5>
            <table class="calculation-table">
                <thead>
                    <tr>
                        <th>Alternatif</th>
                        ${sawCriteria.map(c => `<th>${c.name}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${sawAlternatives.map((alt, altIndex) => `
                        <tr>
                            <td><strong>${alt.name}</strong></td>
                            ${normalized[altIndex].map(v => `<td>${formatNumber(v, 4)}</td>`).join('')}
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
    
    // Step 3: Calculate preference scores
    resultHTML += `
        <div class="step-box">
            <h4>4. Perhitungan Skor Preferensi</h4>
            <p style="margin-bottom: 1rem;"><strong>Rumus:</strong></p>
            <div style="background: white; padding: 1rem; border-radius: 6px; margin-bottom: 1rem; font-family: 'Courier New', monospace;">
                Vi = Σ (wj × rij)
            </div>
            <p style="margin-bottom: 1.5rem;">Dimana wj adalah bobot kriteria dan rij adalah nilai normalisasi.</p>
    `;
    
    let scores = [];
    sawAlternatives.forEach((alt, altIndex) => {
        let score = 0;
        let calculation = [];
        
        sawCriteria.forEach((criterion, critIndex) => {
            const weight = criterion.weight / 100;
            const normalizedValue = normalized[altIndex][critIndex];
            const contribution = weight * normalizedValue;
            score += contribution;
            
            calculation.push({
                criterion: criterion.name,
                weight: weight,
                normalized: normalizedValue,
                contribution: contribution
            });
        });
        
        scores.push({
            name: alt.name,
            score: score,
            calculation: calculation
        });
    });
    
    // Show detailed calculations
    scores.forEach((item, idx) => {
        resultHTML += `
            <div style="background: white; padding: 1rem; border-radius: 6px; margin-bottom: 1rem; border: 2px solid var(--border-color);">
                <p style="font-weight: 600; color: var(--primary-color); margin-bottom: 0.75rem;">${item.name}:</p>
                ${item.calculation.map(calc => `
                    <p>• ${calc.criterion}: ${formatNumber(calc.weight, 2)} × ${formatNumber(calc.normalized, 4)} = ${formatNumber(calc.contribution, 4)}</p>
                `).join('')}
                <p style="margin-top: 0.75rem; padding-top: 0.75rem; border-top: 2px solid var(--border-color);">
                    <strong>Vi = ${item.calculation.map(c => formatNumber(c.contribution, 4)).join(' + ')}</strong>
                </p>
                <p style="font-size: 1.2rem; color: var(--success-color);">
                    <strong>Vi = ${formatNumber(item.score, 4)}</strong>
                </p>
            </div>
        `;
    });
    
    resultHTML += `</div>`;
    
    // Step 4: Ranking
    scores.sort((a, b) => b.score - a.score);
    
    resultHTML += `
        <div class="step-box">
            <h4>5. Perangkingan Alternatif</h4>
            <table class="calculation-table">
                <thead>
                    <tr>
                        <th>Ranking</th>
                        <th>Alternatif</th>
                        <th>Skor Preferensi (Vi)</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${scores.map((item, index) => `
                        <tr ${index === 0 ? 'class="highlight-row"' : ''}>
                            <td><strong>${index + 1}</strong></td>
                            <td><strong>${item.name}</strong></td>
                            <td><strong>${formatNumber(item.score, 4)}</strong></td>
                            <td>
                                ${index === 0 ? '<span class="badge badge-success">Terbaik</span>' : 
                                  index === scores.length - 1 ? '<span class="badge badge-warning">Terakhir</span>' : 
                                  '<span class="badge badge-info">Peringkat ' + (index + 1) + '</span>'}
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
    
    // Summary
    resultHTML += `
        <div class="summary-box">
            <h4><i class="fas fa-check-circle"></i> 6. Kesimpulan</h4>
            <div class="summary-item">
                <span>Alternatif Terbaik:</span>
                <span class="summary-value">${scores[0].name}</span>
            </div>
            <div class="summary-item">
                <span>Skor Tertinggi:</span>
                <span class="summary-value">${formatNumber(scores[0].score, 4)}</span>
            </div>
            <div class="summary-item">
                <span>Urutan Peringkat:</span>
                <span class="summary-value">${scores.map((s, i) => `${i + 1}. ${s.name}`).join(' → ')}</span>
            </div>
            <p style="margin-top: 1rem; padding: 1rem; background: #dbeafe; border-radius: 6px; font-style: italic; color: #1e40af;">
                <i class="fas fa-info-circle"></i> 
                Metode SAW memberikan peringkat berdasarkan skor preferensi yang dihitung dari normalisasi nilai 
                dan pembobotan kriteria. Alternatif dengan skor tertinggi adalah pilihan terbaik.
            </p>
        </div>
    `;
    
    document.getElementById('saw-calculation-steps').innerHTML = resultHTML;
    document.getElementById('saw-result').style.display = 'block';
    
    document.getElementById('saw-result').scrollIntoView({ behavior: 'smooth' });
    showAlert('Perhitungan SAW berhasil!', 'success');
}
