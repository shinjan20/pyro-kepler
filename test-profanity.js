import fs from 'fs';

async function test() {
    const res = await fetch('https://raw.githubusercontent.com/zacanger/profane-words/master/words.json');
    const words = await res.json();

    if (words.includes('associate')) {
        console.log("associate is in the list!");
    } else {
        const matches = words.filter(w => 'associate'.includes(w));
        console.log("associate includes:", matches);
    }
}
test();
