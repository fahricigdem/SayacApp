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
            <td>${reading.date}</td>
            <td>${reading.meter}</td>
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


// Günlük ortalama harcamayı hesapla ve göster
document.getElementById('calculateAverage').addEventListener('click', function () {
    calculateDailyAverage();
});

function calculateDailyAverage() {
    let meterReadings = JSON.parse(localStorage.getItem('meterReadings')) || [];

    if (meterReadings.length >= 2) {
        // Tarihe göre sırala
        meterReadings.sort((a, b) => new Date(a.date) - new Date(b.date));

        // İlk ve son okuma verilerini al
        const firstReading = meterReadings[0];
        const lastReading = meterReadings[meterReadings.length - 1];

        // İlk ve son tarih arasındaki gün farkı
        const daysDifference = (new Date(lastReading.date) - new Date(firstReading.date)) / (1000 * 60 * 60 * 24);
        const consumptionDifference = lastReading.meter - firstReading.meter;

        // Günlük ortalama tüketimi hesapla
        const dailyAverage = consumptionDifference / daysDifference;


        const annualLimit = localStorage.getItem('annualLimit');
        const startMeter = localStorage.getItem('startMeter');
        const contractEndDate = new Date(localStorage.getItem('endDate'));
        const lastReadingDate = new Date(lastReading.date);
        const remainingDays = (contractEndDate - lastReadingDate) / (1000 * 60 * 60 * 24);
        const remainingConsumption = remainingDays * dailyAverage;
        const predictedValue = remainingConsumption + Number(lastReading.meter)

        // Sonucu ve kullanılan tarih aralığını HTML'de göster
        document.getElementById('dailyAverageResult').innerText = `
            Günlük ortalama: ${dailyAverage.toFixed(2)} m³/day ( ${new Date(firstReading.date).toLocaleDateString()} - ${new Date(lastReading.date).toLocaleDateString()}) 
             Toplam harcama: ${Number(lastReading.meter) - Number(firstReading.meter)}
             Kalan harcama: ${Number(annualLimit) - (Number(lastReading.meter) - Number(firstReading.meter))}
        `;


        // console.log(lastReading.meter)
        console.log((Number(lastReading.meter) - Number(firstReading.meter)))
        console.log(remainingConsumption)
        console.log(488 - 114)
        console.log(Number(annualLimit) - Number(remainingConsumption) - (Number(lastReading.meter) - Number(firstReading.meter)))
        const yapilanHarcama = Number(lastReading.meter) - Number(firstReading.meter);
        document.getElementById('predictedMeterResult').innerText = ` Bu gidisle sayac : ${predictedValue.toFixed(0)} m³  
        (${contractEndDate.toLocaleDateString()}'te bu gidisle arta kalacak ${(Number(annualLimit) - (yapilanHarcama + Number(remainingConsumption))).toFixed(0)} ) `;

        document.getElementById('olmasiGereken').innerText = `Gercek Maksimum Limit: ${Number(startMeter) + Number(annualLimit)} m³  (on ${contractEndDate.toLocaleDateString()}) `;


    } else {
        document.getElementById('dailyAverageResult').innerText = 'Not enough data to calculate average consumption.';
        document.getElementById('predictedMeterResult').innerText = '';
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
    calculateDailyAverage();  // Günlük ortalama tüketimi hesapla
    renderCharts();  // Grafikleri oluştur
};



////
document.getElementById('saveCurrentValues').addEventListener('click', function () {
    // Formdaki verileri al
    const currentMeter = document.getElementById('currentMeter').value;
    const currentDate = document.getElementById('currentDate').value;

    // Geçerli veri var mı kontrol et
    if (currentMeter && currentDate) {
        // Mevcut sayaç verilerini al
        let meterReadings = JSON.parse(localStorage.getItem('meterReadings')) || [];

        // Aynı tarihe sahip önceki veriyi bul
        const existingIndex = meterReadings.findIndex(reading => reading.date === currentDate);

        if (existingIndex !== -1) {
            // Aynı tarihe sahip veri bulundu, güncelle
            meterReadings[existingIndex].meter = currentMeter;
        } else {
            // Aynı tarihli veri yok, yeni veriyi ekle
            meterReadings.push({ date: currentDate, meter: currentMeter });
        }

        // Veriyi localStorage'a kaydet
        localStorage.setItem('meterReadings', JSON.stringify(meterReadings));

        // Tablodaki verileri güncelle
        loadMeterReadings();

        // Günlük ortalama tüketimi güncelle
        calculateDailyAverage();

        // Alanları temizle
        document.getElementById('currentMeter').value = '';
        document.getElementById('currentDate').value = '';

        alert('Current meter reading saved!');
    } else {
        alert('Please enter both the meter value and the date.');
    }
});

