# hackathon2022
Project for hackathon 2022: Solar Roulette

Inspiration
Our group likes to appeciate the vastness of space. So we wanted other people to be able to appreciate it too. With the recent launch of the James Webb Telescope, the pace of space discovery has increased in recent years, although the public has not fully appreciated this. We thought it would be interesting to show the public our solar system.

What it does
Solar Roulette allows users to explore a myriad of celestial bodies in our home star system, by allowing users to search or randomly find bodies, where they can then see information about it as well as visualize how it would look if the moon were replaced by the body in question. We also offer a size comparison compared to the earth so you can truly appeciate the scale of the cosmos.

How we built it
Solar Roulette was built with THREE.js, The Solar System OpenData API, bootstrap, selenium, and HTML canvas to create a website hosted on Domain.com. First, we made a prototype in basic HTML and CSS while other team members worked on a 3d render and a web scaper to gather images. Then, we combined all the parts and polished up the interface.

Challenges we ran into
We ran in to many bugs involving rendering glitches as well as performance issues when loading. Also, some of the images found by the webscaper were innacurate, so we had to go through and replace them manually. Finally, there were some browser specific issues with Firefox, as it did not implement a crucial feature, which we were able to resolve via polyfill.
There was plenty of debugging along the way as a result of strange collisions from the physics engine. Not to mention that some seemingly simple problems ended up being rather complicated, such as ensuring the bucket counts stayed consistent when blocks were combined, or the red-ish lines bordering the blocks. By far our largest challenge was using Domain.com to host the app, which ended up requiring many expert opinions and visual compromises to get functioning.

Accomplishments that we're proud of
We are proud of the fact that we managed to complete a website within the4 time limit, despite having little experience with web design.
We're proud of the fact that we made a functional and useful design in the 24 hour time window. Despite this being our first hackathon, we successfully brainstormed and developed an app which isn't too messy, and can be easily expanded.

What we learned
Some of us used bootstrap and HTML canvas for the first time. All of us learned many little things about web development.

Some of us had never used Unity before, and as a result got a basic understanding of the Unity ui. We learned that Google hates Domain.com, that Domain.com hates Simmer.io, that Simmer.io hates compression, and that physics engines can only handle so much. We were also reminded that C# is a far superior language to C++.

What's next for Visual Arithmetech
We could display a list of moons around a planet, and we could add a map of the solar system, showing a bodies location. 
During our initial brainstorming we came up with many features which we had set aside as "features if we have time". Most importantly, we'd like to expand Visual Arithmetech to be more playful. The current form of the app is just a "sandbox", where users can mess around with blocks, but we could easily include a system where a user would have to use arithmetic to reach a certain number using as few blocks and/or button presses as possible. We could also expand the game to include more complex functions or mathematical models, such as exponents or factorials.

Built With