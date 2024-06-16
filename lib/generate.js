'use strict';

function generate(val) {
    return {
        size: (row, col) => size(val, row, col),
        diag: (row, col) => diag(val, row, col)
    }
}

function size(val, row, col) {
    if (!col) {
        col = row;
    }
    let rows = [];
    for (let i = 0; i < row; i++) {
        let cols = [];
        for (let j = 0; j < col; j++) {
            cols[j] = val; 
        }
        rows[i] = cols;
    }
    return rows;
}

function diag(val, row, col) {
    if (!col) {
        col = row;
    }
    let rows = [];
    for (let i = 0; i < row; i++) {
        let cols = [];
        for (let j = 0; j < col; j++) {
            cols[j] = 0; 
        }
        rows[i] = cols;
        if (i < col || row == col) {
            rows[i][i] = val;
        }
    }
    return rows;
}

module.exports = generate;
