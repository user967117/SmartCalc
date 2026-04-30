class CalculatorModel {
    constructor() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.users = JSON.parse(localStorage.getItem('smartCalcUsers')) || [];
        this.activeUser = JSON.parse(localStorage.getItem('smartCalcActiveUser')) || null;
    }

    clear() { 
        this.currentOperand = '0'; 
        this.previousOperand = ''; 
        this.operation = undefined; 
    }
    
    delete() { 
        if (this.currentOperand.length <= 1) this.currentOperand = '0';
        else this.currentOperand = this.currentOperand.slice(0, -1);
    }

    toggleSign() {
        if (this.currentOperand === '' || this.currentOperand === '0') return;
        if (this.currentOperand.startsWith('-')) {
            this.currentOperand = this.currentOperand.slice(1);
        } else {
            this.currentOperand = '-' + this.currentOperand;
        }
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

    logout() { 
        localStorage.removeItem('smartCalcActiveUser'); 
        window.location.href = 'login.html'; 
    }
}