let lastSpin = 0;

function spin() {
    document.getElementById('logo').classList.add('spin');
    lastSpin = Date.now();
    setTimeout(() => {
        if (Date.now() - lastSpin > 900)
            document.getElementById('logo').classList.remove('spin');
    }, 1000);
}

async function getData(){
    planets = [];
    moons = [];
    dwarfs = [];
    asteroids = [];
    comets = [];
    bodies.forEach(body => {
        if (body.isPlanet) {
            planets.splice(planets.length, 0, body);
        }
        else if (body.bodyType == "Moon") {
            moons.splice(moons.length, 0, body);
        } else if (body.bodyType == "Asteroid") {
            asteroids.splice(asteroids.length, 0, body);
        } else if (body.bodyType == "Comet") {
            comets.splice(comets.length, 0, body);
        } else if (body.bodyType == "Dwarf Planet") {
            dwarfs.splice(dwarfs.length, 0, body);
        }
    });
    
    let temp = setInterval(() => {
        if (!window.onChangeBody || !window.onChangeBody())
            return;
        clearInterval(temp);

        getBody("moon");
        window.addEventListener('resize', onWindowResize, false);
        function onWindowResize(){
            const cb = document.getElementById('myCanvas');
            cb.width = 1000;
            cb.height = Math.round(cb.offsetHeight / cb.offsetWidth * 1000);
            displayBody(window.currentBody);
        }
        onWindowResize();
    }, 50);

}
getData().catch(error =>{
    console.log('something is wrong');
    console.log(error);
});

function displayBody(body){
    window.currentBody = body;
    if (window.onChangeBody)
        window.onChangeBody(body);
    
    prevBody = body;
    let name = body.englishName;

    document.getElementsByClassName("card-img")[0].src = `./img/web/${body.id}.png`;

    let discoveredBy;
    let discoveryDate;
    let bodyType=body.bodyType.toLowerCase();
    let axialTilt = body.axialTilt;
    let bodyTypeString;
    let mass_string;
    let massValue;
    let massExponent;
    let radius = body.meanRadius;

    let earthRadius = 6371.0084;
    let discoveredString;
    let ratio;
    let vol_string;
    let radius_string;
    let aroundPlanet;

    if(radius!=0){
        if(radius>earthRadius){
            ratio=(radius/earthRadius)**3;
            ratio=Math.round(ratio);
            vol_string='You can fit '+ratio.toLocaleString()+' Earth(s) in '+name+'.\n';
        }
        else {
            ratio=(earthRadius/radius)**3;
            ratio=Math.round(ratio);
    
            vol_string="You can fit "+ratio.toLocaleString()+" of '"+name +"' in  Earth.\n";
        }

        document.getElementById('volumeComparison').textContent = vol_string;
        radius_string= 'The mean radius of '+name+' is '+radius.toLocaleString()+' km.';
        document.getElementById('radius').textContent = radius_string;
    } else {
        document.getElementById('volumeComparison').textContent = "";
        document.getElementById('radius').textContent = "";
    }

    if (body.discoveredBy!='' && body.discoveryDate!=''){
        discoveredBy=body.discoveredBy;
        discoveryDate=body.discoveryDate;
        discoveryDate = discoveryDate.split('/');

        // Swap M/D for US format
        [discoveryDate[0], discoveryDate[1]] = [discoveryDate[1], discoveryDate[0]];
        discoveryDate = discoveryDate.join('/');
        discoveredString= 'It was discovered on <span class="text-primary">' + discoveryDate +
            '</span> by <span class="text-primary">'+ discoveredBy+'</span>.';
    }

    if (discoveredString){
        document.getElementById('discover').innerHTML = discoveredString;
    } else {
        document.getElementById('discover').innerHTML = "";
    }
    
    bodyTypeString=' is';

    if(bodyType[0]=='a'){
        bodyTypeString+=' an '+ bodyType;
    }else{
        bodyTypeString+=' a '+ bodyType;
    }

    bodyTypeString+='.';

    if(bodyType=='moon'){
        aroundPlanet=body.aroundPlanet.planet;
        englishNamePlanet=getEnglishName(aroundPlanet);
        document.getElementById('aroundPlanet').innerHTML = "It's a moon of "+englishNamePlanet+". ";
    } else {
        document.getElementById('aroundPlanet').innerHTML = "";
    }


    if (!body.mass){
        mass_string = '';
    }
    else{
        massValue = body.mass.massValue;
        massExponent = body.mass.massExponent;
        mass_string = ` It has a mass of ${massValue.toLocaleString()} x 10<sup>${massExponent}</sup> kg.`;
    }
    
    document.getElementById('name').textContent = name;
    document.getElementById('bodyType').textContent = bodyTypeString ;

    document.getElementById('mass').innerHTML = mass_string ;

    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.font = "28px 'Roboto Condensed'";
    ctx.lineWidth = 1;
    if (radius*6.4 < earthRadius){
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(50, 300, 350, 0, 2 * Math.PI);
        ctx.fillStyle = "lightseagreen";
        ctx.fill();
        ctx.fillStyle = "white";
        ctx.fillText("Earth (for scale)", 100, 400)

        var rad = 1+(350*radius/earthRadius);

        ctx.beginPath();
        ctx.strokeStyle = "white";
        ctx.moveTo((700)-rad*1.5*Math.sin(axialTilt*Math.PI/180), (300)-rad*1.5*Math.cos(axialTilt*Math.PI/180));
        ctx.lineTo((700)+rad*1.5*Math.sin(axialTilt*Math.PI/180), (300)+rad*1.5*Math.cos(axialTilt*Math.PI/180));
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(700, 300, rad, 0, 2 * Math.PI);
        ctx.fillStyle = "brown";
        ctx.fill();

        ctx.fillStyle = "white";
        ctx.fillText(name, 700-(8*name.length), 400)
    } else {
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(400-(150*earthRadius/radius), 300, 150*earthRadius/radius, 0, 2 * Math.PI);
        ctx.fillStyle = "lightseagreen";
        ctx.fill();
        ctx.fillStyle = "white";
        ctx.fillText("Earth (for scale)", Math.max(294-(150*earthRadius/radius), 30), 400)

        var rad = 150;

        ctx.beginPath();
        ctx.strokeStyle = "white";
        ctx.moveTo((700)-rad*1.5*Math.sin(axialTilt*Math.PI/180), (300)-rad*1.5*Math.cos(axialTilt*Math.PI/180));
        ctx.lineTo((700)+rad*1.5*Math.sin(axialTilt*Math.PI/180), (300)+rad*1.5*Math.cos(axialTilt*Math.PI/180));
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(700, 300, rad, 0, 2 * Math.PI);
        ctx.fillStyle = "brown";
        ctx.fill();

        ctx.fillStyle = "white";
        ctx.fillText(name, 700-(8*name.length), 400)
    }
}

function getRandomBody(){
    spin();
    let i=Math.floor(Math.random() * bodies.length);
    let body = bodies[i];
    while (body.id == prevBody.id) {
        i=Math.floor(Math.random() * bodies.length);
        body = bodies[i];
    }
    displayBody(body);
}

function getRandomPlanet(){
    spin();
    let i=Math.floor(Math.random() * planets.length);
    let planet = planets[i];
    while (planet.id == prevBody.id) {
        i=Math.floor(Math.random() * planets.length);
        planet = planets[i];
    }
    displayBody(planet);
}

function getRandomMoon(){
    spin();
    let i=Math.floor(Math.random() * moons.length);
    let body = moons[i];
    while (body.id == prevBody.id) {
        i=Math.floor(Math.random() * moons.length);
        body = moons[i];
    }
    displayBody(body);
}

function getRandomAsteroid(){
    spin();
    let i=Math.floor(Math.random() * asteroids.length);
    let body = asteroids[i];
    while (body.id == prevBody.id) {
        i=Math.floor(Math.random() * asteroids.length);
        body = asteroids[i];
    }
    displayBody(body);
}

function getRandomComet(){
    spin();
    let i=Math.floor(Math.random() * comets.length);
    let body = comets[i];
    while (body.id == prevBody.id) {
        i=Math.floor(Math.random() * comets.length);
        body = comets[i];
    }
    displayBody(body);
}

function getRandomDwarf(){
    spin();
    let i=Math.floor(Math.random() * dwarfs.length);
    let body = dwarfs[i];
    while (body.id == prevBody.id) {
        i=Math.floor(Math.random() * dwarfs.length);
        body = dwarfs[i];
    }
    displayBody(body);
}

function getSun(){
    displayBody(bodies[242]);
}


function getBody(bodyName) {
    bodyName = bodyName.toLowerCase();
    var bodyFound = false;
    bodies.forEach(body => {
        if (!bodyFound && body.englishName.toLowerCase() == bodyName || body.id.toLowerCase()== bodyName || body.name.toLowerCase() == bodyName){
            displayBody(body);
            bodyFound = true;
        }
    });
    if (bodyFound) return;
    bodies.forEach(body => {
        if (body.englishName.toLowerCase().includes(bodyName) || body.id.toLowerCase().includes(bodyName) || body.name.toLowerCase().includes(bodyName)){
            displayBody(body);
        }
    });
}



function getEnglishName(bodyName){
    bodyName = bodyName.toLowerCase();

    for (let body of bodies) {
        if (body.id== bodyName){
            return body.englishName;
        }   
    }
}

function searchBody() {
    var bodyName = document.getElementById('searchBar').value.toLowerCase();
    if (bodyName == null || bodyName.length == 0){
        return false;
    }
    getBody(bodyName);
    return false;
}

function clearAutocomplete() {
    let bodyName = document.getElementById('searchBar').value.toLowerCase();
    if (bodyName.length < 2) {
        document.getElementById('search-autocomplete').style.display = 'none';
    }
}


function doAutocomplete() {
    if (!bodies) return;
    let lis = [];
    let bodyName = document.getElementById('searchBar').value.toLowerCase();
    document.getElementById('search-autocomplete').style.display = 'block';
    if (bodyName.length < 2) {
        document.getElementById('search-autocomplete').style.display = 'none';
        return;
    }

    function createLi(body) {
        let li = document.createElement('li');
        li.innerText = `${body.englishName} (${body.id})`;
        let name = body.englishName;
        li.onclick = () => {
            document.getElementById('searchBar').value = name;
            document.getElementById('searchBar').focus();
            document.getElementById('search-autocomplete').style.display = 'none';
            searchBody();
        }
        return li;
    }

    for (let body of bodies) {
        if (body.englishName.toLowerCase().includes(bodyName) || body.id.toLowerCase().includes(bodyName) || body.name.toLowerCase().includes(bodyName))
            lis.push(body);
    }

    lis = lis.map(createLi);
    document.getElementById('search-autocomplete').replaceChildren(...lis);
}

function switchToSky() {
    const ca = document.getElementById('sky-canvas');
    const cb = document.getElementById('myCanvas');
    const tab1 = document.getElementById('tab1');
    const tab2 = document.getElementById('tab2');
    tab2.classList.remove('tab-select');
    tab1.classList.add('tab-select');
    ca.style.visibility = 'visible';
    cb.style.visibility = 'hidden';
}

function switchToSize() {
    const ca = document.getElementById('sky-canvas');
    const cb = document.getElementById('myCanvas');
    const tab1 = document.getElementById('tab1');
    const tab2 = document.getElementById('tab2');
    tab1.classList.remove('tab-select');
    tab2.classList.add('tab-select');
    ca.style.visibility = 'hidden';
    cb.style.visibility = 'visible';
}

function loadEverything() {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('card-img').style.display = 'block';
}
