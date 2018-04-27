'use strict';

const rational = require('./rational');
const merge = require('./merge');

/**
 * Pass a 2-dimensional array that will return a function accepting indices to access the matrix
 *
 * @param mat array that initializes the matrix
 * @returns function with the array initialized and access to method that perform operations on the matrix
 */
function matrix(mat) {
    if (!Array.isArray(mat)) {
        throw new Error('Input should be of type array');
    }
    let _matrix = function() {
        let args = (arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments));
        return read(mat, args);
    }
    return Object.assign(_matrix, _mat(mat));
}


/**
 * Private function that returns an object containing methods
 * that perform operations on the matrix
 *
 * @param mat array that initializes the matrix
 * @returns object of methods performing matrix operations
 */
function _mat(mat) {
    return {
        size: () => size(mat),
        add: (operand) => operate(mat, operand, addition),
        sub: (operand) => operate(mat, operand, subtraction),
        mul: (operand) => operate(mat, operand, multiplication),
        div: (operand) => operate(mat, operand, division),
        prod: (operand) => prod(mat, operand),
        trans: () => trans(mat),
        set: function() {
            let args = (arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments));
            return {
                to: (val) => replace(mat, val, args)
            }
        },
        det: () => determinant(mat),
        inv: () => invert(mat),
        merge: merge(mat),
        map: (func) => map(mat, func)
    };
}

module.exports = matrix;


/**
 * Calculates the size of the array across each dimension
 *
 * @param mat input matrix that initialized the function
 * @returns size of the matrix as an array
 */
function size(mat) {
    let s = [];
    while (Array.isArray(mat)) {
        s.push(mat.length);
        mat = mat[0];
    }
    return s;
}


/**
 * Private function to calculate the dimensions of the matrix
 *
 * @param mat input matrix that initializes the function
 * @returns integer indicating the number of dimensions
 */
function dimensions(mat) {
    return size(mat).length;
}


/**
 * Outputs the original matrix or a particular element or a matrix that is part of the original
 *
 * @param mat input matrix that initializes the function
 * @param args indices to access one or more array elements
 * @returns array or single element
 */
function read(mat, args) {
    if (args.length === 0) {
        return mat;
    } else {
        return extract(mat, args);
    }
}


/**
 * Private function to extract a single element or a matrix that is part of the original
 *
 * @param mat input matrix that initializes the function
 * @param args indices to access one or more array elements
 * @returns array or single element
 */
function extract(mat, args) {
    let dim = dimensions(mat);
    for (let i = 0; i < dim; i++) {
        let d = args[i];
        if (d === undefined) {
            break;
        }
        if (Array.isArray(d)) {
            // if an element of args is an array, more extraction is needed
            mat = extractRange(mat, d, i);
        } else if (Number.isInteger(d)) {
            if (dimensions(mat) > 1 && i > 0) {
                mat = mat.map(function(elem) {
                    return [elem[d]];
                });
            } else {
                mat = mat[d];
            }
        }
    }
    return mat;
}


/**
 * Private function to extract a portion of the array based on the specified range
 *
 * @param mat input matrix that initialized the function
 * @param arg single argument containing the range specified as an array
 * @param ind the current index of the arguments while extracting the matrix
 * @returns array from the specified range
 */
function extractRange(mat, arg, ind) {
    if (!arg.length) {
        return mat;
    } else if (arg.length === 2) {
        let reverse = arg[0] > arg[1];
        let first = (!reverse) ? arg[0] : arg[1];
        let last = (!reverse) ? arg[1]: arg[0];
        if (dimensions(mat) > 1 && ind > 0) {
            return mat.map(function(elem) {
                if (reverse) {
                    return elem.slice(first, last+1).reverse();
                }
                return elem.slice(first, last+1);
            })
        } else {
            mat = mat.slice(first, last+1);
            return (reverse && mat.reverse()) || mat;
        }
    }
}


/**
 * Replaces the specified index in the matrix with the specified value
 *
 * @param mat input matrix that initialized the function
 * @param value specified value that replace current value at index or indices
 * @param args index or indices passed in arguments to initialized function
 * @returns replaced matrix
 */
function replace(mat, value, args) { //TODO: Clean this function up
    let result = clone(mat);
    let prev = args[0];
    let start = prev[0] || 0;
    let end = prev[1] && prev[1] + 1 || mat.length;
    if (!Array.isArray(prev) && args.length === 1) {
        result[prev].fill(value);
    } else if (args.length === 1) {
        for (let ind = start; ind < end; ind++) {
            result[ind].fill(value);
        }
    }
    for (let i = 1; i < args.length; i++) {
        let first = Array.isArray(args[i]) ? args[i][0] || 0 : args[i];
        let last = Array.isArray(args[i]) ? args[i][1] && args[i][1] + 1 || mat[0].length : args[i] + 1;
        if (!Array.isArray(prev)) {
            result[prev].fill(value, first, last);
        } else {
            for (let ind = start; ind < end; ind++) {
                result[ind].fill(value, first, last);
            }
        }
    }
    return result;
}


/**
 * Operates on two matrices of the same size
 *
 * @param mat input matrix that initialized the function
 * @param operand second matrix with which operation is performed
 * @param operation function performing the desired operation
 * @returns result of the operation
 */
function operate(mat, operand, operation) {
    let result = [];
    let op = operand();

    for (let i = 0; i < mat.length; i++) {
        let op1 = mat[i];
        let op2 = op[i];
        result.push(op1.map(function(elem, ind) {
            return operation(elem, op2[ind]);
        }));
    }

    return result;
}


/**
 * Finds the product of two matrices
 *
 * @param mat input matrix that initialized the function
 * @param operand second matrix with which operation is performed
 * @returns the product of the two matrices
 */
function prod(mat, operand) {
    let op1 = mat;
    let op2 = operand();
    let size1 = size(op1);
    let size2 = size(op2);
    let result = [];
    if (size1[1] === size2[0]) {
        for (let i = 0; i < size1[0]; i++) {
            result[i] = [];
            for (let j = 0; j < size2[1]; j++) {
                for (let k = 0; k < size1[1]; k++) {
                    if (result[i][j] === undefined) {
                        result[i][j] = 0;
                    }
                    result[i][j] += multiplication(op1[i][k], op2[k][j]);
                }
            }
        }
    }
    return result;
}


/**
 * Returns the transpose of a matrix, swaps rows with columns
 *
 * @param mat input matrix that initialized the function
 * @returns a matrix with rows and columns swapped from the original matrix
 */
function trans(mat) {
    let input = mat;
    let s = size(mat);
    let output = [];
    for (let i = 0; i < s[0]; i++) {
        for (let j = 0; j < s[1]; j++) {
            if (Array.isArray(output[j])) {
                output[j].push(input[i][j]);
            } else {
                output[j] = [input[i][j]];
            }
        }
    }
    return output;
}

/**
 * Private method to clone the matrix
 *
 * @param mat input matrix that initialized the function
 * @returns cloned matrix
 */
function clone(mat) {
    let result = [];
    for (let i = 0; i < mat.length; i++) {
        result.push(mat[i].slice(0));
    }
    return result;
}

/**
 * Performs addition
 *
 * @param op1 first operand
 * @param op2 second operand
 * @returns result
 */
function addition(op1, op2) {
    return op1 + op2;
}

/**
 * Performs subtraction
 *
 * @param op1 first operand
 * @param op2 second operand
 * @returns result
 */
function subtraction(op1, op2) {
    return op1 - op2;
}

/**
 * Performs multiplication
 *
 * @param op1 first operand
 * @param op2 second operand
 * @returns result
 */
function multiplication(op1, op2) {
    return op1 * op2;
}

/**
 * Performs division
 *
 * @param op1 first operand
 * @param op2 second operand
 * @returns result
 */
function division(op1, op2) {
    return op1/op2;
}


/**
 * Computes the determinant using row reduced echelon form
 * Works best if the elements are integers or rational numbers
 * The matrix must be a square
 *
 * @param mat input matrix that initialized the function
 * @returns determinant value as a number
 */
function determinant(mat) {
    let rationalized = rationalize(mat);
    let siz = size(mat);
    let det = rational(1);
    let sign = 1;

    for (let i = 0; i < siz[0] - 1; i++) {
        for (let j = i + 1; j < siz[0]; j++) {
            if (rationalized[j][i].num === 0) {
                continue;
            }
            if (rationalized[i][i].num === 0) {
                interchange(rationalized, i, j);
                sign = -sign;
                continue;
            }
            let temp = rationalized[j][i].div(rationalized[i][i]);
            temp = rational(Math.abs(temp.num), temp.den);
            if (Math.sign(rationalized[j][i].num) === Math.sign(rationalized[i][i].num)) {
                temp = rational(-temp.num, temp.den);
            }
            for (let k = 0; k < siz[1]; k++) {
                 rationalized[j][k] = temp.mul(rationalized[i][k]).add(rationalized[j][k]);
            }
        }
    }

    det = rationalized.reduce((prev, curr, index) => prev.mul(curr[index]), rational(1));

    return sign * det.num/det.den;
}

/**
 * Interchanges one row index with another on passed matrix
 *
 * @param mat input matrix
 * @param ind1 one of the row indices to exchange
 * @param ind2 one of the row indices to exchange
 */
function interchange(mat, ind1, ind2) {
    let temp = mat[ind1];
    mat[ind1] = mat[ind2];
    mat[ind2] = temp;
}

/**
 * Inverts the input square matrix using row reduction technique
 * Works best if the elements are integers or rational numbers
 * The matrix has to be a square and non-singular
 *
 * @param mat input matrix
 * @returns inverse of the input matrix
 */
function invert(mat) {
    let rationalized = rationalize(mat);
    let siz = size(mat);
    let result = rationalize(identity(siz[0]));

    // Row Reduction
    for (let i = 0; i < siz[0] - 1; i++) {
        if (rationalized[i][i].num === 0) {
            interchange(rationalized, i, i + 1);
            interchange(result, i, i + 1);
        }
        if (rationalized[i][i].num !== 1 || rationalized[i][i] !== 1) {
            let factor = rational(rationalized[i][i].num, rationalized[i][i].den);
            for (let col = 0; col < siz[1]; col++) {
                rationalized[i][col] = rationalized[i][col].div(factor);
                result[i][col] = result[i][col].div(factor);
            }
        }
        for (let j = i + 1; j < siz[0]; j++) {
            if (rationalized[j][i].num === 0) {
                // skip as no row elimination is needed
                continue;
            }

            let temp = rational(-rationalized[j][i].num, rationalized[j][i].den);
            for (let k = 0; k < siz[1]; k++) {
                rationalized[j][k] = temp.mul(rationalized[i][k]).add(rationalized[j][k]);
                result[j][k] = temp.mul(result[i][k]).add(result[j][k]);
            }
        }
    }

    // Further reduction to convert rationalized to identity
    let last = siz[0] - 1;
    if (rationalized[last][last].num !== 1 || rationalized[last][last] !== 1) {
        let factor = rational(rationalized[last][last].num, rationalized[last][last].den);
        for (let col = 0; col < siz[1]; col++) {
            rationalized[last][col] = rationalized[last][col].div(factor);
            result[last][col] = result[last][col].div(factor);
        }
    }

    for (let i = siz[0] - 1; i > 0; i--) {
        for (let j = i - 1; j >= 0; j--) {
            let temp = rational(-rationalized[j][i].num, rationalized[j][i].den);
            for (let k = 0; k < siz[1]; k++) {
                rationalized[j][k] = temp.mul(rationalized[i][k]).add(rationalized[j][k]);
                result[j][k] = temp.mul(result[i][k]).add(result[j][k]);
            }
        }
    }

    return derationalize(result);
}

/**
 * Applies a given function over the matrix, elementwise. Similar to Array.map()
 * The supplied function is provided 4 arguments:
 * the current element,
 * the row index,
 * the col index,
 * the matrix.
 *
 * @param mat input matrix
 * @returns matrix of same dimensions with values altered by the function.
 */
function map(mat, func) {
    const s = size(mat);
    const result = [];
    for (let i = 0; i < s[0]; i++) {
        if(Array.isArray(mat[i])) {
            result[i] = [];
            for (let j = 0; j < s[1]; j++) {
                result[i][j] = func(mat[i][j], i, j, mat);
            }
        } else {
            result[i] = func(mat[i], i, 0, mat);
        }
    }
    return result;
}

/**
 * Converts a matrix of numbers to all rational type objects
 *
 * @param mat input matrix
 * @returns matrix with elements of type rational
 */
function rationalize(mat) {
    let rationalized = [];
    mat.forEach((row, ind) => {
        rationalized.push(row.map((ele) => rational(ele)));
    });
    return rationalized;
}

/**
 * Converts a rationalized matrix to all numerical values
 *
 * @param mat input matrix
 * @returns matrix with numerical values
 */
function derationalize(mat) {
    let derationalized = [];
    mat.forEach((row, ind) => {
        derationalized.push(row.map((ele) => ele.num/ele.den));
    });
    return derationalized;
}

/**
 * Generates a square matrix of specified size all elements with same specified value
 *
 * @param size specified size
 * @param val specified value
 * @returns square matrix
 */
function generate(size, val) {
    let dim = 2;
    while (dim > 0) {
        var arr = [];
        for (var i = 0; i < size; i++) {
            if (Array.isArray(val)) {
                arr.push(Object.assign([], val));
            } else {
                arr.push(val);
            }
        }
        val = arr;
        dim -= 1;
    }
    return val;
}

/**
 * Generates an identity matrix of the specified size
 *
 * @param size specified size
 * @returns identity matrix
 */
function identity(size) {
    let result = generate(size, 0);
    result.forEach((row, index) => {
        row[index] = 1;
    });
    return result;
}
