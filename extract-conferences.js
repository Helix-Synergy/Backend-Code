const fs = require('fs');
const path = require('path');

const hybridsPath = 'c:/Users/it001/Desktop/Helix_synergy_conferences/frontend/src/data/hybridsData1.js';
const webinarsPath = 'c:/Users/it001/Desktop/Helix_synergy_conferences/frontend/src/data/webinarsData1.js';
const allConferencesPath = 'c:/Users/it001/Desktop/Helix_synergy_conferences/frontend/src/pages/AllConferences.js';

let content = "";
try {
  if (fs.existsSync(hybridsPath)) content += fs.readFileSync(hybridsPath, 'utf8');
  if (fs.existsSync(webinarsPath)) content += fs.readFileSync(webinarsPath, 'utf8');
  if (fs.existsSync(allConferencesPath)) content += fs.readFileSync(allConferencesPath, 'utf8');
} catch (e) {
  console.error(e);
}

const conferences = [];
const blocks = content.split('{');
blocks.forEach(block => {
  if (block.includes('title:')) {
    const titleMatch = block.match(/title:\s*['"](.*?)['"]/);
    const linkMatch = block.match(/link:\s*['"](.*?)['"]/);
    const dateMatch = block.match(/date:\s*['"](.*?)['"]/);
    const locationMatch = block.match(/location:\s*['"](.*?)['"]/);
    const venueMatch = block.match(/venue:\s*['"](.*?)['"]/);
    
    if (titleMatch) {
      conferences.push({
        title: titleMatch[1].trim(),
        link: linkMatch ? linkMatch[1] : '',
        date: dateMatch ? dateMatch[1] : 'TBA',
        location: locationMatch ? locationMatch[1] : (venueMatch ? venueMatch[1] : 'TBA')
      });
    }
  }
});

const uniqueMap = new Map();
conferences.forEach(c => {
  if (c.title.length > 3) {
    if (!uniqueMap.has(c.title)) {
      uniqueMap.set(c.title, c);
    } else {
      // Prioritize entry with a link if exists
      const existing = uniqueMap.get(c.title);
      if (!existing.link && c.link) {
        uniqueMap.set(c.title, c);
      }
    }
  }
});
const unique = Array.from(uniqueMap.values());

const listText = unique.map(c => `- ${c.title} | Date: ${c.date} | Location: ${c.location} | Link: ${c.link || 'https://helixconferences.com/Conferences'}`).join('\n');
console.log("Total unique found:", unique.length);
fs.writeFileSync('c:/Users/it001/Desktop/Helix_synergy_conferences/backend/conferences.txt', listText);
console.log("Saved to conferences.txt with dates and locations.");
