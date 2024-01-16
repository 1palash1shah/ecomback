//first program
// const arr = [2, 7, 11, 15];
// const target = 22;
// let result = 0;

// for (let i = 0; i < arr.length; i++) {
//   for (let j = 1; j < arr.length; j++) {
//     if (arr[i] + arr[j] === target) {
//         if(i!==j){
//             console.log("arr[", i,',', j, "]");
//         }
//     }
//   }
// }

//second program
// const arr = [3, 2, 2, 3, 3, 3];
// let val = 3;
// const output = [];

// for (let i = arr.length - 1; i >= 0; i--) {
//     if (arr[i] === val) {
//       arr.splice(i, 1);
//       arr.push("_");
//     }
//     else{
//         output.push(arr[i]);
//     }
//   }
// console.log(arr);
// console.log('Not Match Value of Array->',output);


// Thrid Program
const arr = [1,3,5,6];
let target = 8;
var output=null;
for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {         
        output =  i;
        break;
    }
    else{
        output = 'not Found';
    }
};
console.log(output)