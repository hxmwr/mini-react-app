import { MeshLambertMaterial } from "three";
import { BoxFacade } from "troika-3d";
import { createDerivedMaterial } from "troika-three-utils";


class BarFacade extends BoxFacade {
    get material() {
        const baseMaterial = new MeshLambertMaterial({
            transparent: true,
            opacity: this.opacity,
            color: this.color
        })
        return createDerivedMaterial(baseMaterial, {
            vertexDefs: `
                varying vec3 vPos;`,
            vertexMainIntro: `vPos = position;`,
            fragmentDefs: `varying vec3 vPos;`,
            fragmentColorTransform: `
                gl_FragColor = new vec4(gl_FragColor.rgb, gl_FragColor.a * (vPos.y + 0.5));`
        })
    }
}

export default BarFacade