const express = require('express');
const app = express();
const debug = require('debug')('app:all'); // condotional log, choose to show these log or not from env
require('dotenv').config(); // to read vars from .env file
process.on('unhandledRejection', (ex) => { throw ex });
require('./startup/cors')(app);
require('./startup/config')(app, debug);
require('./startup/routes')(app, debug)
require('./startup/port')(app, debug);

// array1 = [1,2,3,4,5,6,7,8,9,10,12];
// // array2 = [2,3,4,5,10,11];
// array2 = [2,3,4,10,8];
// let result = excludeData(array1, array2);
// // console.log(result);
// function excludeData(array1,array2) {
//     for (let j = 0; j < array2.length; j++) {
//         if(array1.includes(array2[j])){
//             array1.splice(array1.indexOf(array2[j]), 1);
//         }
//     }
//     let replacement = `${array1[1]}-${array1[array1.length-2]}`;
//     array1.splice(array1.indexOf(array1[1]), array1.length-2, replacement);
//     return array1;
// }

// function compressWord(word, k) {
//     let noMore = false;
//     while (!noMore) {
//         let letters = word.match(/([a-zA-Z])\1*/g)||[];
//         for (let i = 0; i < letters.length; i++) {
//             if(letters[i].length >= k) {
//                 letters.splice(letters.indexOf(letters[i]), 1);
//             }
//         }
//         letters = letters.join('');
//         word = letters;
//         if(!includesLevelofRepetition(letters, k)) noMore = true;
//     }
//     return word;
// }
// function includesLevelofRepetition(word, level) {
//     let letters = word.match(/([a-zA-Z])\1*/g)||[];
//     let includesRepetitionLevel = false;
//     letters.forEach(letter => {
//         if(letter.length >= level) includesRepetitionLevel = true;
//     });
//     return includesRepetitionLevel;
// }
// // console.log(compressWord('kdabbcccbaaddk', 3));
// // console.log(compressWord('kdabbcccbaaddk', 2));

// function likes(names) {
//     switch (names.length) {
//         case 0:
//             return `no one likes this`;
//         case 1:
//             return `${names[0]} likes this`;
//         case 2:
//             return `${names.join(' and ')} likes this`;
//         case 3:
//             return `${names[0]}, ${names[1]} and ${names[2]} likes this`;
//         default:
//             return  `${names[0]}, ${names[1]} and ${names.length - 2} likes this`;
//     }
// }
// // console.log(likes(['ali', 'ahmed', 'zizo', 'moh', 'sai']));


// // function findXibbonaci(terms, fibbonaci = true, signature = [0, 1, 1]) {
// //     if(terms <= 0) return [];

// //     let febs = signature;
// //     for (let i = 0; i < terms; i++) {
// //         if(i > 2){
// //             if(fibbonaci){
// //                 febs.push(febs[i-1] + febs[i-2]);
// //             }else{
// //                 febs.push(febs[i-1] + febs[i-2] + febs[i-3]);
// //             }
// //         }
// //     }
// //     return febs;
// // }
// // console.log(findXibbonaci(6));
// // console.log(findXibbonaci(6, false));

// function findFibbonaci(signature, n) {
//     if(n <= 0) return [];

//     let febs = signature;
//     for (let i = 0; i < n; i++) {
//         if(i > 2){
//             febs.push(febs[i-1] + febs[i-2] + febs[i-3]);
//         }
//     }
//     return febs.splice(0, n);
// }
// // console.log(findFibbonaci([300,200,100],0));

// function friend(friends){
//     let friendsName = [];
//     friends.forEach(name => {
//         if(name.length === 4) friendsName.push(name);
//     });
//     return friendsName;
// }
// // console.log(friend(["Love", "Your", "Face", "1"]));

// function findEvenIndex(arr = []){
//     let leftSide = 0, rightSide = 0;
//     for (let i = 0; i < arr.length; i++) {
//         if(i == 0){
//             leftSide = 0;
//             rightSide = arr.slice(1).reduce((total, val) => { return (total + val) }, 0);
//             if(leftSide === rightSide) return i;
//         }else if(i == arr.length - 1){
//             rightSide = 0;
//             leftSide = arr.slice(0, arr.length - 1).reduce((total, val) => { return (total + val) }, 0);
//             if(leftSide === rightSide) return i;
//         }else{
//             leftSide = arr.slice(0, i).reduce((total, val) => { return (total + val) }, 0);
//             rightSide = arr.slice(i + 1, arr.length).reduce((total, val) => { return (total + val) }, 0);
//             if(leftSide === rightSide) return i;
//         }
//     }
//     return -1;
// }
// // console.log(findEvenIndex([20,10,30,10,10,15,35]));

// const binaryArrayToNumber = arr => {
//     return parseInt(arr.join(''), 2);
// };
// // console.log(binaryArrayToNumber([0,1,1,0]));

// function spinWords(text) {
//     let words = text.split(' ');
//     let wordsWithReverse = [];
//     words.forEach(word => {
//         if(word.length >= 5) wordsWithReverse.push(word.split('').reverse().join(''))
//         else wordsWithReverse.push(word);
//     });
//     return wordsWithReverse.join(' ');
// }

// console.log(spinWords("This is another test"));

module.exports = { app: app, debug: debug };