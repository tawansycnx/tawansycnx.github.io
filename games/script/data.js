TITLE = "Interogation Room DEFAULT";
CAST = "<b>Cast:</b> Detective • Suspect";
QUESTIONS=["A male name","Favorite teacher name","A number","Plural object","Store name","Body part","Name of a holiday","Movie title","Amount of distance","Country (funny)"];
TEMPLATE_LINES=[{speaker:"Detective",text:"Hello, I'm detective [#1], and you are?"},{speaker:"Suspect",text:"[#2]"},{speaker:"Detective",text:"You are here today under suspicion of second degree robbery."},{speaker:"Suspect",text:"\"Crumbs\"",stage:true},{speaker:"Detective",text:"That's right! [#3] [#4] were stolen from [#5]"},{speaker:"Detective",text:"And the crime scene has your [#6] written all over it."},{speaker:"Detective",text:"Where were you on the night of [#7]"},{speaker:"Suspect",text:"We were watching [#8]"},{speaker:"Detective",text:"Then why did the security camera footage show you gyrating [#9] away from the crime scene?"},{speaker:"Suspect",text:"\"SHRUGS\"",stage:true},{speaker:"Detective",text:"{ANGRY} I'm done playing games! Where are you from?"},{speaker:"Suspect",text:"[#10]"}];
SAMPLES=["Rob","Mrs. Doubtfire","9486","eggs","Marks & Spencer","buttocks","Haloween","How to rob a bank","3mm","Ukraine"];
// =================== DATA GENERATION ===================
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
        default:
            TITLE = "";
            CAST = "";
            QUESTIONS=[""];
            TEMPLATE_LINES=[""];
            SAMPLES=[""];
    }
}


