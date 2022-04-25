
// API key for using 'openweathermap.org'------------------------
const apiKey = 'a5879309e8bb89920d3f326bf537f23a';

// API URL for geting user location from 'ip-api.com' ------------
const IpUrl = 'http://ip-api.com/json/?fields=status,message,country,regionName,city,lat,lon,timezone';

// fetch location data from IP API--------------------------------
function getLocation(){
    return fetch(IpUrl)
    .then(res => res.json());
}

// fetch Weather data from Weather API----------------------------
function getWeather(lat, lon){
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    // console.log(weatherUrl)
   return fetch(weatherUrl)
    .then(res => res.json());
}

// Required variables from Index.html-----------------------------
const timezone = document.querySelector('.timezone');
const icon = document.querySelector('.icon');
const degreeSection = document.querySelector('.degree-section');
const degree = document.querySelector('.degree');
const unit = document.querySelector('.degree-section span')
const temperatureDescription = document.querySelector('.temperature-description');

//Render data to the web-------------------------------------------
getLocation().then(location => {
    timezone.innerHTML = location.timezone;
    return getWeather(location.lat, location.lon)
})
.then(weatherData => {
    const weatherTemp = weatherData.main.temp;
    const weatherMain = weatherData.weather[0].main;
    const weatherDescription = weatherData.weather[0].description;
    temperatureDescription.innerHTML = weatherDescription;
    const iconName = getIcon(weatherMain);
    icon.innerHTML = `<img src='icons/${iconName}'>`;
    degree.textContent = Math.floor(weatherTemp);
    unit.textContent = '°K';
    degreeSection.addEventListener('click', ()=>{
        if(unit.textContent == '°K'){
            degree.textContent = getTempreture(weatherTemp).far;
            unit.textContent = '°F';
        }
        else if(unit.textContent == '°F'){
            degree.textContent = getTempreture(weatherTemp).c;
            unit.textContent = '°C';
        }
        else if(unit.textContent == '°C'){
            degree.textContent = getTempreture(weatherTemp).kel;
            unit.textContent = '°K';
        }
    }) 
});

// function for determining if it is day or night--------------
function getDayorNight(){
    let dayorNight;
    let date = new Date();
    if(date.getHours() >= 6 && date.getHours() <= 19 ){
        dayorNight = 'Day'
    } else {
        dayorNight = 'Night'
    }
    return dayorNight;
} 

//Choose the related Icon depending on weather condition------
function getIcon(weatherMain){
    let icon;
    switch (weatherMain) {
        case 'Thunderstorm':
            icon = `${weatherMain}.svg`
            break;
        case 'Drizzle':
            icon = `${weatherMain}.svg`
            break;
        case 'Rain':
            icon = `${weatherMain}.svg`
            break;
        case 'Snow':
            icon = `${weatherMain}.svg`
            break;
        case 'Clear':
            const dayorNight = getDayorNight();
            icon = `${weatherMain}-${dayorNight}.svg`
            break;
        case 'Clouds':
            icon = `${weatherMain}.svg`
            break;
        case 'Fog':
            icon = `Atmosphere.png`
            break;
    }
    return icon;
}

// Create the tempreture Object for Kelvin, Fahrenheit and centigrade
function getTempreture(temprature){
    const kelvin = temprature;
    const fahrenheit = (kelvin - 273.15) * 9/5 + 32;
    const centigrade = kelvin - 273.15 ;
    let tempratureObj = {
        kel: Math.floor(kelvin), 
        far: Math.floor(fahrenheit),
        c: Math.floor(centigrade)
     };
     return tempratureObj;
}

//Get new quote from API--------------------------------------
function getQuote(){
    fetch('https://api.goprogram.ai/inspiration')
    .then(res => res.json())
    .then(data => {
        const quote = document.querySelector('.blockquote p');
        const author = document.querySelector('.author');
    quote.textContent = data.quote;
    author.textContent = `- ${data.author}`
})
}
getQuote();

// Create comments list------------------------------------------
const URLComments = 'http://localhost:3000/comments'
const commentUl = document.querySelector('#comment-ul')

fetch(URLComments)
.then(res => res.json())
.then(comments => {
    comments.forEach(comment => {
        // const commentId = comment.id
        const commentLi = document.createElement('li')
        commentLi.style.borderBottom = '2px solid grey';
        commentLi.innerHTML = `
                                ${comment.user} says:
                                <br>       
                                ${comment.comment}
                                <br>
                            `
        const dltBtn = document.createElement('button');
        dltBtn.textContent = 'Delete Comment'
        commentLi.append(dltBtn)
        commentUl.append(commentLi)
        commentUl.append(document.createElement('br'))

    dltBtn.addEventListener('click', () => deleteComment(comment))

    })
} )


// Post new comment------------------------------------------
function postComment(user, newComment){
    return fetch(URLComments, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            comment: newComment, user: user})
        })
        .then(res => res.json())
        .then(data => console.log(data))
    }
    
// Submit new comment------------------------------------------
    const commentsForm = document.querySelector('.comments')
    commentsForm.addEventListener('submit', handleSubmit)

    function handleSubmit(e){
        e.preventDefault()
        console.log(e)
        const user = document.querySelector('#name').value
        const newComment = document.querySelector('#new-comment').value
        postComment(user, newComment)
    }
    
    
// Delete a comment------------------------------------------
    function deleteComment(comment){
        fetch(`http://localhost:3000/comments/${comment.id}`, {
            method: 'DELETE',
          })
            .then(res => res.json())
            .then(res => console.log(res))
            }





