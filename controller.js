class CalculatorController {
    constructor(m, v) {
        this.m = m;
        this.v = v;
        
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
        document.querySelectorAll('.btn-num').forEach(b => b.onclick = () => { 
            this.m.appendNumber(b.innerText.trim()); 
            this.updateUI(); 
        });
        
        document.querySelectorAll('.btn-op').forEach(b => b.onclick = () => {
            const val = b.innerText.trim();
            if (val === 'C' || val === 'CE') this.m.clear();
            else if (val === '⌫') this.m.delete();
            else if (val === '+/-') this.m.toggleSign();
            else if (['A','B','C','D','E','F'].includes(val) && b.classList.contains('text-secondary')) this.m.appendNumber(val);
            else this.m.chooseOperation(val);
            this.updateUI();
        });
        
        document.querySelectorAll('.btn-eq').forEach(b => b.onclick = () => { 
            this.m.calculate(); 
            this.updateUI(); 
        });

        const regF = document.getElementById('register-form');
        if (regF) regF.onsubmit = (e) => {
            e.preventDefault();
            const r = this.m.registerUser(
                document.getElementById('reg-name').value, 
                document.getElementById('reg-email').value, 
                document.getElementById('reg-pass').value, 
                document.querySelector('input[name="gender"]:checked').value, 
                document.getElementById('reg-date').value
            );
            if (r.success) { 
                alert("Успіх!"); 
                window.location.href = 'login.html'; 
            } else alert(r.msg);
        };

        const logF = document.getElementById('login-form');
        if (logF) logF.onsubmit = (e) => {
            e.preventDefault();
            if (this.m.loginUser(document.getElementById('log-email').value, document.getElementById('log-pass').value)) {
                window.location.href = 'index.html';
            } else alert("Помилка входу");
        };

        const outB = document.getElementById('logout-btn');
        if (outB) outB.onclick = () => this.m.logout();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new CalculatorController(new CalculatorModel(), new CalculatorView());
});