// Verilerin Local Storage'a kaydedilmesi
document.getElementById('saveInitialValues').addEventListener('click', function () {
    const startMeter = document.getElementById('startMeter').value;
    const startDate = document.getElementById('startDate').value;
    const annualLimit = document.getElementById('annualLimit').value;
    const endDate = document.getElementById('endDate').value;

    if (startMeter && startDate && annualLimit && endDate) {
        localStorage.setItem('startMeter', startMeter);
        localStorage.setItem('startDate', startDate);
        localStorage.setItem('annualLimit', annualLimit);
        localStorage.setItem('endDate', endDate);
        alert('Initial values saved!');
    } else {
        alert('Please fill in all fields.');
    }
});

// Güncel sayaç verisinin kaydedilmesi
document.getElementById('saveCurrentValues').addEventListener('click', function () {
    const currentMeter = document.getElementById('currentMeter').value;
    const currentDate = document.getElementById('currentDate').value;

    if (currentMeter && currentDate) {
        let meterReadings = JSON.parse(localStorage.getItem('meterReadings')) || [];
        meterReadings.push({ date: currentDate, meter: currentMeter });
        localStorage.setItem('meterReadings', JSON.stringify(meterReadings));
        alert('Current meter reading saved!');
    } else {
        alert('Please fill in all fields.');
    }
});

// Local Storage'dan verilerin yüklenmesi
window.onload = function () {
    if (localStorage.getItem('startMeter')) {
        document.getElementById('startMeter').value = localStorage.getItem('startMeter');
        document.getElementById('startDate').value = localStorage.getItem('startDate');
        document.getElementById('annualLimit').value = localStorage.getItem('annualLimit');
        document.getElementById('endDate').value = localStorage.getItem('endDate');
    }
}
