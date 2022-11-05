async function getData(){
    api_key = 'zEsyctgqv7GuG9zfr5IZLA==1fYgWoEeJCtcP5vq';
    data_url='https://api.le-systeme-solaire.net/rest/bodies/'
    let data = await fetch(data_url);
    let json_data = await data.json();
    console.log(json_data);
    console.log();
    let planets = json_data.bodies;
    i=Math.floor(Math.random() * 275);
    console.log(i);
    let planet = planets[i];
    let name = planet.englishName;
    let discoveredBy;
    let discoveryDate;
    let bodyType=planet.bodyType;
    bodyType=bodyType.toLowerCase();
    let bodyTypeString;
    // console.log(bodyType);
    let mass_string;
    let massValue;
    let massExponent;
    let radius = planet.meanRadius;
    let earthRadius = 6371.0084;
    

    if(bodyType[0]=='a'){
        bodyTypeString=' an '+ bodyType;
    }else{
        bodyTypeString=' a '+ bodyType;
    }

    console.log(bodyTypeString);

    if (planet.mass == null){
        console.log('the mass in null');
        mass_string=' The mass is unabilable.'
    }
    else{
        massValue = planet.mass.massValue;
        massExponent = planet.mass.massExponent;
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
        ctx.arc(100, 300, 400, 0, 2 * Math.PI);
        ctx.fillStyle = "lightseagreen";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(600, 300, 1+(350*radius/earthRadius), 0, 2 * Math.PI);
        ctx.fillStyle = "brown";
        ctx.fill();
    } else {
        ctx.beginPath();
        ctx.arc(300-(150*earthRadius/radius), 300, 150*earthRadius/radius, 0, 2 * Math.PI);
        ctx.fillStyle = "lightseagreen";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(600, 300, 150, 0, 2 * Math.PI);
        ctx.fillStyle = "brown";
        ctx.fill();
    }
}
getData().catch(error =>{
    console.log('something is wrong');
    console.log(error);
});


