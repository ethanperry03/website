function generateFaceSTL(v1, v2, v3) {
    const normal = calculateNormal(v1, v2, v3);

    let faceString = '  facet normal ${normal[0]} ${normal[1]} ${normal[2]}\n';
    faceString += '    outer loop\n';
    faceString += `      vertex ${v1[0]} ${v1[1]} ${v1[2]}\n`;
    faceString += `      vertex ${v2[0]} ${v2[1]} ${v2[2]}\n`;
    faceString += `      vertex ${v3[0]} ${v3[1]} ${v3[2]}\n`;
    faceString += '    endloop\n';
    faceString += '  endfacet\n';

    return faceString;
}

// Function to generate STL output from vertices and faces
function generateSTL(vertices, faces, width, height) {
    var minVal = min / cellsize;

    let stlString = 'solid heightmap\n';

    faces.forEach(face => {
        const v1 = vertices[face[0]];
        const v2 = vertices[face[1]];
        const v3 = vertices[face[2]];

        stlString += generateFaceSTL(v1, v2, v3);
    });

    var bottomVal = minVal - (0.05*(max-min));

    // const height = array.length;
    // const widht = array[0].length;

    // front and back
    for (let i = 0; i < width-1; i++) {

        // top row
        const t0 = [i, 0, vertices[i][2]];
        const t1 = [i+1, 0, vertices[i+1][2]];
        const t2 = [i, 0, minVal];
        const t3 = [i+1, 0, minVal];

        stlString += generateFaceSTL(t0, t1, t2);  
        stlString += generateFaceSTL(t1, t3, t2);

        // bottom row
        const b0 = [i, height-1, vertices[i + (width)*(height-1)][2]];
        const b1 = [i+1, height-1, vertices[i + 1 + (width)*(height-1)][2]];
        const b2 = [i, height-1, minVal];
        const b3 = [i+1, height-1, minVal];

        stlString += generateFaceSTL(b0, b2, b3);  
        stlString += generateFaceSTL(b0, b1, b3);
    }


    // front and back
    for (let j = 0; j < height-1; j++) {

        // left side
        const l0 = [0, j, vertices[j*width][2]];
        const l1 = [0, j+1, vertices[(j+1)*width][2]];
        const l2 = [0, j, minVal];
        const l3 = [0, j+1, minVal];

        stlString += generateFaceSTL(l0, l1, l2);  
        stlString += generateFaceSTL(l1, l3, l2);

        // right side
        const r0 = [width-1, j, vertices[(j*width)+width-1][2]];
        const r1 = [width-1, j+1, vertices[((j+1)*width)+width-1][2]];
        const r2 = [width-1, j, minVal];
        const r3 = [width-1, j+1, minVal];

        stlString += generateFaceSTL(r0, r2, r3);  
        stlString += generateFaceSTL(r0, r1, r3);
    }

    width -= 1;
    height -= 1;

    // generate top side curtain
    stlString += generateFaceSTL([0, 0, bottomVal], [width, 0, bottomVal], [width, 0, minVal]);
    stlString += generateFaceSTL([0, 0, bottomVal], [0, 0, minVal], [width, 0, minVal]);     

    // generate bottom side
    stlString += generateFaceSTL([0, height, bottomVal], [width, height, bottomVal], [width, height, minVal]);
    stlString += generateFaceSTL([0, height, bottomVal], [0, height, minVal], [width, height, minVal]);    

    // generate left side
    stlString += generateFaceSTL([0, 0, bottomVal], [0, height, bottomVal], [0, height, minVal]);
    stlString += generateFaceSTL([0, 0, bottomVal], [0, 0, minVal], [0, height, minVal]);    

    // generate right side
    stlString += generateFaceSTL([width, 0, bottomVal], [width, height, bottomVal], [width, height, minVal]);
    stlString += generateFaceSTL([width, 0, bottomVal], [width, 0, minVal], [width, height, minVal]);    

    // create base of surface with two triangles
    stlString += generateFaceSTL([0, 0, bottomVal], [width, 0, bottomVal], [width, height, bottomVal]);
    stlString += generateFaceSTL([0, 0, bottomVal], [0, height, bottomVal], [width, height, bottomVal]);

    width += 1;
    height += 1;

    stlString += 'endsolid heightmap\n';
    return stlString;
}

// Function to calculate the normal vector for a face
function calculateNormal(v1, v2, v3) {
    const U = [
        v2[0] - v1[0],
        v2[1] - v1[1],
        v2[2] - v1[2]
    ];
    const V = [
        v3[0] - v1[0],
        v3[1] - v1[1],
        v3[2] - v1[2]
    ];

    const normal = [
        U[1] * V[2] - U[2] * V[1],
        U[2] * V[0] - U[0] * V[2],
        U[0] * V[1] - U[1] * V[0]
    ];

    const length = Math.sqrt(normal[0]**2 + normal[1]**2 + normal[2]**2);
    return normal.map(component => component / length);
}

// Function to create a mesh (vertices and faces) from the heightmap data
function createMesh(array) {
    const vertices = [];
    const faces = [];

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            vertices.push([j, i, (array[i][j])*(1.0/cellsize)]);
            if (i < rows - 1 && j < cols - 1) {

                const v0 = i * cols + j;
                const v1 = v0 + 1;
                const v2 = v0 + cols;
                const v3 = v2 + 1;

                faces.push([v0, v1, v2]);
                faces.push([v1, v3, v2]);
            }
        }
    }

    return { vertices, faces };
}
