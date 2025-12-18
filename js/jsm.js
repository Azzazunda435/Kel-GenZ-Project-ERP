// JSM (Job Sequencing Method) Calculator - Johnson's Algorithm
let jsmJobs = [];

// Initialize with example data
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('jsm-jobs')) {
        jsmJobs = [
            { id: generateId(), name: 'Job A', machine1: 5, machine2: 8 },
            { id: generateId(), name: 'Job B', machine1: 9, machine2: 4 },
            { id: generateId(), name: 'Job C', machine1: 7, machine2: 6 },
            { id: generateId(), name: 'Job D', machine1: 3, machine2: 9 },
            { id: generateId(), name: 'Job E', machine1: 8, machine2: 5 }
        ];
        renderJSMJobs();
    }
});

function renderJSMJobs() {
    const container = document.getElementById('jsm-jobs');
    container.innerHTML = '';
    
    jsmJobs.forEach((job, index) => {
        const jobDiv = document.createElement('div');
        jobDiv.className = 'input-row';
        jobDiv.style.marginBottom = '1rem';
        jobDiv.innerHTML = `
            <div class="input-group">
                <label>Nama Job:</label>
                <input type="text" value="${job.name}" 
                    onchange="updateJobName(${index}, this.value)"
                    placeholder="Job ${String.fromCharCode(65 + index)}">
            </div>
            <div class="input-group">
                <label>Waktu Mesin 1 (jam):</label>
                <input type="number" value="${job.machine1}" min="0"
                    onchange="updateJobMachine1(${index}, this.value)">
            </div>
            <div class="input-group">
                <label>Waktu Mesin 2 (jam):</label>
                <input type="number" value="${job.machine2}" min="0"
                    onchange="updateJobMachine2(${index}, this.value)">
            </div>
            <div class="input-group" style="display: flex; align-items: flex-end;">
                <button class="btn btn-danger btn-small" onclick="removeJSMJob(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        container.appendChild(jobDiv);
    });
}

function addJSMJob() {
    const jobLetter = String.fromCharCode(65 + jsmJobs.length);
    jsmJobs.push({
        id: generateId(),
        name: `Job ${jobLetter}`,
        machine1: 0,
        machine2: 0
    });
    renderJSMJobs();
}

function removeJSMJob(index) {
    if (jsmJobs.length <= 2) {
        showAlert('Minimal harus ada 2 job!', 'warning');
        return;
    }
    jsmJobs.splice(index, 1);
    renderJSMJobs();
}

function updateJobName(index, value) {
    jsmJobs[index].name = value || `Job ${String.fromCharCode(65 + index)}`;
}

function updateJobMachine1(index, value) {
    jsmJobs[index].machine1 = parseFloat(value) || 0;
}

function updateJobMachine2(index, value) {
    jsmJobs[index].machine2 = parseFloat(value) || 0;
}

function calculateJSM() {
    if (jsmJobs.length < 2) {
        showAlert('Minimal harus ada 2 job untuk dijadwalkan!', 'warning');
        return;
    }
    
    let resultHTML = '';
    
    // Step 1: Show input data
    resultHTML += `
        <div class="step-box">
            <h4>2. Data Waktu Proses Job</h4>
            <table class="calculation-table">
                <thead>
                    <tr>
                        <th>Job</th>
                        <th>Mesin 1 (jam)</th>
                        <th>Mesin 2 (jam)</th>
                    </tr>
                </thead>
                <tbody>
                    ${jsmJobs.map(job => `
                        <tr>
                            <td><strong>${job.name}</strong></td>
                            <td>${job.machine1}</td>
                            <td>${job.machine2}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
    
    // Step 2: Apply Johnson's Algorithm
    resultHTML += `
        <div class="step-box">
            <h4>3. Penerapan Algoritma Johnson</h4>
            <p style="margin-bottom: 1rem;"><strong>Aturan Johnson:</strong></p>
            <ol style="margin-left: 2rem; margin-bottom: 1rem;">
                <li>Cari waktu proses terkecil dari semua job di kedua mesin</li>
                <li>Jika waktu terkecil di Mesin 1, tempatkan job di <strong>awal urutan</strong></li>
                <li>Jika waktu terkecil di Mesin 2, tempatkan job di <strong>akhir urutan</strong></li>
                <li>Hapus job yang sudah dijadwalkan dan ulangi hingga semua job terjadwal</li>
            </ol>
            
            <h5 style="color: var(--primary-color); margin: 1.5rem 0 1rem;">Proses Penjadwalan:</h5>
    `;
    
    // Implement Johnson's Algorithm
    let remainingJobs = [...jsmJobs];
    let sequence = [];
    let steps = [];
    
    while (remainingJobs.length > 0) {
        let minTime = Infinity;
        let minJob = null;
        let minMachine = null;
        let minIndex = -1;
        
        // Find minimum time
        remainingJobs.forEach((job, idx) => {
            if (job.machine1 < minTime) {
                minTime = job.machine1;
                minJob = job;
                minMachine = 1;
                minIndex = idx;
            }
            if (job.machine2 < minTime) {
                minTime = job.machine2;
                minJob = job;
                minMachine = 2;
                minIndex = idx;
            }
        });
        
        // Place job according to Johnson's rule
        if (minMachine === 1) {
            sequence.unshift(minJob); // Add to beginning
            steps.push({
                job: minJob.name,
                minTime: minTime,
                machine: 1,
                position: 'awal',
                remaining: remainingJobs.filter((_, i) => i !== minIndex).map(j => j.name).join(', ') || 'Tidak ada'
            });
        } else {
            sequence.push(minJob); // Add to end
            steps.push({
                job: minJob.name,
                minTime: minTime,
                machine: 2,
                position: 'akhir',
                remaining: remainingJobs.filter((_, i) => i !== minIndex).map(j => j.name).join(', ') || 'Tidak ada'
            });
        }
        
        remainingJobs.splice(minIndex, 1);
    }
    
    // Reverse sequence (because we used unshift)
    sequence.reverse();
    
    // Display steps
    steps.reverse().forEach((step, idx) => {
        resultHTML += `
            <div style="background: white; padding: 1rem; border-radius: 6px; margin-bottom: 0.75rem; border-left: 4px solid ${step.machine === 1 ? '#2563eb' : '#10b981'};">
                <p style="font-weight: 600; color: ${step.machine === 1 ? '#2563eb' : '#10b981'};">Iterasi ${idx + 1}:</p>
                <p>• Waktu minimum: <strong>${step.minTime} jam</strong> pada Mesin ${step.machine} (${step.job})</p>
                <p>• Mesin ${step.machine} → Tempatkan di <strong>${step.position}</strong> urutan</p>
                <p>• Job tersisa: ${step.remaining}</p>
            </div>
        `;
    });
    
    resultHTML += `
            <div style="background: linear-gradient(135deg, #10b98115 0%, #22c55e15 100%); padding: 1.5rem; border-radius: 8px; margin-top: 1rem; border: 2px solid var(--success-color);">
                <p style="font-weight: 600; color: var(--success-color); margin-bottom: 0.5rem;">
                    <i class="fas fa-check-circle"></i> Urutan Optimal:
                </p>
                <p style="font-size: 1.3rem; text-align: center; font-weight: 700; color: var(--primary-color);">
                    ${sequence.map(j => j.name).join(' → ')}
                </p>
            </div>
        </div>
    `;
    
    // Step 3: Calculate Schedule
    resultHTML += `
        <div class="step-box">
            <h4>4. Perhitungan Jadwal dan Waktu</h4>
    `;
    
    let machine1Schedule = [];
    let machine2Schedule = [];
    let machine1End = 0;
    let machine2End = 0;
    
    sequence.forEach((job, idx) => {
        // Machine 1
        const m1Start = machine1End;
        const m1End = m1Start + job.machine1;
        machine1End = m1End;
        
        // Machine 2 (must wait for job to finish on Machine 1)
        const m2Start = Math.max(machine2End, m1End);
        const m2End = m2Start + job.machine2;
        machine2End = m2End;
        
        machine1Schedule.push({
            job: job.name,
            start: m1Start,
            end: m1End,
            duration: job.machine1
        });
        
        machine2Schedule.push({
            job: job.name,
            start: m2Start,
            end: m2End,
            duration: job.machine2,
            idle: m2Start - machine2End + job.machine2
        });
    });
    
    resultHTML += `
        <h5 style="color: var(--primary-color); margin-bottom: 1rem;">Jadwal Mesin 1:</h5>
        <table class="calculation-table">
            <thead>
                <tr>
                    <th>Urutan</th>
                    <th>Job</th>
                    <th>Waktu Mulai</th>
                    <th>Waktu Selesai</th>
                    <th>Durasi</th>
                </tr>
            </thead>
            <tbody>
                ${machine1Schedule.map((s, idx) => `
                    <tr>
                        <td>${idx + 1}</td>
                        <td><strong>${s.job}</strong></td>
                        <td>${s.start} jam</td>
                        <td>${s.end} jam</td>
                        <td>${s.duration} jam</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        
        <h5 style="color: var(--secondary-color); margin: 1.5rem 0 1rem;">Jadwal Mesin 2:</h5>
        <table class="calculation-table">
            <thead>
                <tr>
                    <th>Urutan</th>
                    <th>Job</th>
                    <th>Waktu Mulai</th>
                    <th>Waktu Selesai</th>
                    <th>Durasi</th>
                    <th>Idle Time</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    let totalIdle2 = 0;
    machine2Schedule.forEach((s, idx) => {
        const idleTime = idx === 0 ? s.start : (s.start - machine2Schedule[idx - 1].end);
        totalIdle2 += idleTime;
        
        resultHTML += `
            <tr>
                <td>${idx + 1}</td>
                <td><strong>${s.job}</strong></td>
                <td>${s.start} jam</td>
                <td>${s.end} jam</td>
                <td>${s.duration} jam</td>
                <td>${idleTime} jam</td>
            </tr>
        `;
    });
    
    resultHTML += `
            </tbody>
        </table>
        </div>
    `;
    
    // Step 4: Calculate Makespan and Idle Time
    const makespan = machine2End;
    const totalMachine1Time = machine1End;
    const idleMachine1 = makespan - totalMachine1Time;
    
    resultHTML += `
        <div class="step-box">
            <h4>5. Perhitungan Makespan dan Idle Time</h4>
            
            <div style="background: white; padding: 1rem; border-radius: 6px; margin-bottom: 1rem;">
                <p style="font-weight: 600; color: var(--primary-color); margin-bottom: 0.75rem;">Makespan (Total Waktu Penyelesaian):</p>
                <p>Makespan adalah waktu total dari mulai job pertama hingga selesainya semua job pada kedua mesin.</p>
                <p style="font-size: 1.3rem; margin-top: 0.5rem;">
                    Makespan = <strong style="color: var(--success-color);">${makespan} jam</strong>
                </p>
            </div>
            
            <div style="background: white; padding: 1rem; border-radius: 6px;">
                <p style="font-weight: 600; color: var(--secondary-color); margin-bottom: 0.75rem;">Idle Time (Waktu Menganggur):</p>
                <p>• Idle Time Mesin 1: <strong>${idleMachine1} jam</strong></p>
                <p>• Idle Time Mesin 2: <strong>${totalIdle2} jam</strong></p>
                <p style="margin-top: 0.75rem;">Total Idle Time: <strong>${idleMachine1 + totalIdle2} jam</strong></p>
            </div>
        </div>
    `;
    
    // Summary
    resultHTML += `
        <div class="summary-box">
            <h4><i class="fas fa-check-circle"></i> 6. Kesimpulan</h4>
            <div class="summary-item">
                <span>Urutan Optimal:</span>
                <span class="summary-value">${sequence.map(j => j.name).join(' → ')}</span>
            </div>
            <div class="summary-item">
                <span>Makespan (Total Waktu):</span>
                <span class="summary-value">${makespan} jam</span>
            </div>
            <div class="summary-item">
                <span>Total Idle Time:</span>
                <span class="summary-value">${idleMachine1 + totalIdle2} jam</span>
            </div>
            <div class="summary-item">
                <span>Efisiensi Mesin 1:</span>
                <span class="summary-value">${formatNumber((totalMachine1Time / makespan) * 100, 2)}%</span>
            </div>
            <div class="summary-item">
                <span>Efisiensi Mesin 2:</span>
                <span class="summary-value">${formatNumber(((makespan - totalIdle2) / makespan) * 100, 2)}%</span>
            </div>
            <p style="margin-top: 1rem; padding: 1rem; background: #dbeafe; border-radius: 6px; font-style: italic; color: #1e40af;">
                <i class="fas fa-info-circle"></i> 
                Algoritma Johnson menghasilkan urutan optimal yang meminimalkan total waktu penyelesaian (makespan) 
                untuk penjadwalan 2 mesin dengan aliran job yang sama.
            </p>
        </div>
    `;
    
    document.getElementById('jsm-calculation-steps').innerHTML = resultHTML;
    document.getElementById('jsm-result').style.display = 'block';
    
    document.getElementById('jsm-result').scrollIntoView({ behavior: 'smooth' });
    showAlert('Perhitungan JSM berhasil!', 'success');
}
