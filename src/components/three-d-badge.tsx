import * as THREE from 'three'
import { useEffect, useRef, useState } from 'react'
import { Canvas, extend, useThree, useFrame } from '@react-three/fiber'
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei'
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint } from '@react-three/rapier'
import { MeshLineGeometry, MeshLineMaterial } from 'meshline'
import { useControls } from 'leva'
import type { RapierRigidBody } from '@react-three/rapier'

// Extend Three.js with mesh line components
declare module '@react-three/fiber' {
  interface ThreeElements {
    meshLineGeometry: {
      attach: string
      args?: unknown[]
    }
    meshLineMaterial: {
      attach: string
      transparent?: boolean
      opacity?: number
      color?: string
      depthTest?: boolean
      resolution?: [number, number]
      lineWidth?: number
      useMap?: boolean
      map?: THREE.Texture
      repeat?: [number, number]
    }
  }
}

extend({ MeshLineGeometry, MeshLineMaterial })

// Preload assets
useGLTF.preload('/glb/3d-test-final.glb')
useTexture.preload('https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/SOT1hmCesOHxEYxL7vkoZ/c57b29c85912047c414311723320c16b/band.jpg')

interface RigidBodyWithLerped extends RapierRigidBody {
  lerped?: THREE.Vector3;
}

interface GLTFResult {
  nodes: {
    card: THREE.Mesh;
    clip: THREE.Mesh;
    clamp: THREE.Mesh;
  };
  materials: {
    base: THREE.MeshPhysicalMaterial;
    metal: THREE.MeshStandardMaterial;
  };
}

const ThreeDBadge: React.FC = () => {
  const { debug } = useControls({ debug: false })
  return (
    <Canvas camera={{ position: [0, 0, 13], fov: 25 }}>
      <ambientLight intensity={Math.PI} />
      <Physics debug={debug} interpolate gravity={[0, -40, 0]} timeStep={1 / 60}>
        <Band />
      </Physics>
      <Environment background blur={0.55}>
        <color attach="background" args={['black']} />
        <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
      </Environment>
    </Canvas>
  )
}

function Band({ maxSpeed = 50, minSpeed = 10 }) {
  const band = useRef<THREE.Mesh>(null)
  const fixed = useRef<RigidBodyWithLerped>(null)
  const j1 = useRef<RigidBodyWithLerped>(null)
  const j2 = useRef<RigidBodyWithLerped>(null)
  const j3 = useRef<RigidBodyWithLerped>(null)
  const card = useRef<RigidBodyWithLerped>(null)
  const vec = new THREE.Vector3()
  const ang = new THREE.Vector3()
  const rot = new THREE.Vector3()
  const dir = new THREE.Vector3()
  const segmentProps = { 
    type: 'dynamic' as const, 
    canSleep: true, 
    colliders: false as const, 
    angularDamping: 2, 
    linearDamping: 2 
  }
  const { nodes, materials } = useGLTF('/tarjeta_2.glb') as unknown as GLTFResult
  const texture = useTexture('/band-tech.jpg')
  const { width, height } = useThree((state) => state.size)
  const [curve] = useState(() => new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()]))
  const [dragged, drag] = useState<THREE.Vector3 | false>(false)
  const [hovered, hover] = useState(false)

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]) // prettier-ignore
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]) // prettier-ignore
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]) // prettier-ignore
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.45, 0]]) // prettier-ignore

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab'
      return () => void (document.body.style.cursor = 'auto')
    }
  }, [hovered, dragged])

  useFrame((state, delta) => {
    if (dragged && card.current) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera)
      dir.copy(vec).sub(state.camera.position).normalize()
      vec.add(dir.multiplyScalar(state.camera.position.length()))
      ;[card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp())
      card.current.setNextKinematicTranslation({ x: vec.x - dragged.x, y: vec.y - dragged.y, z: vec.z - dragged.z })
    }
    if (fixed.current && j1.current && j2.current && j3.current && card.current) {
      // Fix most of the jitter when over pulling the card
      ;[j1, j2].forEach((ref) => {
        if (ref.current) {
          if (!ref.current.lerped) {
            const translation = ref.current.translation()
            ref.current.lerped = new THREE.Vector3(translation.x, translation.y, translation.z)
          }
          const translation = ref.current.translation()
          const targetPos = new THREE.Vector3(translation.x, translation.y, translation.z)
          const clampedDistance = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(targetPos)))
          ref.current.lerped.lerp(targetPos, delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)))
        }
      })
      // Calculate catmul curve
      if (j3.current && j2.current && j1.current && fixed.current) {
        const j3Pos = j3.current.translation()
        const j2Pos = j2.current.lerped || new THREE.Vector3()
        const j1Pos = j1.current.lerped || new THREE.Vector3()
        const fixedPos = fixed.current.translation()
        
        curve.points[0].set(j3Pos.x, j3Pos.y, j3Pos.z)
        curve.points[1].copy(j2Pos)
        curve.points[2].copy(j1Pos)
        curve.points[3].set(fixedPos.x, fixedPos.y, fixedPos.z)
        
        if (band.current) {
          const geometry = band.current.geometry as MeshLineGeometry
          geometry.setPoints(curve.getPoints(32))
        }
      }
      // Tilt it back towards the screen
      if (card.current) {
        const angVel = card.current.angvel()
        const rotation = card.current.rotation()
        ang.set(angVel.x, angVel.y, angVel.z)
        rot.set(rotation.x, rotation.y, rotation.z)
        card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z }, true)
      }
    }
  })

  curve.curveType = 'chordal'
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[2, 0, 0]} ref={card} {...segmentProps} type={dragged ? 'kinematicPosition' : 'dynamic'}>
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e) => {
              const target = e.target as HTMLElement
              target.releasePointerCapture(e.pointerId)
              drag(false)
            }}
            onPointerDown={(e) => {
              if (card.current) {
                const target = e.target as HTMLElement
                target.setPointerCapture(e.pointerId)
                const translation = card.current.translation()
                drag(new THREE.Vector3().copy(e.point).sub(new THREE.Vector3(translation.x, translation.y, translation.z)))
              }
            }}>
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial map={materials.base.map} map-anisotropy={16} clearcoat={1} clearcoatRoughness={0.15} roughness={0.3} metalness={0.5} />
            </mesh>
            <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry attach="geometry" />
        <meshLineMaterial 
          attach="material"
          color="white" 
          depthTest={false} 
          resolution={[width, height]} 
          useMap 
          map={texture} 
          repeat={[-3, 1]} 
          lineWidth={1} 
        />
      </mesh>
    </>
  )
}

export default ThreeDBadge 