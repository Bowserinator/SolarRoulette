async function getData(){
    api_key = 'zEsyctgqv7GuG9zfr5IZLA==1fYgWoEeJCtcP5vq';
    data_url='https://api.le-systeme-solaire.net/rest/bodies/'
    let data = await fetch(data_url);
    let json_data = await data.json();
    bodies = json_data.bodies;
    planets = [];
    bodies.forEach(body => {
        if (body.isPlanet) {
            planets.splice(planets.length, 0, body);
        }
    });
}
getData().catch(error =>{
    console.log('something is wrong');
    console.log(error);
});

function displayBody(body){
    console.log(i);
    let name = body.englishName;
    let discoveredBy;
    let discoveryDate;
    let bodyType=body.bodyType.toLowerCase();
    let axialTilt = body.axialTilt;
    let bodyTypeString='';
    let mass_string;
    let massValue;
    let massExponent;
    let radius = body.meanRadius;
    let earthRadius = 6371.0084;
    let discoveredString;
    let ratio;
    let vol_string;
    let radius_string;

    if(radius>earthRadius){
        ratio=(radius/earthRadius)**3;
        console.log(ratio);
        ratio=Math.round(ratio);
        vol_string='You can fit '+ratio+' Earth in '+name;
        
    }
    else if(radius<earthRadius){
        ratio=(earthRadius/radius)**3;
        console.log(ratio);
        ratio=Math.round(ratio);

        vol_string='You can fit '+ratio+' '+name +' in  Earth';
    }
    else{
        ratio=(earthRadius/radius)**3;
        console.log(ratio);
        ratio=Math.round(ratio);

        vol_string='You can fit '+ratio+' '+name +' in  Earth';
    }

    document.getElementById('volumeComparison').textContent = vol_string;
    radius_string= 'The mean radius of '+name+' is '+Math.round(radius)+' km.';
    document.getElementById('radius').textContent = radius_string;





    if (body.discoveredBy!='' && body.discoveryDate!=''){

        discoveredBy=body.discoveredBy;
        discoveryDate=body.discoveryDate;
        console.log('hhhhh');
        console.log(discoveredBy);
        console.log(discoveryDate);
        console.log('hhhhh');
        discoveredString= 'It was discovered on ' + discoveryDate + ' by '+ discoveredBy;
    }

    if(discoveredString!=''){
        document.getElementById('discover').textContent = discoveredString;

    }
    

    if(bodyType[0]=='a'){
        bodyTypeString=' an '+ bodyType;
    }else{
        bodyTypeString=' a '+ bodyType;
    }

    console.log(bodyTypeString);

    if (body.mass == null){
        console.log('the mass in null');
        mass_string=' The mass is unabilable.'
    }
    else{
        massValue = body.mass.massValue;
        massExponent = body.mass.massExponent;
        mass_string=massValue+' x 10^'+massExponent+'kg';
    }
    console.log(name);
    
    document.getElementById('name').textContent = name;
    document.getElementById('mass').textContent = mass_string ;
    document.getElementById('bodyType').textContent = bodyTypeString ;

    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);
    if (radius*10 < earthRadius){
        ctx.beginPath();
        ctx.arc(150, 300, 350, 0, 2 * Math.PI);
        ctx.fillStyle = "lightseagreen";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(800, 300, 1+(350*radius/earthRadius), 0, 2 * Math.PI);
        ctx.fillStyle = "brown";
        ctx.fill();
    } else {
        ctx.beginPath();
        ctx.arc(500-(150*earthRadius/radius), 300, 150*earthRadius/radius, 0, 2 * Math.PI);
        ctx.fillStyle = "lightseagreen";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(800, 300, 150, 0, 2 * Math.PI);
        ctx.fillStyle = "brown";
        ctx.fill();
    }
}

function getRandomBody(){
    i=Math.floor(Math.random() * bodies.length);
    console.log(i);
    let body = bodies[i];
    displayBody(body);
}

function getRandomPlanet(){
    i=Math.floor(Math.random() * planets.length);
    console.log(i);
    let planet = planets[i];
    displayBody(planet);
}

