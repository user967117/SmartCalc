class CalculatorView {
    constructor() {
        this.display = document.querySelector('.display');
        this.nav = document.querySelector('.navbar-nav');
        this.progLabels = document.querySelectorAll('#prog span:nth-child(2)');
    }

    updateDisplay(val) { 
        if (this.display) this.display.innerText = val; 
    }
    
    updateProg(v) { 
        if (this.progLabels.length >= 4) { 
            this.progLabels[0].innerText = v.HEX; 
            this.progLabels[1].innerText = v.DEC; 
            this.progLabels[2].innerText = v.OCT; 
            this.progLabels[3].innerText = v.BIN; 
        } 
    }

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