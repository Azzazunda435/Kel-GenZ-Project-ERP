// Markov Chain Calculator
let markovStates = [];
let markovMatrix = [];
let markovInitial = [];

function generateMarkovMatrix() {
    const statesInput = document.getElementById('markov-states').value;
    markovStates = statesInput.split(',').map(s => s.trim()).filter(s => s);
    
    if (markovStates.length < 2) {
        showAlert('Minimal harus ada 2 state!', 'warning');
        return;
    }
    
    const n = markovStates.length;
    
    // Initialize matrix and initial state
    markovMatrix = [];
    markovInitial = [];
    
    for (let i = 0; i < n; i++) {
        markovMatrix[i] = [];
        for (let j = 0; j < n; j++) {
            markovMatrix[i][j] = (1 / n); // Default equal probability
        }
        markovInitial[i] = (i === 0 ? 1 : 0); // Default start at first state
    }
    
    renderMarkovMatrix();
    renderMarkovInitial();
    
    showAlert('Matriks berhasil di-generate! Silakan sesuaikan nilai probabilitas.', 'success');
}

function renderMarkovMatrix() {
    const container = document.getElementById('markov-matrix');
    if (markovStates.length === 0) {
        container.innerHTML = '<p style="color: var(--text-secondary); font-style: italic;">Klik "Generate Matriks" untuk membuat matriks transisi</p>';
        return;
    }
    
    let html = '<table class="calculation-table"><thead><tr><th>Dari \\ Ke</th>';
    markovStates.forEach(state => {
        html += `<th>${state}</th>`;
    });
    html += '</tr></thead><tbody>';
    
    markovStates.forEach((fromState, i) => {
        html += `<tr><td><strong>${fromState}</strong></td>`;
        markovStates.forEach((toState, j) => {
            html += `<td><input type="number" step="0.01" min="0" max="1" value="${markovMatrix[i][j]}" 
                style="width: 80px; padding: 0.25rem;" 
                onchange="updateMarkovMatrix(${i}, ${j}, this.value)"></td>`;
        });
        html += '</tr>';
    });
    
    html += '</tbody></table>';
    container.innerHTML = html;
}

function renderMarkovInitial() {
    const container = document.getElementById('markov-initial');
    if (markovStates.length === 0) {
        container.innerHTML = '<p style="color: var(--text-secondary); font-style: italic;">Generate matriks terlebih dahulu</p>';
        return;
    }
    
    let html = '<div class="input-row">';
    markovStates.forEach((state, i) => {
        html += `
            <div class="input-group">
                <label>Probabilitas ${state}:</label>
                <input type="number" step="0.01" min="0" max="1" value="${markovInitial[i]}" 
                    onchange="updateMarkovInitial(${i}, this.value)">
            </div>
        `;
    });
    html += '</div>';
    html += '<p class="help-text">Total probabilitas state awal harus = 1</p>';
    
    container.innerHTML = html;
}

function updateMarkovMatrix(i, j, value) {
    markovMatrix[i][j] = parseFloat(value) || 0;
}

function updateMarkovInitial(i, value) {
    markovInitial[i] = parseFloat(value) || 0;
}

// Matrix multiplication
function multiplyMatrices(a, b) {
    const rowsA = a.length;
    const colsA = a[0].length;
    const colsB = b[0].length;
    
    const result = [];
    for (let i = 0; i < rowsA; i++) {
        result[i] = [];
        for (let j = 0; j < colsB; j++) {
            result[i][j] = 0;
            for (let k = 0; k < colsA; k++) {
                result[i][j] += a[i][k] * b[k][j];
            }
        }
    }
    return result;
}

// Matrix power
function matrixPower(matrix, power) {
    if (power === 0) {
        // Return identity matrix
        const n = matrix.length;
        const identity = [];
        for (let i = 0; i < n; i++) {
            identity[i] = [];
            for (let j = 0; j < n; j++) {
                identity[i][j] = (i === j ? 1 : 0);
            }
        }
        return identity;
    }
    
    if (power === 1) return matrix;
    
    let result = matrix;
    for (let i = 1; i < power; i++) {
        result = multiplyMatrices(result, matrix);
    }
    return result;
}

function calculateMarkov() {
    if (markovStates.length < 2) {
        showAlert('Generate matriks terlebih dahulu!', 'warning');
        return;
    }
    
    const periods = parseInt(document.getElementById('markov-periods').value) || 5;
    
    // Validate transition matrix (each row should sum to 1)
    for (let i = 0; i < markovMatrix.length; i++) {
        const rowSum = markovMatrix[i].reduce((a, b) => a + b, 0);
        if (Math.abs(rowSum - 1) > 0.01) {
            showAlert(`Baris ${markovStates[i]} tidak valid! Total probabilitas = ${rowSum.toFixed(2)}, harus = 1`, 'warning');
            return;
        }
    }
    
    // Validate initial state
    const initialSum = markovInitial.reduce((a, b) => a + b, 0);
    if (Math.abs(initialSum - 1) > 0.01) {
        showAlert(`Total probabilitas state awal = ${initialSum.toFixed(2)}, harus = 1`, 'warning');
        return;
    }
    
    let resultHTML = '';
    
    // Step 1: Show transition matrix
    resultHTML += `
        <div class="step-box">
            <h4>2. Matriks Probabilitas Transisi (P)</h4>
            <table class="calculation-table">
                <thead>
                    <tr>
                        <th>Dari \\ Ke</th>
                        ${markovStates.map(s => `<th>${s}</th>`).join('')}
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${markovStates.map((fromState, i) => `
                        <tr>
                            <td><strong>${fromState}</strong></td>
                            ${markovMatrix[i].map(p => `<td>${formatNumber(p, 2)}</td>`).join('')}
                            <td><strong>${formatNumber(markovMatrix[i].reduce((a, b) => a + b, 0), 2)}</strong></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <p style="margin-top: 1rem; font-style: italic; color: var(--text-secondary);">
                Setiap baris merepresentasikan probabilitas transisi dari satu state ke state lainnya. 
                Total setiap baris harus = 1.
            </p>
        </div>
    `;
    
    // Step 2: Show initial state
    resultHTML += `
        <div class="step-box">
            <h4>3. Distribusi Probabilitas Awal (π<sub>0</sub>)</h4>
            <table class="calculation-table" style="max-width: 500px;">
                <thead>
                    <tr>
                        ${markovStates.map(s => `<th>${s}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        ${markovInitial.map(p => `<td><strong>${formatNumber(p, 4)}</strong></td>`).join('')}
                    </tr>
                </tbody>
            </table>
            <p style="margin-top: 1rem;">Total: <strong>${formatNumber(initialSum, 4)}</strong></p>
        </div>
    `;
    
    // Step 3: Calculate predictions for each period
    resultHTML += `
        <div class="step-box">
            <h4>4. Prediksi Distribusi State per Periode</h4>
            <p style="margin-bottom: 1rem;"><strong>Rumus:</strong></p>
            <div style="background: white; padding: 1rem; border-radius: 6px; margin-bottom: 1.5rem; font-family: 'Courier New', monospace;">
                π<sub>n</sub> = π<sub>0</sub> × P<sup>n</sup>
            </div>
    `;
    
    let predictions = [markovInitial];
    
    for (let period = 1; period <= periods; period++) {
        const pPower = matrixPower(markovMatrix, period);
        
        // Calculate π(period) = π(0) × P^period
        const prediction = [];
        for (let j = 0; j < markovStates.length; j++) {
            let sum = 0;
            for (let i = 0; i < markovStates.length; i++) {
                sum += markovInitial[i] * pPower[i][j];
            }
            prediction.push(sum);
        }
        predictions.push(prediction);
        
        resultHTML += `
            <div style="background: white; padding: 1rem; border-radius: 6px; margin-bottom: 1rem; border-left: 4px solid var(--primary-color);">
                <p style="font-weight: 600; color: var(--primary-color); margin-bottom: 0.75rem;">
                    Periode ${period} (π<sub>${period}</sub>):
                </p>
                <table class="calculation-table" style="margin-top: 0.5rem;">
                    <thead>
                        <tr>
                            ${markovStates.map(s => `<th>${s}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            ${prediction.map(p => `<td><strong>${formatNumber(p, 4)}</strong></td>`).join('')}
                        </tr>
                    </tbody>
                </table>
                <p style="margin-top: 0.5rem; font-size: 0.9rem; color: var(--text-secondary);">
                    Interpretasi: ${markovStates.map((state, idx) => 
                        `${formatNumber(prediction[idx] * 100, 2)}% kemungkinan berada di state ${state}`
                    ).join(', ')}
                </p>
            </div>
        `;
    }
    
    resultHTML += `</div>`;
    
    // Step 4: Show all predictions in table
    resultHTML += `
        <div class="step-box">
            <h4>5. Tabel Evolusi Distribusi State</h4>
            <table class="calculation-table">
                <thead>
                    <tr>
                        <th>Periode</th>
                        ${markovStates.map(s => `<th>${s}</th>`).join('')}
                        <th>State Dominan</th>
                    </tr>
                </thead>
                <tbody>
                    ${predictions.map((pred, period) => {
                        const maxProb = Math.max(...pred);
                        const maxIndex = pred.indexOf(maxProb);
                        return `
                            <tr ${period === predictions.length - 1 ? 'class="highlight-row"' : ''}>
                                <td><strong>${period}</strong></td>
                                ${pred.map((p, idx) => `
                                    <td style="${idx === maxIndex ? 'background: #dcfce7; font-weight: 600;' : ''}">
                                        ${formatNumber(p, 4)}
                                    </td>
                                `).join('')}
                                <td><span class="badge badge-success">${markovStates[maxIndex]}</span></td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
    
    // Step 5: Steady state analysis
    const lastPrediction = predictions[predictions.length - 1];
    const secondLastPrediction = predictions[predictions.length - 2];
    
    let steadyStateReached = true;
    for (let i = 0; i < markovStates.length; i++) {
        if (Math.abs(lastPrediction[i] - secondLastPrediction[i]) > 0.001) {
            steadyStateReached = false;
            break;
        }
    }
    
    resultHTML += `
        <div class="step-box">
            <h4>6. Analisis Steady State (Keseimbangan Jangka Panjang)</h4>
            <p style="margin-bottom: 1rem;">
                Steady state adalah kondisi dimana distribusi probabilitas tidak lagi berubah signifikan dari satu periode ke periode berikutnya.
            </p>
            ${steadyStateReached ? `
                <div class="alert alert-success">
                    <i class="fas fa-check-circle"></i>
                    Steady state tercapai pada periode ${periods}! Distribusi probabilitas telah stabil.
                </div>
                <table class="calculation-table" style="max-width: 500px;">
                    <thead>
                        <tr>
                            ${markovStates.map(s => `<th>${s}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            ${lastPrediction.map(p => `<td><strong>${formatNumber(p, 4)}</strong></td>`).join('')}
                        </tr>
                    </tbody>
                </table>
            ` : `
                <div class="alert alert-warning">
                    <i class="fas fa-exclamation-triangle"></i>
                    Steady state belum tercapai pada periode ${periods}. Sistem masih dalam transisi. 
                    Coba tingkatkan jumlah periode untuk melihat keseimbangan jangka panjang.
                </div>
            `}
        </div>
    `;
    
    // Summary
    const maxProb = Math.max(...lastPrediction);
    const maxIndex = lastPrediction.indexOf(maxProb);
    
    resultHTML += `
        <div class="summary-box">
            <h4><i class="fas fa-check-circle"></i> 7. Kesimpulan</h4>
            <div class="summary-item">
                <span>State Paling Mungkin (Periode ${periods}):</span>
                <span class="summary-value">${markovStates[maxIndex]} (${formatNumber(maxProb * 100, 2)}%)</span>
            </div>
            <div class="summary-item">
                <span>Distribusi pada Periode ${periods}:</span>
                <span class="summary-value">${markovStates.map((s, i) => 
                    `${s}: ${formatNumber(lastPrediction[i] * 100, 2)}%`
                ).join(' | ')}</span>
            </div>
            <div class="summary-item">
                <span>Status Steady State:</span>
                <span class="summary-value">${steadyStateReached ? '✓ Tercapai' : '⏳ Dalam Transisi'}</span>
            </div>
            <p style="margin-top: 1rem; padding: 1rem; background: #dbeafe; border-radius: 6px; font-style: italic; color: #1e40af;">
                <i class="fas fa-info-circle"></i> 
                Markov Chain berguna untuk memprediksi kondisi masa depan berdasarkan probabilitas transisi antar state. 
                Model ini banyak digunakan dalam analisis customer retention, prediksi cuaca, dan sistem antrian.
            </p>
        </div>
    `;
    
    document.getElementById('markov-calculation-steps').innerHTML = resultHTML;
    document.getElementById('markov-result').style.display = 'block';
    
    document.getElementById('markov-result').scrollIntoView({ behavior: 'smooth' });
    showAlert('Perhitungan Markov Chain berhasil!', 'success');
}
