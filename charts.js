// Verileri görselleştirme
function renderCharts() {
    let meterReadings = JSON.parse(localStorage.getItem('meterReadings')) || [];

    // İlk değerleri al
    const startMeter = parseFloat(localStorage.getItem('startMeter')) || 0;
    const startDate = new Date(localStorage.getItem('startDate'));
    const annualLimit = parseFloat(localStorage.getItem('annualLimit')) || 0;
    const endDate = new Date(localStorage.getItem('endDate'));

    // Kullanıcı tarafından girilen verileri işleyelim
    let readings = meterReadings.map(reading => ({
        date: new Date(reading.date),
        meter: parseFloat(reading.meter)
    }));

    // Tarih sırasına göre sırala
    readings.sort((a, b) => a.date - b.date);

    // İlk okuma (ilk ara değer) ve son tarih
    const firstReadingDate = readings.length > 0 ? readings[0].date : null;
    const lastReadingDate = readings.length > 0 ? readings[readings.length - 1].date : null;

    // İlk tarihten sözleşme bitiş tarihine kadar tüm günleri oluşturma
    let dates = [];
    let meters = [];

    // Sözleşme bitiş tarihine kadar günleri ekle
    const endOfPeriodDate = endDate; // Sözleşmenin bitiş tarihi

    for (let d = new Date(firstReadingDate || startDate); d <= endOfPeriodDate; d.setDate(d.getDate() + 1)) {
        const reading = readings.find(r => r.date.toDateString() === d.toDateString());
        dates.push(new Date(d)); // Tüm günleri ekle
        meters.push(reading ? reading.meter : null); // Varsa değeri al, yoksa null ekle
    }

    // Gaz miktarı grafiği (Balken Diagram)
    const ctxUsage = document.getElementById('usageChart').getContext('2d');

    // Minimum sayaç değeri
    const minMeterValue = Math.min(...meters.filter(m => m !== null));

    // Y ekseninde minimum değeri ayarlama (minimum sayaç değeri - 10)
    const minYValue = minMeterValue - 10;

    // Maksimum sayaç değeri hesaplama
    const maxMeterValue = startMeter + annualLimit; // Maksimum sayaç değeri

    // Sadece mevcut veri noktalarını kullanarak sütun grafiği oluşturma
    new Chart(ctxUsage, {
        type: 'bar',
        data: {
            labels: dates.map(date => date.toLocaleDateString()), // Tüm günleri etiketle
            datasets: [{
                label: 'Sayaç Değerleri',
                data: meters,
                backgroundColor: 'rgba(75, 192, 192, 1)',
            }, {
                label: 'Maksimum Sayaç Değeri',
                data: Array(dates.length).fill(maxMeterValue), // Tüm tarihler için sabit değer
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2,
                type: 'line', // Sabit değer için çizgi
                fill: false,
                pointRadius: 0, // Noktaları gizle
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: false, // Y ekseninin sıfırdan başlaması
                    min: minYValue, // Y ekseninde minimum değer
                    title: {
                        display: true,
                        text: 'Sayaç Değeri (m³)'
                    },
                    // Maksimum sayaç değerinin etiketini ekleyin
                    ticks: {
                        callback: function (value) {
                            if (value === maxMeterValue) {
                                return value + ' (Maksimum)'; // Maksimum değeri net olarak göster
                            }
                            return value;
                        }
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Tarih'
                    }
                }
            }
        }
    });
}


