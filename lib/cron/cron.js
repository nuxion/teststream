const parser = require('cron-parser');


const tasks = [
  { id: 1, when: '*/2 * * * * *' },
  { id: 2, when: '*/5 * * * * *' },
  { id: 3, when: '5 5 22 * * *' },
  { id: 4, when: '5 5 22 14 * *' },
  { id: 4, when: '1 4 19 * * 7' },
];

tasks.forEach((e) => {
  const interval = parser.parseExpression(e.when);
  const nexvalue = interval.next();
  const prevvalue = interval.prev();
  console.log(`Task: ${e.id} when: ${nexvalue}`);
  console.log(prevvalue);
  console.log('================');
});
