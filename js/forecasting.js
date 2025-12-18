// Forecasting - Trend Linear Calculator
let forecastData = [];
let forecastChart = null;

// Initialize with example data
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('forecast-data')) {
        forecastData = [
            { period: 1, value: 120 },
            { period: 2, value: 135 },
            { period: 3, value: 148 },
            { period: 4, value: 162 },
            { period: 5, value: 175 },
            { period: 6, value: 190 },
            { period: 7, value: 205 },
            { period: 8, value: 218 },
            { period: 9, value: 232 },
            { period: 10, value: 245 }
        ];
        renderForecastData();
    }
});

function renderForecastData() {
    const container = document.getElementById('forecast-data');
    container.innerHTML = '';
    
    forecastData.forEach((data, index) => {
        const dataDiv = document.createElement('div');
        dataDiv.className = 'input-row';
        dataDiv.style.marginBottom = '0.75rem';
        dataDiv.innerHTML = `
            <div class="input-group">
                <label>Periode ${index + 1}:</label>
                <input type="number" value="${data.period}" min="1" readonly
                    style="background: #f1f5f9;">
            </div>
            <div class="input-group">
                <label>Nilai (Y):</label>
                <input type="number" value="${data.value}" min="0"
                    onchange="updateForecastValue(${index}, this.value)">
            </div>
            <div class="input-group" style="display: flex; align-items: flex-end;">
                <button class="btn btn-danger btn-small" onclick="removeForecastData(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        container.appendChild(dataDiv);
    });
}

function addForecastData() {
    const newPeriod = forecastData.length + 1;
    forecastData.push({
        period: newPeriod,
        value: 0
    });
    renderForecastData();
}

function removeForecastData(index) {
    if (forecastData.length <= 2) {
        showAlert('Minimal harus ada 2 data periode!', 'warning');
        return;
    }
    forecastData.splice(index, 1);
    // Renumber periods
    forecastData.forEach((data, idx) => {
        data.period = idx + 1;
    });
    renderForecastData();
}

function updateForecastValue(index, value) {
    forecastData[index].value = parseFloat(value) || 0;
}

function calculateForecasting() {
    const dataName = document.getElementById('forecast-data-name').value || 'Data';
    const predictPeriod = parseInt(document.getElementById('forecast-period').value) || (forecastData.length + 1);
    
    if (forecastData.length < 2) {
        showAlert('Minimal harus ada 2 data periode!', 'warning');
        return;
    }
    
    let resultHTML = '';
    
    // Step 1: Show data table
    resultHTML += `
        <div class="step-box">
            <h4>2. Data Historis ${dataName}</h4>
            <table class="calculation-table">
                <thead>
                    <tr>
                        <th>Periode (X)</th>
                        <th>Nilai (Y)</th>
                        <th>XY</th>
                        <th>X²</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
    
    forecastData.forEach(data => {
        const x = data.period;
        const y = data.value;
        const xy = x * y;
        const x2 = x * x;
        
        sumX += x;
        sumY += y;
        sumXY += xy;
        sumX2 += x2;
        
        resultHTML += `
            <tr>
                <td>${x}</td>
                <td>${formatNumber(y, 0)}</td>
                <td>${formatNumber(xy, 0)}</td>
                <td>${x2}</td>
            </tr>
        `;
    });
    
    resultHTML += `
                    <tr class="highlight-row">
                        <td><strong>Σ</strong></td>
                        <td><strong>${formatNumber(sumY, 0)}</strong></td>
                        <td><strong>${formatNumber(sumXY, 0)}</strong></td>
                        <td><strong>${sumX2}</strong></td>
                    </tr>
                </tbody>
            </table>
            <p style="margin-top: 1rem;">
                n (jumlah data) = ${forecastData.length}<br>
                ΣX = ${sumX}<br>
                ΣY = ${formatNumber(sumY, 0)}<br>
                ΣXY = ${formatNumber(sumXY, 0)}<br>
                ΣX² = ${sumX2}
            </p>
        </div>
    `;
    
    // Step 2: Calculate b and a
    const n = forecastData.length;
    const b = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const a = (sumY - b * sumX) / n;
    
    resultHTML += `
        <div class="step-box">
            <h4>3. Perhitungan Koefisien a dan b</h4>
            <p><strong>Rumus perhitungan b (slope):</strong></p>
            <div style="background: white; padding: 1rem; border-radius: 6px; font-family: 'Courier New', monospace; margin: 0.5rem 0;">
                b = (n∑XY - ∑X∑Y) / (n∑X² - (∑X)²)
            </div>
            <p style="margin-top: 1rem;"><strong>Substitusi nilai:</strong></p>
            <div style="background: white; padding: 1rem; border-radius: 6px; margin: 0.5rem 0;">
                b = (${n} × ${formatNumber(sumXY, 0)} - ${sumX} × ${formatNumber(sumY, 0)}) / (${n} × ${sumX2} - ${sumX}²)<br>
                b = (${formatNumber(n * sumXY, 0)} - ${formatNumber(sumX * sumY, 0)}) / (${n * sumX2} - ${sumX * sumX})<br>
                b = ${formatNumber((n * sumXY - sumX * sumY), 2)} / ${(n * sumX2 - sumX * sumX)}<br>
                <strong style="color: var(--success-color);">b = ${formatNumber(b, 4)}</strong>
            </div>
            
            <p style="margin-top: 1.5rem;"><strong>Rumus perhitungan a (intersep):</strong></p>
            <div style="background: white; padding: 1rem; border-radius: 6px; font-family: 'Courier New', monospace; margin: 0.5rem 0;">
                a = (∑Y - b∑X) / n
            </div>
            <p style="margin-top: 1rem;"><strong>Substitusi nilai:</strong></p>
            <div style="background: white; padding: 1rem; border-radius: 6px; margin: 0.5rem 0;">
                a = (${formatNumber(sumY, 0)} - ${formatNumber(b, 4)} × ${sumX}) / ${n}<br>
                a = (${formatNumber(sumY, 2)} - ${formatNumber(b * sumX, 2)}) / ${n}<br>
                a = ${formatNumber(sumY - b * sumX, 2)} / ${n}<br>
                <strong style="color: var(--success-color);">a = ${formatNumber(a, 4)}</strong>
            </div>
        </div>
    `;
    
    // Step 3: Show equation
    resultHTML += `
        <div class="step-box">
            <h4>4. Persamaan Trend Linear</h4>
            <div style="background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%); padding: 1.5rem; border-radius: 8px; text-align: center; margin: 1rem 0;">
                <p style="font-size: 1.5rem; font-family: 'Courier New', monospace; color: var(--primary-color); font-weight: 700;">
                    Y = ${formatNumber(a, 4)} + ${formatNumber(b, 4)}X
                </p>
            </div>
            <p style="margin-top: 1rem;">Dimana:</p>
            <ul style="margin-left: 2rem;">
                <li>Y = Nilai prediksi ${dataName}</li>
                <li>X = Periode waktu</li>
                <li>a = ${formatNumber(a, 4)} (konstanta)</li>
                <li>b = ${formatNumber(b, 4)} (koefisien kemiringan)</li>
            </ul>
        </div>
    `;
    
    // Step 4: Predictions
    resultHTML += `
        <div class="step-box">
            <h4>5. Prediksi ${dataName}</h4>
            <table class="calculation-table">
                <thead>
                    <tr>
                        <th>Periode (X)</th>
                        <th>Perhitungan</th>
                        <th>Prediksi (Y)</th>
                        <th>Keterangan</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    // Show fitted values for historical data
    forecastData.forEach(data => {
        const x = data.period;
        const yPredicted = a + b * x;
        resultHTML += `
            <tr>
                <td>${x}</td>
                <td>Y = ${formatNumber(a, 2)} + ${formatNumber(b, 2)} × ${x}</td>
                <td><strong>${formatNumber(yPredicted, 2)}</strong></td>
                <td>Data historis (aktual: ${formatNumber(data.value, 0)})</td>
            </tr>
        `;
    });
    
    // Show prediction for requested period
    const yPredict = a + b * predictPeriod;
    resultHTML += `
                    <tr style="background: #dcfce7;">
                        <td><strong>${predictPeriod}</strong></td>
                        <td><strong>Y = ${formatNumber(a, 2)} + ${formatNumber(b, 2)} × ${predictPeriod}</strong></td>
                        <td><strong style="color: var(--success-color); font-size: 1.1rem;">${formatNumber(yPredict, 2)}</strong></td>
                        <td><span class="badge badge-success">Prediksi</span></td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;
    
    // Summary
    resultHTML += `
        <div class="summary-box">
            <h4><i class="fas fa-check-circle"></i> 6. Kesimpulan</h4>
            <div class="summary-item">
                <span>Persamaan Trend Linear:</span>
                <span class="summary-value">Y = ${formatNumber(a, 4)} + ${formatNumber(b, 4)}X</span>
            </div>
            <div class="summary-item">
                <span>Prediksi ${dataName} Periode ${predictPeriod}:</span>
                <span class="summary-value">${formatNumber(yPredict, 2)}</span>
            </div>
            <div class="summary-item">
                <span>Trend:</span>
                <span class="summary-value">${b > 0 ? '📈 Meningkat' : b < 0 ? '📉 Menurun' : '➡️ Stabil'} (${formatNumber(b, 4)} per periode)</span>
            </div>
            <p style="margin-top: 1rem; padding: 1rem; background: #dbeafe; border-radius: 6px; font-style: italic; color: #1e40af;">
                <i class="fas fa-info-circle"></i> 
                Interpretasi: Setiap penambahan 1 periode, ${dataName} ${b > 0 ? 'meningkat' : 'menurun'} sebesar ${formatNumber(Math.abs(b), 2)} unit.
            </p>
        </div>
    `;
    
    document.getElementById('forecast-calculation-steps').innerHTML = resultHTML;
    document.getElementById('forecast-result').style.display = 'block';
    
    // Create chart
    createForecastChart(a, b, predictPeriod, dataName);
    
    document.getElementById('forecast-result').scrollIntoView({ behavior: 'smooth' });
    showAlert('Perhitungan Forecasting berhasil!', 'success');
}

function createForecastChart(a, b, predictPeriod, dataName) {
    const ctx = document.getElementById('forecast-chart');
    
    if (forecastChart) {
        forecastChart.destroy();
    }
    
    // Prepare data
    const labels = forecastData.map(d => `Periode ${d.period}`);
    const actualValues = forecastData.map(d => d.value);
    const predictedValues = forecastData.map(d => a + b * d.period);
    
    // Add future prediction
    labels.push(`Periode ${predictPeriod}`);
    actualValues.push(null);
    predictedValues.push(a + b * predictPeriod);
    
    forecastChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Data Aktual',
                    data: actualValues,
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    borderWidth: 3,
                    pointRadius: 6,
                    pointHoverRadius: 8
                },
                {
                    label: 'Trend Linear',
                    data: predictedValues,
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 3,
                    borderDash: [5, 5],
                    pointRadius: 6,
                    pointHoverRadius: 8
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: `Grafik Forecasting ${dataName} - Trend Linear`,
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                },
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: dataName
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Periode'
                    }
                }
            }
        }
    });
}
