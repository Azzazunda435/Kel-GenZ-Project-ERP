// Profile Matching Calculator
let pmAspects = [];
let pmCandidates = [];

// Gap weight mapping
const gapWeightMap = {
    0: 5,
    1: 4.5,
    '-1': 4,
    2: 3.5,
    '-2': 3,
    3: 2.5,
    '-3': 2
};

function getGapWeight(gap) {
    if (gap >= 4 || gap <= -4) return 1;
    return gapWeightMap[gap.toString()] || 1;
}

// Initialize with example data
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('pm-aspects')) {
        pmAspects = [
            { id: generateId(), name: 'Pengalaman Kerja', target: 5, type: 'core' },
            { id: generateId(), name: 'Kemampuan Teknis', target: 4, type: 'core' },
            { id: generateId(), name: 'Kepemimpinan', target: 4, type: 'secondary' },
            { id: generateId(), name: 'Komunikasi', target: 5, type: 'secondary' },
            { id: generateId(), name: 'Inisiatif', target: 3, type: 'secondary' }
        ];
        
        pmCandidates = [
            { 
                id: generateId(), 
                name: 'Kandidat A',
                values: [5, 4, 3, 5, 4]
            },
            { 
                id: generateId(), 
                name: 'Kandidat B',
                values: [4, 5, 4, 4, 3]
            },
            { 
                id: generateId(), 
                name: 'Kandidat C',
                values: [5, 3, 5, 5, 5]
            },
            { 
                id: generateId(), 
                name: 'Kandidat D',
                values: [3, 4, 4, 3, 2]
            }
        ];
        
        renderPMAspects();
        renderPMCandidates();
    }
});

function renderPMAspects() {
    const container = document.getElementById('pm-aspects');
    container.innerHTML = '';
    
    pmAspects.forEach((aspect, index) => {
        const aspectDiv = document.createElement('div');
        aspectDiv.className = 'input-row';
        aspectDiv.style.marginBottom = '1rem';
        aspectDiv.innerHTML = `
            <div class="input-group">
                <label>Nama Aspek:</label>
                <input type="text" value="${aspect.name}" 
                    onchange="updateAspectName(${index}, this.value)"
                    placeholder="Aspek ${index + 1}">
            </div>
            <div class="input-group">
                <label>Nilai Target (Ideal):</label>
                <input type="number" value="${aspect.target}" min="1" max="5"
                    onchange="updateAspectTarget(${index}, this.value)">
            </div>
            <div class="input-group">
                <label>Kategori:</label>
                <select onchange="updateAspectType(${index}, this.value)">
                    <option value="core" ${aspect.type === 'core' ? 'selected' : ''}>Core Factor (60%)</option>
                    <option value="secondary" ${aspect.type === 'secondary' ? 'selected' : ''}>Secondary Factor (40%)</option>
                </select>
            </div>
            <div class="input-group" style="display: flex; align-items: flex-end;">
                <button class="btn btn-danger btn-small" onclick="removePMAspect(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        container.appendChild(aspectDiv);
    });
}

function renderPMCandidates() {
    const container = document.getElementById('pm-candidates');
    container.innerHTML = '';
    
    pmCandidates.forEach((candidate, index) => {
        const candDiv = document.createElement('div');
        candDiv.className = 'component-card';
        candDiv.innerHTML = `
            <div class="component-header">
                <input type="text" class="component-title" value="${candidate.name}" 
                    onchange="updateCandidateName(${index}, this.value)" 
                    placeholder="Kandidat ${index + 1}">
                <button class="btn btn-danger btn-small" onclick="removePMCandidate(${index})">
                    <i class="fas fa-trash"></i> Hapus
                </button>
            </div>
            <div class="input-row">
                ${pmAspects.map((aspect, aspIndex) => `
                    <div class="input-group">
                        <label>${aspect.name} (1-5):</label>
                        <input type="number" value="${candidate.values[aspIndex] || 0}" min="1" max="5"
                            onchange="updateCandidateValue(${index}, ${aspIndex}, this.value)">
                    </div>
                `).join('')}
            </div>
        `;
        container.appendChild(candDiv);
    });
}

function addPMAspect() {
    pmAspects.push({
        id: generateId(),
        name: `Aspek ${pmAspects.length + 1}`,
        target: 3,
        type: 'core'
    });
    
    pmCandidates.forEach(cand => {
        cand.values.push(3);
    });
    
    renderPMAspects();
    renderPMCandidates();
}

function removePMAspect(index) {
    if (pmAspects.length <= 2) {
        showAlert('Minimal harus ada 2 aspek!', 'warning');
        return;
    }
    pmAspects.splice(index, 1);
    
    pmCandidates.forEach(cand => {
        cand.values.splice(index, 1);
    });
    
    renderPMAspects();
    renderPMCandidates();
}

function addPMCandidate() {
    pmCandidates.push({
        id: generateId(),
        name: `Kandidat ${pmCandidates.length + 1}`,
        values: pmAspects.map(() => 3)
    });
    renderPMCandidates();
}

function removePMCandidate(index) {
    if (pmCandidates.length <= 2) {
        showAlert('Minimal harus ada 2 kandidat!', 'warning');
        return;
    }
    pmCandidates.splice(index, 1);
    renderPMCandidates();
}

function updateAspectName(index, value) {
    pmAspects[index].name = value || `Aspek ${index + 1}`;
    renderPMCandidates();
}

function updateAspectTarget(index, value) {
    pmAspects[index].target = parseInt(value) || 3;
}

function updateAspectType(index, value) {
    pmAspects[index].type = value;
}

function updateCandidateName(index, value) {
    pmCandidates[index].name = value || `Kandidat ${index + 1}`;
}

function updateCandidateValue(candIndex, aspIndex, value) {
    pmCandidates[candIndex].values[aspIndex] = parseInt(value) || 1;
}

function calculatePM() {
    if (pmAspects.length < 2) {
        showAlert('Minimal harus ada 2 aspek!', 'warning');
        return;
    }
    
    if (pmCandidates.length < 2) {
        showAlert('Minimal harus ada 2 kandidat!', 'warning');
        return;
    }
    
    let resultHTML = '';
    
    // Step 1: Show target profile
    resultHTML += `
        <div class="step-box">
            <h4>2. Profil Ideal (Target)</h4>
            <table class="calculation-table">
                <thead>
                    <tr>
                        <th>Aspek</th>
                        <th>Nilai Target</th>
                        <th>Kategori</th>
                    </tr>
                </thead>
                <tbody>
                    ${pmAspects.map(aspect => `
                        <tr>
                            <td><strong>${aspect.name}</strong></td>
                            <td>${aspect.target}</td>
                            <td><span class="badge ${aspect.type === 'core' ? 'badge-success' : 'badge-info'}">${aspect.type === 'core' ? 'Core Factor (60%)' : 'Secondary Factor (40%)'}</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            
            <h5 style="margin-top: 1.5rem; color: var(--primary-color); margin-bottom: 1rem;">Nilai Kandidat:</h5>
            <table class="calculation-table">
                <thead>
                    <tr>
                        <th>Kandidat</th>
                        ${pmAspects.map(a => `<th>${a.name}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${pmCandidates.map(cand => `
                        <tr>
                            <td><strong>${cand.name}</strong></td>
                            ${cand.values.map(v => `<td>${v}</td>`).join('')}
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
    
    // Step 2: Calculate GAP
    resultHTML += `
        <div class="step-box">
            <h4>3. Perhitungan GAP</h4>
            <p style="margin-bottom: 1rem;"><strong>Rumus:</strong></p>
            <div style="background: white; padding: 1rem; border-radius: 6px; margin-bottom: 1rem; font-family: 'Courier New', monospace;">
                GAP = Nilai Kandidat - Nilai Target
            </div>
    `;
    
    let gapResults = [];
    pmCandidates.forEach((cand, candIndex) => {
        let gaps = [];
        pmAspects.forEach((aspect, aspIndex) => {
            const gap = cand.values[aspIndex] - aspect.target;
            gaps.push(gap);
        });
        gapResults.push(gaps);
    });
    
    resultHTML += `
        <table class="calculation-table">
            <thead>
                <tr>
                    <th>Kandidat</th>
                    ${pmAspects.map(a => `<th>${a.name}</th>`).join('')}
                </tr>
            </thead>
            <tbody>
                ${pmCandidates.map((cand, candIndex) => `
                    <tr>
                        <td><strong>${cand.name}</strong></td>
                        ${gapResults[candIndex].map(gap => `
                            <td style="color: ${gap === 0 ? 'var(--success-color)' : gap > 0 ? 'var(--warning-color)' : 'var(--danger-color)'};">
                                <strong>${gap > 0 ? '+' : ''}${gap}</strong>
                            </td>
                        `).join('')}
                    </tr>
                `).join('')}
            </tbody>
        </table>
        </div>
    `;
    
    // Step 3: Convert to weights
    resultHTML += `
        <div class="step-box">
            <h4>4. Konversi GAP ke Bobot Nilai</h4>
            <p style="margin-bottom: 1rem;"><strong>Tabel Konversi:</strong></p>
            <table class="calculation-table" style="max-width: 600px;">
                <thead>
                    <tr>
                        <th>Selisih GAP</th>
                        <th>Bobot</th>
                        <th>Keterangan</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>0</td><td>5</td><td>Kompetensi sesuai</td></tr>
                    <tr><td>1</td><td>4.5</td><td>Kompetensi lebih 1 tingkat</td></tr>
                    <tr><td>-1</td><td>4</td><td>Kompetensi kurang 1 tingkat</td></tr>
                    <tr><td>2</td><td>3.5</td><td>Kompetensi lebih 2 tingkat</td></tr>
                    <tr><td>-2</td><td>3</td><td>Kompetensi kurang 2 tingkat</td></tr>
                    <tr><td>3</td><td>2.5</td><td>Kompetensi lebih 3 tingkat</td></tr>
                    <tr><td>-3</td><td>2</td><td>Kompetensi kurang 3 tingkat</td></tr>
                    <tr><td>≥4 atau ≤-4</td><td>1</td><td>Sangat tidak sesuai</td></tr>
                </tbody>
            </table>
            
            <h5 style="margin-top: 1.5rem; color: var(--secondary-color); margin-bottom: 1rem;">Bobot Nilai Kandidat:</h5>
            <table class="calculation-table">
                <thead>
                    <tr>
                        <th>Kandidat</th>
                        ${pmAspects.map(a => `<th>${a.name}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
    `;
    
    let weightResults = [];
    pmCandidates.forEach((cand, candIndex) => {
        let weights = [];
        gapResults[candIndex].forEach(gap => {
            weights.push(getGapWeight(gap));
        });
        weightResults.push(weights);
        
        resultHTML += `
            <tr>
                <td><strong>${cand.name}</strong></td>
                ${weights.map(w => `<td><strong>${w}</strong></td>`).join('')}
            </tr>
        `;
    });
    
    resultHTML += `
                </tbody>
            </table>
        </div>
    `;
    
    // Step 4: Calculate Core and Secondary Factor
    resultHTML += `
        <div class="step-box">
            <h4>5. Perhitungan Core Factor (CF) dan Secondary Factor (SF)</h4>
            <p style="margin-bottom: 1rem;"><strong>Rumus:</strong></p>
            <div style="background: white; padding: 1rem; border-radius: 6px; margin-bottom: 1.5rem;">
                <p><strong>Core Factor (CF):</strong> NCF = Σ Bobot CF / Σ Item CF</p>
                <p><strong>Secondary Factor (SF):</strong> NSF = Σ Bobot SF / Σ Item SF</p>
            </div>
    `;
    
    const coreIndices = pmAspects.map((a, i) => a.type === 'core' ? i : -1).filter(i => i !== -1);
    const secondaryIndices = pmAspects.map((a, i) => a.type === 'secondary' ? i : -1).filter(i => i !== -1);
    
    let cfResults = [];
    let sfResults = [];
    
    pmCandidates.forEach((cand, candIndex) => {
        resultHTML += `
            <div style="background: white; padding: 1rem; border-radius: 6px; margin-bottom: 1rem; border: 2px solid var(--border-color);">
                <p style="font-weight: 600; color: var(--primary-color); margin-bottom: 0.75rem; font-size: 1.1rem;">
                    ${cand.name}:
                </p>
        `;
        
        // Core Factor
        if (coreIndices.length > 0) {
            const coreWeights = coreIndices.map(i => weightResults[candIndex][i]);
            const coreSum = coreWeights.reduce((a, b) => a + b, 0);
            const ncf = coreSum / coreIndices.length;
            cfResults.push(ncf);
            
            resultHTML += `
                <p><strong>Core Factor (CF):</strong></p>
                <p style="margin-left: 1rem;">Aspek CF: ${coreIndices.map(i => pmAspects[i].name).join(', ')}</p>
                <p style="margin-left: 1rem;">NCF = (${coreWeights.join(' + ')}) / ${coreIndices.length}</p>
                <p style="margin-left: 1rem;">NCF = ${formatNumber(coreSum, 2)} / ${coreIndices.length} = <strong style="color: var(--success-color);">${formatNumber(ncf, 4)}</strong></p>
            `;
        } else {
            cfResults.push(0);
        }
        
        // Secondary Factor
        if (secondaryIndices.length > 0) {
            const secondaryWeights = secondaryIndices.map(i => weightResults[candIndex][i]);
            const secondarySum = secondaryWeights.reduce((a, b) => a + b, 0);
            const nsf = secondarySum / secondaryIndices.length;
            sfResults.push(nsf);
            
            resultHTML += `
                <p style="margin-top: 0.75rem;"><strong>Secondary Factor (SF):</strong></p>
                <p style="margin-left: 1rem;">Aspek SF: ${secondaryIndices.map(i => pmAspects[i].name).join(', ')}</p>
                <p style="margin-left: 1rem;">NSF = (${secondaryWeights.join(' + ')}) / ${secondaryIndices.length}</p>
                <p style="margin-left: 1rem;">NSF = ${formatNumber(secondarySum, 2)} / ${secondaryIndices.length} = <strong style="color: var(--secondary-color);">${formatNumber(nsf, 4)}</strong></p>
            `;
        } else {
            sfResults.push(0);
        }
        
        resultHTML += `</div>`;
    });
    
    resultHTML += `</div>`;
    
    // Step 5: Calculate Total Score
    resultHTML += `
        <div class="step-box">
            <h4>6. Perhitungan Nilai Total</h4>
            <p style="margin-bottom: 1rem;"><strong>Rumus:</strong></p>
            <div style="background: white; padding: 1rem; border-radius: 6px; margin-bottom: 1.5rem; font-family: 'Courier New', monospace;">
                N = 60% × NCF + 40% × NSF
            </div>
    `;
    
    let totalScores = [];
    pmCandidates.forEach((cand, candIndex) => {
        const ncf = cfResults[candIndex];
        const nsf = sfResults[candIndex];
        const total = 0.6 * ncf + 0.4 * nsf;
        totalScores.push({
            name: cand.name,
            ncf: ncf,
            nsf: nsf,
            total: total
        });
        
        resultHTML += `
            <div style="background: white; padding: 1rem; border-radius: 6px; margin-bottom: 0.75rem; border-left: 4px solid var(--primary-color);">
                <p style="font-weight: 600; color: var(--primary-color);">${cand.name}:</p>
                <p>N = 60% × ${formatNumber(ncf, 4)} + 40% × ${formatNumber(nsf, 4)}</p>
                <p>N = ${formatNumber(0.6 * ncf, 4)} + ${formatNumber(0.4 * nsf, 4)}</p>
                <p style="font-size: 1.2rem; color: var(--success-color);"><strong>N = ${formatNumber(total, 4)}</strong></p>
            </div>
        `;
    });
    
    resultHTML += `</div>`;
    
    // Step 6: Ranking
    totalScores.sort((a, b) => b.total - a.total);
    
    resultHTML += `
        <div class="step-box">
            <h4>7. Ranking Kandidat</h4>
            <table class="calculation-table">
                <thead>
                    <tr>
                        <th>Ranking</th>
                        <th>Kandidat</th>
                        <th>NCF</th>
                        <th>NSF</th>
                        <th>Nilai Total</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${totalScores.map((item, index) => `
                        <tr ${index === 0 ? 'class="highlight-row"' : ''}>
                            <td><strong>${index + 1}</strong></td>
                            <td><strong>${item.name}</strong></td>
                            <td>${formatNumber(item.ncf, 4)}</td>
                            <td>${formatNumber(item.nsf, 4)}</td>
                            <td><strong>${formatNumber(item.total, 4)}</strong></td>
                            <td>
                                ${index === 0 ? '<span class="badge badge-success">Terbaik</span>' : 
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
            <h4><i class="fas fa-check-circle"></i> 8. Kesimpulan</h4>
            <div class="summary-item">
                <span>Kandidat Terbaik:</span>
                <span class="summary-value">${totalScores[0].name}</span>
            </div>
            <div class="summary-item">
                <span>Nilai Total Tertinggi:</span>
                <span class="summary-value">${formatNumber(totalScores[0].total, 4)}</span>
            </div>
            <div class="summary-item">
                <span>Urutan Ranking:</span>
                <span class="summary-value">${totalScores.map((s, i) => `${i + 1}. ${s.name}`).join(' → ')}</span>
            </div>
            <p style="margin-top: 1rem; padding: 1rem; background: #dbeafe; border-radius: 6px; font-style: italic; color: #1e40af;">
                <i class="fas fa-info-circle"></i> 
                Profile Matching menggunakan Gap Analysis untuk membandingkan profil kandidat dengan profil ideal. 
                Core Factor memiliki bobot 60% dan Secondary Factor 40% dalam menentukan nilai total.
            </p>
        </div>
    `;
    
    document.getElementById('pm-calculation-steps').innerHTML = resultHTML;
    document.getElementById('pm-result').style.display = 'block';
    
    document.getElementById('pm-result').scrollIntoView({ behavior: 'smooth' });
    showAlert('Perhitungan Profile Matching berhasil!', 'success');
}
