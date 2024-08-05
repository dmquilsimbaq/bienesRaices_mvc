(function() {

    const lat = document.querySelector('#lat').value || 0.3481348;
    const lng = document.querySelector('#lng').value || -78.125008;
    const mapa = L.map('mapa').setView([lat, lng ], 13);
    let marker;
    // Utilizar Provider y Geocoder
    const geocodeService = L.esri.Geocoding.geocodeService();


    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    marker = new L.marker([lat, lng], {
        draggable: true,
        autoPan: true
    }).addTo(mapa)
    // OBTNER LA UBICACION DEL PING
    marker.on('moveend', function(e){
        marker = e.target
        const posicion = marker.getLatLng();
        mapa.panTo(new L.LatLng(posicion.lat, posicion.lng));
        geocodeService.reverse().latlng(posicion, 13).run(function(error, result){
            marker.bindPopup(result.address.LongLabel);
            document.querySelector('.calle').textContent = result?.address?.Address ?? '';
            document.querySelector('#calle').value = result?.address?.Address ?? '';
            document.querySelector('#lat').value = result?.latlng?.lat ?? '';
            document.querySelector('#lng').value = result?.latlng?.lng ?? '';
        });
    });
})()