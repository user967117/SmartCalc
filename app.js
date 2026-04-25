class CalculatorModel {
    constructor() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.users = JSON.parse(localStorage.getItem('smartCalcUsers')) || [];
        this.activeUser = JSON.parse(localStorage.getItem('smartCalcActiveUser')) || null;
    }

    clear() { this.currentOperand = '0'; this.previousOperand = ''; this.operation = undefined; }
    delete() { 
        if (this.currentOperand.length <= 1) this.currentOperand = '0';
        else this.currentOperand = this.currentOperand.slice(0, -1);
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') this.currentOperand = number.toString();
        else this.currentOperand += number.toString();
    }

    chooseOperation(op) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') this.calculate();
        this.operation = op;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }

    calculate() {
        let computation;
        const isHex = /[A-F]/.test(this.previousOperand) || /[A-F]/.test(this.currentOperand);
        const prev = isHex ? parseInt(this.previousOperand, 16) : parseFloat(this.previousOperand);
        const current = isHex ? parseInt(this.currentOperand, 16) : parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case '+': computation = prev + current; break;
            case '−': case '-': computation = prev - current; break;
            case '×': case '*': computation = prev * current; break;
            case '÷': case '/': computation = current === 0 ? 0 : prev / current; break;
            case '%': computation = prev % current; break;
            case '<<': computation = (prev << current) >>> 0; break;
            case '>>': computation = (prev >>> current) >>> 0; break;
            default: return;
        }
        this.currentOperand = isHex ? computation.toString(16).toUpperCase() : computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
    }

    getProgrammerValues() {
        let num = parseInt(this.currentOperand || '0', /[A-F]/.test(this.currentOperand) ? 16 : 10);
        let u = num >>> 0;
        return { HEX: u.toString(16).toUpperCase(), DEC: num.toString(10), OCT: u.toString(8), BIN: u.toString(2) };
    }

    registerUser(name, email, pass, gender, date) {
        if (this.users.find(u => u.email === email)) return { success: false, msg: "Email вже існує" };
        this.users.push({ name, email, pass, gender, date });
        localStorage.setItem('smartCalcUsers', JSON.stringify(this.users));
        return { success: true };
    }

    loginUser(email, pass) {
        const u = this.users.find(u => u.email === email && u.pass === pass);
        if (u) {
            this.activeUser = u;
            localStorage.setItem('smartCalcActiveUser', JSON.stringify(u));
            return true;
        }
        return false;
    }

    logout() { localStorage.removeItem('smartCalcActiveUser'); window.location.href = 'login.html'; }
}

class CalculatorView {
    constructor() {
        this.display = document.querySelector('.display');
        this.nav = document.querySelector('.navbar-nav');
        this.progLabels = document.querySelectorAll('#prog span:nth-child(2)');
    }

    updateDisplay(val) { if (this.display) this.display.innerText = val; }
    updateProg(v) { if (this.progLabels.length >= 4) { this.progLabels[0].innerText = v.HEX; this.progLabels[1].innerText = v.DEC; this.progLabels[2].innerText = v.OCT; this.progLabels[3].innerText = v.BIN; } }

    updateHeader(user) {
        if (!this.nav) return;
        if (user) {
            this.nav.innerHTML = `<a class="nav-link" href="index.html">Калькулятор</a><a class="nav-link" href="about.html">Про додаток</a><a class="nav-link" href="profile.html">Профіль (${user.name})</a><a class="nav-link text-danger" href="#" id="logout-btn">Вийти</a>`;
        }
    }

    showProfile(user) {
        const content = document.getElementById('profile-content');
        const alert = document.getElementById('login-alert');
        if (!content) return;
        if (user) {
            document.getElementById('prof-name').innerText = user.name;
            document.getElementById('prof-email').innerText = user.email;
            document.getElementById('prof-gender').innerText = user.gender;
            document.getElementById('prof-date').innerText = user.date;
        } else {
            content.classList.add('d-none');
            alert.classList.remove('d-none');
        }
    }
}

class CalculatorController {
    constructor(m, v) {
        this.m = m; this.v = v;
        this.v.updateHeader(this.m.activeUser);
        this.v.showProfile(this.m.activeUser);
        this.updateUI();
        this.setupListeners();
    }

    updateUI() {
        this.v.updateDisplay(this.m.currentOperand);
        this.v.updateProg(this.m.getProgrammerValues());
    }

    setupListeners() {
        document.querySelectorAll('.btn-num').forEach(b => b.onclick = () => { this.m.appendNumber(b.innerText.trim()); this.updateUI(); });
        document.querySelectorAll('.btn-op').forEach(b => b.onclick = () => {
            const val = b.innerText.trim();
            if (val === 'C' || val === 'CE') this.m.clear();
            else if (val === '⌫') this.m.delete();
            else if (['A','B','C','D','E','F'].includes(val) && b.classList.contains('text-secondary')) this.m.appendNumber(val);
            else this.m.chooseOperation(val);
            this.updateUI();
        });
        document.querySelectorAll('.btn-eq').forEach(b => b.onclick = () => { this.m.calculate(); this.updateUI(); });

        const regF = document.getElementById('register-form');
        if (regF) regF.onsubmit = (e) => {
            e.preventDefault();
            const r = this.m.registerUser(document.getElementById('reg-name').value, document.getElementById('reg-email').value, document.getElementById('reg-pass').value, document.querySelector('input[name="gender"]:checked').value, document.getElementById('reg-date').value);
            if (r.success) { alert("Успіх!"); window.location.href = 'login.html'; } else alert(r.msg);
        };

        const logF = document.getElementById('login-form');
        if (logF) logF.onsubmit = (e) => {
            e.preventDefault();
            if (this.m.loginUser(document.getElementById('log-email').value, document.getElementById('log-pass').value)) window.location.href = 'index.html';
            else alert("Помилка входу");
        };

        const outB = document.getElementById('logout-btn');
        if (outB) outB.onclick = () => this.m.logout();
    }
}

document.addEventListener('DOMContentLoaded', () => new CalculatorController(new CalculatorModel(), new CalculatorView()));