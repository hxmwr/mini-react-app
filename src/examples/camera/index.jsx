import React, { useEffect, useRef } from 'react'
import { BoxGeometry, Vector3 } from 'three'
import { Mesh } from 'three'
import { PointLight } from 'three'
import { CameraHelper } from 'three'
import { OrthographicCamera } from 'three'
import { AmbientLight } from 'three'
import { MeshLambertMaterial } from 'three'
import { PerspectiveCamera } from 'three'
import { WebGLRenderer } from 'three'
import { Scene } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const Camera = () => {
    const container = useRef(null)
    useEffect(() => {
        if (container.current) {
            const scene = new Scene()

            const renderer = new WebGLRenderer({
                antialias: true
            })

            renderer.setSize(600, 600)

            const light = new AmbientLight(0xf0f0f0, 0.8)
            scene.add(light)

            const pointLight = new PointLight(0xffffff, 0.6)
            pointLight.position.z = 50
            scene.add(pointLight)

            const camera = new OrthographicCamera(1, 100, 100, 1, 0.1, 2000)
            camera.position.z = 0
            camera.position.y = 50
            camera.position.x = 10
            camera.lookAt(new Vector3(0, 0, 0))

            // const control2 = new OrbitControls(camera, renderer.domElement)
            // scene.add(control)

            const geo = new BoxGeometry(50, 50, 50)
            geo.rotateX = Math.PI / 4
            const mat = new MeshLambertMaterial({
                wireframe: true,
                color: 0x0000f0
            })
            const mesh = new Mesh(geo, mat)
            mesh.rotateY = -Math.PI / 4
            scene.add(mesh)

            container.current.appendChild(renderer.domElement)

            function animate() {
                requestAnimationFrame(animate)
                // camera.updateProjectionMatrix()
                // cameraHelper.update()
                // control.update()

                renderer.render(scene, camera)
            }

            animate()
        }
    }, [])
    return <div ref={container} style={{ width: 600, heigth: 600 }}>
    </div>
}

export default Camera