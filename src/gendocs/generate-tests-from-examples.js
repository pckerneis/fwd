import jsdoc from 'jsdoc-api';
import jsdocParser from 'jsdoc-parse';
import fs from 'node:fs';

const importSection = `import { define, undefine } from './modules/api/api.env.js';
import { ring } from './modules/api/api.ring.js';
import { scoped } from './modules/api/api.scope.js';
import { at, cursor, setSpeed, wait } from './modules/api/api.scheduler.js';
import { Curve, smooth } from './modules/api/api.smooth.js';
import { setPersistedContext } from './modules/api/api.shared.js';
import { random, setSeed } from './modules/api/api.random.js';
`;

const beforeEachSection = `
beforeEach(() => {
  setPersistedContext({});
  setSpeed(1);
  at(0);
});
`;

const jsonDoc = jsdocParser(
  jsdoc.explainSync({
    files: 'src/modules/api/**/*.js',
  }),
);

let generatedTests = importSection + beforeEachSection;

jsonDoc.forEach((doc) => {
  doc?.examples?.forEach((example, exampleIndex) => {
    let testBody = '';
    let assertionCount = 0;

    const buildAssertion = (line) => {
      let [before, after] = line.split('//');

      if (before.trim().length === 0) {
        return `  ${line}\n`;
      }

      if (before.includes(';')) {
        before = before.split(';')[0];
      }

      assertionCount += 1;

      const indent = before.match(/^\s*/)[0];
      return `  ${indent}expect(${before.trim()}).toBe(${after.trim()});\n`;
    };

    example.split('\n').forEach((line) => {
      if (line.includes('//')) {
        testBody += buildAssertion(line);
      } else {
        testBody += `  ${line}\n`;
      }
    });

    if (assertionCount > 0) {
      generatedTests += `
it('Example ${doc.id}#${exampleIndex}', () => {
${testBody}});
`;
    }
  });
});

console.log(generatedTests);

fs.writeFileSync('src/generated.test.js', generatedTests);
