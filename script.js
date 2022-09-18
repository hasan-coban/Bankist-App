'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Davut Unlu',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Selen Mızrak',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Emirhan Çağlar',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Ezgi Teacher',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = ''; //to remove the initial values
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements; //We used slice because we didn't want to mutate the original array.slice does not alter the original array. It returns a shallow copy of elements from the original array.
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
      <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    }${type}</div>
            <div class="movements__value">${mov}💶</div>
        </div>
       `;
    containerMovements.insertAdjacentHTML('afterbegin', html); //if it was "beforeend",then the order would reversed.you can try.bu ekleyeceğimiz işlemi en başa atacak.account1.movements kısmından daha iyi anlaşılabilir.
  });
};

//IMP:reduce metodu anlatıldıktan sonra yapıldı ve buraya alındı.hesabın toplam bakiyesini gösterir
const calcDisplayBalance = function (accounts) {
  accounts.balance = accounts.movements.reduce((acc, mov) => (acc += mov), 0);
  labelBalance.textContent = `${accounts.balance}💶`;
};

//IMP:Chaining method anlatıldıktan sonra yapıldı.
const calcDisplaySummary = function (accounts) {
  const incomes = accounts.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}💶`;
  //calculating withdrawals
  const out = accounts.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}💶`;
  //calculating interests
  const interests = accounts.movements
    .filter(deposit => deposit > 0)
    .map(deposit => (deposit * accounts.interestRate) / 100)
    .filter((interest, i, arr) => {
      console.log(arr);
      return interest >= 1; //that adds the interests bigger than 1
    })
    .reduce((acc, interest) => acc + interest, 0);
  labelSumInterest.textContent = `${interests}💶`;
};

//event handler:
let currentAccount;

const updateUI = function (accounts) {
  displayMovements(accounts.movements);
  //display balance
  calcDisplayBalance(accounts);
  //display summary
  calcDisplaySummary(accounts);
};

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    console.log('LOGIN'); //We used optinal chaining to make sure if the account is exist, otherwise if an unexist accound typed in, it is gonna cause an error.we used also number function to convert the string (typed in) into a number.
    //display UI and the message
    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    //clear the input fields
    inputLoginPin.value = inputLoginUsername.value = '';

    //update UI
    updateUI(currentAccount);
  }
});

//transfer part:
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  console.log(amount, receiverAcc);
  //if blogu, miktar sıfırdan büyük,hesap var olmalı,miktar bakiyeden küçük ve alıcı kendisine para gönderemez.
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    updateUI(currentAccount);
  }
  //clearing the input fields after (((the transfer is done
  inputTransferTo.value = inputTransferAmount.value = '';
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => amount <= mov * 10)) {
    //add the movement(the loan)
    currentAccount.movements.push(amount);
    //update the UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    //delete the account(temporarily)
    accounts.splice(index, 1);

    //hide the UI
    containerApp.style.opacity = 0;
  }
  inputClosePin = inputCloseUsername = '';
});

//sort button
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted; //it allows to change the sort from false to true, then again from true to false and so on
});

/*IMP*******LECTURES*********/
//challenge 1:
let JuliaData = [3, 5, 2, 12, 7];
let KateData = [4, 1, 15, 8, 3];
//1
const newJData = JuliaData.slice(1, -2);
console.log(newJData); //[5, 2]
//2
const jkData = newJData.concat(KateData);
console.log(jkData);
jkData.forEach(function (dog, i) {
  const checkDogs = dog >= 3 ? 'adult' : 'puppy🐶';
  console.log(`Dog number ${i + 1}: is a ${dog} years old ${checkDogs} `);
});
//NEW:The Map Method:that's a method of an array
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const euroToUsd = 1.1;
const movementsUsd = movements.map(function (mov) {
  return euroToUsd * mov;
});
console.log(movements);
console.log(movementsUsd);
//we can do the same thing by using for loop.however in modern js map is more functional
const movementsUsdFor = [];
for (const move of movements) movementsUsdFor.push(move * 1.1);
console.log(movementsUsdFor);
//changing callback f in map method into arrow function:
/*const movementsUsd = movements.map(mov => euroToUsd * mov);*/

const movementsDesription = movements.map(function (move, i, array) {
  return `Movement ${
    i + 1
  }:You ${move > 0 ? 'deposited' : 'withdrew'} ${Math.abs(move)}`;
}); //arrow f de kullanılabilirdi.ayrıca yukarda if bloğu ile yazılan kod burda template literal ve ternary operator ile kısaltıldı.
console.log(movementsDesription);
//NEW: Computing Usernames
const createUserName = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(function (name) {
        return name[0];
      })
      .join('');
  });
};
createUserName(accounts); //accounts coming from line 36
/*1-const userName = user.toLowerCase().split(' ')
2-taking the first letter of the words by map and looping
3-after getting this array ['s', 't', 'w'] we joined by join method.
4-a separate function created 
5-look at the previous version on other js file,
*/

console.log(accounts); //we can see that we have modified(reasonable to use forEach) the object. now each account has a username property.

//NEW:FILTER METHOD:
const deposits = movements.filter(function (mov) {
  return mov > 0;
});
console.log(deposits); //we can do the same by for loop
const depositsFor = [];
for (const mov of movements) {
  if (mov > 0) depositsFor.push(mov);
}
console.log(depositsFor);
const withdrawals = movements.filter(mov => mov < 0);

console.log(withdrawals);
//NEW:REDUCE METHOD:
const balance = movements.reduce(function (acc, cur, i, arr) {
  console.log(`iteration ${i}:${acc}`);
  return acc + cur;
}, 0); //0 is initial value of acc(accumulation)
console.log(balance);
//writing the same by arrow f:
const balance2 = movements.reduce((acc, cur, i, arr) => acc + cur, 0);
console.log(balance2);
//writing the same by for loop:
let balance3 = 0;
for (const mov of movements) balance3 += mov;
console.log(balance3);
//EX:Finding the max value
const max = movements.reduce(function (acc, mov) {
  if (acc > mov) return acc;
  else {
    return mov;
  }
}, movements[0]);
console.log(max);
//finding the min value;
const minValue = movements.reduce((acc, mov) => {
  if (acc < mov) return acc;
  else return mov;
}, movements[0]);
console.log(minValue);

//NEW:CHallenge 2:
//1
const data1 = [5, 2, 4, 1, 15, 8, 3];

const calcHumanAge = data1.map(function (age) {
  if (age <= 2) return age * 2;
  else return 16 + age * 4;
});
console.log(calcHumanAge);
//1-second  way:using arrow function and ternary operator
const humanAges = data1.map(age => (age <= 2 ? age * 2 : 16 + age * 4));
console.log(humanAges);

//2
const adults = humanAges.filter(age => age >= 18);
console.log(adults);

//3
let sum = 0;
for (const mov of adults) {
  sum += mov;
}
const averageHumanAge1 = sum / adults.length;
console.log(averageHumanAge1);
//3-second way:
const averageHumanAge2 =
  adults.reduce((acc, age) => acc + age, 0) / adults.length;
console.log(averageHumanAge2);
//NEW:The Magic of Chaining method:using different data transformations all in one go.
const totalDepositUsd = movements
  .filter(mov => mov > 0)
  .map(mov => mov * euroToUsd)
  .reduce((acc, mov) => acc + mov, 0);
console.log(totalDepositUsd);

//CHALLENGE 3:
const averageHumanAge3 = data1
  .map(age => (age <= 2 ? age * 2 : 16 + age * 4))
  .filter(age => age >= 18)
  .reduce((acc, age, i, arr) => acc + age / arr.length, 0);
//IMP:Burdaki arr, filter methodundan sonra oluşan array'e refer ediyor.böylece adults.length kullanmak zorunda kalmadık.
console.log(averageHumanAge3); //44
//NEW:FIND METHOD:ıt finds the first element that satistifies the condition
const firstWithdrawal = movements.find(mov => mov < 0);
console.log(firstWithdrawal);

const account = accounts.find(acc => acc.owner === 'Jessica Davis');
console.log(account);
//NEW:SOME METHOD:it returns a boolean based on the condition set
const anyDeposit = movements.some(mov => mov > 500);
console.log(anyDeposit);
//NEWEVERY METHOD: it retuns a boolean when all of the element satistifies the condition given
console.log(movements.every(mov => mov > 0)); //false
console.log(account4.movements.every(mov => mov > 0)); //true
//IMP:Separate callback:
const deposit = mov => mov > 0;
console.log(movements);
console.log(movements.some(deposit));
console.log(movements.every(deposit));
console.log(movements.filter(deposit));
//NEW:FLAT METHOD:ıt flattens an array one level
const arr = [[1, 2, 3], [4, 5, 6], 7];
console.log(arr.flat()); // [1, 2, 3, 4, 5, 6, 7]
const arrDeep = [[[1, 2], 3], [[4, 5], 6], 7];
console.log(arrDeep.flat()); //[[1, 2], 3, [4, 5], 6, 7]; to fully flatten, we can set the flatten level
console.log(arrDeep.flat(2)); // [1, 2, 3, 4, 5, 6, 7]
//ex:
//creating an array of movements of 4 accounts
const accountMovements = accounts.map(acc => acc.movements);
console.log(accountMovements);
//combining them
const allMovements = accountMovements.flat();
console.log(allMovements);
//add them up
const overalBalance = allMovements.reduce((acc, mov) => acc + mov, 0);
console.log(overalBalance);
//shorter way:chaining method
const overalBalance2 = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);
console.log(overalBalance2);
//IMP:FLATMAP METHOD: it combines map and flat method. now let's rewrite the ex above. BTW flatMap goes only one-level deep
const overalBalance3 = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);
console.log(overalBalance3);
3;

//NEW: SORTING ARRAYS:
//strings:
const owners = ['Jack', 'Zach', 'Adam', 'Martha'];
console.log(owners.sort()); //alfabetik olarak sıralar.ilk harfin küçük veya büyük olması sıralamayı etkiler.
console.log(movements);
//numbers:
console.log(movements.sort()); //from the output , it is not working.
movements.sort((a, b) => {
  if (a > b) return 1; //return 1 means switch order
  if (a < b) return -1; //keep the order
});
console.log(movements); //now it is in ascending (1,2,3)order
//IMP:Ascending Shorter way
movements.sort((a, b) => a - b); //if a>b, a-b is gonna sth positive,whereas if a<b it is gonna return sth negative. so it doesn't have to be always 1 or -1.just sth pos or negative is good
console.log(movements);
//sorting in descending :

movements.sort((a, b) => {
  if (a > b) return -1;
  if (a < b) return 1;
});
console.log(movements);
//shorter descending:IMP:If a===b then their position stays same
movements.sort((a, b) => b - a);
console.log(movements);
//NEW: More ways of creating and filling arrays
//FILL METHOD
const x = new Array(7);
console.log(x);
x.fill(1, 3); //1:the element put into the array, 3: the starting index.the ending index also can be given
console.log(x); //[empty × 3, 1, 1, 1, 1]
const numbers = [1, 2, 3, 4, 5, 6, 7];
numbers.fill(23, 4, 6);
console.log(numbers); //[1, 2, 3, 4, 23, 23, 7]
//NEW:Array.from: here array is function, we call it from method.
const y = Array.from({ length: 7 }, () => 1);
console.log(y); //[1, 1, 1, 1, 1, 1, 1]
const z = Array.from({ length: 7 }, (cur, i) => i + 1); //cur element is not used here, normally in programming that is used (_,i)
console.log(z); //[1, 2, 3, 4, 5, 6, 7]
//IMP:Programmatically forming an array of random number from 1 to 6
const a = Array.from({ length: 100 }, () => Math.trunc(Math.random() * 6) + 1);
console.log(a);

labelBalance.addEventListener('click', function () {
  const movementUI = Array.from(
    document.querySelectorAll('.movements__value'),
    el => Number(el.textContent.replace('💶', ''))
  );
  console.log(movementUI);
}); //labelbalance rastgele seçildi tıklanmak üzere. herhangi biryer seçilebilirdi.
///NEW:Array Methods Practice
//1
const bankDepositSum = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov > 0)
  .reduce((acc, move) => acc + move, 0);
console.log(bankDepositSum);
//2
const numDeposit1000 = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov >= 1000).length;
console.log(numDeposit1000); //O:6
//second way:
const secondDeposit1000 = accounts
  .flatMap(acc => acc.movements)
  .reduce((count, mov) => (mov >= 1000 ? count + 1 : count), 0);
console.log(secondDeposit1000);
//***IMP:In this ex if were to use count++ instead of count+1, the result would be 0.because count++ would return still the old value. check the below ex */
let k = 10;
console.log(k++); //10 here even if we increased the value,k still holds 10
console.log(k); //11 ,the easy solution would be adding the plus operator to the initial
let m = 25;
console.log(++m); //26
//ex 3:
const sums = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (sums, mov) => {
      mov > 0 ? (sums.deposits += mov) : (sums.withdrawals += mov);
      return sums; //return kullanmamızın nedeni arrow f dan sonra curly bracket kullanmamız.zorunlu.aksi takdirde hata verecekti.
    },
    { deposits: 0, withdrawals: 0 }
  );
console.log(sums);
//second way:
const { deposits1, withdrawals1 } = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (sums, mov) => {
      sums[mov > 0 ? 'deposits1' : 'withdrawals1'] += mov;
      return sums;
    },
    { deposits1: 0, withdrawals1: 0 }
  );
console.log(deposits1, withdrawals1);
//ex 4:
const convertTitleCase = function (title) {
  const exceptions = ['a', 'an', 'the', 'but', 'or', 'on', 'in', 'with', 'and'];
  const titleCase = title
    .toLowerCase()
    .split(' ')
    .map(word =>
      exceptions.includes(word) ? word : word[0].toUpperCase() + word.slice(1)
    )
    .join(' ');
  return titleCase;
};
console.log(convertTitleCase('this is a nice title'));
console.log(convertTitleCase('this is a LONG title but not too long'));
console.log(convertTitleCase('and here is another title with an EXAMPLE'));
//CHALLLENGE FOUR:
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

//1
dogs.forEach(function (acc) {
  acc.recommendedFood = Math.trunc(acc.weight ** 0.75 * 28);
});
console.log(dogs);

//2
const SarahDog = dogs.find(dog => dog.owners.includes('Sarah'));
console.log(
  `Sarah's dog is eating too ${
    SarahDog.curFood > SarahDog.recommendedFood ? 'much' : 'litte'
  }`
);
//3
const ownersEatTooMuch = dogs
  .filter(dog => dog.curFood > dog.recommendedFood)
  .flatMap(dog => dog.owners);
console.log(ownersEatTooMuch);
const ownersEatTooLittle = dogs
  .filter(dog => dog.curFood < dog.recommendedFood)
  .flatMap(dog => dog.owners);
console.log(ownersEatTooLittle);
// 4

console.log(`${ownersEatTooMuch.toString()}'s dogs eat too much`);
console.log(`${ownersEatTooLittle.join(' and ')}'s dogs eat too litte`);

//5
const checkExactDog = dogs.some(dog => dog.curFood === dog.recommendedFood);
console.log(checkExactDog); //false
//6
const isThereOkDog = dog =>
  dog.curFood > dog.recommendedFood * 0.9 &&
  dog.curFood < dog.recommendedFood * 1.1;
console.log(dogs.some(isThereOkDog)); //true//IMP:pay attention that we have used separate callback here
//7
const theOkDogs = dogs.filter(
  dog =>
    dog.curFood > dog.recommendedFood * 0.9 &&
    dog.curFood < dog.recommendedFood * 1.1
);
console.log(theOkDogs);
//7 shorter way:using the separate callback
console.log(dogs.filter(isThereOkDog));
//8

const sorteddogs = dogs
  .slice()
  .sort((a, b) => a.recommendedFood - b.recommendedFood); //IMP:since a and b are objects here, we used the property recommendedFood.slice creates a copy of the original array
console.log(sorteddogs);
