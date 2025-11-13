TITLE = "Interogation Room DEFAULT";
CAST = "<b>Cast:</b> Detective • Suspect";
QUESTIONS=["A male name","Favorite teacher name","A number","Plural object","Store name","Body part","Name of a holiday","Movie title","Amount of distance","Country (funny)"];
TEMPLATE_LINES=[{speaker:"Detective",text:"Hello, I'm detective [#1], and you are?"},{speaker:"Suspect",text:"[#2]"},{speaker:"Detective",text:"You are here today under suspicion of second degree robbery."},{speaker:"Suspect",text:"\"Crumbs\"",stage:true},{speaker:"Detective",text:"That's right! [#3] [#4] were stolen from [#5]"},{speaker:"Detective",text:"And the crime scene has your [#6] written all over it."},{speaker:"Detective",text:"Where were you on the night of [#7]"},{speaker:"Suspect",text:"We were watching [#8]"},{speaker:"Detective",text:"Then why did the security camera footage show you gyrating [#9] away from the crime scene?"},{speaker:"Suspect",text:"\"SHRUGS\"",stage:true},{speaker:"Detective",text:"{ANGRY} I'm done playing games! Where are you from?"},{speaker:"Suspect",text:"[#10]"}];
SAMPLES=["Rob","Mrs. Doubtfire","9486","eggs","Marks & Spencer","buttocks","Haloween","How to rob a bank","3mm","Ukraine"];
// =================== DATA GENERATION ===================

const SCRIPT_TITLES = [
  "Interrogation Room",
  "The Suspicious Package",
  "The Doctor’s Office Freak-Out",
  "Restaurant From Hell",
  "Alien Abduction Interview",
  "The Bad Detective",
  "Airport Security Nightmare",
  "Royal Tea Disaster",
  "The Haunted House Tour",
  "Tech Support Meltdown",
  "Time Travel Troubles",
  "The Overcooked Proposal",
  "Lost Tourist Hotline",
  "The Office Espresso Machine",
  "The Dragon Hotel Reception",
  "Cursed Restaurant Review",
  "The Magical Customer Support",
  "The Wedding Planner Meltdown",
  "The Interview from Another Planet",
  "Haunted Karaoke Night",
  "The Apocalypse Meeting"
];

// 2️⃣ Function to populate dropdown
function populateDropdown() {
  const select = document.getElementById("scriptSelect");
  select.innerHTML = ""; // Clear previous options if any

  SCRIPT_TITLES.forEach((title, index) => {
    const option = document.createElement("option");
    option.value = index + 1; // Option numbering starts at 1
    option.textContent = title;
    if (index === 0) option.selected = true; // Default selection
    select.appendChild(option);
  });

  // Add onchange handler
  select.addEventListener("change", () => handleSelection(select.value));
}

// 3️⃣ Example function to handle selection
function handleSelection(value) {
  console.log(`Script #${value}: ${SCRIPT_TITLES[value - 1]}`);
  // Here you can load your QUESTIONS, TEMPLATE_LINES, etc.
}

function getData(scriptId) {
    switch (scriptId) {
        case 1:
            TITLE = "Interogation Room";
            CAST = "<b>Cast:</b> Detective • Suspect";
            QUESTIONS=["A male name","Favorite teacher name","A number","Plural object","Store name","Body part","Name of a holiday","Movie title","Amount of distance","Country (funny)"];
            TEMPLATE_LINES=[{speaker:"Detective",text:"Hello, I'm detective [#1], and you are?"},{speaker:"Suspect",text:"[#2]"},{speaker:"Detective",text:"You are here today under suspicion of second degree robbery."},{speaker:"Suspect",text:"\"Crumbs\"",stage:true},{speaker:"Detective",text:"That's right! [#3] [#4] were stolen from [#5]"},{speaker:"Detective",text:"And the crime scene has your [#6] written all over it."},{speaker:"Detective",text:"Where were you on the night of [#7]"},{speaker:"Suspect",text:"We were watching [#8]"},{speaker:"Detective",text:"Then why did the security camera footage show you gyrating [#9] away from the crime scene?"},{speaker:"Suspect",text:"\"SHRUGS\"",stage:true},{speaker:"Detective",text:"{ANGRY} I'm done playing games! Where are you from?"},{speaker:"Suspect",text:"[#10]"}];
            SAMPLES=["Rob","Mrs. Doubtfire","9486","eggs","Marks & Spencer","buttocks","Haloween","How to rob a bank","3mm","Ukraine"];
            break;
        case 2:
            TITLE = "The Suspicious Package";
            CAST = "<b>Cast:</b> Agent Biscuit • Agent Flamingo • Delivery";
            QUESTIONS = ["Favorite movie","Favorite snack","A weird sound (1 word)","A celebrity","A teacher’s first name","Random object you can hold","A brand you love","A body part","A famous place","A smell you hate"];
            TEMPLATE_LINES = [{speaker:"A", text:"This package says \"CONFIDENTIAL: Operation [#1].\""},{speaker:"B", text:"Open it, but be careful—it smells like [#10] already."},{speaker:"A", text:"(makes weird sound [#3]): IT’S A TRAP!", stage:true},{speaker:"B", text:"Look, inside—just a single [#6], signed by [#4]!"},{speaker:"A", text:"We must take this to [#9], before the government bans [#2] again."},{speaker:"B", text:"I’ll contact Agent [#5]."},{speaker:"Delivery", text:"(hands invoice): That’ll be 9 million dollars, payable in [#7] gift cards.", stage:true},{speaker:"A", text:"Quick! Distract them with your [#8]!"},{speaker:"_", text:"(Chaos ensues, exit dramatically)", stage:true}];
            SAMPLES = ["Inception","Chips","boing","Keanu Reeves","Ms. Lana","rubber duck","Nike","elbow","Paris","onions"];
            break;
        case 3:
            TITLE = "The Doctor’s Office Freak-Out";
            CAST = "<b>Cast:</b> Doctor • Patient • Nurse (optional)";
            QUESTIONS=["Something slimy","Animal sound","Body part (funny)","A school subject","A random object","A celebrity","A cartoon character","A dessert","A color (crazy)","A weird hobby (1-2 words)"];
            TEMPLATE_LINES=[{speaker:"Doctor",text:"So, your test results show… you’re allergic to [#8]."},{speaker:"Patient",text:"But I LOVE [#8]."},{speaker:"Doctor",text:"It gets worse. Your [#3] is growing a second [#3]."},{speaker:"Patient",text:"([#2]) NOOO!",stage:true},{speaker:"Nurse",text:"Doctor, their [#5] is vibrating again."},{speaker:"Doctor",text:"Patient, have you been studying [#4] while doing [#10]?"},{speaker:"Patient",text:"Only on weekends…"},{speaker:"Doctor",text:"We must call [#6] and [#7], the finest specialists in [#9] medicine."},{speaker:"Patient",text:"Will I survive?"},{speaker:"Doctor",text:"Only if you stop touching [#1]."}];
            SAMPLES=["slime","moo","elbow","math","toaster","Taylor Swift","SpongeBob","cheesecake","neon","extreme ironing"];
            break;
        case 4:
            TITLE = "Restaurant From Hell";
            CAST = "<b>Cast:</b> Server • Customer • Manager (optional)";
            QUESTIONS = ["A dish you hate","A pet name","A random ingredient","A drink","A celebrity chef","A kitchen object","A random emotion (1 word)","A weird adjective","A famous city","Sound effect (1 word)"];
            TEMPLATE_LINES = [{speaker:"Customer",text:"Excuse me, I ordered spaghetti. Why does this taste like [#1]?"},{speaker:"Server",text:"That’s the chef’s special recipe—he learned it from [#5]."},{speaker:"Customer",text:"And why is there [#3] floating in my [#4]?"},{speaker:"Server",text:"It adds… authenticity."},{speaker:"Manager",text:"([#10])",stage:true},{speaker:"Manager",text:"We ran out of forks, you must eat with this [#6]."},{speaker:"Customer",text:"([#7]) This is [#8]!"},{speaker:"Server",text:"Please remain calm, or we’ll relocate you to [#9] seating."},{speaker:"Customer",text:"That’s it. I’m calling my pet [#2]. They’ll handle this."},{speaker:"_",text:"(Everyone dramatically stares at imaginary pet)",stage:true}];
            SAMPLES = ["licorice soup","Pickles","glitter","cola","Gordon Ramsay","spatula","rage","spongy","Tokyo","HONK"];
            break;
        case 5:
            TITLE = "Alien Abduction Interview";
            CAST = "<b>Cast:</b> Alien Zorp • Human Interviewer • Translator (optional)";
            QUESTIONS=["Favorite childhood toy","A gross food","A planet/moon name","A body part","A random verb (1 word)","A weird sound","A favorite smell","A color","A random occupation","A sports team"];
            TEMPLATE_LINES=[{speaker:"Interviewer",text:"Alien Zorp, why have you taken planet Earth hostage?"},{speaker:"Alien",text:"We require [#2]. Lots of it."},{speaker:"Translator",text:"([#6]) This is serious.",stage:true},{speaker:"Alien",text:"On [#3], we use it to repair our [#4]."},{speaker:"Interviewer",text:"How long will this take?"},{speaker:"Alien",text:"Until every human learns to [#5] properly."},{speaker:"Translator",text:"They brought a sample—your [#1]."},{speaker:"Interviewer",text:"That’s my childhood memory!"},{speaker:"Alien",text:"We will trade it for tickets to [#10]."},{speaker:"Translator",text:"Their favorite smell is [#7], and they prefer humans of [#8] color."},{speaker:"Interviewer",text:"I’m a [#9]… does that help?"},{speaker:"Alien",text:"…Yes. Welcome aboard."}];
            SAMPLES=["yo-yo","brussels sprouts","Europa","knee","wiggle","bleep","rain","purple","barista","Lakers"];
            break;
        case 6:
            TITLE = "The Bad Detective";
            CAST = "<b>Cast:</b> Detective • Suspect • Backup Cop";
            QUESTIONS=["A nickname","A random illegal thing (funny)","A household object","A favorite restaurant","A weird body part","A random date (month/day)","A celebrity","A silly verb","A strange noise (1 word)","A vehicle"];
            TEMPLATE_LINES=[{speaker:"Detective",text:"We know you were at [#4] on [#6]."},{speaker:"Suspect",text:"Prove it."},{speaker:"Backup",text:"([#9])",stage:true},{speaker:"Detective",text:"We found your [#5] prints on a [#3]."},{speaker:"Suspect",text:"Everyone touches [#3]!"},{speaker:"Detective",text:"And you were caught [#8] near a [#10]."},{speaker:"Backup",text:"Classic criminal move."},{speaker:"Suspect",text:"But I was with [#7]!"},{speaker:"Detective",text:"Lie again, [#1], and we’ll add [#2] to your charges."},{speaker:"Suspect",text:"…okay fine, it was me."},{speaker:"_",text:"(Detective celebrates awkwardly)",stage:true}];
            SAMPLES=["Noodles","jaywalking a turtle","remote","SushiGo","left toe","04/01","Beyoncé","wiggling","HONK","scooter"];
            break;
        case 7:
            TITLE = "Airport Security Nightmare";
            CAST = "<b>Cast:</b> Security Officer • Passenger • Supervisor (optional)";
            QUESTIONS=["A forbidden object","A favorite snack","A childish insult (1–2 words)","A celebrity","A random country","A silly body part","A weird fear","Something squishy","A ridiculous excuse","A strange sound (1 word)"];
            TEMPLATE_LINES=[{speaker:"Officer",text:"Sir, you can’t bring [#1] through security."},{speaker:"Passenger",text:"But it’s for my [#7] therapy!"},{speaker:"Officer",text:"([#10]) That’s not how therapy works.",stage:true},{speaker:"Supervisor",text:"Why does your bag smell like [#8]?"},{speaker:"Passenger",text:"It’s covered in [#2] crumbs… my bad."},{speaker:"Officer",text:"And why is [#4] hiding inside your jacket?"},{speaker:"Passenger",text:"They needed a ride to [#5]."},{speaker:"Supervisor",text:"Explain the [#6] strapped to your forehead."},{speaker:"Passenger",text:"[#9], I swear!"},{speaker:"Officer",text:"That’s it. You’re banned."},{speaker:"Passenger",text:"[#3]! You can’t ban me!"},{speaker:"Officer",text:"Watch me."}];
            SAMPLES=["watermelon sword","pretzels","poopoo head","Tom Hanks","Iceland","extra elbow","balloons","jelly","doctor’s orders","BZZT"];
            break;
        case 8:
            TITLE = "Royal Tea Disaster";
            CAST = "<b>Cast:</b> Queen/King • Butler • Guest";
            QUESTIONS=["Fancy drink","Embarrassing hobby","A weird adjective","A dessert","A kitchen tool","A celebrity","A random animal","A smell you love","A drama phrase (1–2 words)","A ridiculous law (1 phrase)"];
            TEMPLATE_LINES=[{speaker:"Royal",text:"Welcome to tea. We serve only [#1] here."},{speaker:"Butler",text:"Your Majesty also enjoys [#2] on Sundays."},{speaker:"Royal",text:"SILENCE! Don’t expose my [#3] hobbies."},{speaker:"Guest",text:"This cake tastes like [#7] stepped on [#4]."},{speaker:"Butler",text:"That’s our signature."},{speaker:"Royal",text:"And the aroma of [#8] pairs nicely with fear."},{speaker:"Guest",text:"I’m calling [#6], my lawyer."},{speaker:"Royal",text:"[#9]! You dare?!"},{speaker:"Butler",text:"According to royal law [#10], you must now eat with this [#5]."},{speaker:"Guest",text:"…Help."}];
            SAMPLES=["sparkling oolong","stamp collecting","gloopy","tiramisu","ladle","Lady Gaga","llama","fresh rain","How dare you","No blinking on Thursdays"];
            break;
        case 9:
            TITLE = "The Haunted House Tour";
            CAST = "<b>Cast:</b> Paranormal Guide • Tourist • Ghost (optional)";
            QUESTIONS=["A spooky object","A silly fear","An ex’s first name","A random job","A disgusting food","A weird body part","A creepy noise","A place you dislike","A random holiday","A celebrity"];
            TEMPLATE_LINES=[{speaker:"Guide",text:"Welcome to the Haunted House. Beware the cursed [#1]."},{speaker:"Tourist",text:"I once feared [#2] more than that."},{speaker:"Guide",text:"Legend says [#3] haunts these halls."},{speaker:"Ghost",text:"([#7])",stage:true},{speaker:"Tourist",text:"Sounds like [#5] bubbling."},{speaker:"Guide",text:"We found their [#6] left behind."},{speaker:"Tourist",text:"Gross."},{speaker:"Guide",text:"They worked their entire life as a [#4]… that’s why they’re angry."},{speaker:"Tourist",text:"Honestly, I’d haunt [#8] too."},{speaker:"Ghost",text:"Return on [#9], or face [#10] forever!"},{speaker:"_",text:"(Guide faints)",stage:true}];
            SAMPLES=["porcelain doll","balloons","Alex","tax auditor","fermented fish","elbow","HISSS","the DMV","Halloween","The Rock"];
            break;
        case 10:
            TITLE = "Tech Support Meltdown";
            CAST = "<b>Cast:</b> Tech Support Agent • Customer • Angry Manager (optional)";
            QUESTIONS=["A device brand","A random password","Favorite childhood show","A body part","A ridiculous app name","A celebrity","A weird verb","Something sticky","A weird reaction (1 word)","A fictional place"];
            TEMPLATE_LINES=[{speaker:"Agent",text:"Hello, thanks for calling [#1] support. What seems to be the issue?"},{speaker:"Customer",text:"My phone shows your face instead of mine."},{speaker:"Agent",text:"Did you try entering password: [#2]?"},{speaker:"Customer",text:"([#9]) Of course!",stage:true},{speaker:"Agent",text:"Then reinstall [#5]."},{speaker:"Customer",text:"That app controls my [#4] though."},{speaker:"Agent",text:"That is concerning."},{speaker:"Manager",text:"You installed [#8] into the server again!"},{speaker:"Customer",text:"My favorite show [#3] never did this!"},{speaker:"Agent",text:"I’ll escalate this to [#6] in headquarters [#10]."},{speaker:"Customer",text:"Please hurry, I’m starting to [#7] randomly."}];
            SAMPLES=["Nokia","hunter2","Power Rangers","eyebrow","ZapZap","Bieber","vibrate","honey","gasp","Hogwarts"];
            break;
        case 11:
            TITLE = "Time Travel Troubles";
            CAST = "<b>Cast:</b> Time Traveler • Confused Local • Future Police";
            QUESTIONS=["A year (past or future)","A historical person","A strange invention","A funny dance move","A random weapon","A weird smell","A favorite drink","A curse word substitute","A mythical creature","A body part (funny)"];
            TEMPLATE_LINES=[{speaker:"Traveler",text:"Greetings. I come from the year [#1]."},{speaker:"Local",text:"Why do you smell like [#6] though?"},{speaker:"Traveler",text:"That’s our perfume."},{speaker:"Local",text:"And why is [#2] dancing [#4] behind you?"},{speaker:"Traveler",text:"Ignore them."},{speaker:"Police",text:"Drop the [#3] or we attack with [#5]."},{speaker:"Local",text:"I just wanted [#7]…"},{speaker:"Traveler",text:"([#8]) I’m being hunted!",stage:true},{speaker:"Police",text:"Return the [#10] of the [#9]!"},{speaker:"Local",text:"…That escalated quickly."},{speaker:"Traveler",text:"Quick, jump with me before history gets weird!"}];
            SAMPLES=["2099","Cleopatra","self-toasting shoes","flossing","rubber chicken","petrol","Thai tea","cheese and rice","dragon","earlobe"];
            break;
        case 12:
            // SCRIPT #11 — “The Overcooked Proposal”
            TITLE = "The Overcooked Proposal";
            CAST = "<b>Cast:</b> Chef • Sous Chef • Restaurant Guest / Narrator (optional)";
            QUESTIONS = ["A romantic place","A food that burns easily","A kitchen tool","A weird emotion","A celebrity chef","A random animal","A love song","A drink","An embarrassing nickname","An object you’d kneel with"];
            TEMPLATE_LINES = [{speaker:"Chef", text:"Tonight, we cook for love — at the glorious [#1]."},{speaker:"Sous", text:"But the [#2] is on fire again!"},{speaker:"Chef", text:"Quick, hand me the [#3]!"},{speaker:"Sous", text:"You look [#4], Chef."},{speaker:"Chef", text:"That’s because [#5] once told me: never cry over burnt [#2]."},{speaker:"Sous", text:"A [#6] just stole the dessert!"},{speaker:"Chef", text:"Play [#7]! It calms the flames."},{speaker:"Sous", text:"Would you like some [#8] before your confession?"},{speaker:"Chef", text:"My dear [#9], will you accept this [#10]?"},{speaker:"Sous", text:"(swoons dramatically)"}];
            SAMPLES = ["Paris","soufflé","spatula","anxiously","Gordon Ramsay","cat","Perfect","champagne","Biscuit","spoon"];
            break;
        case 13:
            // SCRIPT #12 — “Lost Tourist Hotline”
            TITLE = "Lost Tourist Hotline";
            CAST = "<b>Cast:</b> Tourist • Operator";
            QUESTIONS = ["A city","A transportation method","A food you dislike","A street name","A local word you can’t pronounce","A celebrity","A random number","A weird smell","A direction","A souvenir"];
            TEMPLATE_LINES = [{speaker:"Tourist",text:"Hi, I’m lost somewhere in [#1]."},{speaker:"Operator",text:"How did you get there?"},{speaker:"Tourist",text:"I took a [#2] instead of a taxi."},{speaker:"Operator",text:"Do you see any signs?"},{speaker:"Tourist",text:"Yes — it says '[#4]' and smells like [#8]."},{speaker:"Operator",text:"That’s near the [#3] festival."},{speaker:"Tourist",text:"Wait, [#6] is performing here?!"},{speaker:"Operator",text:"Head [#9] until you see [#7] flamingos."},{speaker:"Tourist",text:"Got it, I’ll grab a [#10] for you."},{speaker:"Operator",text:"Please don’t."}];
            SAMPLES = ["Bangkok","tuk-tuk","durian","Moon Street","khao-soi","Taylor Swift","3","fish sauce","north","keychain"];
           break;
        case 14:
            // SCRIPT #13 — “The Office Espresso Machine”
            TITLE = "The Office Espresso Machine";
            CAST = "<b>Cast:</b> Boss • Employee • Intern";
            QUESTIONS = ["A boss’s name","A beverage","A random appliance","A noise","A holiday","A random company","A snack","A coworker nickname","A famous quote","A useless gadget"];
            TEMPLATE_LINES = [{speaker:"Boss",text:"Who broke the [#2] dispenser again?"},{speaker:"Employee",text:"It wasn’t me, [#1]!"},{speaker:"Boss",text:"Then why is there a [#3] inside it?"},{speaker:"Employee",text:"It made that sound — [#4] — before exploding."},{speaker:"Boss",text:"Not again, not before [#5]."},{speaker:"Employee",text:"Should we report this to [#6]?"},{speaker:"Boss",text:"They only care about [#7] sales."},{speaker:"Employee",text:"At least my nickname ‘[#8]’ is trending."},{speaker:"Boss",text:"[#9]! You’re fired."},{speaker:"Employee",text:"Can I take the [#10] home?"}];
            SAMPLES = ["Mr. Tan","coffee","microwave","BOING","Christmas","Tesla","pretzels","Sloth","Work smart not hard","USB fan"];
            break;
        case 15:
            // SCRIPT #14 — “The Dragon Hotel Reception”
            TITLE = "The Dragon Hotel Reception";
            CAST = "<b>Cast:</b> Receptionist • Guest • Dragon Manager";
            QUESTIONS = ["A mythical creature","A fantasy place","A job title","A weird color","A royal name","A smell","An object made of gold","A random guest name","A spell word","A reason for complaint"];
            TEMPLATE_LINES = [{speaker:"Receptionist",text:"Welcome to the [#1] Inn of [#2]!"},{speaker:"Guest",text:"I booked the royal suite under [#8]."},{speaker:"Receptionist",text:"Ah yes, the [#4] carpeted dungeon view."},{speaker:"Guest",text:"Why is there a [#5] sleeping in my room?"},{speaker:"Receptionist",text:"Apologies, that’s our manager."},{speaker:"Guest",text:"It smells like [#6] and burnt [#7]."},{speaker:"Receptionist",text:"Please recite '[#9]' to reset the temperature."},{speaker:"Guest",text:"I’d like to file a complaint — [#10]!"},{speaker:"Receptionist",text:"Our [#3] will contact you shortly."},{speaker:"Guest",text:"This place is legendary."}];
            SAMPLES = ["Dragon","Eldoria","wizard","turquoise","Queen Lila","smoke","goblet","Sir Beans","abracadabra","cold soup"];
            break;
        case 16:
            // SCRIPT #15 — “Cursed Restaurant Review”
            TITLE = "Cursed Restaurant Review";
            CAST = "<b>Cast:</b> Critic • Assistant • Waiter";
            QUESTIONS = ["A restaurant name","A disgusting food","A fancy adjective","A random celebrity","A number","A random shape","A flavor","A utensil","A body part","A curse word substitute"];
            TEMPLATE_LINES = [{speaker:"Critic",text:"Tonight I dined at [#1] — a truly [#3] experience."},{speaker:"Assistant",text:"You mean delicious?"},{speaker:"Critic",text:"No. Their soup tasted like [#2]."},{speaker:"Assistant",text:"What about presentation?"},{speaker:"Critic",text:"Each plate resembled a [#6] of sadness."},{speaker:"Assistant",text:"At least [#4] ate there once."},{speaker:"Critic",text:"They gave it [#5]/10 stars and a free [#8]."},{speaker:"Assistant",text:"How’s your [#9] feeling?"},{speaker:"Critic",text:"[#10]! I can’t move it."},{speaker:"Assistant",text:"We’re never eating out again."}];
            SAMPLES = ["The Spicy Duck","slime","avant-garde","Elon Musk","2","triangle","bitter","spoon","tongue","cheese and rice"];
            break;
        case 17:
            // SCRIPT #16 — “The Magical Customer Support”
            TITLE = "The Magical Customer Support";
            CAST = "<b>Cast:</b> Caller • Wizard Support • Background Creature";
            QUESTIONS = ["A spell word","A magical object","A creature","A complaint reason","A weird number","A fantasy place","A smell","A random potion","A royal name","An emotion"];
            TEMPLATE_LINES = [{speaker:"Caller",text:"Hello, my [#2] isn’t glowing anymore."},{speaker:"Wizard Support",text:"Have you tried saying [#1] loudly?"},{speaker:"Caller",text:"It only summons [#3]."},{speaker:"Wizard Support",text:"That’s normal after [#5] uses."},{speaker:"Caller",text:"But it reeks of [#7]!"},{speaker:"Wizard Support",text:"Please send it to [#6] via owl delivery."},{speaker:"Caller",text:"I need it before [#9]’s coronation."},{speaker:"Wizard Support",text:"Drink one bottle of [#8] first."},{speaker:"Caller",text:"I feel [#10] already."},{speaker:"Wizard Support",text:"Perfect. Problem solved."}];
            SAMPLES = ["expelliarmus","wand","frog","spark failure","42","Hogwarts","smoke","Mana Boost","King Bob","dizzy"];
            break;
        case 18:
            // SCRIPT #17 — “The Wedding Planner Meltdown”
            TITLE = "The Wedding Planner Meltdown";
            CAST = "<b>Cast:</b> Planner • Assistant • Guest";
            QUESTIONS = ["A couple’s name","A random flower","A fruit","A sound effect","A guest name","A celebrity","A dance move","A wedding disaster","A body part","A random color"];
            TEMPLATE_LINES = [{speaker:"Planner",text:"Welcome to [#1]’s wedding rehearsal."},{speaker:"Assistant",text:"We’ve replaced roses with [#2]."},{speaker:"Planner",text:"What about the cake?"},{speaker:"Assistant",text:"It’s made entirely of [#3]."},{speaker:"Planner",text:"([#4]) That’s… creative."},{speaker:"Guest",text:"[#5] just fainted after seeing [#6]."},{speaker:"Planner",text:"Everyone dance the [#7] while I fix this!"},{speaker:"Assistant",text:"We lost the rings during [#8]."},{speaker:"Planner",text:"My [#9] can’t handle this."},{speaker:"Guest",text:"It’s okay, the theme is [#10]."}];
            SAMPLES = ["Tom & Mia","sunflowers","pineapple","BANG","Uncle Joe","Adele","macarena","cake fire","eyebrow","lime green"];
            break;
        case 19:
            // SCRIPT #18 — “The Interview from Another Planet”
            TITLE = "The Interview from Another Planet";
            CAST = "<b>Cast:</b> Interviewer • Alien • HR Bot";
            QUESTIONS = ["A company name","A random planet","A weird skill","A food","A gadget","A language","A celebrity","A body part","A random color","A famous movie"];
            TEMPLATE_LINES = [{speaker:"Interviewer",text:"Welcome to [#1]. Why did you travel from [#2]?"},{speaker:"Alien",text:"Your planet offers free [#4]."},{speaker:"Interviewer",text:"Do you have experience with [#3]?"},{speaker:"Alien",text:"Only if I can use my [#5]."},{speaker:"Interviewer",text:"We prefer fluent [#6]."},{speaker:"Alien",text:"I learned from [#7]."},{speaker:"Interviewer",text:"Why is your [#8] glowing [#9]?"},{speaker:"Alien",text:"It’s a side effect of watching [#10]."},{speaker:"Interviewer",text:"You’re hired."},{speaker:"Alien",text:"Do I get weekends off?"}];
            SAMPLES = ["Amazon","Mars","teleporting","pizza","hoverboard","Klingon","Keanu Reeves","ear","purple","Avatar"];
            break;
        case 20:
            // SCRIPT #19 — “Haunted Karaoke Night”
            TITLE = "Haunted Karaoke Night";
            CAST = "<b>Cast:</b> DJ • Ghost Singer • Audience Member";
            QUESTIONS = ["A song title","A random decade","A celebrity","A spooky sound","A drink","A scary movie","An emotion","A body part","A ghost name","A random object"];
            TEMPLATE_LINES = [{speaker:"DJ",text:"Welcome to Haunted Karaoke! Next up — [#9] singing [#1]!"},{speaker:"Ghost",text:"This one’s from the [#2]s."},{speaker:"Crowd",text:"([#4])"},{speaker:"Ghost",text:"Someone hand me a [#5]."},{speaker:"DJ",text:"Didn’t you star in [#6]?"},{speaker:"Ghost",text:"I died halfway through."},{speaker:"Crowd",text:"We feel so [#7]!"},{speaker:"Ghost",text:"My [#8] just fell off again."},{speaker:"DJ",text:"Careful, you dropped your [#10]."},{speaker:"Ghost",text:"Thank you, I’ll haunt again next week."}];
            SAMPLES = ["Thriller","1980","Lady Gaga","WOOO","beer","The Ring","confused","head","Bob","microphone"];
            break;
        case 21:
            // SCRIPT #20 — “The Apocalypse Meeting”
            TITLE = "The Apocalypse Meeting";
            CAST = "<b>Cast:</b> Leader • Member • Intern";
            QUESTIONS = ["A job title","A random weapon","A celebrity","A drink","A random date","A strange sound","A world-ending event","A survival item","A random location","A slogan"];
            TEMPLATE_LINES = [{speaker:"Leader",text:"Welcome, team. As your [#1], I declare emergency mode."},{speaker:"Member",text:"Did someone bring the [#2]?"},{speaker:"Leader",text:"No, but [#3] is live-streaming it."},{speaker:"Member",text:"Can I have some [#4] first?"},{speaker:"Leader",text:"We don’t have time — the [#7] starts on [#5]!"},{speaker:"Member",text:"([#6]) That soon?!"},{speaker:"Leader",text:"Everyone grab a [#8] and meet at [#9]."},{speaker:"Member",text:"Should we pray?"},{speaker:"Leader",text:"No, just remember — [#10]."},{speaker:"Member",text:"I regret joining this company."}];
            SAMPLES = ["manager","chainsaw","The Rock","coffee","12/12/2099","BOOM","zombie apocalypse","toaster","warehouse","Keep calm and panic"];
            break;
        default:
            TITLE = "";
            CAST = "";
            QUESTIONS=[""];
            TEMPLATE_LINES=[""];
            SAMPLES=[""];
    }
}


