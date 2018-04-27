matrix
======

A Javascript Library to perform basic matrix operations using the functional nature of Javascript

## Usage
```javascript
var a = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
var A = matrix(a);
```

### Operations
#### 1. Identity
```javascript
A(); //returns [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
```
#### 2. Row
```javascript
A(0); // returns [1, 2, 3]
```
#### 3. Column
```javascript
A([], 0); // returns [[1], [4], [7]]
```
#### 4. Element
```javascript
A(1, 2); // returns 6
```
#### 5. Range
```javascript
A([1,2]); // returns [[4, 5, 6], [7, 8, 9]]
A([],[1,2]); // returns [[2, 3], [5, 6], [8, 9]]
A([1,2],[1,2]); // returns [[5, 6], [8, 9]]
A([2,1],[]); // returns [[7, 8, 9], [4, 5 ,6]]
A([],[2,1]); // returns [[3, 2], [6, 5], [9, 8]]
A([2,1],[2,1]); // returns [[9, 8], [6, 5]]
```
#### 6. Size
```javascript
A.size(); //returns [3, 3]
```
#### 7. Set
```javascript
A.set(0).to(0); // returns [[0, 0, 0], [4, 5, 6], [7, 8, 9]]
A.set(1,2).to(10); // returns [[1, 2, 3], [4, 5, 10], [7, 8, 9]]
A.set([], 0).to(0); // returns [[0, 2, 3], [0, 5, 6], [0, 8, 9]]
A.set([1,2]).to(4); // returns [[1, 2, 3], [4, 4, 4], [4, 4, 4]]
A.set([], [1,2]).to(1); // returns [[1, 1, 1], [4, 1, 1], [7, 1, 1]]
```
#### 8. Addition
```javascript
var B = matrix([[3, 4, 5], [6, 7, 8], [9, 10, 11]]);
A.add(B); // returns [[4, 6, 8], [10, 12, 14], [16, 18, 20]]
```
#### 9. Subtraction
```javascript
B.sub(A); // returns [[2, 2, 2], [2, 2, 2], [2, 2, 2]]
```
#### 10. Multiplication
```javascript
A.mul(B); // returns [[3, 8, 15], [24, 35, 48], [56, 80, 99]]
```
#### 11. Division
```javascript
A.div(B); // returns [[0.33, 0.5, 0.6], [0.66, 0.71, 0.75], [0.77, 0.8, 0.81]]
```
#### 12. Product
```javascript
A.prod(B); // returns [[42, 48, 54], [96, 111, 126], [150, 174, 198]]
```
#### 13. Transpose
```javascript
A.trans(); // returns [[1, 4, 7], [2, 5, 8], [3, 6, 9]]
```
#### 14. Determinant
```javascript
var C = matrix([[5, 4, 7], [4, 8, 2], [9, 0, 4]]);
C.det(); // returns -336
```
#### 15. Inverse
Should be invertible
```javascript
M = matrix([[1, 3, 3], [1, 4, 3], [1, 3 ,4]]);
M.inv(); // returns [[7, -3, -3], [-1, 1, 0], [-1, 0 ,1]]
```

#### 16. Merge
Merges two matrices in all directions

* Left
```javascript
M = matrix([[3, 4], [7, 8]]);
M.merge.left([[1, 2], [5, 6]]); // returns [[1, 2, 3, 4], [5, 6, 7, 8]]
```
* Right
```javascript
M = matrix([[1, 2], [5, 6]]);
M.merge.right([[3, 4], [7, 8]]); // returns [[1, 2, 3, 4], [5, 6, 7, 8]]
```
* Top
```javascript
M = matrix([5, 6, 7, 8]);
M.merge.top([1, 2, 3, 4]); // returns [[1, 2, 3, 4], [5, 6, 7, 8]]
```
* Bottom
```javascript
M = matrix([1, 2, 3 ,4]);
M.merge.bottom([5, 6, 7, 8]); // returns [[1, 2, 3, 4], [5, 6, 7, 8]]
```

#### 17. Map
Applies a given function over the matrix, elementwise. Similar to Array.map()
```javascript
M = matrix([1, 2, 3]);
M.map(x => x*x); // returns [1, 4, 9]
```
> This example shows the arguments provided to the function  
```javascript
M = matrix([[1, 2], [3, 4]]);
M.map(function(value, row, col, mat) {
    return value * col
}); // returns [[0, 2], [0, 4]]
```
