# Solar Roulette
Project for HACKRPI 2022: Solar Roulette

## Inspiration
Our group likes to appreciate the vastness of space. So we wanted other people to be able to appreciate it too. With the recent launch of the James Webb Telescope, the pace of space discovery has increased in recent years, although the public has not fully appreciated this. We thought it would be interesting to show the public our solar system.

## What it does
Solar Roulette allows users to explore a myriad of celestial bodies in our home star system by allowing users to search or randomly find bodies. They can then see information about it as well as visualize how it would look if the moon were replaced by the body in question. We also offer a size comparison with to the earth so you can truly appreciate the scale of the cosmos.

## How we built it
Solar Roulette was built with THREE.js, The Solar System OpenData API, bootstrap, selenium, and HTML canvas to create a website hosted on Domain.com. First, we made a prototype in basic HTML and CSS while other team members worked on a 3d render and a web scraper to gather images. Then, we combined all the parts and polished up the interface.

## Challenges we ran into
We ran in to many bugs involving rendering glitches as well as performance issues when loading. Also, some of the images found by the webscaper were inaccurate, so we had to go through and replace them manually. Finally, there were some browser specific issues with Firefox, as it did not implement a crucial feature, which we were able to resolve via polyfill.

## Accomplishments that we're proud of
We are proud of the fact that we managed to complete a website within the4 time limit, despite having little experience with web design.

## What we learned
Some of us used bootstrap and HTML canvas for the first time. All of us learned many little things about web development, as well as 
deploying a live site with a domain

## What's next for Solar Roulette
We could display a list of moons around a planet, and we could add a map of the solar system, showing a body's location. Furthermore, we 
could improve the sky rendering with better terrain and atmospheric effects for it to feel more immersive.

## Built With
- HTML/JS/CSS
- Bootstrap
- THREE.js
- Python + Selenium + Requests
- The Solar System OpenData API