const fs = require('fs');
const path = 'd:/B.Tech/Programing languages/React/intership_work/second/client/src/pages/SearchPage.jsx';
let c = fs.readFileSync(path, 'utf8');

const endDiv = '</' + 'div>';
const block = [
  '                On time',
  '              ' + endDiv,
  '            )}',
  '          ' + endDiv,
  '          )}',
  '        ' + endDiv,
].join('\n');

const broken = c.match(/On time[\s\S]{0,120}\{\/\* Actions \*\}/);
if (broken) {
  console.log('found broken block:', broken[0]);
}

c = c.replace(
  /On time\r?\n\s+<\/motion\.div>\r?\n\s+\)\}\r?\n\s+<\/motion\.motion\.motion\.div>/,
  `On time\n              ${endDiv}\n            )}\n          ${endDiv}`
);

c = c.replace(
  /\)\}\r?\n\s+<\/motion\.div>\r?\n\r?\n\s+\{\/\* Actions \*\}/,
  `)}\n        ${endDiv}\n\n        {/* Actions */}`
);

fs.writeFileSync(path, c);
console.log('done');
