import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { verdictHex } from "../lib/verdicts";
import type { Theme } from "../lib/useTheme";
import { streamRows } from "./streamData";

/**
 * The hero: file paths stream past a watching lens, and each one is tagged with
 * its verdict colour as it crosses the lens plane. This is the product's actual
 * behaviour, shown rather than described.
 *
 * Text is drawn to a 2D canvas and used as a texture, so the real IBM Plex Mono
 * webfont renders in the scene without shipping a second font format for a 3D
 * text library.
 */

const CARD_W = 3.4;
const CARD_H = 0.4;
/** Vertical travel: cards enter above the lens and leave below it. */
const TRACK_TOP = 4.6;
const TOTAL_ROWS = 12;
/** World units between adjacent rows -- wide enough that perspective
 * foreshortening on receding cards cannot compress them into overlap. */
const ROW_PITCH = 1.35;
const TRACK_RANGE = ROW_PITCH * TOTAL_ROWS;
const SPEED = 0.42;
/** Where the lens sits on the track. Crossing this resolves the verdict. */
const LENS_Y = 0;

interface Palette {
  ink: string;
  inkSoft: string;
  surface: string;
  rule: string;
}

const palettes: Record<Theme, Palette> = {
  light: { ink: "#191713", inkSoft: "#5C564C", surface: "#FFFFFF", rule: "#DFDBD2" },
  dark: { ink: "#F0EDE6", inkSoft: "#A9A192", surface: "#242019", rule: "#332D25" },
};

/** Draws one file row -- path on the left, reason on the right -- to a texture. */
function useRowTextures(theme: Theme) {
  return useMemo(() => {
    const palette = palettes[theme];
    const scale = 2; // texel density; card is 3.6 x 0.42 world units
    const width = 1024;
    const height = Math.round((width / CARD_W) * CARD_H);

    return streamRows.map((row) => {
      const canvas = document.createElement("canvas");
      canvas.width = width * scale;
      canvas.height = height * scale;
      const ctx = canvas.getContext("2d")!;
      ctx.scale(scale, scale);

      // Card body
      ctx.fillStyle = palette.surface;
      ctx.fillRect(0, 0, width, height);
      ctx.strokeStyle = palette.rule;
      ctx.lineWidth = 2;
      ctx.strokeRect(1, 1, width - 2, height - 2);

      const fontSize = Math.round(height * 0.42);
      const pad = 28;
      const gap = 36;
      ctx.textBaseline = "middle";

      ctx.font = `${fontSize}px "IBM Plex Mono", monospace`;
      ctx.fillStyle = palette.ink;
      ctx.fillText(row.path, pad, height / 2);
      const pathRight = pad + ctx.measureText(row.path).width;

      // The reason is secondary detail, not the point of the card -- if a long
      // path leaves no room for it, drop it rather than let the two collide.
      ctx.font = `${Math.round(fontSize * 0.86)}px "IBM Plex Mono", monospace`;
      const reasonWidth = ctx.measureText(row.reason).width;
      const reasonX = width - reasonWidth - pad;
      if (reasonX > pathRight + gap) {
        ctx.fillStyle = palette.inkSoft;
        ctx.fillText(row.reason, reasonX, height / 2);
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = 4;
      return texture;
    });
  }, [theme]);
}

function FileCard({
  texture,
  verdict,
  offset,
  theme,
  total,
}: {
  texture: THREE.Texture;
  verdict: keyof typeof verdictHex;
  offset: number;
  theme: Theme;
  total: number;
}) {
  const group = useRef<THREE.Group>(null);
  const tag = useRef<THREE.Mesh>(null);

  const tagColor = useMemo(
    () => new THREE.Color(verdictHex[verdict][theme]),
    [verdict, theme],
  );
  const idleColor = useMemo(
    () => new THREE.Color(palettes[theme].rule),
    [theme],
  );

  useFrame((state) => {
    if (!group.current) return;

    // Evenly spaced down the track, wrapping continuously.
    const travelled =
      state.clock.elapsedTime * SPEED + (offset / total) * TRACK_RANGE;
    const y = TRACK_TOP - (travelled % TRACK_RANGE);
    group.current.position.y = y;

    // A little depth: cards lean back as they move away from the lens. Kept
    // subtle -- too much push-back and perspective foreshortening compresses
    // neighbouring rows into each other on screen.
    const distance = Math.abs(y - LENS_Y);
    group.current.position.z = -distance * 0.05;
    group.current.rotation.x = THREE.MathUtils.clamp(
      (y - LENS_Y) * 0.012,
      -0.08,
      0.08,
    );

    // Fade in at the top of the track and out at the bottom.
    const fadeIn = 1 - THREE.MathUtils.smoothstep(y, TRACK_TOP - 1.6, TRACK_TOP);
    const fadeOut = THREE.MathUtils.smoothstep(
      y,
      TRACK_TOP - TRACK_RANGE,
      TRACK_TOP - TRACK_RANGE + 1.6,
    );
    const opacity = fadeIn * fadeOut;

    group.current.children.forEach((child) => {
      const mesh = child as THREE.Mesh;
      const material = mesh.material as THREE.MeshBasicMaterial;
      if (material) material.opacity = opacity;
    });

    // The verdict resolves as the card crosses the lens.
    if (tag.current) {
      const crossed = 1 - THREE.MathUtils.smoothstep(y, LENS_Y - 0.1, LENS_Y + 1.1);
      const material = tag.current.material as THREE.MeshBasicMaterial;
      material.color.copy(idleColor).lerp(tagColor, crossed);
      material.opacity = opacity;
    }
  });

  return (
    <group ref={group}>
      <mesh>
        <planeGeometry args={[CARD_W, CARD_H]} />
        <meshBasicMaterial map={texture} transparent toneMapped={false} />
      </mesh>
      {/* The verdict tag: a bar on the leading edge that takes its colour as the
          card crosses the lens. */}
      <mesh ref={tag} position={[-CARD_W / 2 - 0.06, 0, 0.001]}>
        <planeGeometry args={[0.07, CARD_H]} />
        <meshBasicMaterial transparent toneMapped={false} />
      </mesh>
    </group>
  );
}

/** The lens the stream passes through. Static -- it watches, it does not move. */
function Lens({ theme }: { theme: Theme }) {
  const color = palettes[theme].inkSoft;
  return (
    <group position={[0, 0, 0]}>
      <mesh>
        <ringGeometry args={[2.35, 2.4, 96]} />
        <meshBasicMaterial color={color} transparent opacity={0.55} toneMapped={false} />
      </mesh>
      <mesh>
        <ringGeometry args={[2.62, 2.64, 96]} />
        <meshBasicMaterial color={color} transparent opacity={0.25} toneMapped={false} />
      </mesh>
      {/* Aperture blades, echoing the mark in the nav. */}
      {[0, 90, 180, 270].map((deg) => (
        <mesh
          key={deg}
          rotation={[0, 0, (deg * Math.PI) / 180]}
          position={[0, 0, 0]}
        >
          <planeGeometry args={[0.02, 0.42]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.5}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function Scene({ theme }: { theme: Theme }) {
  const textures = useRowTextures(theme);

  useEffect(() => {
    return () => textures.forEach((t) => t.dispose());
  }, [textures]);

  return (
    <>
      <Lens theme={theme} />
      {streamRows.map((row, index) => (
        <FileCard
          key={row.path}
          texture={textures[index]}
          verdict={row.verdict}
          offset={index}
          total={streamRows.length}
          theme={theme}
        />
      ))}
    </>
  );
}

export default function LensHero({ theme }: { theme: Theme }) {
  const wrapper = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  // Stop rendering entirely when the hero is scrolled out of view.
  useEffect(() => {
    const node = wrapper.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "120px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={wrapper} className="h-full w-full" aria-hidden="true">
      <Canvas
        frameloop={visible ? "always" : "never"}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0.35, 7.2], fov: 38 }}
      >
        <Scene theme={theme} />
      </Canvas>
    </div>
  );
}
