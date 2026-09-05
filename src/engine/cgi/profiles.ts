import * as THREE from "three";

/** N20 acoustic cover, plan view. +X intake, +Y of shape → world +Z (front). */
export function beautyCoverShape(): THREE.Shape {
  const s = new THREE.Shape();
  // Traced from F3x in-bay photographs: shield silhouette, OFH cut-out on intake/front.
  s.moveTo(-0.148, -0.236);
  s.lineTo(0.138, -0.236);
  s.quadraticCurveTo(0.158, -0.236, 0.158, -0.214);
  s.lineTo(0.158, -0.02);
  s.quadraticCurveTo(0.158, 0.055, 0.072, 0.092);
  s.lineTo(0.05, 0.2);
  s.quadraticCurveTo(0.042, 0.228, 0.012, 0.232);
  s.lineTo(-0.118, 0.232);
  s.quadraticCurveTo(-0.152, 0.232, -0.158, 0.198);
  s.lineTo(-0.158, -0.214);
  s.quadraticCurveTo(-0.158, -0.236, -0.148, -0.236);
  s.closePath();
  return s;
}

export function valveCoverShape(): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(-0.108, -0.228);
  s.lineTo(0.108, -0.228);
  s.quadraticCurveTo(0.122, -0.228, 0.122, -0.21);
  s.lineTo(0.122, 0.2);
  s.quadraticCurveTo(0.122, 0.218, 0.104, 0.218);
  s.lineTo(-0.104, 0.218);
  s.quadraticCurveTo(-0.122, 0.218, -0.122, 0.2);
  s.lineTo(-0.122, -0.21);
  s.quadraticCurveTo(-0.122, -0.228, -0.108, -0.228);
  s.closePath();
  const w1 = new THREE.Path();
  w1.absellipse(0, -0.078, 0.038, 0.062, 0, Math.PI * 2, true);
  const w2 = new THREE.Path();
  w2.absellipse(0, 0.078, 0.038, 0.062, 0, Math.PI * 2, true);
  s.holes.push(w1, w2);
  return s;
}

export function blockShape(): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(-0.108, -0.232);
  s.lineTo(0.108, -0.232);
  s.quadraticCurveTo(0.118, -0.232, 0.118, -0.218);
  s.lineTo(0.118, 0.2);
  s.quadraticCurveTo(0.118, 0.228, 0.092, 0.238);
  s.lineTo(-0.092, 0.238);
  s.quadraticCurveTo(-0.118, 0.228, -0.118, 0.2);
  s.lineTo(-0.118, -0.218);
  s.quadraticCurveTo(-0.118, -0.232, -0.108, -0.232);
  s.closePath();
  return s;
}

export function headShape(): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(-0.112, -0.235);
  s.lineTo(0.112, -0.235);
  s.quadraticCurveTo(0.124, -0.235, 0.124, -0.22);
  s.lineTo(0.124, 0.215);
  s.quadraticCurveTo(0.124, 0.232, 0.108, 0.236);
  s.lineTo(-0.108, 0.236);
  s.quadraticCurveTo(-0.124, 0.232, -0.124, 0.215);
  s.lineTo(-0.124, -0.22);
  s.quadraticCurveTo(-0.124, -0.235, -0.112, -0.235);
  s.closePath();
  return s;
}

export function sumpShape(): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(-0.1, -0.2);
  s.lineTo(0.1, -0.2);
  s.quadraticCurveTo(0.112, -0.2, 0.112, -0.186);
  s.lineTo(0.1, 0.2);
  s.lineTo(-0.1, 0.2);
  s.lineTo(-0.112, -0.186);
  s.quadraticCurveTo(-0.112, -0.2, -0.1, -0.2);
  s.closePath();
  return s;
}

export function ofhBodyShape(): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(-0.052, -0.048);
  s.lineTo(0.04, -0.048);
  s.quadraticCurveTo(0.055, -0.048, 0.055, -0.03);
  s.lineTo(0.055, 0.038);
  s.quadraticCurveTo(0.055, 0.052, 0.038, 0.052);
  s.lineTo(-0.038, 0.052);
  s.quadraticCurveTo(-0.055, 0.052, -0.055, 0.034);
  s.lineTo(-0.055, -0.032);
  s.quadraticCurveTo(-0.055, -0.048, -0.052, -0.048);
  s.closePath();
  return s;
}

export function intakePlenumShape(): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(-0.048, -0.2);
  s.lineTo(0.048, -0.2);
  s.quadraticCurveTo(0.058, -0.2, 0.058, -0.186);
  s.lineTo(0.052, 0.175);
  s.quadraticCurveTo(0.052, 0.192, 0.036, 0.192);
  s.lineTo(-0.036, 0.192);
  s.quadraticCurveTo(-0.052, 0.192, -0.052, 0.175);
  s.lineTo(-0.058, -0.186);
  s.quadraticCurveTo(-0.058, -0.2, -0.048, -0.2);
  s.closePath();
  return s;
}

export function dmeShape(): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(-0.048, -0.085);
  s.lineTo(0.048, -0.085);
  s.lineTo(0.048, 0.085);
  s.lineTo(-0.048, 0.085);
  s.closePath();
  return s;
}

export function coolerShape(): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(-0.042, -0.032);
  s.lineTo(0.042, -0.032);
  s.lineTo(0.042, 0.032);
  s.lineTo(-0.042, 0.032);
  s.closePath();
  return s;
}

export function heatShieldShape(): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(-0.07, -0.09);
  s.quadraticCurveTo(-0.09, 0, -0.06, 0.08);
  s.lineTo(0.05, 0.07);
  s.quadraticCurveTo(0.08, 0, 0.05, -0.08);
  s.closePath();
  return s;
}
