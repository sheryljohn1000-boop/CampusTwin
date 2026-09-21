import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { useCampusStore } from '../../store/campusStore';
import { getOccupancyColor } from '../../utils/formatters';
import { MapPin, Layers, Crosshair } from 'lucide-react';

/**
 * Basemaps. "Dark" is the default royal-night canvas (CARTO Dark Matter),
 * "Streets" is the familiar Google-style look (CARTO Voyager),
 * "Satellite" is Esri World Imagery.
 */
const TILE_SERVERS = {
  dark: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
  },
  streets: {
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri',
    maxZoom: 18,
  },
};

type TileStyle = keyof typeof TILE_SERVERS;

const CAMPUS_CENTER: L.LatLngExpression = [12.8234, 80.0442];

export const SrmLiveMap: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});

  const {
    zones,
    selectedZoneId,
    selectZone,
    currentTime,
    getZoneOccupancyAtTime,
    mapTileStyle,
    setMapTileStyle,
  } = useCampusStore();

  // Initialize map once
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: CAMPUS_CENTER,
        zoom: 16,
        minZoom: 14,
        maxZoom: 19,
        zoomControl: false,
        attributionControl: true,
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      const config = TILE_SERVERS[mapTileStyle as TileStyle];
      tileLayerRef.current = L.tileLayer(config.url, {
        attribution: config.attribution,
        maxZoom: config.maxZoom,
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Swap tile layer when the style changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }
    const config = TILE_SERVERS[mapTileStyle as TileStyle];
    tileLayerRef.current = L.tileLayer(config.url, {
      attribution: config.attribution,
      maxZoom: config.maxZoom,
    }).addTo(mapInstanceRef.current);
  }, [mapTileStyle]);

  // Render and refresh markers
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    zones.forEach((zone) => {
      const { percentage, level } = getZoneOccupancyAtTime(zone, currentTime);
      const color = getOccupancyColor(level);
      const isSelected = zone.id === selectedZoneId;
      const isTP2 = zone.code === 'TP2';

      const customHtml = `
        <div class="group cursor-pointer transition-transform duration-150 ${isSelected ? 'scale-105' : 'hover:scale-105'}">
          <div class="flex items-center gap-1.5 whitespace-nowrap rounded-full border bg-night-card/95 pl-2 pr-2.5 py-1 backdrop-blur ${
            isSelected
              ? 'border-royal shadow-glow-royal'
              : 'border-night-line shadow-card'
          }">
            <span class="h-1.5 w-1.5 rounded-full ${color.dotColor}"></span>
            <span class="text-2xs font-semibold text-ink">${zone.code}</span>
            ${isTP2 ? '<span class="rounded-full bg-gold-soft px-1 py-px text-[8px] font-semibold text-gold">NEW</span>' : ''}
            <span class="text-2xs font-medium tabular-nums" style="color:${color.svgFill}">${percentage}%</span>
          </div>
          <div class="mx-auto h-2 w-px bg-ink-faint/40"></div>
          <div class="mx-auto h-1 w-1 rounded-full border border-ink-faint/60 bg-night-card"></div>
        </div>
      `;

      const icon = L.divIcon({
        className: 'custom-srm-marker',
        html: customHtml,
        iconSize: [96, 40],
        iconAnchor: [48, 40],
      });

      if (markersRef.current[zone.id]) {
        markersRef.current[zone.id].setIcon(icon);
      } else {
        const marker = L.marker([zone.location.lat, zone.location.lng], { icon }).addTo(map);
        marker.on('click', () => selectZone(zone.id));
        markersRef.current[zone.id] = marker;
      }
    });
  }, [zones, currentTime, selectedZoneId, getZoneOccupancyAtTime, selectZone]);

  const handleCenterCampus = () => {
    mapInstanceRef.current?.setView(CAMPUS_CENTER, 16, { animate: true });
  };

  const styleButton = (style: TileStyle, label: string) => (
    <button
      type="button"
      onClick={() => setMapTileStyle(style)}
      className={`rounded-full px-2.5 py-1 text-2xs font-medium transition-colors ${
        mapTileStyle === style
          ? 'bg-royal text-white'
          : 'text-ink-soft hover:bg-night-hover hover:text-ink'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Live map canvas */}
      <div ref={mapContainerRef} className="z-0 h-full w-full" />

      {/* Top-left: campus identity */}
      <div className="pointer-events-auto absolute left-4 top-4 z-[400] flex flex-col gap-2">
        <div className="flex items-center gap-2.5 rounded-card border border-night-line bg-night-card/95 px-3.5 py-2 shadow-card backdrop-blur">
          <MapPin className="h-3.5 w-3.5 text-royal" strokeWidth={1.75} />
          <div className="leading-tight">
            <div className="text-xs font-semibold text-ink">SRM IST · Kattankulathur</div>
            <div className="text-2xs font-mono text-ink-faint">12.823° N, 80.044° E</div>
          </div>
        </div>

        {selectedZoneId && (
          <div className="flex items-center gap-2 rounded-card border border-night-line bg-night-card/95 px-3.5 py-2 text-2xs shadow-card backdrop-blur">
            <span className="text-ink-faint">Selected</span>
            <span className="font-semibold text-ink">
              {zones.find((z) => z.id === selectedZoneId)?.name}
            </span>
          </div>
        )}
      </div>

      {/* Top-right: layer switcher + recenter */}
      <div className="pointer-events-auto absolute right-4 top-4 z-[400] flex items-center gap-2">
        <div className="flex items-center gap-0.5 rounded-full border border-night-line bg-night-card/95 p-1 shadow-card backdrop-blur">
          <Layers className="mx-1 h-3 w-3 text-ink-faint" strokeWidth={1.75} />
          {styleButton('dark', 'Dark')}
          {styleButton('streets', 'Streets')}
          {styleButton('satellite', 'Satellite')}
        </div>

        <button
          type="button"
          onClick={handleCenterCampus}
          title="Recenter campus"
          className="rounded-full border border-night-line bg-night-card/95 p-2 text-ink-soft shadow-card backdrop-blur transition-colors hover:text-ink"
        >
          <Crosshair className="h-4 w-4" strokeWidth={1.75} />
        </button>
      </div>
    </div>
  );
};
