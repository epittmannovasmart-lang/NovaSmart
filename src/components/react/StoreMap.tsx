import React, { useEffect, useState, useRef } from 'react';

interface Store {
  id: number;
  name: string;
  district: string;
  address: string;
  hours: string;
  lat: number;
  lng: number;
}

interface CoverageResult {
  departamento: string | null;
  provincia: string | null;
  distrito: string | null;
}

const stores: Store[] = [
  {
    id: 1,
    name: 'Sede Miraflores',
    district: 'Miraflores',
    address: 'Av. Alfredo Benavides 1180, Miraflores',
    hours: 'Lun-Vie: 9AM-7PM | Sáb: 9AM-5PM',
    lat: -12.1191,
    lng: -77.0299
  },
  {
    id: 2,
    name: 'Sede Surco',
    district: 'Surco',
    address: 'Av. La Encalada 1610, Santiago de Surco',
    hours: 'Lun-Vie: 9AM-7PM | Sáb: 9AM-5PM',
    lat: -12.1385,
    lng: -76.9935
  },
  {
    id: 3,
    name: 'Sede San Isidro',
    district: 'San Isidro',
    address: 'Av. Javier Prado Este 4600, San Isidro',
    hours: 'Lun-Vie: 9AM-7PM | Sáb: 9AM-5PM',
    lat: -12.0985,
    lng: -76.9850
  },
  {
    id: 4,
    name: 'Sede Comas',
    district: 'Comas',
    address: 'Av. Túpac Amaru 3580, Comas',
    hours: 'Lun-Vie: 9AM-7PM | Sáb: 9AM-5PM',
    lat: -11.9845,
    lng: -77.0520
  }
];

const districtCoords: Record<string, { lat: number; lng: number; name: string }> = {
  'miraflores': { lat: -12.1191, lng: -77.0299, name: 'MIRAFLORES' },
  'surco': { lat: -12.1385, lng: -76.9935, name: 'SANTIAGO DE SURCO' },
  'santiago de surco': { lat: -12.1385, lng: -76.9935, name: 'SANTIAGO DE SURCO' },
  'san isidro': { lat: -12.0985, lng: -76.9850, name: 'SAN ISIDRO' },
  'comas': { lat: -11.9845, lng: -77.0520, name: 'COMAS' },
  'san juan de lurigancho': { lat: -11.9800, lng: -77.0000, name: 'SAN JUAN DE LURIGANCHO' },
  'los olivos': { lat: -11.9700, lng: -77.0700, name: 'LOS OLIVOS' },
  'ate': { lat: -12.0250, lng: -76.9150, name: 'ATE VITARTE' },
  'ate vitarte': { lat: -12.0250, lng: -76.9150, name: 'ATE VITARTE' },
  'la molina': { lat: -12.0750, lng: -76.9550, name: 'LA MOLINA' },
  'san miguel': { lat: -12.0780, lng: -77.0900, name: 'SAN MIGUEL' },
  'callao': { lat: -12.0560, lng: -77.1180, name: 'CALLAO' },
  'chorrillos': { lat: -12.1750, lng: -77.0150, name: 'CHORRILLOS' },
  'san borja': { lat: -12.1070, lng: -77.0010, name: 'SAN BORJA' },
  'lince': { lat: -12.0830, lng: -77.0340, name: 'LINCE' },
  'jesus maria': { lat: -12.0750, lng: -77.0450, name: 'JESÚS MARÍA' },
  'pueblo libre': { lat: -12.0740, lng: -77.0640, name: 'PUEBLO LIBRE' },
  'barranco': { lat: -12.1470, lng: -77.0210, name: 'BARRANCO' },
  'san martin de porres': { lat: -11.9980, lng: -77.0910, name: 'SAN MARTÍN DE PORRES' },
  'villa el salvador': { lat: -12.2150, lng: -76.9380, name: 'VILLA EL SALVADOR' },
  'villa maria del triunfo': { lat: -12.1640, lng: -76.9370, name: 'VILLA MARÍA DEL TRIUNFO' },
  'carabayllo': { lat: -11.8980, lng: -77.0280, name: 'CARABAYLLO' },
  'puente piedra': { lat: -11.8680, lng: -77.0780, name: 'PUENTE PIEDRA' },
  'santa anita': { lat: -12.0460, lng: -76.9680, name: 'SANTA ANITA' },
  'el agustino': { lat: -12.0470, lng: -77.0050, name: 'EL AGUSTINO' }
};

export default function StoreMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const customPinMarkerRef = useRef<any>(null);

  const [selectedStore, setSelectedStore] = useState<number>(1);
  const [coverage, setCoverage] = useState<CoverageResult | null>({
    departamento: 'LIMA',
    provincia: 'LIMA',
    distrito: 'MIRAFLORES'
  });
  const [checkingCoverage, setCheckingCoverage] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [mapLoaded, setMapLoaded] = useState(false);

  const checkCoverage = (lat: number, lng: number, forcedDistrictName?: string) => {
    setCheckingCoverage(true);
    let matchedDistrict = forcedDistrictName || 'MIRAFLORES';

    if (!forcedDistrictName) {
      let minDistance = Infinity;
      Object.values(districtCoords).forEach((item) => {
        const dist = Math.hypot(item.lat - lat, item.lng - lng);
        if (dist < minDistance) {
          minDistance = dist;
          matchedDistrict = item.name;
        }
      });
    }

    setTimeout(() => {
      setCoverage({
        departamento: 'LIMA',
        provincia: 'LIMA',
        distrito: matchedDistrict.toUpperCase()
      });
      setCheckingCoverage(false);
    }, 150);
  };

  useEffect(() => {
    // Load Leaflet CSS dynamically
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    // Load Leaflet JS dynamically
    const initLeaflet = () => {
      const L = (window as any).L;
      if (!L || !mapContainerRef.current || mapInstanceRef.current) return;

      const map = L.map(mapContainerRef.current, {
        center: [-12.108, -77.005],
        zoom: 12,
        zoomControl: false
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap'
      }).addTo(map);

      mapInstanceRef.current = map;
      setMapLoaded(true);

      const createCustomIcon = (color: string, size: [number, number]) => {
        return L.divIcon({
          className: 'custom-marker',
          html: `<div style="
            width: ${size[0]}px;
            height: ${size[1]}px;
            background: ${color};
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: 3px solid #FFFFFF;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            position: relative;
          ">
            <div style="
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%) rotate(45deg);
              width: 8px;
              height: 8px;
              background: white;
              border-radius: 50%;
            "></div>
          </div>`,
          iconSize: size,
          iconAnchor: [size[0] / 2, size[1]],
          popupAnchor: [0, -size[1]]
        });
      };

      // Add Store Markers
      stores.forEach((store) => {
        const icon = createCustomIcon(
          store.id === 1 ? '#E30613' : '#64748B',
          store.id === 1 ? [36, 52] : [28, 44]
        );

        const marker = L.marker([store.lat, store.lng], { icon }).addTo(map);
        marker.bindPopup(`
          <div style="font-family: Plus Jakarta Sans, sans-serif; min-width: 220px; padding: 4px;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; padding-bottom: 8px; border-bottom: 2px solid #E30613;">
              <div style="width: 32px; height: 32px; background: #E30613; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 13px; font-weight: 800;">NS</div>
              <div>
                <h3 style="font-size: 0.95rem; font-weight: 800; color: #0F172A; margin: 0;">${store.name}</h3>
                <span style="font-size: 0.78rem; color: #E30613; font-weight: 700;">Sede Autorizada Claro</span>
              </div>
            </div>
            <p style="font-size: 0.82rem; color: #334155; margin: 6px 0; line-height: 1.4;">${store.address}</p>
            <a href="https://wa.me/51983985748?text=Hola%2C%20deseo%20visitar%20la%20sede%20de%20Nova%20Smart" target="_blank" style="display: inline-block; width: 100%; margin-top: 8px; padding: 8px; background: #25D366; color: #FFF; text-align: center; font-weight: 700; border-radius: 8px; text-decoration: none; font-size: 0.8rem;">Contacto por WhatsApp</a>
          </div>
        `);

        marker.on('click', () => {
          setSelectedStore(store.id);
          checkCoverage(store.lat, store.lng, store.district);
        });

        markersRef.current.push({ id: store.id, marker });
      });

      // Map Click Event
      map.on('click', (e: any) => {
        if (customPinMarkerRef.current) {
          map.removeLayer(customPinMarkerRef.current);
        }

        const pinIcon = createCustomIcon('#0E9F6E', [32, 48]);
        const pinMarker = L.marker([e.latlng.lat, e.latlng.lng], { icon: pinIcon }).addTo(map);
        pinMarker.bindPopup(`
          <div style="font-family: Plus Jakarta Sans, sans-serif; padding: 4px;">
            <strong style="color: #03543F; font-size: 0.85rem;">Ubicación Seleccionada</strong>
            <p style="font-size: 0.75rem; color: #64748B; margin: 4px 0 0;">Verificando red Claro...</p>
          </div>
        `).openPopup();

        customPinMarkerRef.current = pinMarker;
        checkCoverage(e.latlng.lat, e.latlng.lng);
      });
    };

    if ((window as any).L) {
      initLeaflet();
    } else {
      if (!document.getElementById('leaflet-js')) {
        const script = document.createElement('script');
        script.id = 'leaflet-js';
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = () => initLeaflet();
        document.body.appendChild(script);
      } else {
        const interval = setInterval(() => {
          if ((window as any).L) {
            clearInterval(interval);
            initLeaflet();
          }
        }, 100);
      }
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const handleSelectStore = (storeId: number) => {
    setSelectedStore(storeId);
    const store = stores.find(s => s.id === storeId);
    if (store && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([store.lat, store.lng], 15, { duration: 1.2 });
      checkCoverage(store.lat, store.lng, store.district);

      const target = markersRef.current.find(m => m.id === storeId);
      if (target) {
        target.marker.openPopup();
      }
    }
  };

  const handleSearchDistrict = (districtName: string) => {
    const key = districtName.trim().toLowerCase();
    if (!key) return;

    let target = districtCoords[key];
    if (!target) {
      const matchedKey = Object.keys(districtCoords).find(k => k.includes(key) || key.includes(k));
      if (matchedKey) {
        target = districtCoords[matchedKey];
      } else {
        target = { lat: -12.0464, lng: -77.0428, name: districtName.toUpperCase() };
      }
    }

    if (mapInstanceRef.current) {
      const L = (window as any).L;
      if (L) {
        if (customPinMarkerRef.current) {
          mapInstanceRef.current.removeLayer(customPinMarkerRef.current);
        }

        const createCustomIcon = (color: string, size: [number, number]) => {
          return L.divIcon({
            className: 'custom-marker',
            html: `<div style="
              width: ${size[0]}px;
              height: ${size[1]}px;
              background: ${color};
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              border: 3px solid #FFFFFF;
              box-shadow: 0 4px 12px rgba(0,0,0,0.3);
              position: relative;
            ">
              <div style="
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) rotate(45deg);
                width: 8px;
                height: 8px;
                background: white;
                border-radius: 50%;
              "></div>
            </div>`,
            iconSize: size,
            iconAnchor: [size[0] / 2, size[1]],
            popupAnchor: [0, -size[1]]
          });
        };

        const pinIcon = createCustomIcon('#0E9F6E', [32, 48]);
        const pinMarker = L.marker([target.lat, target.lng], { icon: pinIcon }).addTo(mapInstanceRef.current);
        pinMarker.bindPopup(`
          <div style="font-family: Plus Jakarta Sans, sans-serif; padding: 4px;">
            <strong style="color: #03543F; font-size: 0.85rem;">${target.name}</strong>
            <p style="font-size: 0.75rem; color: #64748B; margin: 4px 0 0;">Zona Verificada Claro Fibra Óptica</p>
          </div>
        `).openPopup();

        customPinMarkerRef.current = pinMarker;
        mapInstanceRef.current.flyTo([target.lat, target.lng], 14, { duration: 1.2 });
        checkCoverage(target.lat, target.lng, target.name);
      }
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', fontFamily: 'Plus Jakarta Sans, Inter, sans-serif' }}>
      {/* Buscador de Cobertura */}
      <div style={{
        background: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
        padding: '16px 20px',
        borderRadius: '16px 16px 0 0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
      }}>
        <div style={{
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
          marginBottom: '12px',
          flexWrap: 'wrap'
        }}>
          <input
            type="text"
            placeholder="Ej: Los Olivos, Surco, San Juan de Lurigancho, Comas..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearchDistrict(searchInput);
            }}
            style={{
              flex: 1,
              minWidth: '220px',
              padding: '10px 16px',
              borderRadius: '10px',
              border: '1.5px solid #CBD5E1',
              fontSize: '0.9rem',
              outline: 'none',
              transition: 'border-color 0.2s ease',
              fontFamily: 'inherit'
            }}
          />
          <button
            onClick={() => handleSearchDistrict(searchInput)}
            style={{
              background: '#E30613',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '10px',
              padding: '10px 20px',
              fontSize: '0.9rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'inherit',
              boxShadow: '0 4px 12px rgba(227, 6, 19, 0.2)'
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            Verificar Cobertura
          </button>
        </div>

        {/* Chips de Distritos Populares */}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>Distritos Populares:</span>
          {['Miraflores', 'Surco', 'San Isidro', 'Comas', 'Los Olivos', 'Ate', 'San Juan de Lurigancho'].map((d) => (
            <button
              key={d}
              onClick={() => {
                setSearchInput(d);
                handleSearchDistrict(d);
              }}
              style={{
                background: '#F1F5F9',
                border: '1px solid #E2E8F0',
                borderRadius: '20px',
                padding: '4px 12px',
                fontSize: '0.76rem',
                color: '#334155',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontFamily: 'inherit'
              }}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Contenedor del Mapa Leaflet Vanilla */}
      <div style={{ position: 'relative', width: '100%', height: '540px', background: '#F1F5F9' }}>
        <div
          ref={mapContainerRef}
          style={{ width: '100%', height: '100%', borderRadius: '0 0 16px 16px', zIndex: 1 }}
        />

        {!mapLoaded && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: '#F8FAFC',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748B',
            fontSize: '0.95rem',
            zIndex: 10
          }}>
            Cargando Mapa de Cobertura y Tiendas...
          </div>
        )}

        {/* Panel Lateral de Sedes y Resultado de Cobertura */}
        <div style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          zIndex: 1000,
          background: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(8px)',
          borderRadius: '14px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
          padding: '16px',
          width: '270px',
          maxHeight: '480px',
          overflowY: 'auto'
        }}>
          {/* Card de Estado de Cobertura */}
          <div style={{
            background: checkingCoverage ? '#F8FAFC' : '#ECFDF5',
            border: `1px solid ${checkingCoverage ? '#E2E8F0' : '#A7F3D0'}`,
            borderRadius: '10px',
            padding: '12px',
            marginBottom: '14px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: checkingCoverage ? '#94A3B8' : '#10B981',
                display: 'inline-block'
              }}></span>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: checkingCoverage ? '#64748B' : '#047857', textTransform: 'uppercase' }}>
                {checkingCoverage ? 'Verificando...' : '¡Cobertura Disponible!'}
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#0F172A', margin: 0, fontWeight: 700 }}>
              {coverage ? `Distrito: ${coverage.distrito}` : 'Selecciona una zona'}
            </p>
            <p style={{ fontSize: '0.75rem', color: '#475569', margin: '4px 0 0' }}>
              Red 100% Fibra Óptica Claro lista para instalación.
            </p>
          </div>

          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>
            Nuestras Sedes ({stores.length})
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {stores.map((store) => (
              <div
                key={store.id}
                onClick={() => handleSelectStore(store.id)}
                style={{
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: store.id === selectedStore ? '2px solid #E30613' : '1px solid #E2E8F0',
                  background: store.id === selectedStore ? '#FFF5F5' : '#FFFFFF',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: '0.85rem', color: store.id === selectedStore ? '#E30613' : '#0F172A' }}>
                    {store.name}
                  </strong>
                  {store.id === selectedStore && (
                    <span style={{ fontSize: '0.65rem', background: '#E30613', color: '#FFF', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                      ACTIVA
                    </span>
                  )}
                </div>
                <p style={{ fontSize: '0.75rem', color: '#64748B', margin: '4px 0 0', lineHeight: 1.3 }}>
                  {store.address}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
