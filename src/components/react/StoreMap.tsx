import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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

L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-shadow.png'
});

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

function MapEvents({ mapRef, setCustomPin, checkCoverage }: any) {
  const map = useMap();
  useEffect(() => {
    mapRef.current = map;
    const handleClick = (e: any) => {
      setCustomPin({ lat: e.latlng.lat, lng: e.latlng.lng });
      checkCoverage(e.latlng.lat, e.latlng.lng);
    };
    map.on('click', handleClick);
    return () => {
      map.off('click', handleClick);
    };
  }, [map, mapRef, setCustomPin, checkCoverage]);
  return null;
}

export default function StoreMap() {
  const [isMounted, setIsMounted] = useState(false);
  const [selectedStore, setSelectedStore] = useState<number>(1);
  const [coverage, setCoverage] = useState<CoverageResult | null>({
    departamento: 'LIMA',
    provincia: 'LIMA',
    distrito: 'MIRAFLORES'
  });
  const [checkingCoverage, setCheckingCoverage] = useState(false);
  const [customPin, setCustomPin] = useState<{ lat: number; lng: number } | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const mapRef = useRef<any>(null);

  useEffect(() => {
    setIsMounted(true);
    checkCoverage(-12.1191, -77.0299);
  }, []);

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

  const handleSelectStore = (storeId: number) => {
    setSelectedStore(storeId);
    const store = stores.find(s => s.id === storeId);
    if (store) {
      setCustomPin(null);
      checkCoverage(store.lat, store.lng, store.district);
      if (mapRef.current) {
        mapRef.current.flyTo([store.lat, store.lng], 15, { duration: 1.2 });
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

    setCustomPin({ lat: target.lat, lng: target.lng });
    checkCoverage(target.lat, target.lng, target.name);
    if (mapRef.current) {
      mapRef.current.flyTo([target.lat, target.lng], 14, { duration: 1.2 });
    }
  };

  if (!isMounted) {
    return (
      <div style={{
        height: '540px',
        background: '#F8FAFC',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#64748B',
        fontSize: '0.95rem',
        fontFamily: 'Plus Jakarta Sans, sans-serif'
      }}>
        Cargando Mapa de Cobertura y Tiendas...
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width: '100%', fontFamily: 'Plus Jakarta Sans, Inter, sans-serif' }}>
      {/* Buscador de Cobertura en Parte Superior */}
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

      {/* Contenedor del Mapa */}
      <div style={{ position: 'relative', width: '100%', height: '540px' }}>
        <MapContainer
          center={[-12.108, -77.005]}
          zoom={12}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <MapEvents mapRef={mapRef} setCustomPin={setCustomPin} checkCoverage={checkCoverage} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Marcadores de Tiendas */}
          {stores.map((store) => (
            <Marker
              key={store.id}
              position={[store.lat, store.lng]}
              icon={createCustomIcon(
                store.id === selectedStore ? '#E30613' : '#64748B',
                store.id === selectedStore ? [36, 52] : [28, 44]
              )}
              eventHandlers={{
                click: () => {
                  handleSelectStore(store.id);
                }
              }}
            >
              <Popup>
                <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', minWidth: '220px', padding: '4px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '8px',
                    paddingBottom: '8px',
                    borderBottom: '2px solid #E30613'
                  }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      background: '#E30613',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '13px',
                      fontWeight: 800
                    }}>
                      NS
                    </div>
                    <div>
                      <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                        {store.name}
                      </h3>
                      <span style={{ fontSize: '0.78rem', color: '#E30613', fontWeight: 700 }}>
                        Sede Autorizada Claro
                      </span>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#334155', margin: '6px 0', lineHeight: 1.4, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#E30613" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    <span>{store.address}</span>
                  </p>
                  <a
                    href="https://wa.me/51983985748?text=Hola%2C%20deseo%20visitar%20la%20sede%20de%20Nova%20Smart%20y%20consultar%20servicios."
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                      gap: '6px',
                      marginTop: '10px',
                      padding: '8px 14px',
                      background: '#25D366',
                      color: '#FFFFFF',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      borderRadius: '8px',
                      textDecoration: 'none'
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.205 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                    <span>Contacto por WhatsApp</span>
                  </a>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Marcador Personalizado de Búsqueda / Clic en Mapa */}
          {customPin && (
            <Marker
              position={[customPin.lat, customPin.lng]}
              icon={createCustomIcon('#0E9F6E', [32, 48])}
            >
              <Popup>
                <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', padding: '4px' }}>
                  <strong style={{ color: '#03543F', fontSize: '0.85rem' }}>Ubicación Seleccionada</strong>
                  <p style={{ fontSize: '0.75rem', color: '#64748B', margin: '4px 0 0' }}>
                    Verificando red Claro...
                  </p>
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>

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
