// Tunggu sampai DOM sepenuhnya dimuat sebelum menambahkan event listener
window.addEventListener('DOMContentLoaded', () => {
    // Ambil elemen DOM utama
    const expressionDisplay = document.getElementById('expression');
    const resultDisplay = document.getElementById('result');
    const buttons = document.querySelectorAll('button');

    // Variabel untuk menyimpan nilai dan operator saat ini
    let currentNumber = '';
    let previousNumber = '';
    let operator = '';
    let shouldResetDisplay = false;

    // Menambahkan event listener ke setiap tombol
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            let value = button.textContent.trim();

            // Normalisasi simbol operator
            if (value === 'x') value = '*';
            if (value === '÷') value = '/';

            // Logika utama berdasarkan nilai tombol
            switch (value) {
                case '=':
                    calculate();
                    break;
                case 'C':
                    clear();
                    break;
                case 'x²':
                    squareCurrentNumber();
                    break;
                case '±':
                    toggleSign();
                    break;
                case '%':
                    applyPercent();
                    break;
                case '⌫':
                    deleteLast();
                    break;
                case '+':
                case '-':
                case '*':
                case '/':
                    handleOperator(value);
                    break;
                case '.':
                    handleDecimal();
                    break;
                default:
                    if (!isNaN(value)) {
                        handleNumber(value);
                    }
                    break;
            }
        });
    });

    // Fungsi untuk menangani input angka
    function handleNumber(num) {
        if (shouldResetDisplay) {
            currentNumber = '';
            shouldResetDisplay = false;
        }

        if (currentNumber.length < 10) {
            currentNumber += num;
            updateDisplay();
        }
    }

    // Fungsi untuk menangani input titik desimal
    function handleDecimal() {
        if (shouldResetDisplay) {
            currentNumber = '';
            shouldResetDisplay = false;
        }

        if (!currentNumber.includes('.')) {
            currentNumber = currentNumber === '' ? '0.' : currentNumber + '.';
            updateDisplay();
        }
    }

    // Fungsi untuk menangani operator (+, -, *, /)
    function handleOperator(nextOperator) {
        if (currentNumber === '' && previousNumber === '') return;

        if (previousNumber !== '' && currentNumber !== '' && operator !== '') {
            calculate(false);
        }

        previousNumber = currentNumber || previousNumber;
        currentNumber = '';
        operator = nextOperator;
        shouldResetDisplay = false;

        updateExpression();
    }

    // Fungsi untuk melakukan perhitungan
    function calculate(showResult = true) {
        if (previousNumber === '' || currentNumber === '' || operator === '') return;

        const prev = parseFloat(previousNumber);
        const current = parseFloat(currentNumber);
        let result;

        if (isNaN(prev) || isNaN(current)) {
            resultDisplay.textContent = 'Error';
            return;
        }

        // Hitung sesuai operator
        switch (operator) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '*':
                result = prev * current;
                break;
            case '/':
                result = current !== 0 ? prev / current : 'Error';
                break;
            default:
                result = 'Error';
        }

        if (result === 'Error') {
            resultDisplay.textContent = 'Error';
            return;
        }

        // Pembulatan hasil ke 8 desimal untuk menghindari masalah floating point
        result = Math.round((result + Number.EPSILON) * 100000000) / 100000000;

        if (showResult) {
            const displayOp = operator === '*' ? 'x' : operator === '/' ? '÷' : operator;
            expressionDisplay.textContent = `${previousNumber} ${displayOp} ${currentNumber} =`;
            resultDisplay.textContent = result;

            previousNumber = result.toString();
            currentNumber = '';
            operator = '';
            shouldResetDisplay = true;
        } else {
            previousNumber = result.toString();
            currentNumber = '';
            updateExpression();
            resultDisplay.textContent = result;
        }
    }

    // Fungsi untuk mereset semua kalkulasi
    function clear() {
        currentNumber = '';
        previousNumber = '';
        operator = '';
        shouldResetDisplay = false;
        expressionDisplay.textContent = '';
        resultDisplay.textContent = '0';
    }

    // Fungsi untuk memperbarui tampilan hasil saat input angka/operasi
    function updateDisplay() {
        resultDisplay.textContent = currentNumber || '0';
        updateExpression();
    }

    // Fungsi untuk memperbarui ekspresi pada tampilan atas
    function updateExpression() {
        let expr = '';

        if (previousNumber !== '') {
            expr += previousNumber;
        }

        if (operator !== '') {
            const displayOp = operator === '*' ? ' x ' : operator === '/' ? ' ÷ ' : ` ${operator} `;
            expr += displayOp;
        }

        if (currentNumber !== '' && operator !== '') {
            expr += currentNumber;
        }

        expressionDisplay.textContent = expr;
    }

    // Fungsi untuk ubah tanda angka (positif/negatif)
    function toggleSign() {
        if (currentNumber) {
            currentNumber = (parseFloat(currentNumber) * -1).toString();
            updateDisplay();
        }
    }

    // Fungsi untuk konversi ke persen
    function applyPercent() {
        if (currentNumber) {
            currentNumber = (parseFloat(currentNumber) / 100).toString();
            updateDisplay();
        }
    }

    // Fungsi untuk menghapus angka terakhir dari input
    function deleteLast() {
        if (shouldResetDisplay) return;

        if (currentNumber.length > 0) {
            currentNumber = currentNumber.slice(0, -1);
            updateDisplay();
        }
    }

    // Fungsi untuk mengkuadratkan angka saat ini
    function squareCurrentNumber() {
        if (currentNumber === '') return;

        const num = parseFloat(currentNumber);
        const squared = Math.pow(num, 2);
        currentNumber = squared.toString();
        expressionDisplay.textContent = `${num}²`;
        resultDisplay.textContent = squared;
        shouldResetDisplay = true;
    }

    // Reset kalkulator saat halaman dimuat ulang
    clear();
});