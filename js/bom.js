// BOM (Bill of Materials) Calculator
let bomComponents = [];

function initializeBOM() {
    // Initialize with example data (Laptop)
    bomComponents = [
        {
            id: generateId(),
            name: 'Motherboard',
            quantity: 1,
            subComponents: [
                { id: generateId(), name: 'CPU', quantity: 1, price: 250000 },
                { id: generateId(), name: 'Chipset', quantity: 1, price: 700000 },
                { id: generateId(), name: 'Kapasitor', quantity: 10, price: 2000 }
            ]
        },
        {
            id: generateId(),
            name: 'RAM',
            quantity: 2,
            subComponents: [
                { id: generateId(), name: 'Memory Chip', quantity: 8, price: 140000 },
                { id: generateId(), name: 'PCB', quantity: 1, price: 70000 }
            ]
        },
        {
            id: generateId(),
            name: 'SSD',
            quantity: 1,
            subComponents: [
                { id: generateId(), name: 'Flash Memory', quantity: 1, price: 300000 },
                { id: generateId(), name: 'Controller', quantity: 1, price: 110000 }
            ]
        },
        {
            id: generateId(),
            name: 'Casing',
            quantity: 1,
            subComponents: [
                { id: generateId(), name: 'Skrup', quantity: 8, price: 5000 },
                { id: generateId(), name: 'Plat', quantity: 1, price: 50000 }
            ]
        },
        {
            id: generateId(),
            name: 'Keyboard',
            quantity: 1,
            subComponents: [
                { id: generateId(), name: 'PCB', quantity: 1, price: 20000 },
                { id: generateId(), name: 'Kabel', quantity: 1, price: 12000 }
            ]
        },
        {
            id: generateId(),
            name: 'Touchpad',
            quantity: 1,
            subComponents: [
                { id: generateId(), name: 'Sensor sentuh', quantity: 1, price: 9000 },
                { id: generateId(), name: 'Kabel fleksibel', quantity: 1, price: 1200 }
            ]
        }
    ];
    
    renderBOMComponents();
}

function renderBOMComponents() {
    const container = document.getElementById('bom-components');
    container.innerHTML = '';
    
    bomComponents.forEach((component, index) => {
        const componentDiv = document.createElement('div');
        componentDiv.className = 'component-card';
        componentDiv.innerHTML = `
            <div class="component-header">
                <input type="text" class="component-title" value="${component.name}" 
                    onchange="updateComponentName(${index}, this.value)" 
                    placeholder="Nama Komponen">
                <button class="btn btn-danger btn-small" onclick="removeComponent(${index})">
                    <i class="fas fa-trash"></i> Hapus
                </button>
            </div>
            <div class="input-row">
                <div class="input-group">
                    <label>Jumlah per Produk:</label>
                    <input type="number" value="${component.quantity}" min="1"
                        onchange="updateComponentQuantity(${index}, this.value)">
                </div>
            </div>
            <h4 style="margin-top: 1rem; font-size: 0.95rem; color: var(--text-secondary);">Sub-komponen:</h4>
            <div id="sub-components-${index}">
                ${component.subComponents.map((sub, subIndex) => `
                    <div class="sub-component">
                        <div class="sub-component-header">
                            <input type="text" value="${sub.name}" 
                                onchange="updateSubComponentName(${index}, ${subIndex}, this.value)"
                                placeholder="Nama Sub-komponen" 
                                style="flex: 1; margin-right: 0.5rem; padding: 0.5rem; border: 1px solid var(--border-color); border-radius: 6px;">
                            <button class="btn btn-danger btn-small" onclick="removeSubComponent(${index}, ${subIndex})">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        <div class="input-row">
                            <div class="input-group">
                                <label>Jumlah:</label>
                                <input type="number" value="${sub.quantity}" min="1"
                                    onchange="updateSubComponentQuantity(${index}, ${subIndex}, this.value)">
                            </div>
                            <div class="input-group">
                                <label>Harga Satuan (Rp):</label>
                                <input type="number" value="${sub.price}" min="0"
                                    onchange="updateSubComponentPrice(${index}, ${subIndex}, this.value)">
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            <button class="btn btn-secondary btn-small" style="margin-top: 0.5rem;" 
                onclick="addSubComponent(${index})">
                <i class="fas fa-plus"></i> Tambah Sub-komponen
            </button>
        `;
        container.appendChild(componentDiv);
    });
}

function addBOMComponent() {
    bomComponents.push({
        id: generateId(),
        name: 'Komponen Baru',
        quantity: 1,
        subComponents: []
    });
    renderBOMComponents();
}

function removeComponent(index) {
    if (confirm('Yakin ingin menghapus komponen ini?')) {
        bomComponents.splice(index, 1);
        renderBOMComponents();
    }
}

function addSubComponent(componentIndex) {
    bomComponents[componentIndex].subComponents.push({
        id: generateId(),
        name: 'Sub-komponen Baru',
        quantity: 1,
        price: 0
    });
    renderBOMComponents();
}

function removeSubComponent(componentIndex, subIndex) {
    bomComponents[componentIndex].subComponents.splice(subIndex, 1);
    renderBOMComponents();
}

function updateComponentName(index, value) {
    bomComponents[index].name = value;
}

function updateComponentQuantity(index, value) {
    bomComponents[index].quantity = parseInt(value) || 1;
}

function updateSubComponentName(componentIndex, subIndex, value) {
    bomComponents[componentIndex].subComponents[subIndex].name = value;
}

function updateSubComponentQuantity(componentIndex, subIndex, value) {
    bomComponents[componentIndex].subComponents[subIndex].quantity = parseInt(value) || 1;
}

function updateSubComponentPrice(componentIndex, subIndex, value) {
    bomComponents[componentIndex].subComponents[subIndex].price = parseInt(value) || 0;
}

function calculateBOM() {
    const productName = document.getElementById('bom-product-name').value || 'Produk';
    const totalProducts = parseInt(document.getElementById('bom-quantity').value) || 1;
    
    if (bomComponents.length === 0) {
        showAlert('Tambahkan minimal satu komponen!', 'warning');
        return;
    }
    
    let resultHTML = '';
    
    // Step 1: Show Structure
    resultHTML += `
        <div class="step-box">
            <h4>2. Struktur BOM ${productName} (Hierarki Produk)</h4>
            <p>1 ${productName} membutuhkan:</p>
            <ul style="margin-left: 2rem;">
                ${bomComponents.map(comp => `
                    <li><strong>${comp.name}</strong> (${comp.quantity})
                        <ul style="margin-left: 1.5rem; margin-top: 0.5rem;">
                            ${comp.subComponents.map(sub => 
                                `<li>${sub.name} (${sub.quantity})</li>`
                            ).join('')}
                        </ul>
                    </li>
                `).join('')}
            </ul>
        </div>
    `;
    
    // Step 2: Calculate each component
    resultHTML += `<div class="step-box"><h4>3. Perhitungan Biaya Setiap Komponen</h4>`;
    
    let componentCosts = [];
    bomComponents.forEach((component, idx) => {
        let subTotal = 0;
        let calculations = '';
        
        component.subComponents.forEach(sub => {
            const cost = sub.quantity * sub.price;
            subTotal += cost;
            calculations += `<p><strong>${sub.name}:</strong> ${sub.quantity} × ${formatCurrency(sub.price)} = ${formatCurrency(cost)}</p>`;
        });
        
        const totalCost = subTotal * component.quantity;
        
        resultHTML += `
            <div style="background: white; padding: 1rem; border-radius: 6px; margin-bottom: 1rem; border: 1px solid var(--border-color);">
                <h5 style="color: var(--primary-color); margin-bottom: 0.75rem;">${String.fromCharCode(65 + idx)}. Biaya ${component.quantity} ${component.name}</h5>
                <p style="margin-bottom: 0.5rem;">Komponen ${component.name}:</p>
                ${calculations}
                <p style="margin-top: 0.75rem;"><strong>Total biaya 1 ${component.name}:</strong></p>
                <p style="font-size: 1.1rem; color: var(--success-color);"><strong>${formatCurrency(subTotal)}</strong></p>
                ${component.quantity > 1 ? `
                    <p style="margin-top: 0.5rem;">Karena 1 ${productName} membutuhkan ${component.quantity} ${component.name}:</p>
                    <p style="font-size: 1.1rem; color: var(--primary-color);"><strong>${component.quantity} × ${formatCurrency(subTotal)} = ${formatCurrency(totalCost)}</strong></p>
                ` : ''}
            </div>
        `;
        
        componentCosts.push({
            name: component.name,
            quantity: component.quantity,
            unitCost: subTotal,
            totalCost: totalCost
        });
    });
    
    resultHTML += `</div>`;
    
    // Step 3: Summary table for 1 product
    const totalCostOneProduct = componentCosts.reduce((sum, comp) => sum + comp.totalCost, 0);
    
    resultHTML += `
        <div class="step-box">
            <h4>4. Total Cost untuk 1 ${productName}</h4>
            <table class="calculation-table">
                <thead>
                    <tr>
                        <th>Komponen</th>
                        <th>Biaya (Rp)</th>
                    </tr>
                </thead>
                <tbody>
                    ${componentCosts.map(comp => `
                        <tr>
                            <td>${comp.name}${comp.quantity > 1 ? ` (${comp.quantity} unit)` : ''}</td>
                            <td>${formatCurrency(comp.totalCost)}</td>
                        </tr>
                    `).join('')}
                    <tr class="highlight-row">
                        <td><strong>Total Cost 1 ${productName}</strong></td>
                        <td><strong>${formatCurrency(totalCostOneProduct)}</strong></td>
                    </tr>
                </tbody>
            </table>
            <p style="margin-top: 1rem; font-size: 1.1rem;">Jadi, biaya produksi 1 ${productName} = <strong style="color: var(--success-color);">${formatCurrency(totalCostOneProduct)}</strong></p>
        </div>
    `;
    
    // Step 4: Material requirements for multiple products
    resultHTML += `
        <div class="step-box">
            <h4>5. Kebutuhan Material untuk ${totalProducts} ${productName}</h4>
            <h5 style="color: var(--primary-color); margin-bottom: 1rem;">A. Rekap Jumlah Material Utama</h5>
            <table class="calculation-table">
                <thead>
                    <tr>
                        <th>Komponen</th>
                        <th>Kebutuhan per ${productName}</th>
                        <th>Total untuk ${totalProducts} ${productName}</th>
                    </tr>
                </thead>
                <tbody>
                    ${componentCosts.map(comp => `
                        <tr>
                            <td>${comp.name}</td>
                            <td>${comp.quantity}</td>
                            <td><strong>${comp.quantity * totalProducts}</strong></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            
            <h5 style="color: var(--primary-color); margin: 1.5rem 0 1rem;">B. Akumulasi Material Detail</h5>
            ${bomComponents.map((component, idx) => {
                const totalComponentQty = component.quantity * totalProducts;
                return `
                    <div style="background: white; padding: 1rem; border-radius: 6px; margin-bottom: 1rem; border-left: 4px solid var(--secondary-color);">
                        <p style="font-weight: 600; color: var(--secondary-color); margin-bottom: 0.5rem;">${component.name} (${totalComponentQty} unit):</p>
                        <ul style="margin-left: 1.5rem;">
                            ${component.subComponents.map(sub => {
                                const totalSubQty = sub.quantity * totalComponentQty;
                                return `<li>${sub.name}: ${totalProducts} × ${component.quantity} × ${sub.quantity} = <strong>${totalSubQty} unit</strong></li>`;
                            }).join('')}
                        </ul>
                    </div>
                `;
            }).join('')}
        </div>
    `;
    
    // Step 5: Total for all products
    const totalCostAllProducts = totalCostOneProduct * totalProducts;
    
    resultHTML += `
        <div class="step-box">
            <h4>6. Total Cost untuk ${totalProducts} ${productName}</h4>
            <p style="margin-bottom: 1rem;"><strong>Rumus:</strong></p>
            <p style="background: white; padding: 1rem; border-radius: 6px; font-family: 'Courier New', monospace;">
                Total Cost = Biaya 1 ${productName} × Jumlah ${productName}
            </p>
            <p style="font-size: 1.2rem; margin-top: 1rem;">
                ${formatCurrency(totalCostOneProduct)} × ${totalProducts} = 
                <strong style="color: var(--success-color);">${formatCurrency(totalCostAllProducts)}</strong>
            </p>
        </div>
    `;
    
    // Final Summary
    resultHTML += `
        <div class="summary-box">
            <h4><i class="fas fa-check-circle"></i> 7. Kesimpulan</h4>
            <div class="summary-item">
                <span>Cost produksi 1 ${productName}:</span>
                <span class="summary-value">${formatCurrency(totalCostOneProduct)}</span>
            </div>
            <div class="summary-item">
                <span>Cost produksi ${totalProducts} ${productName}:</span>
                <span class="summary-value">${formatCurrency(totalCostAllProducts)}</span>
            </div>
            <p style="margin-top: 1rem; padding: 1rem; background: #fef3c7; border-radius: 6px; font-style: italic; color: #92400e;">
                <i class="fas fa-info-circle"></i> Perhitungan ini murni berdasarkan Bill of Material, 
                belum termasuk biaya tenaga kerja, overhead pabrik, distribusi, dan margin keuntungan.
            </p>
        </div>
    `;
    
    document.getElementById('bom-calculation-steps').innerHTML = resultHTML;
    document.getElementById('bom-result').style.display = 'block';
    
    // Scroll to result
    document.getElementById('bom-result').scrollIntoView({ behavior: 'smooth' });
    
    showAlert('Perhitungan BOM berhasil!', 'success');
}
