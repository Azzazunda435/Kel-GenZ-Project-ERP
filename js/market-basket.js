// Market Basket Analysis Calculator
let mbaTransactions = [];

// Initialize with example data
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('mba-transactions')) {
        mbaTransactions = [
            { id: generateId(), items: 'Roti, Susu, Mentega' },
            { id: generateId(), items: 'Roti, Mentega' },
            { id: generateId(), items: 'Susu, Mentega, Keju' },
            { id: generateId(), items: 'Roti, Susu, Mentega, Keju' },
            { id: generateId(), items: 'Roti, Susu' },
            { id: generateId(), items: 'Mentega, Keju' },
            { id: generateId(), items: 'Roti, Susu, Mentega, Keju' },
            { id: generateId(), items: 'Roti, Mentega, Keju' },
            { id: generateId(), items: 'Susu, Keju' },
            { id: generateId(), items: 'Roti, Susu, Keju' }
        ];
        renderMBATransactions();
    }
});

function renderMBATransactions() {
    const container = document.getElementById('mba-transactions');
    container.innerHTML = '';
    
    mbaTransactions.forEach((transaction, index) => {
        const transDiv = document.createElement('div');
        transDiv.className = 'input-row';
        transDiv.style.marginBottom = '0.75rem';
        transDiv.innerHTML = `
            <div class="input-group" style="flex: 1;">
                <label>Transaksi ${index + 1}:</label>
                <input type="text" value="${transaction.items}" 
                    onchange="updateTransactionItems(${index}, this.value)"
                    placeholder="Contoh: Roti, Susu, Mentega">
            </div>
            <div class="input-group" style="display: flex; align-items: flex-end;">
                <button class="btn btn-danger btn-small" onclick="removeMBATransaction(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        container.appendChild(transDiv);
    });
}

function addMBATransaction() {
    mbaTransactions.push({
        id: generateId(),
        items: ''
    });
    renderMBATransactions();
}

function removeMBATransaction(index) {
    if (mbaTransactions.length <= 2) {
        showAlert('Minimal harus ada 2 transaksi!', 'warning');
        return;
    }
    mbaTransactions.splice(index, 1);
    renderMBATransactions();
}

function updateTransactionItems(index, value) {
    mbaTransactions[index].items = value;
}

function calculateMBA() {
    const minSupport = parseFloat(document.getElementById('mba-min-support').value) || 30;
    const minConfidence = parseFloat(document.getElementById('mba-min-confidence').value) || 50;
    
    if (mbaTransactions.length < 2) {
        showAlert('Minimal harus ada 2 transaksi!', 'warning');
        return;
    }
    
    // Parse transactions
    const parsedTransactions = mbaTransactions
        .map(t => t.items.split(',').map(item => item.trim()).filter(item => item))
        .filter(t => t.length > 0);
    
    if (parsedTransactions.length === 0) {
        showAlert('Tidak ada transaksi yang valid!', 'warning');
        return;
    }
    
    const totalTransactions = parsedTransactions.length;
    
    let resultHTML = '';
    
    // Step 1: Show transactions
    resultHTML += `
        <div class="step-box">
            <h4>2. Data Transaksi</h4>
            <p>Total Transaksi: <strong>${totalTransactions}</strong></p>
            <table class="calculation-table">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Item yang Dibeli</th>
                    </tr>
                </thead>
                <tbody>
                    ${parsedTransactions.map((trans, idx) => `
                        <tr>
                            <td>T${idx + 1}</td>
                            <td>${trans.join(', ')}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
    
    // Get all unique items
    const allItems = [...new Set(parsedTransactions.flat())];
    
    // Step 2: Calculate support for individual items
    resultHTML += `
        <div class="step-box">
            <h4>3. Perhitungan Support Item Individu</h4>
            <p style="margin-bottom: 1rem;"><strong>Rumus Support:</strong></p>
            <div style="background: white; padding: 1rem; border-radius: 6px; margin-bottom: 1rem; font-family: 'Courier New', monospace;">
                Support(A) = Transaksi mengandung A / Total Transaksi × 100%
            </div>
            <table class="calculation-table">
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Frekuensi</th>
                        <th>Support (%)</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    let itemSupport = {};
    allItems.forEach(item => {
        const count = parsedTransactions.filter(trans => trans.includes(item)).length;
        const support = (count / totalTransactions) * 100;
        itemSupport[item] = { count, support };
        
        resultHTML += `
            <tr>
                <td><strong>${item}</strong></td>
                <td>${count}</td>
                <td>${formatNumber(support, 2)}%</td>
                <td>
                    ${support >= minSupport ? 
                        '<span class="badge badge-success">Memenuhi min. support</span>' : 
                        '<span class="badge badge-warning">Tidak memenuhi</span>'}
                </td>
            </tr>
        `;
    });
    
    resultHTML += `
                </tbody>
            </table>
        </div>
    `;
    
    // Filter items that meet minimum support
    const frequentItems = allItems.filter(item => itemSupport[item].support >= minSupport);
    
    if (frequentItems.length < 2) {
        showAlert('Tidak ada cukup item yang memenuhi minimum support untuk membuat aturan asosiasi!', 'warning');
        return;
    }
    
    // Step 3: Generate association rules
    resultHTML += `
        <div class="step-box">
            <h4>4. Pembangkitan Aturan Asosiasi</h4>
            <p style="margin-bottom: 1rem;"><strong>Rumus:</strong></p>
            <div style="background: white; padding: 1rem; border-radius: 6px; margin-bottom: 1rem;">
                <p><strong>Support(A,B):</strong> Transaksi mengandung A dan B / Total Transaksi × 100%</p>
                <p><strong>Confidence(A→B):</strong> Support(A,B) / Support(A) × 100%</p>
                <p><strong>Lift(A→B):</strong> Confidence(A→B) / Support(B)</p>
            </div>
    `;
    
    let rules = [];
    
    // Generate rules for pairs
    for (let i = 0; i < frequentItems.length; i++) {
        for (let j = 0; j < frequentItems.length; j++) {
            if (i !== j) {
                const itemA = frequentItems[i];
                const itemB = frequentItems[j];
                
                // Count transactions containing both A and B
                const countAB = parsedTransactions.filter(trans => 
                    trans.includes(itemA) && trans.includes(itemB)
                ).length;
                
                const supportAB = (countAB / totalTransactions) * 100;
                const supportA = itemSupport[itemA].support;
                const supportB = itemSupport[itemB].support;
                const confidence = (supportAB / supportA) * 100;
                const lift = confidence / supportB;
                
                if (supportAB >= minSupport && confidence >= minConfidence) {
                    rules.push({
                        antecedent: itemA,
                        consequent: itemB,
                        countAB: countAB,
                        supportAB: supportAB,
                        supportA: supportA,
                        supportB: supportB,
                        confidence: confidence,
                        lift: lift
                    });
                }
            }
        }
    }
    
    if (rules.length === 0) {
        resultHTML += `
            <div class="alert alert-warning">
                <i class="fas fa-exclamation-triangle"></i>
                Tidak ditemukan aturan asosiasi yang memenuhi minimum support (${minSupport}%) 
                dan minimum confidence (${minConfidence}%).
            </div>
        `;
    } else {
        // Show detailed calculations
        resultHTML += `<h5 style="color: var(--primary-color); margin-bottom: 1rem;">Perhitungan Detail Aturan:</h5>`;
        
        rules.forEach((rule, idx) => {
            resultHTML += `
                <div style="background: white; padding: 1rem; border-radius: 6px; margin-bottom: 1rem; border: 2px solid var(--border-color);">
                    <p style="font-weight: 600; color: var(--primary-color); margin-bottom: 0.75rem; font-size: 1.1rem;">
                        Aturan ${idx + 1}: ${rule.antecedent} → ${rule.consequent}
                    </p>
                    <p><strong>Support(${rule.antecedent},${rule.consequent}):</strong></p>
                    <p style="margin-left: 1rem;">= ${rule.countAB} / ${totalTransactions} × 100% = <strong>${formatNumber(rule.supportAB, 2)}%</strong></p>
                    
                    <p style="margin-top: 0.5rem;"><strong>Confidence(${rule.antecedent}→${rule.consequent}):</strong></p>
                    <p style="margin-left: 1rem;">= ${formatNumber(rule.supportAB, 2)}% / ${formatNumber(rule.supportA, 2)}% × 100%</p>
                    <p style="margin-left: 1rem;">= <strong>${formatNumber(rule.confidence, 2)}%</strong></p>
                    
                    <p style="margin-top: 0.5rem;"><strong>Lift(${rule.antecedent}→${rule.consequent}):</strong></p>
                    <p style="margin-left: 1rem;">= ${formatNumber(rule.confidence, 2)} / ${formatNumber(rule.supportB, 2)}</p>
                    <p style="margin-left: 1rem;">= <strong>${formatNumber(rule.lift, 4)}</strong></p>
                    
                    <div style="margin-top: 0.75rem; padding: 0.75rem; background: ${rule.lift > 1 ? '#dcfce7' : rule.lift < 1 ? '#fee2e2' : '#f1f5f9'}; border-radius: 6px;">
                        <p style="font-weight: 600; color: ${rule.lift > 1 ? '#166534' : rule.lift < 1 ? '#991b1b' : '#64748b'};">
                            ${rule.lift > 1 ? '✓ Asosiasi Positif: Pembelian ' + rule.antecedent + ' meningkatkan probabilitas membeli ' + rule.consequent :
                              rule.lift < 1 ? '✗ Asosiasi Negatif: Pembelian ' + rule.antecedent + ' menurunkan probabilitas membeli ' + rule.consequent :
                              '− Independen: Tidak ada hubungan'}
                        </p>
                    </div>
                </div>
            `;
        });
        
        // Step 4: Summary table
        resultHTML += `
            <h5 style="color: var(--secondary-color); margin: 1.5rem 0 1rem;">Ringkasan Aturan Asosiasi:</h5>
            <table class="calculation-table">
                <thead>
                    <tr>
                        <th>Aturan</th>
                        <th>Support (%)</th>
                        <th>Confidence (%)</th>
                        <th>Lift</th>
                        <th>Interpretasi</th>
                    </tr>
                </thead>
                <tbody>
                    ${rules.map(rule => `
                        <tr>
                            <td><strong>${rule.antecedent} → ${rule.consequent}</strong></td>
                            <td>${formatNumber(rule.supportAB, 2)}%</td>
                            <td>${formatNumber(rule.confidence, 2)}%</td>
                            <td><strong>${formatNumber(rule.lift, 4)}</strong></td>
                            <td>
                                <span class="badge ${rule.lift > 1 ? 'badge-success' : rule.lift < 1 ? 'badge-warning' : 'badge-info'}">
                                    ${rule.lift > 1 ? 'Positif ↑' : rule.lift < 1 ? 'Negatif ↓' : 'Independen →'}
                                </span>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }
    
    resultHTML += `</div>`;
    
    // Step 5: Recommendations
    if (rules.length > 0) {
        const bestRule = rules.reduce((best, rule) => 
            rule.lift > best.lift ? rule : best
        , rules[0]);
        
        const strongRules = rules.filter(rule => rule.lift > 1).sort((a, b) => b.lift - a.lift);
        
        resultHTML += `
            <div class="summary-box">
                <h4><i class="fas fa-check-circle"></i> 5. Kesimpulan dan Rekomendasi</h4>
                <div class="summary-item">
                    <span>Total Aturan Ditemukan:</span>
                    <span class="summary-value">${rules.length} aturan</span>
                </div>
                <div class="summary-item">
                    <span>Aturan Terkuat:</span>
                    <span class="summary-value">${bestRule.antecedent} → ${bestRule.consequent} (Lift: ${formatNumber(bestRule.lift, 4)})</span>
                </div>
                <div class="summary-item">
                    <span>Asosiasi Positif:</span>
                    <span class="summary-value">${strongRules.length} aturan</span>
                </div>
                
                ${strongRules.length > 0 ? `
                    <div style="margin-top: 1rem; padding: 1rem; background: #dcfce7; border-radius: 6px;">
                        <p style="font-weight: 600; color: #166534; margin-bottom: 0.75rem;">
                            <i class="fas fa-lightbulb"></i> Rekomendasi Bisnis:
                        </p>
                        <ul style="margin-left: 1.5rem; color: #166534;">
                            ${strongRules.slice(0, 3).map(rule => `
                                <li style="margin-bottom: 0.5rem;">
                                    <strong>Bundle Promo:</strong> Tawarkan diskon untuk pembelian 
                                    "${rule.antecedent}" bersama "${rule.consequent}" 
                                    (Confidence: ${formatNumber(rule.confidence, 0)}%)
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                ` : ''}
                
                <p style="margin-top: 1rem; padding: 1rem; background: #dbeafe; border-radius: 6px; font-style: italic; color: #1e40af;">
                    <i class="fas fa-info-circle"></i> 
                    Market Basket Analysis membantu menemukan pola pembelian pelanggan untuk strategi 
                    cross-selling, bundle promo, dan penempatan produk yang optimal.
                </p>
            </div>
        `;
    }
    
    document.getElementById('mba-calculation-steps').innerHTML = resultHTML;
    document.getElementById('mba-result').style.display = 'block';
    
    document.getElementById('mba-result').scrollIntoView({ behavior: 'smooth' });
    showAlert('Perhitungan Market Basket Analysis berhasil!', 'success');
}
