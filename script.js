const inputSlider = document.querySelector("[data-lengthSlider]");

const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");

const copyBtn = document.querySelector("[data-copy]");

const copyMsg = document.querySelector("[data-copyMsg]");

const uppercaseCheck = document.querySelector("#uppercase");

const lowercaseCheck = document.querySelector("#lowercase");

const numbersCheck = document.querySelector("#numbers");

const symbolsCheck = document.querySelector("#symbols");

const indicator = document.querySelector("[data-indicator]");

const generateButton = document.querySelector(".generateButton");

const allCheckBox = document.querySelectorAll("input[type=checkbox]");

const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';



//initially
let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
//ste strength circle color to grey
setIndicator("#ccc");


//set passwordLength
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    //or kuch bhi karna chahiye ? - HW
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"
}

function setIndicator(color){
    indicator.style.backgroundColor = color
    //shadow
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomNumber() {
    return getRandomInteger(0,10);
}
function getRandomLowerCase() {  
       return String.fromCharCode(getRandomInteger(97,123))
}
function getRandomUpperCase() {  
    return String.fromCharCode(getRandomInteger(65,91))
}
function getRandomSymbol() {
    const randNum = getRandomInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

function calculateStrength() {
    let hasUpper = false
    let hasLower = false
    let hasNum = false
    let hasSymbol = false
    if(uppercaseCheck.checked)  hasUpper = true
    if(lowercaseCheck.checked)  hasLower = true
    if(numbersCheck.checked)  hasNum = true
    if(symbolsCheck.checked)  hasSymbol = true
 
    if(hasUpper && hasLower && (hasNum || hasSymbol) && passwordLength >= 8){
        setIndicator("#0f0")
    }
    else if((hasLower || hasUpper) && (hasNum || hasSymbol) && passwordLength >= 6){
        setIndicator("#ff0")
    }
    else {
      setIndicator("#f00")
    }
}


async function copyContent(){
    //returns a promise -> if success -> copied else failed
    try{
        await navigator.clipboard.writeText(passwordDisplay.value)
        copyMsg.innerText = "copied"
    }
    catch(e){
        copyMsg.innerText = "Failed";
    }
    // to make copy span visible
    copyMsg.classList.add("active")

    setTimeout(() => {
        copyMsg.classList.remove("active")
    },2000)
}

function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        //random J, find out using random function
        const j = Math.floor(Math.random() * (i + 1));
        //swap number at i index and j index
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

function handleCheckBoxChange(){
    checkCount = 0
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked)
            checkCount++
    })

    //special condition
    if(passwordLength < checkCount){
        passwordLength = checkCount
        handleSlider()
    }
}


// adding event listener to all checkboxes and 
allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange)// if any of the checkboxes changes it counts again
})

inputSlider.addEventListener('input',(e) => {
    passwordLength = e.target.value  // value on slider
    handleSlider()
})

copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value)// if there is some value in input there you can copy else you cannot
        copyContent()
})


generateButton.addEventListener('click', () => {
    // none of the checkbox are selected
    if(checkCount <= 0) return;

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider()//move the slider to new position
    }

    // lets start a journey to find new password
    password = ""

    //let's put the stuff mentioned by checkboxes
    // if(uppercaseCheck){
    //     password += getRandomUpperCase()
    // }
    // if(lowercaseCheck){
    //     password += getRandomLowerCase()
    // }
    // if(symbolsCheck){
    //     password += getRandomSymbol()
    // }
    // if(numbersCheck){
    //     password += getRandomNumber()
    // }

    let funArray = []

    if(uppercaseCheck.checked)
        funArray.push(getRandomUpperCase)
    if(lowercaseCheck.checked)
        funArray.push(getRandomLowerCase)
    if(numbersCheck.checked)
        funArray.push(getRandomNumber)
    if(symbolsCheck.checked)
        funArray.push(getRandomSymbol)


    for(let i=0;i<funArray.length; i++){
        password += funArray[i]()
    }

    for(let i=0;i<passwordLength-funArray.length; i++){
        let randIndex = getRandomInteger(0, funArray.length)
        password += funArray[randIndex]()
    }
    //shuffle the password
    password = shufflePassword(Array.from(password))

    passwordDisplay.value = password
    //calculate strength
    calculateStrength()
})




