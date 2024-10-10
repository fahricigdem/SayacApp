// Verileri tabloda göster (ilk değer ve güncel değerler dahil)
function loadMeterReadings() {
    let meterReadings = JSON.parse(localStorage.getItem('meterReadings')) || [];

    // İlk değerleri de tabloda göstermek için ekliyoruz
    const startMeter = localStorage.getItem('startMeter');
    const startDate = localStorage.getItem('startDate');

    if (startMeter && startDate) {
        meterReadings.unshift({ date: startDate, meter: startMeter });  // İlk veriyi başa ekle
    }

    // Tarihe göre sondan başa sıralama (ilk veri sabit olarak en başta kalacak)
    meterReadings.sort((a, b) => new Date(b.date) - new Date(a.date));

    const tableBody = document.querySelector('#readingsTable tbody');
    tableBody.innerHTML = '';  // Tabloyu temizle

    meterReadings.forEach((reading, index) => {
        const isInitialValue = reading.date === startDate && reading.meter === startMeter;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="date" value="${reading.date}" onchange="editReading(${index}, 'date', this.value)" ${isInitialValue ? 'disabled' : ''}></td>
            <td><input type="number" value="${reading.meter}" onchange="editReading(${index}, 'meter', this.value)" ${isInitialValue ? 'disabled' : ''}></td>
            <td>${isInitialValue ? '' : `<button class="delete" onclick="deleteReading(${index})">Delete</button>`}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Veriyi düzenle
function editReading(index, field, value) {
    let meterReadings = JSON.parse(localStorage.getItem('meterReadings'));

    // Tarihe göre sıralama yapılmadan önce indeksi güncelle
    const startMeter = localStorage.getItem('startMeter');
    const startDate = localStorage.getItem('startDate');

    if (index > 0 || !startMeter || !startDate) {  // İlk değeri düzenlemeye izin vermiyoruz
        meterReadings.sort((a, b) => new Date(b.date) - new Date(a.date));
        meterReadings[index][field] = value;
        localStorage.setItem('meterReadings', JSON.stringify(meterReadings));
        alert('Reading updated!');
        loadMeterReadings();  // Tabloyu yeniden yükle
    }
}

// Veriyi sil
function deleteReading(index) {
    let meterReadings = JSON.parse(localStorage.getItem('meterReadings'));

    // İlk değeri silemeyiz, bu yüzden indeks kontrolü yapıyoruz
    if (index > 0) {  // İlk değer sabit kaldığı için 0. indexi silemeyiz
        meterReadings.sort((a, b) => new Date(b.date) - new Date(a.date));
        meterReadings.splice(index, 1);  // Veriyi listeden çıkar
        localStorage.setItem('meterReadings', JSON.stringify(meterReadings));
        alert('Reading deleted!');
        loadMeterReadings();  // Tabloyu yeniden yükle
    }
}

// Sayfa yüklendiğinde mevcut verileri göster
window.onload = function () {
    if (localStorage.getItem('startMeter')) {
        document.getElementById('startMeter').value = localStorage.getItem('startMeter');
        document.getElementById('startDate').value = localStorage.getItem('startDate');
        document.getElementById('annualLimit').value = localStorage.getItem('annualLimit');
        document.getElementById('endDate').value = localStorage.getItem('endDate');
    }
    loadMeterReadings();  // Mevcut verileri yükle
    renderCharts();  // Grafikleri oluştur
};


