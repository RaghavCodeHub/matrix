'use strict';

const matrix = require('../lib');
const assert = require('assert');
let a, a1, a2, a3, a4, mat, mat1, mat2, mat3, mat4, m;

it('should exist', () => {
    assert.ok(matrix);
});

it('should throw not array', () => {
    assert.throws(matrix, 'Input should be of type array');
});

describe('Matrix operations', () => {
    before(() => {
        a = [[1, 2, 3], [4, 5, 6]];
        a1 = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
        a2 = [[1, 1, 1], [1, 1, 1], [1, 1, 1]];
        a3 = [[7, 8], [9, 10], [11, 12]];
        m = matrix([[2, 2, 2], [2, 2, 2], [2, 2, 2]]);
        mat = matrix(a);
        mat1 = matrix(a1);
        mat2 = matrix(a2);
        mat3 = matrix(a3);
    });
    it('should return size', () => {
        assert.deepEqual(mat.size(), [2, 3]);
    });

    it('should return back the matrix', () => {
        assert.deepEqual(mat(), a);
    });

    it('should return a single element', () => {
        assert.equal(mat(0, 0), 1);
    });

    it('should return a row', () => {
        assert.deepEqual(mat(0), [1, 2, 3]);
    });

    it('should return column', () => {
       assert.deepEqual(mat([],0), [[1],[4]]);
    });

    it('should return in specified range', () => {
       assert.deepEqual(mat([1,0],[2,1]), [[6, 5], [3, 2]]);
       assert.deepEqual(mat(0,[2,1]), [3, 2]);
       assert.deepEqual(mat([1,0],1), [[5], [2]]);
    });

    it('should replace the specified index', () => {
       assert.deepEqual(mat.set(1).to(8), [[1,2,3], [8,8,8]]);
       assert.deepEqual(mat.set(1,2).to(8), [[1,2,3], [4,5,8]]);
       assert.deepEqual(mat.set([],1).to(8), [[1,8,3], [4,8,6]]);
       assert.deepEqual(mat1.set([],[1,2]).to(8), [[1,8,8], [4,8,8], [7,8,8]]);
       assert.deepEqual(mat1.set([1,2],[1,2]).to(8), [[1,2,3], [4,8,8], [7,8,8]]);
    });

    it('should add two matrices', () => {
        assert.deepEqual(mat1.add(mat2), [[2, 3, 4], [5, 6, 7], [8, 9, 10]]);
    });

    it('should subtract two matrices', () => {
       assert.deepEqual(mat1.sub(mat2), [[0, 1, 2], [3, 4, 5], [6, 7, 8]]);
    });


    it('should find scalar product two matrices', () => {
       assert.deepEqual(mat1.mul(m), [[2, 4, 6], [8, 10, 12], [14, 16, 18]]);
    });

    it('should divide each element of two matrices', () => {
       assert.deepEqual(mat1.div(m), [[0.5, 1, 1.5], [2, 2.5, 3], [3.5, 4, 4.5]]);
    });

    it('should find the product of two matrices', () => {
       assert.deepEqual(mat1.prod(mat2), [[6, 6, 6], [15, 15, 15], [24, 24, 24]]);
       assert.deepEqual(mat.prod(mat3), [[58, 64], [139, 154]]);
       assert.deepEqual(mat3.prod(mat), [[39, 54, 69], [49, 68, 87], [59, 82, 105]]);
    });

    it('should return the transpose of a matrix', () => {
       assert.deepEqual(mat.trans(), [[1, 4], [2, 5], [3, 6]]);
       assert.deepEqual(mat1.trans(), [[1, 4, 7], [2, 5, 8], [3, 6, 9]]);
    });

    it('should return the determinant', () => {
        assert.equal(mat1.det(), 0);
        assert.equal(matrix([[8, 4, 3], [8, 1, 1], [6, 3, 4]]).det(), -42);
        assert.equal(matrix([[3, 4, 7], [0, 0, 6], [8, 3, 2]]).det(), 138);
        assert.equal(matrix([[5, 4, 7], [4, 8, 2], [9, 0, 4]]).det(), -336);
    });

    it('should invert the matrix', () => {
        assert.deepEqual(matrix([[5, 4, 7], [4, 8, 2], [9, 0, 4]]).inv(),
            [
                [-0.09523809523809523, 0.047619047619047616, 0.14285714285714285],
                [-0.005952380952380952, 0.12797619047619047, -0.05357142857142857],
                [0.21428571428571427, -0.10714285714285714, -0.07142857142857142]
            ]
        );
        assert.deepEqual(matrix([[1, 3, 3], [1, 4, 3], [1, 3, 4]]).inv(),
            [[7, -3, -3], [-1, 1, 0], [-1, 0, 1]]);
        assert.deepEqual(matrix([[3, 4, 7], [0, 0, 6], [8, 3, 2]]).inv(),
            [
                [-0.13043478260869565, 0.09420289855072464, 0.17391304347826086],
                [0.34782608695652173, -0.36231884057971014, -0.13043478260869565],
                [0, 0.16666666666666666, 0]
            ]);
    });

    it('should merge two matrices', () => {
        // top
        assert.deepEqual(mat.merge.top([11, 12, 13]), [[11, 12, 13], [1, 2, 3], [4, 5, 6]]);
        assert.deepEqual(matrix([2, 3, 4]).merge.top([1, 2, 3]), [[1, 2, 3], [2, 3, 4]]);
        assert.deepEqual(matrix([2, 3, 4]).merge.top([[1, 2, 3],[4, 5, 6]]), [[1, 2, 3], [4, 5, 6], [2, 3, 4]]);

        // bottom
        assert.deepEqual(mat1.merge.bottom([11, 12, 13]), [[1, 2, 3], [4, 5, 6], [7, 8, 9], [11, 12, 13]]);
        assert.deepEqual(matrix([2, 3, 4]).merge.bottom([1, 2, 3]), [[2, 3, 4], [1, 2, 3]]);
        assert.deepEqual(matrix([2, 3, 4]).merge.bottom([[1, 2, 3],[4, 5, 6]]), [[2, 3, 4], [1, 2, 3], [4, 5, 6]]);

        // left
        assert.deepEqual(matrix([[1], [3], [5]]).merge.left([[2], [4], [6]]), [[2, 1], [4, 3], [6, 5]]);
        assert.deepEqual(matrix([5, 6, 7]).merge.left([1, 2, 3, 4]), [1, 2, 3, 4, 5, 6, 7]);
        assert.deepEqual(matrix([[2, 4], [5, 5]]).merge.left([[1, 1], [1, 1]]), [[1, 1, 2, 4], [1, 1, 5, 5]]);

        // right
        assert.deepEqual(matrix([[1], [3], [5]]).merge.right([[2], [4], [6]]), [[1, 2], [3, 4], [5, 6]]);
        assert.deepEqual(matrix([1, 2, 3, 4]).merge.right([5, 6, 7]), [1, 2, 3, 4, 5, 6, 7]);
        assert.deepEqual(matrix([[2, 4], [5, 5]]).merge.right([[1, 1], [1, 1]]), [[2, 4, 1, 1], [5, 5, 1, 1]]);
    });

    it('map: should map a function over a matrix', () => {
        const square = (x) => x*x;
        assert.deepEqual(matrix([[1, 2, 3], [4, 5, 6], [7, 8, 9]]).map(square),
            [[1, 2*2, 3*3], [4*4, 5*5, 6*6], [7*7, 8*8, 9*9]]);
        assert.deepEqual(matrix([1, 2, 3]).map(square), [1, 2*2, 3*3]);
    });
});
