import React from 'react';
import { spring, useCurrentFrame } from 'remotion';
import { C, FPS, SPRING } from './theme';

const O = C.outline;

export type PersonP = {
  x: number; y: number; s?: number; flip?: boolean; pose?: 'sit' | 'stand';
  skin: string; ear: string; shirt: string; pants: string; hair: string;
  long?: boolean; lungi?: string; glasses?: boolean; mustache?: string;
  mouth?: boolean; smile?: boolean; sad?: boolean; blink?: boolean;
  hand?: [number, number]; elbow?: [number, number]; arm?: 'rest' | 'raise';
};

/**
 * Character construction rules:
 * - one continuous torso-to-hip silhouette (no exposed waist seam/gap)
 * - legs overlap the pelvis with a generous hidden join
 * - hands are simple rounded mittens; no drawn individual cartoon fingers
 * - limbs use round caps/joins to avoid gaps while the pose changes
 */
export const Person: React.FC<PersonP> = (p) => {
  const {
    x, y, s = 1, flip, pose = 'sit', skin, ear, shirt, pants, hair,
    long, lungi, glasses, mustache, mouth, smile, sad, blink, arm = 'rest'
  } = p;
  const sit = pose === 'sit';
  const hand = p.hand ?? (sit ? [128, -126] : arm === 'raise' ? [120, -150] : [18, -30]);
  const elbow = p.elbow ?? (sit ? [62, -96] : arm === 'raise' ? [64, -112] : [10, -90]);
  const armPts = `0,-160 ${elbow[0]},${elbow[1]} ${hand[0]},${hand[1]}`;
  const torsoBottom = long && !sit ? 118 : 18;

  return (
    <g transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
      {/* Legs / lower body are drawn first so the waist connection stays hidden underneath the torso. */}
      {sit ? (
        <g stroke={O} strokeWidth={4} strokeLinejoin="round" strokeLinecap="round">
          {/* One connected seated lower-body silhouette: seat, thigh and hanging lower leg. */}
          <path
            d="M-42,-28
               Q-44,-48 -20,-48
               L102,-48
               Q145,-48 151,-15
               L151,16
               Q150,42 122,47
               L70,47
               Q47,47 38,30
               L-24,30
               Q-45,26 -42,-2 Z"
            fill={pants}
          />
          <path
            d="M72,22
               Q72,5 91,5
               L121,5
               Q145,5 145,30
               L145,174
               Q145,194 125,194
               L91,194
               Q72,194 72,174 Z"
            fill={pants}
          />
          <ellipse cx={108} cy={190} rx={49} ry={16} fill="#1f1a17" />
        </g>
      ) : (
        <>
          {lungi ? (
            <g stroke={O} strokeWidth={4} strokeLinejoin="round">
              {/* Waist is tucked under the shirt; no gap between shirt and lungi. */}
              <path d="M-48,-18 Q-48,-34 -30,-34 L42,-34 Q60,-34 60,-14 L60,196 Q60,214 42,214 L-28,214 Q-48,214 -48,194 Z" fill={lungi} />
              <path d="M-46,58 H58 M-46,126 H58 M-10,-22 V208 M24,-22 V208" stroke="#00000030" strokeWidth={3} fill="none" />
              <ellipse cx={8} cy={214} rx={44} ry={13} fill="#6b4a32" />
            </g>
          ) : (
            <g stroke={O} strokeWidth={4} strokeLinejoin="round">
              {/* Pelvis/shorts form a bridge across both legs. */}
              <path d="M-43,-24 Q-43,-42 -25,-42 L29,-42 Q47,-42 47,-22 L47,24 Q47,43 28,43 L-25,43 Q-43,43 -43,24 Z" fill={pants} />
              {/* Leg tops start inside the pelvis so motion cannot expose a waist gap. */}
              <path d="M-39,8 Q-39,-4 -27,-4 L-7,-4 Q7,-4 7,12 L7,190 Q7,207 -10,207 L-24,207 Q-42,207 -42,190 Z" fill={pants} />
              <path d="M-4,8 Q-4,-4 10,-4 L31,-4 Q45,-4 45,12 L45,190 Q45,207 28,207 L13,207 Q-4,207 -4,190 Z" fill={pants} />
              <ellipse cx={3} cy={208} rx={46} ry={15} fill="#1f1a17" />
            </g>
          )}
        </>
      )}

      {/* Continuous shirt silhouette covers the waist seam and overlaps the pelvis. */}
      <path
        d={`M-45,-195
            Q-45,-205 -30,-205
            L30,-205
            Q47,-205 47,-187
            L47,${torsoBottom - 28}
            Q47,${torsoBottom} 22,${torsoBottom + 4}
            L-20,${torsoBottom + 4}
            Q-45,${torsoBottom + 2} -45,${torsoBottom - 24} Z`}
        fill={shirt}
        stroke={O}
        strokeWidth={4}
        strokeLinejoin="round"
      />
      <path d="M-14 -228 L16 -228 L16 -188 Q16 -178 3 -178 Q-14 -178 -14 -190 Z"
        fill={skin} stroke={O} strokeWidth={4} strokeLinejoin="round" />

      {/* Head and face */}
      <circle cx={6} cy={-272} r={62} fill={skin} stroke={O} strokeWidth={4} />
      <ellipse cx={-16} cy={-262} rx={13} ry={19} fill={ear} stroke={O} strokeWidth={3} />
      <path d="M-58 -282 Q-46 -346 14 -340 Q68 -334 70 -284 Q40 -308 -12 -300 Z"
        fill={hair} stroke={O} strokeWidth={3} />
      {blink ? (
        <path d="M24 -278 Q36 -272 48 -278" stroke={O} strokeWidth={4} fill="none" strokeLinecap="round" />
      ) : (
        <>
          <circle cx={36} cy={-278} r={13} fill="#fff" stroke={O} strokeWidth={3} />
          <circle cx={40} cy={-278} r={6} fill={O} />
        </>
      )}
      {sad ? (
        <path d="M24 -296 L50 -306" stroke={O} strokeWidth={4} strokeLinecap="round" />
      ) : (
        <path d="M26 -300 Q38 -308 50 -300" stroke={O} strokeWidth={4} fill="none" strokeLinecap="round" />
      )}
      {glasses && (
        <>
          <circle cx={38} cy={-278} r={21} fill="#ffffff22" stroke={O} strokeWidth={3} />
          <path d="M17 -280 L-8 -286" stroke={O} strokeWidth={3} />
        </>
      )}
      {mustache && <path d="M48 -256 Q62 -266 76 -256 Q62 -250 48 -256 Z" fill={mustache} stroke={O} strokeWidth={2} />}
      {mouth ? (
        <ellipse cx={60} cy={-240} rx={8} ry={11} fill="#3b1a14" />
      ) : smile ? (
        <path d="M44 -242 Q58 -226 72 -244" stroke={O} strokeWidth={4} fill="none" strokeLinecap="round" />
      ) : sad ? (
        <path d="M48 -236 Q58 -246 68 -236" stroke={O} strokeWidth={4} fill="none" strokeLinecap="round" />
      ) : (
        <path d="M48 -242 Q58 -237 66 -243" stroke={O} strokeWidth={4} fill="none" strokeLinecap="round" />
      )}

      {/* Arm is layered over torso; mitten-shaped palm has no individual fingers. */}
      <polyline points={armPts} fill="none" stroke={O} strokeWidth={46} strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={armPts} fill="none" stroke={shirt} strokeWidth={38} strokeLinecap="round" strokeLinejoin="round" />
      <path
        d={`M${hand[0]-13},${hand[1]-13}
            Q${hand[0]-24},${hand[1]-5} ${hand[0]-16},${hand[1]+9}
            Q${hand[0]-9},${hand[1]+24} ${hand[0]+8},${hand[1]+20}
            Q${hand[0]+25},${hand[1]+16} ${hand[0]+23},${hand[1]+1}
            Q${hand[0]+20},${hand[1]-12} ${hand[0]+8},${hand[1]-16}
            Q${hand[0]-2},${hand[1]-21} ${hand[0]-13},${hand[1]-13} Z`}
        fill={skin} stroke={O} strokeWidth={4} strokeLinejoin="round"
      />
    </g>
  );
};

// Small infographic figure: limbs overlap the body so no gaps appear while bobbing.
export const Mini: React.FC<{ x: number; y: number; s?: number; color: string; skin?: string; flip?: boolean; bob?: number }> = ({ x, y, s = 1, color, skin = '#9A6238', flip, bob = 0 }) => (
  <g transform={`translate(${x},${y + bob}) scale(${flip ? -s : s},${s})`}>
    <path d="M-11,-20 Q-11,-27 -5,-27 L6,-27 Q12,-27 12,-20 L12,36 Q12,42 6,42 L-6,42 Q-12,42 -12,36 Z" fill="#2A3550" />
    <rect x={-17} y={-78} width={34} height={72} rx={16} fill={color} />
    <path d="M-15,-14 Q0,-7 15,-14 L14,2 Q0,9 -14,2 Z" fill={color} />
    <circle cx={0} cy={-96} r={17} fill={skin} />
    <path d="M-17 -100 Q-12 -118 4 -114 Q17 -112 17 -100 Q4 -108 -17 -100Z" fill="#17120f" />
    <circle cx={7} cy={-96} r={2.6} fill="#17120f" />
  </g>
);

export const Bubble: React.FC<{ x: number; y: number; text: string; delay?: number; w?: number; tail?: 'l' | 'r'; dark?: boolean }> = ({ x, y, text, delay = 0, w = 70, tail = 'l', dark }) => {
  const f = useCurrentFrame();
  const sc = spring({ frame: f - delay, fps: FPS, config: SPRING });
  const fill = dark ? '#2f2a27' : '#F6EFE8';
  const tx = dark ? '#F6EFE8' : C.ink;
  return (
    <g transform={`translate(${x},${y}) scale(${sc})`} opacity={Math.min(1, sc)}>
      <rect x={-w / 2} y={-26} width={w} height={42} rx={20} fill={fill} stroke={O} strokeWidth={2.5} />
      <path d={tail === 'l' ? 'M-14 14 L-24 30 L2 14Z' : 'M14 14 L24 30 L-2 14Z'} fill={fill} stroke={O} strokeWidth={2.5} strokeLinejoin="round" />
      <rect x={-w / 2 + 3} y={8} width={w - 6} height={9} fill={fill} />
      <text x={0} y={5} textAnchor="middle" fontFamily="Hind" fontWeight={700} fontSize={22} fill={tx}>{text}</text>
    </g>
  );
};
