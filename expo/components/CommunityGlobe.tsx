import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, {
  Circle,
  Path,
  Defs,
  RadialGradient,
  Stop,
  ClipPath,
  G,
} from 'react-native-svg';

const SIZE = 280;
const R = 118;
const CX = SIZE / 2;
const CY = SIZE / 2;

type Poly = [number, number][];

/** Simplified continent outlines — [lat, lng] pairs, clockwise winding */
const CONTINENTS: Poly[] = [
  // ── North America ─────────────────────────────────────────────────────────
  [
    [71,-156],[68,-168],[64,-168],[60,-166],[57,-136],[54,-133],[48,-124],
    [37,-122],[32,-117],[22,-105],[17,-94],[15,-92],[10,-84],[8,-77],
    [10,-73],[12,-71],[22,-97],[25,-97],[30,-97],[30,-81],[25,-80],
    [28,-80],[35,-75],[38,-76],[43,-70],[47,-53],[50,-56],[55,-60],
    [60,-65],[64,-68],[67,-62],[64,-76],[63,-88],[66,-96],[70,-98],
    [72,-80],[80,-65],[84,-63],[83,-80],[82,-92],[76,-110],[72,-125],
    [70,-140],[71,-156],
  ],
  // ── South America ─────────────────────────────────────────────────────────
  [
    [12,-72],[10,-63],[7,-61],[5,-52],[0,-50],[-5,-35],[-12,-38],
    [-20,-40],[-23,-43],[-30,-51],[-33,-52],[-35,-57],[-38,-57],
    [-42,-63],[-51,-69],[-55,-68],[-54,-65],[-52,-70],[-46,-75],
    [-38,-73],[-30,-72],[-18,-70],[-5,-80],[0,-79],[5,-77],[8,-77],
    [10,-73],[12,-72],
  ],
  // ── Europe (mainland + Balkans) ───────────────────────────────────────────
  [
    [36,-9],[44,-9],[44,-2],[43,3],[44,8],[44,14],[42,14],[38,15],
    [36,23],[38,24],[40,26],[42,28],[44,28],[47,40],[52,40],[55,38],
    [57,33],[60,30],[60,28],[63,30],[65,26],[68,28],[70,25],[68,14],
    [65,14],[64,16],[60,18],[57,18],[57,12],[54,10],[51,14],[48,14],
    [46,14],[45,20],[42,21],[40,24],[36,22],[36,10],[37,5],[36,-2],
    [36,-6],[36,-9],
  ],
  // ── Africa ────────────────────────────────────────────────────────────────
  [
    [37,-5],[37,10],[32,32],[22,37],[12,44],[11,51],
    [8,42],[0,42],[-10,40],[-25,33],[-35,28],[-35,22],[-30,17],
    [-18,12],[-5,10],[0,9],[5,2],[5,-3],[8,-5],
    [12,-17],[15,-17],[20,-17],[25,-15],[28,-13],[31,-8],
    [33,-8],[35,-5],[37,-5],
  ],
  // ── Asia (main Eurasian body) ─────────────────────────────────────────────
  [
    [70,27],[68,28],[65,26],[63,30],[60,28],[57,33],[55,38],
    [52,40],[47,40],[47,38],[44,44],[44,51],[38,57],[36,59],
    [38,66],[37,68],[38,75],[36,75],[28,86],[28,88],[22,92],
    [22,90],[20,86],[16,80],[8,77],[8,80],[10,80],[16,82],
    [22,88],[22,92],[20,93],[16,97],[10,99],[5,100],[2,104],
    [5,103],[10,105],[14,108],[20,107],[22,115],[25,122],
    [30,122],[35,121],[38,120],[40,122],[42,130],[44,135],
    [50,140],[55,140],[60,143],[62,140],[60,130],[55,125],
    [52,120],[50,115],[52,110],[52,100],[55,90],[55,82],
    [57,70],[57,60],[57,56],[60,50],[63,48],[65,42],
    [65,36],[65,33],[67,32],[68,30],[70,27],
  ],
  // ── Indian subcontinent ───────────────────────────────────────────────────
  [
    [28,68],[24,68],[22,70],[20,73],[16,73],[10,77],[8,77],
    [8,80],[10,80],[16,82],[22,88],[22,90],[25,90],[28,88],
    [30,78],[32,75],[28,68],
  ],
  // ── Australia ─────────────────────────────────────────────────────────────
  [
    [-20,114],[-14,128],[-14,136],[-12,136],[-14,142],
    [-18,148],[-24,152],[-28,154],[-34,151],
    [-38,147],[-38,145],[-35,138],[-37,140],
    [-35,117],[-28,114],[-22,114],[-20,114],
  ],
  // ── Greenland ─────────────────────────────────────────────────────────────
  [
    [84,-42],[83,-60],[82,-68],[77,-72],[72,-55],[68,-53],
    [65,-38],[68,-25],[72,-22],[76,-18],[80,-25],[83,-33],[84,-42],
  ],
];

const COMMUNITY_DOTS = [
  { lat: 40.18, lng: 44.51 },   // Armenia
  { lat: 55.75, lng: 37.62 },   // Russia
  { lat: 40.71, lng: -74.01 },  // USA
  { lat: 40.42, lng: -3.70 },   // Spain
  { lat: 43.65, lng: -79.38 },  // Canada
  { lat: 39.90, lng: 116.41 },  // China
  { lat: 31.77, lng: 35.21 },   // Israel
  { lat: 48.21, lng: 16.37 },   // Vienna
  { lat: 1.35,  lng: 103.82 },  // Singapore
];

function project(lat: number, lng: number, rotDeg: number) {
  const phi   = (90 - lat) * (Math.PI / 180);
  const theta = (lng + rotDeg) * (Math.PI / 180);
  return {
    x: CX + R * Math.sin(phi) * Math.cos(theta),
    y: CY - R * Math.cos(phi),
    z: Math.sin(phi) * Math.sin(theta), // > 0 → front hemisphere
  };
}

function buildContinentPath(poly: Poly, rotDeg: number): string {
  let d   = '';
  let pen = false;
  for (const [lat, lng] of poly) {
    const { x, y, z } = project(lat, lng, rotDeg);
    if (z > 0) {
      d += pen
        ? `L${x.toFixed(1)},${y.toFixed(1)}`
        : `M${x.toFixed(1)},${y.toFixed(1)}`;
      pen = true;
    } else {
      if (pen) d += 'Z';
      pen = false;
    }
  }
  if (pen) d += 'Z';
  return d;
}

function buildGrid(rotDeg: number): string {
  let d = '';
  for (const lat of [-60, -30, 0, 30, 60]) {
    let move = true;
    for (let lng = -180; lng <= 180; lng += 5) {
      const { x, y, z } = project(lat, lng, rotDeg);
      if (z > 0) {
        d += move ? `M${x.toFixed(1)},${y.toFixed(1)}` : `L${x.toFixed(1)},${y.toFixed(1)}`;
        move = false;
      } else move = true;
    }
  }
  for (let lng = -165; lng < 180; lng += 30) {
    let move = true;
    for (let lat = -80; lat <= 80; lat += 4) {
      const { x, y, z } = project(lat, lng, rotDeg);
      if (z > 0) {
        d += move ? `M${x.toFixed(1)},${y.toFixed(1)}` : `L${x.toFixed(1)},${y.toFixed(1)}`;
        move = false;
      } else move = true;
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
  const pulse  = 0.7 + 0.3 * Math.sin(frame * 0.07);

  const continentPaths = CONTINENTS.map(poly => buildContinentPath(poly, rotDeg));
  const grid           = buildGrid(rotDeg);

  const dots = COMMUNITY_DOTS.map(loc => ({
    ...loc,
    ...project(loc.lat, loc.lng, rotDeg),
  })).filter(d => d.z > 0.05);

  return (
    <View style={styles.wrapper}>
      <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        <Defs>
          {/* Globe base — bright top-left fading to darker edge */}
          <RadialGradient id="gBase" cx="38%" cy="32%" r="70%">
            <Stop offset="0%"   stopColor="#FFFFFF" />
            <Stop offset="55%"  stopColor="#EDECE7" />
            <Stop offset="100%" stopColor="#C2C0BA" />
          </RadialGradient>
          {/* Subtle atmosphere halo */}
          <RadialGradient id="gAtm" cx="50%" cy="50%" r="50%">
            <Stop offset="72%"  stopColor="#B0B8C0" stopOpacity="0"    />
            <Stop offset="87%"  stopColor="#B0B8C0" stopOpacity="0.1"  />
            <Stop offset="100%" stopColor="#B0B8C0" stopOpacity="0"    />
          </RadialGradient>
          {/* Specular highlight — top-left bright spot */}
          <RadialGradient id="gSpec" cx="32%" cy="28%" r="40%">
            <Stop offset="0%"   stopColor="#FFFFFF" stopOpacity="0.65" />
            <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0"    />
          </RadialGradient>
          {/* Edge darkening for 3-D depth */}
          <RadialGradient id="gEdge" cx="50%" cy="50%" r="50%">
            <Stop offset="70%"  stopColor="#000000" stopOpacity="0"    />
            <Stop offset="100%" stopColor="#000000" stopOpacity="0.22" />
          </RadialGradient>
          <ClipPath id="gClip">
            <Circle cx={CX} cy={CY} r={R} />
          </ClipPath>
        </Defs>

        {/* Atmosphere glow ring */}
        <Circle cx={CX} cy={CY} r={R + 14} fill="url(#gAtm)" />

        {/* Globe surface */}
        <Circle cx={CX} cy={CY} r={R} fill="url(#gBase)" />

        <G clipPath="url(#gClip)">
          {/* Grid lines — very faint */}
          <Path
            d={grid}
            stroke="#C8C7C1"
            strokeWidth="0.35"
            strokeOpacity="0.45"
            fill="none"
          />
          {/* Continent fills */}
          {continentPaths.map((d, i) =>
            d ? (
              <Path
                key={i}
                d={d}
                fill="#AEACA6"
                fillOpacity="0.95"
                stroke="#9E9C96"
                strokeWidth="0.5"
                strokeOpacity="0.9"
              />
            ) : null
          )}
        </G>

        {/* Edge shadow overlay — adds depth */}
        <Circle cx={CX} cy={CY} r={R} fill="url(#gEdge)" clipPath="url(#gClip)" />

        {/* Specular highlight */}
        <Circle cx={CX} cy={CY} r={R} fill="url(#gSpec)" clipPath="url(#gClip)" />

        {/* Outer border */}
        <Circle
          cx={CX} cy={CY} r={R}
          fill="none"
          stroke="#BEBCB6"
          strokeWidth="1"
        />

        {/* Community dots */}
        <G clipPath="url(#gClip)">
          {dots.map((d, i) => {
            const vis = Math.min(1, d.z * 3);
            const gr  = 7 * pulse;
            return (
              <G key={i}>
                {/* Glow ring */}
                <Circle cx={d.x} cy={d.y} r={gr}  fill="#3D7A5C" fillOpacity={0.22 * vis} />
                {/* Core dot */}
                <Circle cx={d.x} cy={d.y} r={3.5} fill="#2A6B50" fillOpacity={vis} />
                {/* Bright centre */}
                <Circle cx={d.x} cy={d.y} r={1.3} fill="#FFFFFF"  fillOpacity={vis * 0.9} />
              </G>
            );
          })}
        </G>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    paddingVertical: 12,
  },
});
