const fs = require('fs');
const path = require('path');

const glbPath = path.join(__dirname, 'xilingping999.glb');
const buffer = fs.readFileSync(glbPath);

// GLB has a 12-byte header
// magic: 4 bytes
// version: 4 bytes
// length: 4 bytes
// Then chunks. Chunk 0 is always JSON.
const jsonChunkLength = buffer.readUInt32LE(12);
const jsonChunkType = buffer.readUInt32LE(16);

if (jsonChunkType === 0x4E4F534A) { // 'JSON'
    const jsonString = buffer.toString('utf8', 20, 20 + jsonChunkLength);
    const gltf = JSON.parse(jsonString);
    console.log("Meshes:");
    gltf.meshes.forEach((m, i) => console.log(`[${i}] ${m.name}`));
    console.log("\nNodes:");
    gltf.nodes.forEach((n, i) => console.log(`[${i}] ${n.name} - mesh: ${n.mesh}`));
}
