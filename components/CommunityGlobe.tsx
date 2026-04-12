import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, {
  Circle,
  Path,
  Defs,
  RadialGradient,
  Stop,
  ClipPath,
  G,
} from 'react-native-svg';
import { darkTheme } from '@/constants/theme';

const SIZE = 260;
const R = 108;
const CX = SIZE / 2;
const CY = SIZE / 2;

const LOCATIONS = [
  { lat: 40.18, lng: 44.51,  label: 'Армения' },
  { lat: 55.75, lng: 37.62,  label: 'Россия' },
  { lat: 40.71, lng: -74.01, label: 'США' },
  { lat: 40.42, lng: -3.70,  label: 'Испания' },
  { lat: 43.65, lng: -79.38, label: 'Канада' },
  { lat: 39.90, lng: 116.41, label: 'Китай' },
  { lat: 31.77, lng: 35.21,  label: 'Израиль' },
  { lat: 48.21, lng: 16.37,  label: 'Вена' },
  { lat: 1.35,  lng: 103.82, label: 'Сингапур' },
];

const COUNTRY_FLAGS: Record<string, string> = {
  'Армения': '🇦🇲',
  'Россия': '🇷🇺',
  'США': '🇺🇸',
  'Испания': '🇪🇸',
  'Канада': '🇨🇦',
  'Китай': '🇨🇳',
  'Израиль': '🇮🇱',
  'Вена': '🇦🇹',
  'Сингапур': '🇸🇬',
};

function project(lat: number, lng: number, rotDeg: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + rotDeg) * (Math.PI / 180);
  return {
    x: CX + R * Math.sin(phi) * Math.cos(theta),
    y: CY - R * Math.cos(phi),
    z: Math.sin(phi) * Math.sin(theta), // > 0 → front hemisphere
  };
}

function buildGrid(rotDeg: number): string {
  let d = '';

  // Latitude lines
  for (const lat of [-60, -30, 0, 30, 60]) {
    let move = true;
    for (let lng = -180; lng <= 180; lng += 5) {
      const { x, y, z } = project(lat, lng, rotDeg);
      if (z > 0) {
        d += move
          ? `M${x.toFixed(1)},${y.toFixed(1)}`
          : `L${x.toFixed(1)},${y.toFixed(1)}`;
        move = false;
      } else {
        move = true;
      }
    }
  }

  // Longitude lines
  for (let lng = -165; lng < 180; lng += 30) {
    let move = true;
    for (let lat = -80; lat <= 80; lat += 4) {
      const { x, y, z } = project(lat, lng, rotDeg);
      if (z > 0) {
        d += move
          ? `M${x.toFixed(1)},${y.toFixed(1)}`
          : `L${x.toFixed(1)},${y.toFixed(1)}`;
        move = false;
      } else {
        move = true;
      }
    }
  }

  return d;
}

export function CommunityGlobe() {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setFrame(f => f + 1), 50);
    return () => clearInterval(id);
  }, []);

  const rotDeg = frame * 0.35;
  const pulse = 0.7 + 0.3 * Math.sin(frame * 0.07);
  const grid = buildGrid(rotDeg);

  const dots = LOCATIONS.map(loc => ({
    ...loc,
    ...project(loc.lat, loc.lng, rotDeg),
  })).filter(d => d.z > 0.04);

  return (
    <View style={styles.wrapper}>
      {/* Globe */}
      <View style={styles.globeContainer}>
        <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
          <Defs>
            <RadialGradient id="gBg" cx="38%" cy="32%" r="65%">
              <Stop offset="0%" stopColor="#1e3a30" />
              <Stop offset="100%" stopColor="#091510" />
            </RadialGradient>
            <RadialGradient id="gAtm" cx="50%" cy="50%" r="50%">
              <Stop offset="68%" stopColor="#6B8E7F" stopOpacity="0" />
              <Stop offset="84%" stopColor="#6B8E7F" stopOpacity="0.18" />
              <Stop offset="100%" stopColor="#6B8E7F" stopOpacity="0" />
            </RadialGradient>
            <RadialGradient id="gSpec" cx="32%" cy="28%" r="42%">
              <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.14" />
              <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </RadialGradient>
            <ClipPath id="gClip">
              <Circle cx={CX} cy={CY} r={R} />
            </ClipPath>
          </Defs>

          {/* Atmosphere glow (outside globe) */}
          <Circle cx={CX} cy={CY} r={R + 14} fill="url(#gAtm)" />

          {/* Globe surface */}
          <Circle cx={CX} cy={CY} r={R} fill="url(#gBg)" />

          {/* Grid lines */}
          <G clipPath="url(#gClip)">
            <Path
              d={grid}
              stroke="#6B8E7F"
              strokeWidth="0.45"
              strokeOpacity="0.35"
              fill="none"
            />
          </G>

          {/* Specular highlight */}
          <Circle
            cx={CX}
            cy={CY}
            r={R}
            fill="url(#gSpec)"
            clipPath="url(#gClip)"
          />

          {/* Globe border */}
          <Circle
            cx={CX}
            cy={CY}
            r={R}
            fill="none"
            stroke="#6B8E7F"
            strokeWidth="1.2"
            strokeOpacity="0.55"
          />

          {/* Location dots */}
          {dots.map((d, i) => {
            const vis = Math.min(1, d.z * 2.5);
            const glowR = 10 * pulse;
            return (
              <G key={i}>
                {/* Outer glow */}
                <Circle
                  cx={d.x}
                  cy={d.y}
                  r={glowR}
                  fill="#6B8E7F"
                  fillOpacity={0.12 * vis}
                />
                {/* Inner glow */}
                <Circle
                  cx={d.x}
                  cy={d.y}
                  r={glowR * 0.55}
                  fill="#7FFFD4"
                  fillOpacity={0.28 * vis}
                />
                {/* Core dot */}
                <Circle
                  cx={d.x}
                  cy={d.y}
                  r={2.8}
                  fill="#7FFFD4"
                  fillOpacity={vis}
                />
                {/* Bright centre */}
                <Circle
                  cx={d.x}
                  cy={d.y}
                  r={1.2}
                  fill="#FFFFFF"
                  fillOpacity={vis * 0.9}
                />
              </G>
            );
          })}
        </Svg>
      </View>

      {/* Subtitle */}
      <Text style={styles.subtitle}>
        9 стран уже практикуют вместе с вами
      </Text>

      {/* Country chips */}
      <View style={styles.chips}>
        {LOCATIONS.map(({ label }) => (
          <View key={label} style={styles.chip}>
            <Text style={styles.chipText}>
              {COUNTRY_FLAGS[label]} {label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 20,
    paddingHorizontal: 16,
    gap: 12,
  },
  globeContainer: {
    width: SIZE,
    height: SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: darkTheme.colors.textSecondary,
    textAlign: 'center',
    fontWeight: darkTheme.fontWeight.medium,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
  },
  chip: {
    backgroundColor: darkTheme.colors.backgroundSecondary,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: darkTheme.colors.border,
  },
  chipText: {
    fontSize: 12,
    color: darkTheme.colors.text,
    fontWeight: darkTheme.fontWeight.medium,
  },
});
