// Simple scroll spy and interaction
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
        document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
        this.classList.add('active');
    });
});

// Auto-patching simulation for DevSecOps Dashboard
const patchLog = document.getElementById('patch-log');
const patchedCountEl = document.getElementById('patched-count');
let patchedCount = 1420;

const cves = ['CVE-2025-1023', 'CVE-2024-8921', 'CVE-2025-0012', 'CVE-2024-5544', 'CVE-2025-3301'];
const packages = ['openssl', 'kernel', 'libpng', 'nginx', 'bash', 'python3', 'docker-ce'];

function addLog() {
    if (!patchLog) return;

    const cve = cves[Math.floor(Math.random() * cves.length)];
    const pkg = packages[Math.floor(Math.random() * packages.length)];
    const now = new Date();
    const time = now.getHours().toString().padStart(2, '0') + ':' +
        now.getMinutes().toString().padStart(2, '0') + ':' +
        now.getSeconds().toString().padStart(2, '0');

    const line = document.createElement('div');
    line.style.marginBottom = '4px';
    line.innerHTML = `<span style="color: #666">[${time}]</span> <span style="color: var(--accent-blue)">SCANNING</span> ${pkg} found ${cve}... <span style="color: var(--accent-green)">PATCHED</span>`;

    patchLog.appendChild(line);

    // Keep only last 5 lines
    while (patchLog.children.length > 5) {
        patchLog.removeChild(patchLog.firstChild);
    }

    // Randomly update count
    if (Math.random() > 0.3) {
        patchedCount++;
        if (patchedCountEl) patchedCountEl.innerText = patchedCount.toLocaleString();
    }
}

setInterval(addLog, 2000); // Add new log every 2 seconds

// IAM Visualizer Logic
(function () {
    const canvas = document.getElementById('iam-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let parentWidth = canvas.parentElement.clientWidth;
    let parentHeight = canvas.parentElement.clientHeight;

    canvas.width = parentWidth;
    canvas.height = parentHeight;

    // Resize observer
    window.addEventListener('resize', () => {
        parentWidth = canvas.parentElement.clientWidth;
        parentHeight = canvas.parentElement.clientHeight;
        canvas.width = parentWidth;
        canvas.height = parentHeight;
    });

    // Graph State
    const nodes = [];
    const nodeCount = 8;
    for (let i = 0; i < nodeCount; i++) {
        nodes.push({
            x: Math.random() * parentWidth,
            y: Math.random() * parentHeight,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            type: i === 0 ? 'root' : 'role' // 0 is root/admin, others are roles
        });
    }

    let auditState = 0; // 0: Analyze (red lines), 1: Remediate (fading red), 2: Secure (green lines)
    const statusBox = document.getElementById('iam-status');

    function cycleAudit() {
        auditState = (auditState + 1) % 3;
        if (statusBox) {
            if (auditState === 0) statusBox.innerHTML = "STATUS: DETECTING EXCESSIVE PERMISSIONS...";
            if (auditState === 1) statusBox.innerHTML = "STATUS: REMOVING WILDCARD POLICIES...";
            if (auditState === 2) statusBox.innerHTML = "STATUS: LEAST-PRIVILEGE ENFORCED";
        }
    }
    setInterval(cycleAudit, 3000);

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update and Draw Nodes
        nodes.forEach(node => {
            node.x += node.vx;
            node.y += node.vy;
            if (node.x < 0 || node.x > parentWidth) node.vx *= -1;
            if (node.y < 0 || node.y > parentHeight) node.vy *= -1;

            ctx.beginPath();
            ctx.arc(node.x, node.y, 4, 0, Math.PI * 2);
            ctx.fillStyle = node.type === 'root' ? '#fff' : '#888';
            ctx.fill();
        });

        // Draw Connections
        // Root is nodes[0]
        for (let i = 1; i < nodes.length; i++) {
            const dist = Math.hypot(nodes[i].x - nodes[0].x, nodes[i].y - nodes[0].y);
            if (dist < 150) {
                ctx.beginPath();
                ctx.moveTo(nodes[0].x, nodes[0].y);
                ctx.lineTo(nodes[i].x, nodes[i].y);

                // Color logic based on audit state
                // Some nodes are "risky" (indices 1, 2, 3)
                let isRisky = i < 4;

                if (auditState === 0 && isRisky) {
                    ctx.strokeStyle = `rgba(255, 95, 86, ${1 - dist / 150})`; // Red
                } else if (auditState === 1 && isRisky) {
                    ctx.strokeStyle = `rgba(255, 189, 46, ${1 - dist / 150})`; // Yellow/Fixing
                } else {
                    ctx.strokeStyle = `rgba(0, 255, 65, ${0.5 - (dist / 150) * 0.5})`; // Green
                }

                ctx.lineWidth = 1.5;
                ctx.stroke();
            }
        }

        requestAnimationFrame(draw);
    }
    draw();
})();

// MCP Terminal Simulation
(function () {
    const mcpOutput = document.getElementById('mcp-output');
    if (!mcpOutput) return;

    const sequences = [
        { text: "> list all idle RDS instances in us-east-1", type: "input" },
        { text: "[INFO] Querying AWS Organizations (Account A, B, C)...", type: "info" },
        { text: "[SUCCESS] Found 3 idle instances:", type: "success" },
        { text: `{\n  "instances": [\n    { "id": "db-abc-123", "status": "available", "cx": 0 },\n    { "id": "db-def-456", "status": "available", "cx": 0 }\n  ]\n}`, type: "json" }
    ];

    let step = 0;
    let charIndex = 0;
    let currentText = "";

    function typeWriter() {
        if (step >= sequences.length) {
            setTimeout(() => {
                mcpOutput.innerHTML = '';
                step = 0;
                setTimeout(typeWriter, 1000);
            }, 5000);
            return;
        }

        const seq = sequences[step];

        if (seq.type === "input") {
            if (charIndex < seq.text.length) {
                currentText += seq.text.charAt(charIndex);
                mcpOutput.innerHTML = `<span style="color: var(--accent-blue)">${currentText}</span><span class="pulse" style="display:inline-block; width:5px; height:10px; background:var(--accent-blue); margin-left:2px;"></span>`;
                charIndex++;
                setTimeout(typeWriter, 50 + Math.random() * 50);
            } else {
                mcpOutput.innerHTML = `<span style="color: var(--accent-blue)">${currentText}</span><br>`;
                step++;
                charIndex = 0;
                currentText = "";
                setTimeout(typeWriter, 500);
            }
        } else {
            // Instant output for system messages
            let color = "#aaa";
            if (seq.type === "success") color = "var(--accent-green)";
            if (seq.type === "json") color = "#e0e0e0";

            const div = document.createElement('div');
            div.style.color = color;
            if (seq.type === "json") div.style.whiteSpace = "pre";
            div.innerText = seq.text;
            mcpOutput.appendChild(div);
            step++;
            setTimeout(typeWriter, 800);
        }
    }
    typeWriter();
})();

// Anomaly Graph Simulation
(function () {
    const canvas = document.getElementById('anomaly-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = canvas.parentElement.clientWidth;
    let height = canvas.parentElement.clientHeight;
    canvas.width = width;
    canvas.height = height;

    window.addEventListener('resize', () => {
        width = canvas.parentElement.clientWidth;
        height = canvas.parentElement.clientHeight;
        canvas.width = width;
        canvas.height = height;
    });

    const dataPoints = new Array(Math.ceil(width / 5)).fill(height / 2);
    let time = 0;

    function draw() {
        // Shift left
        for (let i = 0; i < dataPoints.length - 1; i++) {
            dataPoints[i] = dataPoints[i + 1];
        }

        // Add new point (Sine wave + Random Noise + Occasional Spike)
        let y = height / 2 + Math.sin(time * 0.1) * 20 + (Math.random() - 0.5) * 10;

        // Spike logic
        if (Math.random() > 0.98) {
            y = height / 4 + Math.random() * 10; // High spike
            const statusEl = document.getElementById('anomaly-status');
            if (statusEl) {
                statusEl.innerText = "ALERT: ANOMALY DETECTED [LogID: 9X82]";
                statusEl.style.textShadow = "0 0 5px red";
            }
        } else {
            const statusEl = document.getElementById('anomaly-status');
            if (statusEl && statusEl.innerText.includes("ALERT")) {
                setTimeout(() => {
                    statusEl.innerText = "STATUS: MONITORING LOG STREAMS";
                    statusEl.style.textShadow = "none";
                }, 1000);
            }
        }

        dataPoints[dataPoints.length - 1] = y;
        time++;

        ctx.fillStyle = 'rgba(0,0,0,0.1)'; // Fade effect
        ctx.fillRect(0, 0, width, height);

        ctx.beginPath();
        ctx.moveTo(0, dataPoints[0]);
        for (let i = 1; i < dataPoints.length; i++) {
            ctx.lineTo(i * 5, dataPoints[i]);
        }

        ctx.strokeStyle = '#ff5f56';
        ctx.lineWidth = 2;
        ctx.shadowBlur = 5;
        ctx.shadowColor = '#ff5f56';
        ctx.stroke();
        ctx.shadowBlur = 0;

        requestAnimationFrame(draw);
    }
    draw();
})();

// ============================================
// 1. Matrix Digital Rain Background
// ============================================
(function () {
    const canvas = document.getElementById('matrix-bg');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // Resize listener
    window.addEventListener('resize', () => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    });

    const cols = Math.floor(width / 20) + 1;
    const ypos = Array(cols).fill(0);

    function matrix() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = '#0f0';
        ctx.font = '15pt monospace';

        ypos.forEach((y, i) => {
            const text = String.fromCharCode(Math.random() * 128);
            const x = i * 20;
            ctx.fillText(text, x, y);

            if (y > 100 + Math.random() * 10000) ypos[i] = 0;
            else ypos[i] = y + 20;
        });
    }

    setInterval(matrix, 50);
})();

// ============================================
// 2. Hacker Text Decoding Effect
// ============================================
(function () {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890@#$%^&*";
    const head = document.querySelector('.hacker-text');
    if (!head) return;

    let intervals = null;

    head.onmouseover = event => {
        let iteration = 0;
        clearInterval(intervals);

        intervals = setInterval(() => {
            event.target.innerText = event.target.innerText
                .split("")
                .map((letter, index) => {
                    if (index < iteration) {
                        return event.target.dataset.value[index];
                    }
                    return letters[Math.floor(Math.random() * 26)];
                })
                .join("");

            if (iteration >= event.target.dataset.value.length) {
                clearInterval(intervals);
            }

            iteration += 1 / 3;
        }, 30);
    }

    // Trigger once on load
    head.dispatchEvent(new MouseEvent('mouseover'));
})();

// ============================================
// 3. Command Palette (Ctrl/Cmd + K)
// ============================================
// ============================================
// 3. Command Palette (Interactive Terminal)
// ============================================
(function () {
    const overlay = document.getElementById('cmd-overlay');
    const input = document.getElementById('cmd-input');
    const results = document.getElementById('cmd-results');
    if (!overlay || !input) return;

    // Standard Actions
    const actions = [
        { id: 'home', label: 'Go to Home', desc: 'Scroll to top', action: () => scrollTo('#home') },
        { id: 'projects', label: 'View Projects', desc: 'Jump to Deployments', action: () => scrollTo('#projects') },
        { id: 'resume', label: 'Download Resume', desc: 'Get the PDF', action: () => document.querySelector('a[download]').click() },
        { id: 'email', label: 'Send Email', desc: 'Open mail client', action: () => window.location.href = "mailto:workwithbhaveshcc@gmail.com" },
        { id: 'github', label: 'Open GitHub', desc: 'Visit profile', action: () => window.open("https://github.com/bhaveshopss", "_blank") },
        { id: 'linkedin', label: 'Open LinkedIn', desc: 'Visit profile', action: () => window.open("https://www.linkedin.com/in/bhaveshops/", "_blank") },
        { id: 'skills', label: 'View Tech Stack', desc: 'Languages & Tools', action: () => scrollTo('#skills') }
    ];

    // Terminal Commands
    const commands = {
        'help': 'Available: ls, cd [dir], cat [file], clear, exit',
        'ls': 'Home  Experience  Deployments  Tech-Stack  Credentials  resume.pdf',
        'whoami': 'Bhavesh Kumar Parmar | Cloud & DevOps Engineer',
        'date': new Date().toString(),
        'clear': () => { results.innerHTML = ''; input.value = ''; },
        'exit': () => togglePalette(),
        'kubectl': (val) => {
            return `NAME                   READY   STATUS    RESTARTS   AGE
web-portfolio-v2       1/1     Running   0          2d
api-gateway            1/1     Running   0          5h
legacy-monolith        0/1     Error     12         5y (Click to fix components)
db-cluster-primary     3/3     Running   0          30d`;
        }
    };

    // Toggle via keyboard
    document.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            togglePalette();
        }
        if (e.key === 'Escape' && !overlay.classList.contains('hidden')) {
            togglePalette();
        }
    });

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) togglePalette();
    });

    function togglePalette() {
        overlay.classList.toggle('hidden');
        if (!overlay.classList.contains('hidden')) {
            input.value = "";
            input.focus();
            renderResults("");
        }
    }

    function scrollTo(id) {
        document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
        togglePalette();
    }

    // Command Router
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const raw = input.value.trim();
            const args = raw.toLowerCase().split(' ');
            const cmd = args[0];

            // Check if it matches a clickable action first (fuzzy match)
            const actionMatch = actions.find(a => a.id === cmd);
            if (actionMatch) {
                actionMatch.action();
                return;
            }

            // Otherwise treat as terminal command
            const history = document.createElement('div');
            history.innerHTML = `<span style="color:#0f0">guest@portfolio:~$</span> ${raw}`;
            history.style.borderBottom = '1px solid #333';
            history.style.padding = '5px 0';
            // Prepend new history (or append if you prefer standard terminal flow)
            // But visually, existing results are clickable items. Let's clear them for terminal mode
            if (results.querySelector('.cmd-item')) results.innerHTML = '';

            results.appendChild(history);

            let output = '';
            if (commands[cmd]) {
                if (typeof commands[cmd] === 'function') {
                    commands[cmd]();
                    return;
                }
                output = commands[cmd];
            } else if (cmd === 'cd') {
                const map = { 'home': '#home', 'experience': '#experience', 'deployments': '#projects', 'projects': '#projects', 'skills': '#skills' };
                if (map[args[1]]) {
                    output = `Navigating to ${args[1]}...`;
                    scrollTo(map[args[1]]);
                } else {
                    output = `cd: no such directory: ${args[1] || ''}`;
                }
            } else if (cmd === 'cat') {
                if (raw.includes('resume')) {
                    output = 'Initating download...';
                    document.querySelector('a[download]').click();
                } else {
                    output = 'cat: file not found';
                }
            } else {
                output = `Command not found: ${cmd}`;
            }

            if (output) {
                const resp = document.createElement('div');
                resp.style.color = '#ccc';
                resp.style.padding = '5px 0 15px 0';
                resp.innerText = output;
                results.appendChild(resp);
            }
            input.value = '';
            results.scrollTop = results.scrollHeight;
        }
    });

    // Default Render (Clickable Menu)
    input.addEventListener('input', (e) => renderResults(e.target.value));

    function renderResults(query) {
        // If query looks like a command, don't show clickable menu
        if (query.startsWith('ls') || query.startsWith('cd ') || query.startsWith('cat ')) return;

        results.innerHTML = "";
        const filtered = actions.filter(c =>
            c.label.toLowerCase().includes(query.toLowerCase()) ||
            c.desc.toLowerCase().includes(query.toLowerCase())
        );

        filtered.forEach(cmd => {
            const div = document.createElement('div');
            div.className = 'cmd-item';
            div.innerHTML = `
                <span>${cmd.label} <span style="font-size:0.7rem; color:#666; margin-left:10px;">${cmd.desc}</span></span>
                <span class="cmd-key">↵</span>
            `;
            div.onclick = cmd.action;
            results.appendChild(div);
        });
    }
})();

// ============================================
// 4. Server Live Stats Simulation
// ============================================
(function () {
    function rand(min, max) { return Math.floor(Math.random() * (max - min + 1) + min); }

    setInterval(() => {
        const cpu = document.getElementById('cpu-stat');
        const ram = document.getElementById('ram-stat');
        const net = document.getElementById('net-stat');

        if (cpu) cpu.innerText = rand(5, 40) + "%";
        if (ram) ram.innerText = (4 + Math.random()).toFixed(1) + "GB";
        if (net) net.innerText = rand(15, 60) + "ms";

        // Occasional spike
        if (Math.random() > 0.95 && cpu) cpu.innerText = rand(70, 99) + "%";
    }, 2000);
})();

// ============================================
// 6. Custom Cloud Cursor
// ============================================
(function () {
    const cursor = document.getElementById('cursor');
    const trail = document.getElementById('cursor-trail');
    if (!cursor || !trail) return;

    document.addEventListener('mousemove', e => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';

        // Trail lag
        setTimeout(() => {
            trail.style.left = e.clientX + 'px';
            trail.style.top = e.clientY + 'px';
        }, 50);
    });

    // Hover effects
    document.querySelectorAll('a, button, .card').forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('hover-active'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('hover-active'));
    });
})();

// ============================================
// 7. CI/CD Pipeline Simulator
// ============================================
(function () {
    const stages = ['build', 'test', 'security', 'deploy'];
    const connectors = document.querySelectorAll('.connector');

    function resetPipeline() {
        stages.forEach(id => {
            const el = document.getElementById('stage-' + id);
            if (el) {
                el.classList.remove('active', 'success');
                const icon = el.querySelector('.stage-icon');
                if (icon) icon.innerHTML = getIcon(id);
            }
        });
        connectors.forEach(c => c.classList.remove('filled'));
        setTimeout(runPipeline, 1000);
    }

    function getIcon(id) {
        if (id === 'build') return '<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>';
        if (id === 'test') return '<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M10 2v7.31"></path><path d="M14 2v7.31"></path><path d="M8.5 2h7"></path><path d="M14 9.3a6.5 6.5 0 1 1-4 0V2"></path></svg>';
        if (id === 'security') return '<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>';
        if (id === 'deploy') return '<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path></svg>';
    }

    function runPipeline() {
        let delay = 0;

        stages.forEach((id, index) => {
            setTimeout(() => {
                const el = document.getElementById('stage-' + id);
                if (!el) return;

                // Active State
                el.classList.add('active');

                // Success State (after work simulation)
                setTimeout(() => {
                    el.classList.remove('active');
                    el.classList.add('success');
                    el.querySelector('.stage-icon').innerHTML = '<svg class="icon" style="color:var(--accent-green)" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>';

                    // Fill connector
                    if (index < connectors.length) {
                        connectors[index].classList.add('filled');
                    }

                    // If last stage, reset
                    if (index === stages.length - 1) {
                        setTimeout(resetPipeline, 3000);
                    }
                }, 1500);

            }, delay);
            delay += 2000;
        });
    }

    // Check if visible then start
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                runPipeline();
                observer.disconnect();
            }
        });
    });

    const container = document.querySelector('.pipeline-container');
    if (container) observer.observe(container);
})();

// ============================================
// 8. Terraform Plan Stream
// ============================================
(function () {
    const termOutput = document.getElementById('terraform-output');
    if (!termOutput) return;

    const planOutput = [
        "Terraform used the selected providers to generate the following execution plan...",
        "",
        "<span style='color:#a5d6ff'># aws_vpc.main_vpc</span> will be created",
        "+ resource \"aws_vpc\" \"main_vpc\" {",
        "    + cidr_block           = \"10.0.0.0/16\"",
        "    + enable_dns_hostnames = true",
        "    + enable_dns_support   = true",
        "    + instance_tenancy     = \"default\"",
        "    + tags                 = {",
        "        + \"Name\" = \"production-vpc\"",
        "      }",
        "  }",
        "",
        "<span style='color:#a5d6ff'># aws_eks_cluster.cluster</span> will be created",
        "+ resource \"aws_eks_cluster\" \"cluster\" {",
        "    + arn                   = (known after apply)",
        "    + name                  = \"prod-k8s-cluster\"",
        "    + role_arn              = \"arn:aws:iam::123:role/eks-role\"",
        "    + version               = \"1.27\"",
        "  }",
        "",
        "<span style='color:#7ee787'>Plan:</span> 14 to add, 0 to change, 0 to destroy."
    ];

    let line = 0;

    // Pre-populate slightly
    function addLine(text) {
        const div = document.createElement('div');
        div.innerHTML = text;
        div.style.marginBottom = "4px";
        termOutput.appendChild(div);
        termOutput.scrollTop = termOutput.scrollHeight;
    }

    function streamLog() {
        if (line < planOutput.length) {
            addLine(planOutput[line]);
            line++;
            setTimeout(streamLog, 100);
        } else {
            setTimeout(() => {
                termOutput.innerHTML = '';
                line = 0;
                streamLog();
            }, 5000);
        }
    }

    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) streamLog();
    });
    observer.observe(termOutput);
})();

// ============================================
// 9. Architecture Drag & Drop Sandbox (Renumbered)
// ============================================

// ============================================
// 10. Architecture Drag & Drop Sandbox
// ============================================
(function () {
    const draggables = document.querySelectorAll('.draggable-item');
    const dropZone = document.getElementById('vpc-zone');
    const status = document.getElementById('deploy-status');
    if (!dropZone) return;

    draggables.forEach(drag => {
        drag.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('type', e.target.dataset.type);
            e.dataTransfer.setData('text', e.target.innerText);
        });

        // Touch/Click Support for Mobile
        drag.addEventListener('click', () => {
            const type = drag.dataset.type;
            const text = drag.innerText;
            deployItem(type, text, 50 + Math.random() * 200, 50 + Math.random() * 100);
        });
    });

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('drag-over');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');

        const type = e.dataTransfer.getData('type');
        const text = e.dataTransfer.getData('text');
        deployItem(type, text, e.offsetX, e.offsetY);
    });

    function deployItem(type, text, x, y) {
        // Create deployed item
        const item = document.createElement('div');
        item.className = 'deployed-item';
        item.innerText = text;

        // Bounds checking
        if (x < 0) x = 10;
        if (y < 0) y = 10;

        item.style.left = (x - 30) + "px";
        item.style.top = (y - 15) + "px";

        dropZone.appendChild(item);

        // Simulate deployment status
        status.innerText = `>> Deploying ${type.toUpperCase()} instance... [OK]`;
        status.style.opacity = 1;

        setTimeout(() => {
            status.style.opacity = 0.7;
        }, 2000);
    }
})();

// ============================================
// 11. Deploy Button Logic (Confetti)
// ============================================
(function () {
    const btn = document.getElementById('deploy-btn');
    const progress = btn?.querySelector('.btn-progress');
    const text = btn?.querySelector('.btn-text');

    if (!btn) return;

    btn.addEventListener('click', () => {
        if (btn.classList.contains('deploying')) return;

        // Start Deployment
        btn.classList.add('deploying');
        text.innerText = "PROVISIONING OFFER LETTER...";
        progress.style.width = "100%";

        setTimeout(() => {
            text.innerText = "DEPLOYMENT SUCCESSFUL!";
            fireConfetti();

            setTimeout(() => {
                window.location.href = "mailto:workwithbhaveshcc@gmail.com?subject=Job Offer: Cloud Engineer Position";

                // Reset after a while
                setTimeout(() => {
                    progress.style.width = "0%";
                    text.innerHTML = `
                        <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path></svg>
                        INITIALIZE_CONTACT_PROTOCOL
                    `;
                    btn.classList.remove('deploying');
                }, 3000);
            }, 1500);
        }, 3000);
    });

    function fireConfetti() {
        const canvas = document.getElementById('confetti-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = [];
        const colors = ['#00ff41', '#00bfff', '#ffffff'];

        for (let i = 0; i < 150; i++) {
            particles.push({
                x: window.innerWidth / 2,
                y: window.innerHeight / 2,
                r: Math.random() * 6 + 2,
                dx: (Math.random() - 0.5) * 15,
                dy: (Math.random() - 0.5) * 15,
                color: colors[Math.floor(Math.random() * colors.length)],
                life: 100
            });
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let active = false;

            particles.forEach(p => {
                if (p.life > 0) {
                    active = true;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                    ctx.fillStyle = p.color;
                    ctx.fill();

                    p.x += p.dx;
                    p.y += p.dy;
                    p.dy += 0.2; // Gravity
                    p.life--;
                    p.r *= 0.96; // Shrink
                }
            });

            if (active) requestAnimationFrame(animate);
            else ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        animate();
    }
})();

// ============================================
// 12. Observability (Grafana & K8s)
// ============================================
(function () {
    // A. Grafana Chart (Simulated)
    const canvas = document.getElementById('grafana-chart');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let dataPoints = new Array(50).fill(0).map(() => Math.random() * 50 + 20);

        function drawChart() {
            // Resize logic
            canvas.width = canvas.parentElement.offsetWidth;
            canvas.height = canvas.parentElement.offsetHeight;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Grid
            ctx.strokeStyle = '#222';
            ctx.lineWidth = 1;
            ctx.beginPath();
            for (let i = 0; i < canvas.width; i += 50) { ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); }
            for (let i = 0; i < canvas.height; i += 40) { ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); }
            ctx.stroke();

            // Line
            ctx.beginPath();
            ctx.strokeStyle = '#00ff41'; // Green Line
            ctx.lineWidth = 2;

            const step = canvas.width / (dataPoints.length - 1);
            dataPoints.forEach((val, i) => {
                const y = canvas.height - (val / 100 * canvas.height);
                if (i === 0) ctx.moveTo(0, y);
                else ctx.lineTo(i * step, y);
            });
            ctx.stroke();

            // Fill
            ctx.lineTo(canvas.width, canvas.height);
            ctx.lineTo(0, canvas.height);
            ctx.fillStyle = 'rgba(0, 255, 65, 0.1)';
            ctx.fill();

            // Update Data
            dataPoints.shift();
            // Random walk
            let last = dataPoints[dataPoints.length - 1];
            let next = last + (Math.random() - 0.5) * 20;
            if (next < 10) next = 10;
            if (next > 90) next = 90;
            dataPoints.push(next);

            requestAnimationFrame(() => setTimeout(drawChart, 100)); // 10fps
        }
        drawChart();
    }

    // B. K8s Pod Grid
    const grid = document.getElementById('k8s-grid');
    if (grid) {
        const totalPods = 24;

        for (let i = 0; i < totalPods; i++) {
            const pod = document.createElement('div');
            pod.className = 'pod-hex';
            // Randomly assign error state to 20% of pods initially
            if (Math.random() > 0.8) pod.classList.add('pod-error');

            pod.addEventListener('click', () => {
                if (pod.classList.contains('pod-error')) {
                    // Self Heal
                    pod.classList.add('healing');
                    setTimeout(() => {
                        pod.classList.remove('pod-error', 'healing');
                    }, 500);
                }
            });

            grid.appendChild(pod);
        }

        // Random Chaos Monkey (Breaks a pod every 5s)
        setInterval(() => {
            const pods = document.querySelectorAll('.pod-hex:not(.pod-error)');
            if (pods.length > 0) {
                const victim = pods[Math.floor(Math.random() * pods.length)];
                victim.classList.add('pod-error');
            }
        }, 5000);
    }
})();

// ============================================
// 13. Self-Healing CI/CD AI Agent Simulation
// ============================================
(function () {
    const output = document.getElementById('self-healing-output');
    if (!output) return;

    const scenarios = [
        [
            { text: "[GitHub Actions] Build #247 FAILED", type: "error" },
            { text: "[AI Agent] Fetching logs via LangChain pipeline...", type: "info" },
            { text: "[Gemini Pro] Analyzing: ModuleNotFoundError: 'requests'", type: "analyze" },
            { text: "[AI Agent] Root cause: Missing dependency in requirements.txt", type: "warning" },
            { text: "[Self-Heal] Adding 'requests==2.31.0' to requirements.txt", type: "fix" },
            { text: "[GitOps] Committing fix → Triggering rebuild...", type: "success" },
            { text: "[Pipeline] Build #248 PASSED ✓", type: "success" }
        ],
        [
            { text: "[Jenkins] Pipeline 'deploy-prod' FAILED", type: "error" },
            { text: "[AI Agent] Retrieving build context from Jenkins API...", type: "info" },
            { text: "[Gemini Pro] Detected: ImagePullBackOff - invalid registry", type: "analyze" },
            { text: "[AI Agent] Diagnosis: ECR login token expired", type: "warning" },
            { text: "[Self-Heal] Refreshing ECR credentials via aws-cli", type: "fix" },
            { text: "[K8s] Redeploying pods to cluster...", type: "success" },
            { text: "[Pipeline] Deployment SUCCESSFUL ✓", type: "success" }
        ],
        [
            { text: "[AWS CodePipeline] Stage 'Test' FAILED", type: "error" },
            { text: "[AI Agent] Injecting logs into Gemini Pro context...", type: "info" },
            { text: "[Gemini Pro] Test failure: AssertionError at test_api.py:42", type: "analyze" },
            { text: "[AI Agent] Flaky test detected - 3 failures in last 10 runs", type: "warning" },
            { text: "[Self-Heal] Quarantining flaky test, notifying team", type: "fix" },
            { text: "[Retry] Re-running pipeline with stable test suite...", type: "success" },
            { text: "[Pipeline] All stages PASSED ✓", type: "success" }
        ]
    ];

    let scenarioIndex = 0;
    let stepIndex = 0;

    function getColor(type) {
        switch (type) {
            case 'error': return '#ff5f56';
            case 'info': return '#00bfff';
            case 'analyze': return '#a78bfa';
            case 'warning': return '#ffbd2e';
            case 'fix': return '#00ff41';
            case 'success': return '#00ff41';
            default: return '#888';
        }
    }

    function addLogLine() {
        const currentScenario = scenarios[scenarioIndex];

        if (stepIndex >= currentScenario.length) {
            // Pause after scenario completes, then reset
            setTimeout(() => {
                output.innerHTML = '';
                scenarioIndex = (scenarioIndex + 1) % scenarios.length;
                stepIndex = 0;
                addLogLine();
            }, 3000);
            return;
        }

        const step = currentScenario[stepIndex];
        const line = document.createElement('div');
        line.style.marginBottom = '5px';
        line.style.opacity = '0';
        line.style.transform = 'translateX(-10px)';
        line.style.transition = 'all 0.3s ease';
        line.innerHTML = `<span style="color: ${getColor(step.type)}">${step.text}</span>`;

        output.appendChild(line);

        // Animate in
        requestAnimationFrame(() => {
            line.style.opacity = '1';
            line.style.transform = 'translateX(0)';
        });

        // Keep only last 6 lines visible
        while (output.children.length > 6) {
            output.removeChild(output.firstChild);
        }

        stepIndex++;

        // Determine delay based on step type
        let delay = 800;
        if (step.type === 'error') delay = 1200;
        if (step.type === 'success') delay = 1000;

        setTimeout(addLogLine, delay);
    }

    // Start animation when card is visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                addLogLine();
                observer.disconnect();
            }
        });
    });

    const card = document.getElementById('self-healing-card');
    if (card) observer.observe(card);
})();

// ============================================
// 14. Theme Toggle (Dark/Light Mode)
// ============================================
(function () {
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;

    // Check for saved preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
    }

    toggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        const isLight = document.body.classList.contains('light-mode');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });
})();

// ============================================
// 15. GitHub Contribution Graph
// ============================================
(function () {
    const grid = document.getElementById('contribution-grid');
    if (!grid) return;

    // Generate 52 weeks x 7 days = 364 days of contributions
    const weeks = 52;
    const daysPerWeek = 7;

    for (let week = 0; week < weeks; week++) {
        const weekCol = document.createElement('div');
        weekCol.style.display = 'flex';
        weekCol.style.flexDirection = 'column';
        weekCol.style.gap = '3px';

        for (let day = 0; day < daysPerWeek; day++) {
            const dayEl = document.createElement('div');
            dayEl.className = 'contribution-day';

            // Random contribution level with some patterns
            const rand = Math.random();
            if (rand > 0.7) {
                const level = Math.ceil(Math.random() * 4);
                dayEl.classList.add(`level-${level}`);
            }

            // Recent weeks have more activity
            if (week > 45 && rand > 0.4) {
                const level = Math.ceil(Math.random() * 4);
                dayEl.classList.add(`level-${level}`);
            }

            weekCol.appendChild(dayEl);
        }
        grid.appendChild(weekCol);
    }
})();

// ============================================
// 16. Contact Form Handler
// ============================================
(function () {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const btn = form.querySelector('.form-submit');
        const originalText = btn.innerHTML;

        // Show sending state
        btn.innerHTML = '<span class="btn-text">SENDING...</span>';
        btn.disabled = true;

        // Simulate sending (replace with actual form submission)
        setTimeout(() => {
            btn.innerHTML = '<span class="btn-text" style="color: #00ff41;">✓ MESSAGE SENT!</span>';

            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.disabled = false;
                form.reset();
            }, 2000);
        }, 1500);

        // For actual submission, you would use:
        // fetch(form.action, { method: 'POST', body: new FormData(form) });
    });
})();

// ============================================
// 17. Scroll-based Navigation Highlight
// ============================================
(function () {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (scrollY >= sectionTop - 300) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
})();

// ============================================
// 18. Smooth Scroll for Navigation
// ============================================
(function () {
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
})();

// ============================================
// 19. Animation on Scroll (Fade In)
// ============================================
(function () {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Apply to cards and sections
    document.querySelectorAll('.case-study-card, .blog-card, .testimonial-card, .opportunity-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
})();

// ============================================
// 20. AI Chatbot (BhaveshBot)
// ============================================
(function () {
    const toggle = document.getElementById('chatbot-toggle');
    const container = document.getElementById('chatbot-container');
    const closeBtn = document.getElementById('chatbot-close');
    const input = document.getElementById('chatbot-input');
    const sendBtn = document.getElementById('chatbot-send');
    const messages = document.getElementById('chatbot-messages');

    if (!toggle || !container || !closeBtn) return;

    // Knowledge base about Bhavesh
    const knowledge = {
        experience: "I have 1+ year of experience as a DevOps Engineer at Shellkode, where I manage multi-cloud infrastructure across AWS, Azure, and GCP for 10+ clients. I've implemented GitOps practices with ArgoCD, automated infrastructure with Terraform, and achieved 40% faster deployments.",
        kubernetes: "I'm deeply experienced with Kubernetes! I manage EKS, AKS, and GKE clusters, implement Helm charts, design pod security policies, and have built custom Kubernetes operators. I also created a self-healing CI/CD platform that automatically diagnoses and fixes K8s issues.",
        skills: "My core skills include: Kubernetes, Terraform, AWS/Azure/GCP, Docker, Jenkins, GitHub Actions, ArgoCD, Ansible, Prometheus, Grafana, Python, and LangChain for AI integrations.",
        projects: "My featured projects include: 1) Self-Healing CI/CD Platform - AI-powered pipeline that auto-diagnoses failures, 2) Cloud Inventory Assistant - Anthropic MCP server for natural language AWS queries, 3) Multi-Cloud IaC Framework with Terraform.",
        education: "I completed B.Tech in Computer Science Engineering from JIET Jodhpur (2020-2024). I was also the President of JIET Student Council, leading 150+ members.",
        certifications: "I hold AWS Certified Solutions Architect certification and have multiple credentials in cloud and DevOps.",
        contact: "You can reach me at workwithbhaveshcc@gmail.com or call +91 88905 69447. I'm also on LinkedIn at linkedin.com/in/bhavesh8890",
        aiops: "I specialize in AIOps - integrating LLMs with DevOps. I've built RAG pipelines for cloud infrastructure, created an MCP server using Anthropic's protocol, and implemented AI-powered log analysis and auto-remediation systems.",
        location: "I'm based in Bangalore, India, and open to remote opportunities worldwide.",
        available: "I'm open for: Full-time DevOps/Cloud Engineer positions, Consulting on cloud architecture, Speaking at tech events, and Open source collaborations.",
        terraform: "I have extensive Terraform experience - managing 200+ cloud resources across AWS, Azure, and GCP. I've built modular IaC frameworks, implemented Terraform Cloud workflows, and reduced infrastructure provisioning time by 60%.",
        hello: "Hello! 👋 I'm BhaveshBot, your AI assistant. Ask me about Bhavesh's skills, projects, or experience!"
    };

    // Toggle chatbot
    toggle.addEventListener('click', () => {
        container.classList.toggle('hidden');
        if (!container.classList.contains('hidden')) {
            setTimeout(() => {
                if (input) input.focus();
            }, 100);
        }
    });

    closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        container.classList.add('hidden');
    });

    // Send message
    function sendMessage() {
        const text = input.value.trim();
        if (!text) return;

        // Add user message
        addMessage(text, 'user');
        input.value = '';

        // Generate response
        setTimeout(() => {
            const response = generateResponse(text.toLowerCase());
            addMessage(response, 'bot');
        }, 500 + Math.random() * 1000);
    }

    function addMessage(text, type) {
        const div = document.createElement('div');
        div.className = `chat-message ${type}`;
        div.innerHTML = `<div class="message-content">${text}</div>`;
        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;
    }

    function generateResponse(query) {
        if (query.includes('hello') || query.includes('hi') || query.includes('hey')) {
            return knowledge.hello;
        }
        if (query.includes('experience') || query.includes('work')) {
            return knowledge.experience;
        }
        if (query.includes('kubernetes') || query.includes('k8s') || query.includes('cluster')) {
            return knowledge.kubernetes;
        }
        if (query.includes('skill') || query.includes('tech') || query.includes('stack')) {
            return knowledge.skills;
        }
        if (query.includes('project') || query.includes('built') || query.includes('created')) {
            return knowledge.projects;
        }
        if (query.includes('education') || query.includes('college') || query.includes('degree')) {
            return knowledge.education;
        }
        if (query.includes('certif')) {
            return knowledge.certifications;
        }
        if (query.includes('contact') || query.includes('email') || query.includes('reach')) {
            return knowledge.contact;
        }
        if (query.includes('ai') || query.includes('llm') || query.includes('aiops') || query.includes('ml')) {
            return knowledge.aiops;
        }
        if (query.includes('location') || query.includes('where') || query.includes('based')) {
            return knowledge.location;
        }
        if (query.includes('hire') || query.includes('available') || query.includes('job') || query.includes('open')) {
            return knowledge.available;
        }
        if (query.includes('terraform') || query.includes('iac') || query.includes('infrastructure')) {
            return knowledge.terraform;
        }

        // Default response
        return "I can tell you about Bhavesh's experience, skills, projects, Kubernetes expertise, AIOps work, or how to contact him. What would you like to know? 🤔";
    }

    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
})();

// ============================================
// Game logic removed

// ============================================
// Voice control logic removed

// ============================================
// K8s visualizer logic removed

// ============================================
// 24. PWA Service Worker Registration
// ============================================
(function () {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            // Service worker will be registered when created
            // navigator.serviceWorker.register('/sw.js');
        });
    }
})();

// Console Easter Egg
console.log('%c Hey there, fellow developer! 👋', 'font-size: 20px; color: #00ff41;');


// ============================================
// 25. Self-Drawing Icon Observer
// ============================================
(function () {
    const observerOptions = {
        threshold: 0.5,
        rootMargin: "0px"
    };

    const drawObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('drawn');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.draw-icon').forEach(icon => {
        drawObserver.observe(icon);
    });
})();

