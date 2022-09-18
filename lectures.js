//NEW:Simple Array Method:
//SLICE METHOD: it doesn't mutate the original array
let arr = ['a', 'b', 'c', 'd', 'e'];
console.log(arr.slice(2));
console.log(arr.slice(2, 4)); //2<= && 4>
console.log(arr);
console.log(arr.slice(-2)); //taking from the end to the start. output:['d', 'e'];
console.log(arr.slice(1, -2)); //o:['b', 'c']
console.log(arr.slice()); //it copies the original array.o:['a', 'b', 'c', 'd', 'e'].2nd solution below
console.log([...arr]);
//SPLICE METHOD:ıt mutates the original array
console.log(arr.splice(2)); //output:['c', 'd', 'e']
console.log(arr); //o: ['a', 'b'] the original array has been changed(mutated).
let arr2 = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'k'];
arr2.splice(1, 3); //1:represent extracting start index, 3 represent the num of element we are going to extract
console.log(arr2); //o:['a', 'e', 'f', 'g', 'k']
//REVERSE METHOD:
console.log(arr2.reverse());
console.log(arr2); //the original is now changed
//CONCAT METHOD:mergin two arrays
const letters = arr.concat(arr2);
console.log(letters);
console.log(arr); //shows concat method doesnt mutate the original array, which was changed on line 13
//option2:we can do the same thing by  using the spread operator. and thats also not gonna mutate the arrays
console.log([...arr, ...arr2]);
//JOIN METHOD:
console.log(letters.join('-')); //o: a string
const myClass = ['hatice', 'selen', 'hüsamettin', 'Yusuf'];
console.log(myClass.join('❤'));
//NEW: The New at Method:
const numbers = [1, 2, 5, 10];
console.log(numbers[0]); //same can be done by "at" method
console.log(numbers.at(0));
//getting the last element by traditional methods
console.log(numbers[numbers.length - 1]); //10
console.log(numbers.slice(-1)); //[10]
console.log(numbers.slice(-1)[0]); //10
//getting the last element by the new method
console.log(numbers.at(-1));
//at method works on strings as well
console.log('hasan'.at(0)); //O:"h"
//NEW:Looping over Arrays:

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
for (const [i, move] of movements.entries()) {
  if (move > 0) {
    console.log(`Movement ${i + 1}:You have deposited ${move}`);
  } else {
    console.log(`Movement ${i + 1}:You have withdrew ${Math.abs(move)}`); //we took the absolute value
  }
}
console.log('----FOREACH METHOD---');
//Doing the same by forEach method. pay attention to the syntax.here the first is move(the current element) then current index
movements.forEach(function (move, i, array) {
  if (move > 0) {
    console.log(`Movement ${i + 1}:You have deposited ${move}`);
  } else {
    console.log(`Movement ${i + 1}:You have withdrew ${Math.abs(move)}`);
  } //burda fonksiyonu ayrı tanımlayıp yukarıda forEach metodunun içerisine  de yazabilirdik.
}); //syntax:array.forEach(function(currentValue, index, arr), thisValue)

//ex:
let sum = 0;
const schoolNumbers = [10, 45, 68, 100, 120];
function myFunction(item) {
  sum += item;
}
schoolNumbers.forEach(myFunction);
console.log(sum);
//NEW:ForEach with map and sets
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);
currencies.forEach(function (value, key, map) {
  console.log(`${key}:${value}`);
});
//SETS:
const currenciesUniques = new Set(['USD', 'GBP', 'EURO', 'USD', 'EURO']);
currenciesUniques.forEach(function (value, key, set) {
  console.log(`${key}:${value}`); //if we look at the output ,value=key.sets don't have keys, this is coming because the structure of forEach function.beca.of(value,key,set) structure.key is unnecessary indeed here
});
