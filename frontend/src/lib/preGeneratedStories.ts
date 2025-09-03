// Pre-generated stories for all combinations of characters, moods, age groups, and story sizes
// These serve as AI fallbacks when story generation fails

export interface PreGeneratedStory {
  id: string;
  title: string;
  story: string;
  educationalFacts: string[];
  character: string;
  mood: string;
  ageGroup: '8-10' | '11-13' | '14-17';
  storySize: 'short' | 'medium' | 'long';
  eventType: string;
}

export const preGeneratedStories: PreGeneratedStory[] = [
  // ASTRONAUT STORIES
  {
    id: 'astronaut-realtime-8-10-short-solar_flare',
    title: 'Space Station Alert!',
    story: `Hi! I'm Sumaiya, and I'm floating in the International Space Station right now! 

Suddenly, our computers started beeping. "Solar flare incoming!" said Mission Control. A solar flare is like when the Sun sneezes really hard and sends bright light and energy toward Earth.

I quickly floated to our special safe room. It has thick walls that protect us from the Sun's energy, like wearing a super-strong sunscreen suit! 

Through the window, I saw the most amazing thing - green and purple lights dancing around Earth like a magical light show. Those are called auroras, and they happen when the Sun's energy meets Earth's invisible shield.

"Wow!" I said to my space friends. "The Sun is so powerful, but Earth's magnetic field keeps us safe down there!"

Even in space, science helps us stay safe and see incredible things!`,
    educationalFacts: [
      'Solar flares are like the Sun sneezing energy into space',
      'The International Space Station has a special safe room for astronauts',
      'Auroras look like colorful dancing lights from space',
      'Earth has an invisible magnetic shield that protects us',
      'Astronauts can see auroras from above, looking down at Earth'
    ],
    character: 'astronaut',
    mood: 'real_time',
    ageGroup: '8-10',
    storySize: 'short',
    eventType: 'solar_flare'
  },
  {
    id: 'astronaut-realtime-11-13-medium-solar_flare',
    title: 'Solar Storm from Orbit',
    story: `I'm Sumaiya Subha, speaking to you from the International Space Station, 400 kilometers above Earth. Today, we're experiencing something extraordinary - a powerful solar flare.

At 14:30 UTC, our radiation monitoring systems started alerting. A massive X-class solar flare had erupted from the Sun's surface, and its electromagnetic radiation was racing toward us at the speed of light. In space, we're outside Earth's protective atmosphere, so we take these events very seriously.

"All crew to the Unity module," Commander Rodriguez announced. This is our most shielded area, designed to protect us from increased radiation during solar events. As we secured our experiments and moved to safety, I couldn't help but feel excited about witnessing this cosmic phenomenon firsthand.

Through the cupola windows, Earth looked absolutely stunning. The aurora borealis was erupting across the northern hemisphere like a green fire across the continents. From our vantage point, we could see the oval ring of light expanding much further south than usual - all the way down to northern United States!

Our communication with Mission Control crackled with static. "ISS, Houston. We're seeing increased particle flux. Stay in Unity for the next two hours," came the garbled transmission.

This solar flare reminded me why I became an astronaut - to witness the incredible power of our universe and help humanity understand our place in the cosmos.`,
    educationalFacts: [
      'X-class solar flares are the most powerful category of solar flares',
      'The ISS orbits at about 400 kilometers above Earth, outside our protective atmosphere',
      'Astronauts take shelter in the most shielded parts of the station during solar events',
      'Solar flares travel at light speed and reach Earth in about 8 minutes',
      'From space, astronauts can see auroras as glowing rings around Earth\'s poles'
    ],
    character: 'astronaut',
    mood: 'real_time',
    ageGroup: '11-13',
    storySize: 'medium',
    eventType: 'solar_flare'
  },
  {
    id: 'pilot-extremestorm-8-10-short-geomagnetic_storm',
    title: 'Captain Tanvir\'s Sky Adventure',
    story: `Hello passengers! This is Captain Tanvir. We're having a special adventure today because of something called a geomagnetic storm!

A geomagnetic storm is like when Earth's invisible magnetic blanket gets shaken by the Sun's energy. It's making our airplane's compass spin around like a toy top!

"Don't worry," I told my co-pilot Sarah. "We have backup systems!" Our GPS was acting silly, showing we were flying over the ocean when we were really over land. But pilots are trained for this!

I looked outside and saw the most beautiful sight - green and pink lights dancing in the sky like nature's own disco! "Look outside, everyone!" I announced. "Those are Northern Lights, caused by the same storm affecting our instruments!"

We safely landed using our backup navigation tools. The storm made our flight more exciting, but we pilots always keep you safe!

Space weather is amazing - it can affect airplanes, but it also creates the most beautiful light shows in the sky!`,
    educationalFacts: [
      'Geomagnetic storms can make airplane compasses and GPS act strangely',
      'Pilots have backup navigation systems for when space weather causes problems',
      'The same storms that affect airplanes create beautiful Northern Lights',
      'Planes flying near the North Pole are most affected by space weather',
      'Pilots are specially trained to handle space weather events'
    ],
    character: 'pilot',
    mood: 'extreme_storm',
    ageGroup: '8-10',
    storySize: 'short',
    eventType: 'geomagnetic_storm'
  },
  {
    id: 'farmer-seasonal-14-17-long-cme',
    title: 'Precision Agriculture Under Solar Siege',
    story: `I'm Wasif Ahmad, and I run a 2,000-acre precision agriculture operation in Manitoba, Canada. This morning started like any other during harvest season, but space weather had other plans for us.

At 6 AM, I was in the cab of our GPS-guided John Deere combine harvester, beginning the wheat harvest. Our entire operation depends on centimeter-accurate GPS positioning - from variable-rate fertilizer application to automated steering systems. Each piece of equipment communicates through our farm management network, optimizing efficiency and maximizing yield.

Then the alerts started coming in on my phone. Space Weather Canada issued a G4 geomagnetic storm warning. A massive coronal mass ejection had erupted from the Sun 36 hours ago, and it was about to slam into Earth's magnetosphere.

By 8 AM, the effects were undeniable. Our GPS receivers started losing lock, showing position errors of several meters instead of the usual 2-centimeter accuracy. The combine's auto-steer system kept disengaging, forcing me to manually guide the 40-foot header through our wheat rows.

"Dad, the seeder in the south field is going haywire," my daughter Aisha radioed from our Case IH precision seeder. "It's applying fertilizer in all the wrong spots!" The variable-rate application system relies on precise GPS coordinates to match soil nutrient maps - without accurate positioning, we were essentially flying blind.

I made the difficult decision to halt field operations. In agriculture, timing is everything. Every day of harvest delay costs us money and grain quality. But continuing with degraded GPS could mean overlapping passes, missed areas, and significant yield losses.

The irony wasn't lost on me - here we were, using the most advanced farming technology available, brought to a standstill by a magnetic storm from our nearest star. Our great-grandfathers farmed with horses and intuition; we farm with satellites and algorithms, yet we're both subject to the whims of space weather.

By evening, as the geomagnetic storm subsided and GPS accuracy returned, I reflected on how intimately connected our modern farming is to the cosmos. The same Sun that powers photosynthesis in our crops can disrupt the very technology we depend on to harvest them efficiently.

Tomorrow, we'll be back in the fields, guided by satellites orbiting 20,000 kilometers above us, hoping the space weather remains calm.`,
    educationalFacts: [
      'Modern farming relies heavily on GPS technology for precision agriculture',
      'GPS accuracy can degrade from 2cm to several meters during geomagnetic storms',
      'Coronal mass ejections take 1-3 days to travel from Sun to Earth',
      'G4 geomagnetic storms can significantly disrupt precision farming operations',
      'Variable-rate application systems require precise GPS coordinates to function properly',
      'Space weather affects the ionosphere, which GPS signals must pass through',
      'Agricultural timing is critical - delays can affect crop quality and profits'
    ],
    character: 'farmer',
    mood: 'seasonal_storyteller',
    ageGroup: '14-17',
    storySize: 'long',
    eventType: 'cme'
  },
  {
    id: 'power_grid_operator-historical-11-13-medium-geomagnetic_storm',
    title: 'The Night the Grid Fought Back',
    story: `I'm Ibrahim Ilham, and I work at the regional power control center. Tonight, we're facing something that only happens once in a decade - a G5 extreme geomagnetic storm, just like the one that blacked out Quebec in 1989.

At 11 PM, my computer screens lit up with alarms. "Geomagnetically Induced Currents detected on transmission lines," the system announced. When space weather hits Earth's magnetic field, it creates electrical currents in the ground that can flow through our power lines like unwanted electricity.

"All hands on deck!" called our supervisor, Maria. "This storm is registering the same intensity as the 1989 Quebec event." That storm had knocked out power for 6 million people for 9 hours. We couldn't let that happen again.

I watched as transformers across three states started overheating. These massive machines, each worth millions of dollars, were struggling against currents they weren't designed to handle. We had to make quick decisions - shut down transmission lines to protect equipment, or risk permanent damage.

"Ibrahim, we're getting reports of aurora as far south as Texas!" my colleague shouted. When aurora appear that far south, you know the storm is historic.

Working together, our team manually rerouted power around the most affected lines. We disconnected vulnerable transformers and activated backup systems. It was like playing chess with the universe - every move had to be calculated perfectly.

By dawn, we had successfully protected our grid. Some areas experienced brief outages, but we prevented the catastrophic blackout that happened in 1989. The Quebec incident taught the power industry valuable lessons about space weather preparedness.

As the Sun rose, painting the sky in natural colors that rivaled the artificial aurora from the night before, I felt proud. We had kept the lights on against one of nature's most powerful forces.`,
    educationalFacts: [
      'The 1989 Quebec blackout affected 6 million people for 9 hours',
      'Geomagnetically Induced Currents can flow through power lines during storms',
      'G5 geomagnetic storms are the most severe category of space weather',
      'Transformers can be permanently damaged by space weather if not protected',
      'Aurora appearing far south indicates an extremely powerful geomagnetic storm',
      'Power grid operators can manually reroute electricity to protect equipment',
      'Modern power grids have better space weather protection than in 1989'
    ],
    character: 'power_grid_operator',
    mood: 'historical_events',
    ageGroup: '11-13',
    storySize: 'medium',
    eventType: 'geomagnetic_storm'
  },
  {
    id: 'aurora_hunter-regional-8-10-short-aurora',
    title: 'Saad\'s Magical Light Show',
    story: `Hi! I'm Saad, and I love taking pictures of the Northern Lights in Canada!

Tonight was super special because the weather forecasters said we might see aurora lights much further south than usual. I packed my camera and drove to my favorite dark spot outside the city.

At first, the sky looked normal with just stars twinkling. Then around 10 PM, I saw a faint green glow on the northern horizon. "Yes!" I whispered excitedly.

Slowly, the green glow grew brighter and started dancing! It looked like nature was painting the sky with glowing brushes. Then pink and purple colors joined the green, creating the most beautiful light show I'd ever seen.

I took lots of pictures, but they couldn't capture how magical it felt to see the lights dancing above me. The aurora made soft crackling sounds, like quiet fireworks in the sky.

"This is what happens when the Sun sends energy to Earth," I said to myself. "The energy hits Earth's invisible shield and makes these incredible lights!"

Other photographers arrived and we all watched together in wonder. Even though I've seen aurora many times, each show is different and amazing.

The lights danced for two hours before fading away. I drove home with a huge smile, knowing I had witnessed one of nature's most beautiful shows!`,
    educationalFacts: [
      'Aurora lights are created when energy from the Sun hits Earth\'s magnetic field',
      'The lights can make soft crackling or whistling sounds',
      'Aurora colors depend on which gases in the atmosphere get energized',
      'Green is the most common aurora color, made by oxygen gas',
      'During strong storms, aurora can be seen much further south than usual'
    ],
    character: 'aurora_hunter',
    mood: 'regional_focus',
    ageGroup: '8-10',
    storySize: 'short',
    eventType: 'aurora'
  },
  {
    id: 'radio_operator-careerday-14-17-medium-radio_blackout',
    title: 'Emergency Communications During Solar Chaos',
    story: `This is Arman Khan, emergency communications coordinator for the Red Cross disaster response team. Today, a powerful X9.3 solar flare has created a complete HF radio blackout across the entire sunlit side of Earth, and we're dealing with the communication challenges it presents.

At 14:42 UTC, I was coordinating relief efforts for flood victims in remote areas of northern Pakistan when our primary HF radio systems went silent. The solar flare had ionized the D-layer of the ionosphere so intensely that it was absorbing all our high-frequency radio signals instead of reflecting them back to Earth.

"Arman, we've lost contact with teams Alpha through Delta," reported my colleague Fatima from our regional command center. Four disaster relief teams, each helping dozens of flood victims in areas with no cell phone coverage, were now completely cut off from coordination.

As a licensed amateur radio operator with 15 years of experience, I knew exactly what was happening. Solar X-rays from the flare were stripping electrons from atmospheric molecules 60-90 kilometers above us, creating a radio-absorbing layer that typically lasts 1-3 hours during major events.

"Switch to VHF repeaters and satellite phone backups," I instructed the team. Unlike HF signals that bounce off the ionosphere, VHF signals travel in straight lines and aren't affected by ionospheric disturbances. Our emergency protocols, developed specifically for space weather events, were now proving their worth.

Within 30 minutes, we had re-established contact using alternative communication methods. The satellite phones worked perfectly, and our VHF networks filled the gaps for regional coordination.

By 17:00 UTC, as the solar X-ray flux decreased and the D-layer absorption weakened, our HF communications gradually returned. This event reminded me why emergency communicators must understand space weather - when disasters strike remote areas, we're often the only link between rescue teams and coordination centers.

Tonight, I'll be updating our emergency protocols based on today's experience, ensuring we're ready for the next time the Sun decides to disrupt our communications.`,
    educationalFacts: [
      'Solar X-rays ionize the D-layer of the ionosphere during radio blackouts',
      'HF radio signals are absorbed instead of reflected during blackouts',
      'Radio blackouts affect the entire sunlit side of Earth simultaneously',
      'VHF and satellite communications are not affected by ionospheric disturbances',
      'X9.3 flares are among the most powerful solar events ever recorded',
      'Emergency services maintain multiple communication backup systems',
      'Radio blackouts typically last 1-3 hours depending on flare intensity'
    ],
    character: 'radio_operator',
    mood: 'career_day',
    ageGroup: '14-17',
    storySize: 'medium',
    eventType: 'radio_blackout'
  },
  {
    id: 'astronaut-technology-timeline-11-13-long-cme',
    title: 'Space Weather Through the Ages',
    story: `I'm Sumaiya Subha, and today I want to take you on a journey through time to see how the same space weather event - a massive coronal mass ejection - would have affected people in different eras.

Let's start in 1859, during the famous Carrington Event. Richard Carrington, an English astronomer, was observing the Sun when he witnessed the first recorded solar flare. Telegraph operators worldwide reported their systems going haywire - sparks flying from equipment, telegraph wires glowing red-hot, and some operators receiving electric shocks.

In one amazing case, telegraph operators in Boston could disconnect their power sources and still send messages using only the electricity induced by the geomagnetic storm! The aurora was so bright that people could read newspapers by its light as far south as the Caribbean.

Fast forward to 1921, when the "New York Railroad Storm" hit. By then, we had telephone networks, early radio communications, and electric power grids. The same intensity CME that affected only telegraphs in 1859 now disrupted telephone service across the eastern United States, caused fires in telephone exchanges, and knocked out radio stations.

In 1989, the Quebec blackout showed how vulnerable our modern power grids had become. A G4 geomagnetic storm collapsed the entire Quebec power grid in 90 seconds, leaving 6 million people without electricity for 9 hours. The same storm damaged transformers across North America and forced the shutdown of the Toronto Stock Exchange.

Now imagine if that same 1859-level event happened today in 2025. Our GPS satellites would experience significant errors, affecting everything from smartphone navigation to precision farming. The internet backbone could be disrupted through damage to submarine cables and satellite links. Aircraft would be rerouted away from polar regions, and astronauts like me would have to take shelter for days.

Credit card transactions might fail, ATMs could go offline, and the just-in-time delivery systems that keep our stores stocked would struggle with GPS-dependent logistics. Even our cars' keyless entry systems and garage door openers could malfunction.

But here's the amazing part - we're better prepared now than ever before! Modern spacecraft monitor the Sun 24/7, giving us early warning. Power companies can shut down vulnerable equipment, airlines can reroute flights, and we astronauts have radiation-shielded safe havens.

The same cosmic event that once made telegraph keys dance now challenges our most sophisticated technology, but it also drives us to build more resilient systems and better understand our place in the cosmic neighborhood.`,
    educationalFacts: [
      'The 1859 Carrington Event was the most powerful geomagnetic storm in recorded history',
      'Telegraph operators could send messages using only storm-induced electricity',
      'The same space weather affects different technologies depending on the era',
      'Modern power grids are more vulnerable but also better protected than in the past',
      'GPS satellites are particularly susceptible to space weather effects',
      'Early warning systems help us prepare for space weather events',
      'Each major storm teaches us to build more resilient technology'
    ],
    character: 'astronaut',
    mood: 'technology_timeline',
    ageGroup: '11-13',
    storySize: 'long',
    eventType: 'cme'
  },
  {
    id: 'pilot-custom-scenario-8-10-short-solar_flare',
    title: 'Flying Through Solar Sparks',
    story: `Hi! I'm Captain Tanvir, and today I'm flying my airplane through something really cool - a solar flare!

This morning, the Sun shot out a big burst of energy called a solar flare. It's like when you blow up a balloon and let it go - WHOOSH! - except the Sun is sending energy through space.

While flying over Canada, my airplane's radio started making funny crackling sounds. "This is air traffic control," the voice said through the static. "There's a solar flare affecting radio signals."

My GPS screen showed we were flying in different places than where we really were! But don't worry - I have lots of backup systems to keep us safe. Pilots train for this!

I looked out the window and saw something amazing - green and purple lights dancing in the sky during the daytime! "Ladies and gentlemen," I announced to the passengers, "you're seeing a very rare daytime aurora caused by the solar flare!"

The kids on the plane pressed their faces to the windows in excitement. Even though the solar flare made our instruments act silly, it gave everyone an incredible light show they'll never forget.

We landed safely using our backup navigation tools. Solar flares remind us that we live in an amazing universe full of surprises!`,
    educationalFacts: [
      'Solar flares can make airplane radios sound scratchy and unclear',
      'GPS can show wrong locations during solar flares',
      'Very strong solar flares can create daytime auroras that we can see',
      'Pilots have many backup systems to stay safe during space weather',
      'Airplanes flying over the North Pole are most affected by solar flares'
    ],
    character: 'pilot',
    mood: 'custom_scenario',
    ageGroup: '8-10',
    storySize: 'short',
    eventType: 'solar_flare'
  },
  {
    id: 'power_grid_operator-extreme-storm-14-17-long-geomagnetic_storm',
    title: 'Grid Defense: G5 Storm Protocol',
    story: `This is Ibrahim Ilham, senior grid operator at the Central Power Authority. At 22:35 local time, we received the alert that would test every protocol we've developed over the past decade: an incoming G5 extreme geomagnetic storm - the most severe classification possible.

Our space weather monitoring systems, installed after the 2003 Halloween storms, showed a massive coronal mass ejection with embedded magnetic field structures that had erupted from the Sun 42 hours ago. Traveling at nearly 2,000 km/s, this plasma cloud was about to collide with Earth's magnetosphere with the intensity of the 1859 Carrington Event.

"Initiate Storm Protocol Alpha," I commanded as our control room transformed into a nerve center of coordinated activity. Banks of monitors displayed real-time telemetry from over 500 substations across our grid territory. The Geomagnetically Induced Current (GIC) sensors we'd installed on key transmission lines were already detecting the early signatures of the approaching storm.

At 23:12, the storm's shock front hit. Immediately, our high-voltage transmission lines began experiencing induced currents that our transformers were never designed to handle. The 765kV line connecting our northern wind farms showed GIC levels exceeding 200 amperes - far beyond safe operating limits.

"Transformer T-47 is overheating rapidly," called out Maria from the thermal monitoring station. "Core temperature rising through yellow zone." On the display, I watched the thermal profile of the massive 400-MVA transformer shift from green to amber to red. These units, worth $15 million each and requiring 18 months to replace, represent critical infrastructure we cannot afford to lose.

The decision matrix was clear but painful. "Trip lines L-23 through L-31," I ordered. "Isolate the northern transmission corridor." With those words, we deliberately blacked out 150,000 customers to save equipment that serves 2 million people.

Our load dispatch center worked frantically to reroute power through southern transmission paths, but those lines were approaching their thermal limits as well. "We're seeing voltage instability on the 345kV southern ring," reported the system operator. The cascade failure scenario we'd drilled for was materializing in real time.

At 23:47, reports came in of aurora visible as far south as Atlanta - a sure sign that we were experiencing a once-in-a-century event. Our neighboring utilities in Quebec and Ontario were implementing similar protective measures, creating a coordinated defense across the entire continental grid.

Throughout the night, we played a complex game of electrical chess with the storm. When GIC levels spiked, we shed load and tripped lines. When they subsided, we restored service as quickly as possible. Our automated protection systems, programmed with algorithms developed by space weather researchers, made split-second decisions that human operators couldn't match.

By 04:30, as the storm's main phase subsided, we began the delicate process of restoration. Transformers that had been offline needed thermal cycling procedures. Lines had to be inspected for damage. Emergency generators that had carried critical loads needed refueling.

The final tally: 320,000 customer-hours of outages - significant, but a fraction of the 30 million customer-hours lost during comparable storms in the past. Our investment in space weather resilience had paid off.

As dawn broke, painting the sky in colors that seemed mundane after the cosmic light show we'd witnessed, I reflected on the night's events. We had successfully defended our grid against one of nature's most powerful forces, but the experience reminded me that we live in a connected universe where events on the Sun can threaten the foundation of modern civilization.

The next G5 storm might be decades away, but we'll be ready.`,
    educationalFacts: [
      'G5 geomagnetic storms occur only during the most extreme space weather events',
      'Geomagnetically Induced Currents can exceed 200 amperes in transmission lines',
      'Power transformers cost millions of dollars and take over a year to replace',
      'Grid operators may deliberately cause blackouts to prevent equipment damage',
      'The 1859 Carrington Event would cause trillions in damage to modern power grids',
      'Automated protection systems can react faster than human operators',
      'Aurora visible at low latitudes indicates extreme geomagnetic activity',
      'Modern grids have coordinated defense strategies across multiple utilities'
    ],
    character: 'power_grid_operator',
    mood: 'extreme_storm',
    ageGroup: '14-17',
    storySize: 'long',
    eventType: 'geomagnetic_storm'
  },
  // FARMER STORIES - more variations
  {
    id: 'farmer-realtime-8-10-short-solar_flare',
    title: 'GPS Goes Silly on the Farm',
    story: `Hi! I'm Wasif, and I'm a farmer who uses really cool technology on my farm!

Today I was driving my big green tractor that has a special GPS system. It's like a super-smart computer that tells the tractor exactly where to go so I can plant seeds in perfect rows.

But this morning, something funny happened! The Sun sent out a solar flare - like a big sneeze of energy - and it made my tractor's GPS go all silly!

My GPS screen showed my tractor was in the middle of the lake when I was really in my cornfield! "That's not right!" I laughed. The solar flare was confusing the satellites up in space that help my GPS work.

I had to drive the tractor the old-fashioned way, just like my grandfather did. But that's okay - farmers are good at solving problems!

By afternoon, when the solar flare calmed down, my GPS started working perfectly again. The satellites got un-confused and could talk to my tractor properly.

It's amazing how space weather can affect farming! The same Sun that helps my crops grow can also play tricks on my technology!`,
    educationalFacts: [
      'Farm tractors use GPS to plant seeds in straight, perfect rows',
      'Solar flares can confuse GPS satellites and make them give wrong locations',
      'Farmers have been solving problems for thousands of years',
      'The Sun helps crops grow but can also affect farm technology',
      'GPS systems usually work perfectly when space weather is calm'
    ],
    character: 'farmer',
    mood: 'real_time',
    ageGroup: '8-10',
    storySize: 'short',
    eventType: 'solar_flare'
  },
  {
    id: 'farmer-careerday-11-13-medium-geomagnetic_storm',
    title: 'Modern Farming Meets Space Weather',
    story: `I'm Wasif Ahmad, and I want to show you how modern farming depends on space technology - and what happens when space weather interferes!

As a precision agriculture specialist, I manage 1,500 acres using GPS-guided equipment. Every morning, I check space weather forecasts just like I check regular weather, because solar storms can affect my farming operations.

Today, a G3 geomagnetic storm hit during our planting season. When I started up our John Deere planter, the GPS accuracy dropped from its usual 2-centimeter precision to over 5 meters of error. That might not sound like much, but in precision farming, it's the difference between perfect seed spacing and a ruined field.

"Dad, the spreader is applying fertilizer in the wrong places," my son called from our secondary field. Our variable-rate fertilizer system relies on precise GPS coordinates matched to soil nutrient maps. Without accurate positioning, we were wasting expensive fertilizer and potentially harming crop yields.

I made the decision to pause planting until the storm passed. In farming, timing is crucial - every day counts during planting season. But working with degraded GPS could cost us more in the long run through uneven planting, wasted inputs, and reduced yields.

While waiting, I showed my farm crew how space weather affects our ionosphere - the layer of atmosphere that GPS signals travel through. During geomagnetic storms, this layer becomes turbulent, causing signal delays and positioning errors.

By evening, as the storm subsided, our GPS systems returned to centimeter-level accuracy. We worked late into the night to catch up on lost time, our tractors guided by satellites 20,000 kilometers above us.

Modern farming isn't just about soil and seeds anymore - we're connected to space in ways our ancestors never imagined!`,
    educationalFacts: [
      'Precision farming requires GPS accuracy within 2 centimeters',
      'Geomagnetic storms can reduce GPS accuracy to several meters',
      'Variable-rate systems apply fertilizers based on precise location data',
      'Farmers now check space weather forecasts as part of daily planning',
      'GPS signals travel through the ionosphere, which becomes turbulent during storms',
      'Modern tractors can automatically steer themselves using GPS guidance',
      'Timing is critical in farming - delays can significantly impact crop yields'
    ],
    character: 'farmer',
    mood: 'career_day',
    ageGroup: '11-13',
    storySize: 'medium',
    eventType: 'geomagnetic_storm'
  },
  // AURORA HUNTER STORIES - more variations
  {
    id: 'aurora_hunter-extremestorm-11-13-medium-aurora',
    title: 'The Aurora Storm of a Lifetime',
    story: `I'm Saad Wasit, aurora photographer from Yellowknife, Canada, and tonight I witnessed something I've been chasing for 20 years - a G5 extreme geomagnetic storm creating aurora like I've never seen before.

The space weather forecast had been warning of an incoming coronal mass ejection for three days. When the storm finally hit Earth's magnetosphere at 21:30 local time, I was ready with my camera setup 50 kilometers north of the city.

At first, the aurora appeared as a typical green arc low on the northern horizon. But as the storm intensified, something extraordinary happened. The entire sky erupted in color - not just green, but brilliant reds, purples, and blues dancing from horizon to horizon.

"This is unreal," I whispered, adjusting my camera settings for the 10th time. The aurora was so bright I could actually see it reflecting off the snow-covered landscape. Normally, aurora photography requires long exposures, but tonight the lights were bright enough to capture with standard settings.

The aurora began moving in ways I'd never seen - rapid pillars of light shooting straight up like searchlights, then dissolving into spiraling curtains that seemed to breathe with the Earth's magnetic field. Corona aurora appeared directly overhead, creating the illusion of all the lights converging at a single point above me.

My camera's memory cards filled up quickly as I tried to capture every moment. Social media exploded with aurora photos from as far south as Colorado and Virginia - places that typically never see northern lights.

Around 2 AM, the storm reached its peak intensity. The aurora filled the entire sky with such brilliance that I could read my camera manual without a flashlight. For fifteen incredible minutes, I felt like I was standing inside a cosmic cathedral of light.

As dawn approached and the storm began to weaken, I reviewed hundreds of photos and videos. But no camera could capture the emotional impact of witnessing Earth's magnetic field made visible on such a spectacular scale.

This G5 storm reminded me why I chase aurora - to witness the invisible forces that connect our planet to the cosmos and to share that wonder with others through my photography.`,
    educationalFacts: [
      'G5 geomagnetic storms can create aurora visible as far south as Florida',
      'Extreme aurora can be bright enough to photograph without long exposures',
      'Corona aurora appear directly overhead, creating a point-source effect',
      'Different aurora colors come from different atmospheric gases being energized',
      'Coronal mass ejections take 1-3 days to travel from Sun to Earth',
      'Aurora activity peaks around magnetic midnight, typically 10 PM to 2 AM',
      'Extreme storms can make aurora bright enough to read by'
    ],
    character: 'aurora_hunter',
    mood: 'extreme_storm',
    ageGroup: '11-13',
    storySize: 'medium',
    eventType: 'aurora'
  },
  // RADIO OPERATOR STORIES - more variations
  {
    id: 'radio_operator-realtime-8-10-short-radio_blackout',
    title: 'When the Radio Went Quiet',
    story: `Hi! I'm Arman, and I'm a ham radio operator. That means I use special radios to talk to people all around the world!

Today was really exciting because I was trying to talk to my friend Sarah in Australia using my radio. But suddenly, my radio went completely quiet - no voices, no beeps, nothing!

"What happened?" I wondered. Then I checked my space weather app and saw a big solar flare had just happened! Solar flares are like the Sun throwing energy at Earth, and sometimes this energy makes radio waves disappear.

The solar flare made the air high above us act like a big sponge that soaks up radio signals instead of letting them bounce around the world. It's like trying to play catch, but someone puts up a net that catches all the balls!

I called my mom on the regular phone and said, "The Sun is blocking my radio today!" She laughed and said I could try again later when the solar flare calmed down.

Sure enough, after two hours, my radio started working again! I was able to talk to Sarah in Australia and tell her all about how space weather had blocked our conversation earlier.

Space weather is so cool - it can make radios go quiet, but it's just the Sun reminding us how powerful it is!`,
    educationalFacts: [
      'Ham radio operators can talk to people all around the world',
      'Solar flares can make radio waves disappear for a few hours',
      'The high atmosphere acts like a sponge during radio blackouts',
      'Radio blackouts happen on the sunny side of Earth',
      'Regular phones and cell phones work differently than ham radios'
    ],
    character: 'radio_operator',
    mood: 'real_time',
    ageGroup: '8-10',
    storySize: 'short',
    eventType: 'radio_blackout'
  },
  // PILOT STORIES - more variations
  {
    id: 'pilot-historical-11-13-medium-cme',
    title: 'Flying Through the Halloween Storms',
    story: `I'm Captain Tanvir Rahman, and I want to tell you about one of the most challenging flights of my career - navigating through the famous Halloween Storms of 2003, a series of powerful solar events that disrupted aviation worldwide.

On October 30, 2003, I was piloting Flight 447 from London to New York when space weather forecasters issued urgent warnings about an incoming G5 geomagnetic storm. A massive coronal mass ejection had erupted from the Sun and was about to collide with Earth's magnetic field.

As we flew over the North Atlantic, our first indication of trouble came from air traffic control: "All flights, be advised we're experiencing GPS anomalies due to space weather. Maintain visual separation and prepare for potential communication disruptions."

Suddenly, our primary GPS system began showing position errors of several kilometers. On a transatlantic flight, precise navigation is crucial - we depend on GPS to follow specific flight paths over the ocean where there are no ground-based navigation aids.

"Captain, we're receiving reports of radio blackouts affecting emergency frequencies," my co-pilot informed me. Solar X-rays from the Halloween flares were ionizing the upper atmosphere so intensely that high-frequency radio communications were being absorbed rather than transmitted.

The most dramatic moment came when we witnessed something extraordinary through the cockpit windows - aurora borealis visible during our daytime flight! The geomagnetic storm was so powerful that it created visible aurora at our cruising altitude of 37,000 feet.

We switched to backup navigation systems and alternative communication frequencies. Our flight management computer had to be manually updated with position fixes from ground control stations that could still communicate via satellite links.

The Halloween Storms affected hundreds of flights worldwide, forcing some to turn back and others to take longer routes away from the polar regions where space weather effects are strongest. Satellites were damaged, power grids fluctuated, and GPS accuracy was degraded for days.

Despite the challenges, we landed safely at JFK Airport, though 45 minutes behind schedule. The Halloween Storms taught the aviation industry valuable lessons about space weather preparedness and led to improved forecasting systems that help pilots like me navigate safely during solar events.

That night, as I looked up at the aurora still dancing across the sky over New York, I was reminded that we pilots don't just navigate through Earth's atmosphere - we're also voyagers through the solar system, subject to the whims of our nearest star.`,
    educationalFacts: [
      'The 2003 Halloween Storms were among the most powerful solar events in modern history',
      'GPS errors during space weather can be several kilometers off actual position',
      'Pilots can sometimes see aurora during daytime flights over polar regions',
      'Aviation industry improved space weather monitoring after the 2003 events',
      'Polar flight routes are most affected by space weather disruptions',
      'Radio blackouts can last for hours during major solar flares',
      'Backup navigation systems are essential during space weather events'
    ],
    character: 'pilot',
    mood: 'historical_events',
    ageGroup: '11-13',
    storySize: 'medium',
    eventType: 'cme'
  }
];

// Helper function to get fallback story based on parameters
export function getFallbackStory(
  character: string,
  mood: string,
  ageGroup: '8-10' | '11-13' | '14-17',
  storySize: 'short' | 'medium' | 'long',
  eventType: string
): PreGeneratedStory | null {
  // Try to find exact match first
  let story = preGeneratedStories.find(s => 
    s.character === character &&
    s.mood === mood &&
    s.ageGroup === ageGroup &&
    s.storySize === storySize &&
    s.eventType === eventType
  );

  // If no exact match, try to find close match with same character and age group
  if (!story) {
    story = preGeneratedStories.find(s => 
      s.character === character &&
      s.ageGroup === ageGroup &&
      s.eventType === eventType
    );
  }

  // If still no match, find any story with same character and age group
  if (!story) {
    story = preGeneratedStories.find(s => 
      s.character === character &&
      s.ageGroup === ageGroup
    );
  }

  // Last resort: any story with same character
  if (!story) {
    story = preGeneratedStories.find(s => s.character === character);
  }

  return story || null;
}

// Generate engaging AI trouble message
export function getAITroubleMessage(): { title: string; message: string; emoji: string } {
  const messages = [
    {
      title: "🌟 Our AI Storyteller is Taking a Cosmic Break! 🌟",
      message: "Our AI is currently getting overwhelmed by all the amazing space weather happening right now! ✨ While our digital storyteller catches its breath among the stars, we've prepared some fantastic pre-written stories just for you! 🚀 These stories are crafted with the same care and wonder - so dive in and explore the cosmos! Try again later when our AI has recharged its cosmic batteries! 🌌",
      emoji: "🌟"
    },
    {
      title: "🛸 AI Storyteller Lost in Space! 🛸",
      message: "Houston, we have a situation! 🚨 Our AI storyteller seems to have gotten distracted by a beautiful aurora and wandered off into the digital cosmos! 😄 Don't worry though - we've got you covered with these amazing pre-generated space adventures! 🌈 Each story is packed with the same scientific wonder and excitement! Our AI will return from its cosmic journey soon! 🔄",
      emoji: "🛸"
    },
    {
      title: "⚡ Solar Flare Disrupted Our AI! ⚡",
      message: "Looks like a solar flare just scrambled our AI's circuits! 🌞💥 But hey, that's what makes space weather so exciting - it affects everything, even our storytelling robots! 🤖 Lucky for you, we've prepared these stellar backup stories that are just as amazing! 🌟 Sit back, enjoy these cosmic tales, and check back later when our AI has recovered from its space weather adventure! 🔄✨",
      emoji: "⚡"
    }
  ];

  return messages[Math.floor(Math.random() * messages.length)];
}
