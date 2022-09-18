'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Davut Unlu',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-27T14:11:59.604Z',
    '2020-07-26T17:01:17.194Z',
    '2020-07-28T23:36:17.929Z',
    '2020-08-01T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Sevda Yılmaz',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
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

/////////////////////////////////////////////////
// Functions
const formatMovementDates = function (date, locale) {
  const calcPassedDays = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  const daysPassed = calcPassedDays(new Date(), date);
  console.log(daysPassed);
  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  /*else {
    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }*/
  return new Intl.DateTimeFormat(locale).format(date);
};
//formatting currency
const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

//displaying movements
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDates(date, acc.locale);
    const formattedMov = formatCur(mov, acc.locale, acc.currency);
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
     <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

///////////////////////////////////////
//logout timer function
const startLogOutTimer = function () {
  //set the time 3 min
  let time = 180;
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0); //turned into string to be able to use padStart method
    labelTimer.textContent = `${min}:${sec}`;

    //in each ca ll print the remaining time to UI
    //When 0 sec print the time and log out user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = `Log in to get started`;
      containerApp.style.opacity = 0;
    }
    //decrease timer
    time--;
  };
  //call the  timer every sec
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};
// Event handlers
let currentAccount, timer;
btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    //setting the date by experimenting API
    const now1 = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    };
    /*const locale = navigator.language; //it set the info according to default on the browser*/

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now1);

    /*setting the date
    const day = `${now1.getDate()}`.padStart(2, 0); //tarihlerde başına sıfır koymak için .02/05/gibi
    const month = `${now1.getMonth() + 1}`.padStart(2, 0);
    const year = now1.getFullYear();
    const hour = `${now1.getHours()}`.padStart(2, 0);
    const minute = `${now1.getMinutes()}`.padStart(2, 0);*/

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    //timer
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();
    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    //setting the time of the transfer
    currentAccount.movementsDates.push(new Date().toISOString()); //sondaki toIso..aynı formatta array içerisine düşmesi için yapıldı.
    receiverAcc.movementsDates.push(new Date().toISOString());
    // Update UI
    updateUI(currentAccount);
    //reset the timer: remember the timer is for inactivity
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value); //we removed Number function cause floor method does type coersion itself.

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      // Add movement
      currentAccount.movements.push(amount);
      //set the loan time
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);
      //reset the timer:
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 2500);
    //settimeout kredinin 2.5 saniye sonra yapılacağını gösteriyor
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
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
//Conversion
console.log(Number('23')); //23
console.log(+'23'); //23 bec.of type coersion. it automatically convert the string into number.IMP: Bu durumda code düzenlenip  daha kısa yapılabilir.Number olan heryer + ile değiştirilebilir.
//IMP: Every function is also an object.
//Parsing:The string should start with a number. it might(not)also includes some other chars.
console.log(Number.parseInt('30px', 10)); //30. number 10 is the base
console.log(Number.parseInt('2.5rem')); //2
console.log(Number.parseFloat('2.5rem')); //2.5
//IMP: Since parseFloat and parseInt functions are global, they can be used without Number f as well. but that is a little bit old way
console.log(parseInt('5.5rem')); //5
//check if value is NaN:
console.log(Number.isNaN(23)); //false
console.log(Number.isNaN('23')); //false
console.log(Number.isNaN(+'20px')); //true
console.log(Number.isNaN(23 / 0)); //false

//A better Way of checking if value is a Number:
console.log(Number.isFinite(23)); //true
console.log(Number.isFinite('23')); //false
console.log(isFinite('23'));
console.log(Number.isFinite(+'23px')); //false
console.log(Number.isFinite(0)); //true
console.log(Number.isFinite(23 / 0)); //false

console.log(Number.isInteger(23)); //true
console.log(Number.isInteger('23')); //false
console.log(Number.isInteger(23 / 0)); //false
//NEW:Math and Rounding:
console.log(Math.sqrt(25)); //5
console.log(25 ** (1 / 2)); //5
console.log(125 ** (1 / 3)); //4.999
console.log(8 ** (1 / 3)); //2
console.log(Math.max(5, 12, 40, 8, 24)); //40
console.log(Math.cbrt(125)); //5
console.log(Math.max(5, 12, 40, '58', 24)); //58 coersion works
console.log(Math.max(5, 12, '40px', 8, 24)); //NaN--takeaway: parse doesn't work
console.log(Math.min(3, 12, 40, 8, 24)); //3
console.log(Math.PI * Number.parseFloat('10px') ** 2); //314.1592653589793
const randomInt = (min, max) =>
  Math.trunc(Math.random() * (max - min) + 1) + min;
console.log(randomInt(10, 20));
//Rounding Integers:
console.log(Math.trunc(23.8)); //23
console.log(Math.round(23.3)); //23
console.log(Math.round(23.7)); //24 round method rounds the nearest integer
console.log(Math.ceil(23.7)); //24
console.log(Math.ceil(23.2)); //24 rounds up  the smallest int
console.log(Math.floor(23.7)); //23
console.log(Math.round(23.3)); //23 rounds down to largest integer less than or equal to x.
//IMP: All of these methods also do type coersion.
//IMP: The difference between floor and trunc can be seen in neg.numbers
console.log(Math.trunc(-23.7)); //-23
console.log(Math.floor(-23.7)); //-24
//Rounding Decimals:
console.log((2.7).toFixed(0)); //3
console.log((2.7).toFixed(3)); //2.700
console.log((2.745).toFixed(2)); //2.75--toFixed metodunda yazdığımız virgülden sonra kaç basamak olduğunu gösterir.IMP:yalnız dikkat et sonuçlar consoleda hep string. to convert into an integer, we know using plus(+) operator would simply enough
console.log(+(2.7).toFixed(0)); //3
//NEW:The Remainder Operator:
labelBalance.addEventListener('click', function () {
  [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
    if (i % 2 === 0) row.style.backgroundColor = 'grey';
    if (i % 2 === 1) row.style.backgroundColor = '#00c992';
  });
});
//NEW:NUMERIC SEPARATOR: in order to read the large numbers easily, we can use underscore
const diameter = 286_345_000_000;
console.log(diameter); //286345000000
const priceCents = 395_54;
console.log(priceCents); //39554
//IMP: The place underscore  put matters.
const fee1 = 15_00;
const fee2 = 1_500; //even if the output is same, the first one look likes 15, the second one 1500;
console.log(Number('230_000')); //NaN IMP
console.log(parseInt('230_000')); //230 ,everything else ignore
//NEW:WORKING WITH BIGINT:
console.log(2 ** 53 - 1); //9007199254740991
console.log(Number.MAX_SAFE_INTEGER); //9007199254740991
//BIGINT:
console.log(54643218731381645132n); //bigint or we can use the bigınt func.
console.log(BigInt(54643218731381645132)); //54643218731381645312n

//OPERATIONS:
console.log(20000n + 10000n);
console.log(545486518n * 10000n);
const huge = 544537832135438n;
const num = 23;
console.log(huge * BigInt(num)); //IMP: We can not mix bigint and other types like simple int.therefore we used BigInt .
//some exceptionS:
console.log(20n > 18); //true
console.log(20n === 20); //false
console.log(typeof 20n);
console.log(20n == 20); //true. type coersion work here but it doesnt with the triple equality.
console.log(20n == '20'); //true
console.log(huge + ' ' + 'is Really a big number');
//Divisions:
console.log(11n / 3n); //3n bölümü alıyor
console.log(12n / 3n); //4n
//NEW: Creating Dates:
const now = new Date();
console.log(now);
console.log(new Date('Sep 12 2022 10:11:21'));
console.log(new Date('December 23 2018'));
console.log(new Date(account1.movementsDates[0])); //Tue Nov 19 2019 00:31:17 GMT+0300 (GMT+03:00)
//creating it based on a constructor
console.log(new Date(2019, 10, 19, 15, 23, 5)); //Tue Nov 19 2019 15:23:05 GMT+0300 (GMT+03:00)--month-day-hour-minute-second.IMP:even if the month is 10, the result is Nov(11th month).in js months are zero indexed.
console.log(new Date(2019, 10, 33)); //Tue Dec 03 2019 00:00:00 GMT+0300 (GMT+03:00)
console.log(new Date(0)); //Thu Jan 01 1970 02:00:00 GMT+0200 (GMT+03:00)
console.log(new Date(3 * 24 * 60 * 60 * 1000)); //Sun Jan 04 1970 02:00:00 GMT+0200 (GMT+03:00)
console.log(3 * 24 * 60 * 60 * 1000); //259200000 IMP:called timestamp
//Working with dates
const future = new Date(2037, 10, 19, 15, 23);
console.log(future);
console.log(future.getFullYear()); //2037
console.log(future.getMonth()); //10
console.log(future.getHours()); //and lots of other methods
console.log(future.toISOString()); //2037-11-19T12:23:00.000Z
console.log(future.getTime()); //2142246180000 the timestamp since 1970
//reversing the timestamp
console.log(new Date(2142246180000)); //hu Nov 19 2037 15:23:00 GMT+0300 (GMT+03:00)
console.log(Date.now()); //timestamp of now
console.log(new Date().getTime()); //timestamp of now
//IMP: There are also a bunch of set methods
future.setFullYear(2040); //yılı değiştiriyor
console.log(future); //Mon Nov 19 2040 15:23:00 GMT+0300 (GMT+03:00)
//NEW:Operations with DayS:
console.log(+future); //IMP2236940580000 given in milliseconds
const calcPassedDays = (date1, date2) =>
  Math.abs(date2 - date1) / (1000 * 60 * 60 * 24);
const days1 = calcPassedDays(new Date(2037, 3, 14), new Date(2037, 3, 24));
console.log(days1); //10
const days2 = calcPassedDays(new Date(2037, 3, 4), new Date(2037, 3, 24));
console.log(days2); //20
//NEW: Internationalizing Numbers:
const num1 = 3884764.23;
const options = {
  style: 'currency',
  unit: 'celsius',
  currency: 'EUR',
};
console.log('Us', new Intl.NumberFormat('en-US', options).format(num1)); //Us 3,884,764.23
console.log('Germany', new Intl.NumberFormat('de-DE', options).format(num1)); //Germany 3.884.764,23 IMP:From two examples we can see that separators might vary from country to country
console.log('Syria', new Intl.NumberFormat('ar-SY', options).format(num1)); //Syria ٣٬٨٨٤٬٧٦٤٫٢٣
//NEW:SetTimeout and setInterval
//settimeout:receive callback
const ingredients = ['spinach', 'olives'];
const pizzaTimer = setTimeout(
  (ing1, ing2) => console.log(`Here is your pizza 🍕 with ${ing1} and ${ing2}`),
  3000,
  ...ingredients
);
console.log('Waiting...');
//setInterval:it is used when a f loop requires
setInterval(function () {
  const now = new Date();
  now.setHours;
  console.log();
}, 2000);
