import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, type ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import { Billboard, Edges, Environment, Html, Lightformer, OrbitControls, RoundedBox } from "@react-three/drei";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import {
  connections,
  previousTickets,
  services,
  type OpsightMode,
  type PreviousTicket,
  type ServiceId,
} from "@/lib/opsight-data";

const HEALTHY = "#b7ddff";
const HEALTHY_CORE = "#7ec8ff";
const INCIDENT = "#ff233f";
const MEMORY_CYAN = "#38bdf8";
const MEMORY_PURPLE = "#c084fc";
const MEMORY_AMBER = "#f59e0b";
const DARK = "#02050a";

const positions = Object.fromEntries(
  Object.values(services).map((s) => [s.id, new THREE.Vector3(...s.position)]),
) as Record<ServiceId, THREE.Vector3>;

function GridFloor({ mode }: { mode: OpsightMode }) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uIntensity: { value: mode === "interface" ? 1 : 0.7 },
    }),
    [],
  );
  useEffect(() => {
    uniforms.uIntensity.value = mode === "interface" ? 1 : 0.7;
  }, [mode, uniforms]);
  useFrame((_, rawDelta) => {
    const time = material.current?.uniforms["uTime"];
    if (time) time.value += Math.min(rawDelta, 0.05);
  });
  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, -0.13, 1]}>
      <planeGeometry args={[28, 28, 1, 1]} />
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
        vertexShader={`varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`}
        fragmentShader={`
          varying vec2 vUv; uniform float uTime; uniform float uIntensity;
          void main(){
            vec2 p=(vUv-.5)*28.; vec2 g=abs(fract(p)-.5)/fwidth(p); float line=1.-min(min(g.x,g.y),1.);
            vec2 major=abs(fract(p/5.)-.5)/fwidth(p/5.); float m=1.-min(min(major.x,major.y),1.);
            float d=length(vUv-.5); float fade=1.-smoothstep(.18,.7,d);
            vec3 c=mix(vec3(.07,.24,.38),vec3(.18,.58,1.),m);
            float a=(line*.10+m*.20)*fade*uIntensity;
            gl_FragColor=vec4(c,a);
          }`}
      />
    </mesh>
  );
}

function AmbientNodes() {
  const ref = useRef<THREE.Points>(null);
  const geometry = useMemo(() => {
    const points: number[] = [];
    for (let i = 0; i < 150; i++) {
      const x = (((i * 67) % 149) / 149) * 26 - 13;
      const z = (((i * 43) % 137) / 137) * 25 - 10;
      const y = (((i * 29) % 101) / 101) * 5;
      points.push(x, y, z);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
    return geo;
  }, []);
  useFrame((_, rawDelta) => {
    if (ref.current) ref.current.rotation.y += Math.min(rawDelta, 0.05) * 0.008;
  });
  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial size={0.045} color={HEALTHY} transparent opacity={0.7} depthWrite={false} />
    </points>
  );
}

function DataLine({
  from,
  to,
  active,
  incident,
}: {
  from: ServiceId;
  to: ServiceId;
  active: boolean;
  incident: boolean;
}) {
  const dot = useRef<THREE.Mesh>(null);
  const curve = useMemo(() => {
    const a = positions[from].clone().add(new THREE.Vector3(0, 0.65, 0));
    const b = positions[to].clone().add(new THREE.Vector3(0, 0.65, 0));
    const mid = a.clone().lerp(b, 0.5);
    mid.y += 0.5;
    return new THREE.QuadraticBezierCurve3(a, mid, b);
  }, [from, to]);
  useFrame(({ clock }) => {
    if (!dot.current) return;
    const speed = incident ? 0.15 : 0.1;
    dot.current.position.copy(curve.getPoint((clock.elapsedTime * speed + from.length * 0.13) % 1));
  });
  const color = incident ? INCIDENT : HEALTHY;
  return (
    <>
      <mesh>
        <tubeGeometry args={[curve, 40, active ? 0.027 : 0.012, 5, false]} />
        <meshBasicMaterial color={color} transparent opacity={active ? 0.95 : 0.3} toneMapped={false} />
      </mesh>
      <mesh ref={dot}>
        <sphereGeometry args={[active ? 0.09 : 0.055, 8, 8]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
    </>
  );
}

function MemoryRay({
  from,
  to,
  active,
  color,
}: {
  from: [number, number, number];
  to: [number, number, number];
  active: boolean;
  color: string;
}) {
  const curve = useMemo(() => {
    const start = new THREE.Vector3(...from);
    const end = new THREE.Vector3(...to).add(new THREE.Vector3(0, 0.75, 0));
    const mid = start.clone().lerp(end, 0.5);
    mid.y += 0.6;
    return new THREE.QuadraticBezierCurve3(start, mid, end);
  }, [from, to]);

  const dot = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!dot.current) return;
    dot.current.position.copy(curve.getPoint((clock.elapsedTime * 0.18) % 1));
  });

  return (
    <>
      <mesh>
        <tubeGeometry args={[curve, 32, active ? 0.018 : 0.007, 4, false]} />
        <meshBasicMaterial color={color} transparent opacity={active ? 0.85 : 0.25} toneMapped={false} />
      </mesh>
      <mesh ref={dot}>
        <sphereGeometry args={[active ? 0.055 : 0.035, 6, 6]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
    </>
  );
}

function MemoryCrystalNode({
  ticket,
  selected,
  isRelatedToActiveNode,
  hide3DLabels = false,
  onSelect,
}: {
  ticket: PreviousTicket;
  selected: boolean;
  isRelatedToActiveNode: boolean;
  hide3DLabels?: boolean;
  onSelect: (ticket: PreviousTicket) => void;
}) {
  const group = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const color = ticket.similarity >= 90 ? MEMORY_CYAN : ticket.similarity >= 80 ? MEMORY_PURPLE : MEMORY_AMBER;
  const targetServicePos = services[ticket.serviceId].position;

  useFrame(({ clock }, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    if (group.current) {
      group.current.rotation.y += delta * (hovered || selected ? 1.2 : 0.4);
      group.current.position.y = ticket.position3D[1] + Math.sin(clock.elapsedTime * 1.5 + ticket.similarity) * 0.12;
      const targetScale = selected ? 1.35 : hovered ? 1.2 : isRelatedToActiveNode ? 1.08 : 0.92;
      group.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.12);
    }
    if (ring.current) {
      ring.current.rotation.z += delta * 0.8;
    }
  });

  const stop = (event: ThreeEvent<MouseEvent | PointerEvent>) => event.stopPropagation();

  return (
    <group position={[ticket.position3D[0], ticket.position3D[1], ticket.position3D[2]]}>
      <MemoryRay
        from={ticket.position3D}
        to={targetServicePos}
        active={selected || hovered || isRelatedToActiveNode}
        color={color}
      />
      <group
        ref={group}
        onClick={(e) => {
          stop(e);
          onSelect(ticket);
        }}
        onPointerOver={(e) => {
          stop(e);
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "default";
        }}
      >
        {/* Holographic 3D Crystal Octahedron */}
        <mesh>
          <octahedronGeometry args={[0.3, 0]} />
          <meshPhysicalMaterial
            color={color}
            emissive={color}
            emissiveIntensity={selected ? 1.8 : hovered ? 1.3 : isRelatedToActiveNode ? 0.9 : 0.4}
            metalness={0.9}
            roughness={0.15}
            transparent
            opacity={0.88}
          />
          <Edges color={color} threshold={15} />
        </mesh>

        {/* Orbiting Halo Ring */}
        <mesh ref={ring} rotation-x={Math.PI / 2}>
          <torusGeometry args={[0.48, 0.016, 6, 32]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={selected ? 0.95 : isRelatedToActiveNode ? 0.65 : 0.3}
            toneMapped={false}
          />
        </mesh>

        <pointLight
          color={color}
          intensity={selected ? 6 : isRelatedToActiveNode ? 3.5 : 1.5}
          distance={4}
          decay={2}
        />

        {/* Floating 3D Badge */}
        {!hide3DLabels && (
          <Html position={[0, 0.58, 0]} center distanceFactor={9} zIndexRange={[0, 10]} style={{ pointerEvents: "none" }}>
            <div
              className={`memory-node-tag ${selected ? "is-selected" : ""} ${isRelatedToActiveNode ? "is-related" : ""}`}
              style={{
                borderColor: color,
                boxShadow: selected ? `0 0 16px ${color}` : undefined,
              }}
            >
              <b style={{ color }}>{ticket.id}</b>
              <span>{ticket.similarity}% Match</span>
            </div>
          </Html>
        )}
      </group>
    </group>
  );
}

function WarningMark({ hide3DLabels }: { hide3DLabels?: boolean }) {
  return (
    <Billboard position={[1.25, 1, 0]}>
      <mesh>
        <circleGeometry args={[0.33, 3]} />
        <meshBasicMaterial color={INCIDENT} transparent opacity={0.82} toneMapped={false} />
      </mesh>
      {!hide3DLabels && (
        <Html center transform distanceFactor={7} zIndexRange={[0, 10]}>
          <span className="incident-mark">!</span>
        </Html>
      )}
    </Billboard>
  );
}

const databaseLayers = [
  { name: "BACKUP", detail: "82 GB · READY", y: 2.25, radius: 0.72 },
  { name: "LOG", detail: "18 GB · WRITING", y: 1.65, radius: 0.84 },
  { name: "CACHE", detail: "8 GB · 91% HIT", y: 1.05, radius: 0.7 },
  { name: "INDEX", detail: "42 GB · DEGRADED", y: 0.45, radius: 0.9 },
  { name: "DATA", detail: "120 GB · CRITICAL", y: -0.15, radius: 1.02 },
] as const;

function DatabaseMachine({ expanded, hide3DLabels = false }: { expanded: boolean; hide3DLabels?: boolean }) {
  const layerRefs = useRef<Array<THREE.Group | null>>([]);
  const flowRefs = useRef<Array<THREE.Mesh | null>>([]);
  useFrame(({ clock }, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    const easing = 1 - Math.exp(-4.5 * delta);
    layerRefs.current.forEach((layer, index) => {
      if (!layer) return;
      const compactY = 0.42 + index * 0.32;
      const definition = databaseLayers[index];
      if (!definition) return;
      const openY = definition.y + 1.1;
      layer.position.y = THREE.MathUtils.lerp(layer.position.y, expanded ? openY : compactY, easing);
      layer.rotation.y += delta * (index % 2 === 0 ? 0.09 : -0.07);
    });
    flowRefs.current.forEach((particle, index) => {
      if (!particle) return;
      const span = expanded ? 3.05 : 1.52;
      particle.position.y = 0.38 + ((clock.elapsedTime * 0.7 + index * 0.63) % span);
      particle.visible = expanded;
    });
  });
  return (
    <group position-y={0.16}>
      <mesh position-y={0.12}>
        <cylinderGeometry args={[1.35, 1.55, 0.2, 32]} />
        <meshStandardMaterial color={DARK} metalness={0.95} roughness={0.14} emissive={INCIDENT} emissiveIntensity={0.14} />
      </mesh>
      <mesh position-y={0.24} rotation-x={-Math.PI / 2}>
        <torusGeometry args={[1.24, 0.035, 8, 64]} />
        <meshBasicMaterial color={INCIDENT} toneMapped={false} />
      </mesh>
      {databaseLayers.map((layer, index) => (
        <group
          key={layer.name}
          ref={(value) => {
            layerRefs.current[index] = value;
          }}
          position-y={0.42 + index * 0.32}
        >
          <mesh>
            <cylinderGeometry args={[layer.radius, layer.radius * 1.06, 0.2, 32]} />
            <meshPhysicalMaterial
              color={DARK}
              metalness={0.88}
              roughness={0.16}
              transparent
              opacity={0.9}
              emissive={INCIDENT}
              emissiveIntensity={expanded ? 0.24 : 0.1}
            />
          </mesh>
          <mesh position-y={0.11} rotation-x={-Math.PI / 2}>
            <torusGeometry args={[layer.radius * 0.86, 0.025, 6, 48]} />
            <meshBasicMaterial color={INCIDENT} transparent opacity={0.8} toneMapped={false} />
          </mesh>
          {[-0.48, 0, 0.48].map((x, blockIndex) => (
            <mesh key={x} position={[x * layer.radius, 0.05, 0]}>
              <boxGeometry args={[0.17, 0.14, 0.22]} />
              <meshStandardMaterial
                color={blockIndex === 1 && index > 2 ? INCIDENT : HEALTHY_CORE}
                emissive={blockIndex === 1 && index > 2 ? INCIDENT : HEALTHY_CORE}
                emissiveIntensity={0.45}
                metalness={0.7}
              />
            </mesh>
          ))}
          {expanded && !hide3DLabels && (
            <Html position={[1.35, 0.04, 0]} center distanceFactor={8} zIndexRange={[0, 10]} style={{ pointerEvents: "none" }}>
              <div className={`database-layer-label ${index > 2 ? "is-critical" : ""}`}>
                <b>{layer.name}</b>
                <span>{layer.detail}</span>
              </div>
            </Html>
          )}
        </group>
      ))}
      {[0, 1, 2, 3].map((index) => (
        <mesh
          key={index}
          ref={(value) => {
            flowRefs.current[index] = value;
          }}
          position={[Math.cos((index * Math.PI) / 2) * 0.5, 0.4, Math.sin((index * Math.PI) / 2) * 0.5]}
        >
          <sphereGeometry args={[0.045, 8, 8]} />
          <meshBasicMaterial color={index % 2 ? HEALTHY_CORE : INCIDENT} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

function ServerNode({
  id,
  selected,
  hovered,
  dimmed,
  mode,
  hide3DLabels = false,
  onSelect,
  onHover,
}: {
  id: ServiceId;
  selected: boolean;
  hovered: boolean;
  dimmed: boolean;
  mode: OpsightMode;
  hide3DLabels?: boolean;
  onSelect: (id: ServiceId) => void;
  onHover: (id: ServiceId | null) => void;
}) {
  const data = services[id];
  const incident = data.status !== "HEALTHY";
  const group = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);
  const color = incident ? INCIDENT : HEALTHY;
  const core = incident ? INCIDENT : HEALTHY_CORE;

  useFrame(({ clock }, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    if (group.current) {
      const target = selected ? 1.13 : hovered ? 1.06 : 1;
      const current = group.current.scale.x;
      group.current.scale.setScalar(THREE.MathUtils.lerp(current, target, 1 - Math.exp(-7 * delta)));
      group.current.position.y = data.position[1] + Math.sin(clock.elapsedTime * 0.75 + id.length) * 0.09;
    }
    if (ring.current) {
      ring.current.rotation.z += delta * (incident ? 0.28 : 0.12);
      const pulse = incident ? 0.45 + Math.sin(clock.elapsedTime * 2.2) * 0.14 : 0.36;
      (ring.current.material as THREE.MeshBasicMaterial).opacity = selected ? 0.85 : pulse;
    }
  });

  const stop = (event: ThreeEvent<MouseEvent | PointerEvent>) => event.stopPropagation();

  return (
    <group
      ref={group}
      position={data.position}
      onClick={(e) => {
        stop(e);
        onSelect(id);
      }}
      onPointerOver={(e) => {
        stop(e);
        onHover(id);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        onHover(null);
        document.body.style.cursor = "default";
      }}
    >
      <group visible={!dimmed || Boolean(selected)}>
        <mesh position-y={0.03}>
          <cylinderGeometry args={[1.48, 1.65, 0.12, 8]} />
          <meshStandardMaterial
            color={DARK}
            metalness={0.9}
            roughness={0.12}
            emissive={color}
            emissiveIntensity={selected ? 0.55 : 0.18}
          />
        </mesh>
        <mesh ref={ring} rotation-x={-Math.PI / 2} position-y={0.12}>
          <torusGeometry args={[1.33, selected ? 0.035 : 0.022, 8, 64]} />
          <meshBasicMaterial color={color} transparent opacity={0.5} toneMapped={false} />
        </mesh>
        <mesh rotation-x={-Math.PI / 2} position-y={0.11}>
          <ringGeometry args={[0.8, 1.18, 48]} />
          <meshBasicMaterial color={color} transparent opacity={0.09} side={THREE.DoubleSide} />
        </mesh>
        {id === "database" ? (
          <DatabaseMachine expanded={selected} hide3DLabels={hide3DLabels} />
        ) : (
          <group position-y={1.22}>
            <RoundedBox args={[1.42, 2.18, 1.34]} radius={0.08} smoothness={3}>
              <meshPhysicalMaterial
                color={DARK}
                transparent
                opacity={0.52}
                transmission={0.35}
                metalness={0.7}
                roughness={0.18}
                emissive={core}
                emissiveIntensity={selected ? 0.18 : 0.045}
              />
              <Edges color={color} threshold={12} />
            </RoundedBox>
            {[0.65, 0.22, -0.22, -0.65].map((y, i) => (
              <group key={y} position={[0, y, 0.69]}>
                <RoundedBox args={[1.08, 0.27, 0.035]} radius={0.035} smoothness={2}>
                  <meshStandardMaterial
                    color="#050b13"
                    metalness={0.95}
                    roughness={0.12}
                    emissive={color}
                    emissiveIntensity={selected ? 0.2 : 0.05}
                  />
                  <Edges color={color} />
                </RoundedBox>
                <mesh position={[-0.37, 0, 0.035]}>
                  <boxGeometry args={[0.19, 0.025, 0.015]} />
                  <meshBasicMaterial color={color} toneMapped={false} />
                </mesh>
                {[0, 1, 2].map((n) => (
                  <mesh key={n} position={[0.22 + n * 0.13, 0, 0.04]}>
                    <circleGeometry args={[0.018, 8]} />
                    <meshBasicMaterial color={n === i % 3 ? color : "#16304a"} toneMapped={false} />
                  </mesh>
                ))}
              </group>
            ))}
            <mesh position={[0, 1.13, 0]} rotation-x={-Math.PI / 2}>
              <boxGeometry args={[1.18, 1.08, 0.035]} />
              <meshBasicMaterial color={color} transparent opacity={0.52} toneMapped={false} />
            </mesh>
            <mesh position={[0, 1.25, 0]}>
              <octahedronGeometry args={[0.17, 0]} />
              <meshBasicMaterial color={color} toneMapped={false} />
            </mesh>
          </group>
        )}
        <pointLight position={[0, 0.75, 0]} color={color} intensity={selected ? 14 : incident ? 7 : 4} distance={5.5} decay={2} />
        {(incident || (mode === "interface" && selected)) && incident ? <WarningMark hide3DLabels={hide3DLabels} /> : null}
      </group>
      {!hide3DLabels && (
        <Html position={[0, 3, 0]} center distanceFactor={10} zIndexRange={[0, 10]} style={{ pointerEvents: "none" }}>
          <div
            className={`node-label ${incident ? "node-label-incident" : ""} ${selected || hovered ? "is-active" : ""}`}
          >
            <span>{data.name}</span>
            <small>{data.status}</small>
          </div>
        </Html>
      )}
    </group>
  );
}

function CameraFocus({
  selected,
  selectedTicket,
  controls,
}: {
  selected: ServiceId | null;
  selectedTicket: PreviousTicket | null;
  controls: React.RefObject<any>;
}) {
  const { camera } = useThree();
  const focus = useRef(new THREE.Vector3(0, 0.5, 0));

  useFrame((_, rawDelta) => {
    const t = 1 - Math.exp(-3 * Math.min(rawDelta, 0.05));
    let target = new THREE.Vector3(0, 0.4, 0);

    if (selectedTicket) {
      target = new THREE.Vector3(...selectedTicket.position3D);
      focus.current.lerp(target, t);
      if (controls.current) controls.current.target.copy(focus.current);
      if (camera.position.distanceTo(target) > 8) {
        camera.position.lerp(target.clone().add(new THREE.Vector3(3.5, 3.5, 5)), t * 0.45);
      }
    } else if (selected) {
      target = positions[selected].clone().add(new THREE.Vector3(0, 0.8, 0));
      focus.current.lerp(target, t);
      if (controls.current) controls.current.target.copy(focus.current);
      if (camera.position.distanceTo(target) > 10.5) {
        camera.position.lerp(target.clone().add(new THREE.Vector3(5, 6.3, 8.5)), t * 0.45);
      }
    } else {
      focus.current.lerp(target, t);
      if (controls.current) controls.current.target.copy(focus.current);
    }
  });
  return null;
}

function Scene({
  selected,
  hovered,
  selectedTicket,
  mode,
  hide3DLabels = false,
  onSelect,
  onHover,
  onSelectTicket,
}: {
  selected: ServiceId | null;
  hovered: ServiceId | null;
  selectedTicket: PreviousTicket | null;
  mode: OpsightMode;
  hide3DLabels?: boolean;
  onSelect: (id: ServiceId) => void;
  onHover: (id: ServiceId | null) => void;
  onSelectTicket: (ticket: PreviousTicket | null) => void;
}) {
  const controls = useRef<any>(null);
  const related = useMemo(
    () => new Set(selected ? connections.filter(([a, b]) => a === selected || b === selected).flat() : []),
    [selected],
  );

  return (
    <>
      <ambientLight intensity={0.32} color="#779ac0" />
      <directionalLight position={[-4, 12, 5]} intensity={1.4} color="#d8edff" />
      <Environment resolution={64}>
        <Lightformer intensity={2} color="#b7ddff" position={[0, 8, -4]} scale={[10, 3, 1]} />
        <Lightformer intensity={3} color="#ff233f" position={[8, 2, 8]} rotation-y={-Math.PI / 2} scale={[6, 2, 1]} />
        <Lightformer intensity={2.5} color="#a855f7" position={[-8, 4, 0]} rotation-y={Math.PI / 2} scale={[6, 2, 1]} />
      </Environment>
      <fogExp2 attach="fog" args={[DARK, 0.027]} />
      <GridFloor mode={mode} />
      <AmbientNodes />

      {/* Network Data Lines between live services */}
      {connections.map(([from, to]) => (
        <DataLine
          key={`${from}-${to}`}
          from={from}
          to={to}
          incident={from === "payment" && to === "database"}
          active={!selected || from === selected || to === selected}
        />
      ))}

      {/* Live Server Nodes */}
      {(Object.keys(services) as ServiceId[]).map((id) => (
        <ServerNode
          key={id}
          id={id}
          selected={selected === id}
          hovered={hovered === id}
          dimmed={Boolean(selected && !related.has(id) && id !== selected)}
          mode={mode}
          hide3DLabels={hide3DLabels}
          onSelect={onSelect}
          onHover={onHover}
        />
      ))}

      {/* Holographic 3D Hindsight Memory Crystals (Previous Tickets & Proven Fixes) */}
      {previousTickets.map((ticket) => (
        <MemoryCrystalNode
          key={ticket.id}
          ticket={ticket}
          selected={selectedTicket?.id === ticket.id}
          isRelatedToActiveNode={Boolean(
            selected && (ticket.serviceId === selected || ticket.relatedServiceId === selected),
          )}
          hide3DLabels={hide3DLabels}
          onSelect={(t) => onSelectTicket(t)}
        />
      ))}

      <CameraFocus selected={selected} selectedTicket={selectedTicket} controls={controls} />
      <OrbitControls
        ref={controls}
        makeDefault
        enableDamping
        dampingFactor={0.075}
        minDistance={8}
        maxDistance={25}
        minPolarAngle={0.5}
        maxPolarAngle={1.4}
        target={[0, 0.4, 0]}
        enablePan={false}
      />
      <EffectComposer multisampling={0}>
        <Bloom
          intensity={mode === "interface" ? 0.72 : 0.48}
          luminanceThreshold={0.35}
          luminanceSmoothing={0.35}
          mipmapBlur
        />
        <Vignette offset={0.22} darkness={0.82} />
      </EffectComposer>
    </>
  );
}

export function InfrastructureScene({
  selected,
  hovered,
  selectedTicket,
  mode,
  hide3DLabels = false,
  onSelect,
  onHover,
  onSelectTicket,
  onDeselect,
}: {
  selected: ServiceId | null;
  hovered: ServiceId | null;
  selectedTicket: PreviousTicket | null;
  mode: OpsightMode;
  hide3DLabels?: boolean;
  onSelect: (id: ServiceId) => void;
  onHover: (id: ServiceId | null) => void;
  onSelectTicket: (ticket: PreviousTicket | null) => void;
  onDeselect: () => void;
}) {
  const [failed, setFailed] = useState(false);
  if (failed)
    return (
      <div className="webgl-fallback">
        <strong>3D view unavailable</strong>
        <span>Your browser could not start the infrastructure renderer.</span>
      </div>
    );
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [11.2, 9.8, 14.2], fov: 43, near: 0.1, far: 80 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
        gl.domElement.addEventListener("webglcontextlost", () => setFailed(true), { once: true });
      }}
      onPointerMissed={() => {
        onDeselect();
        onSelectTicket(null);
      }}
    >
      <Scene
        selected={selected}
        hovered={hovered}
        selectedTicket={selectedTicket}
        mode={mode}
        hide3DLabels={hide3DLabels}
        onSelect={onSelect}
        onHover={onHover}
        onSelectTicket={onSelectTicket}
      />
    </Canvas>
  );
}
