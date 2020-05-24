import { EOL } from 'os';
import to from 'await-to-js';

import { executeCommand } from '../.';

const pathToBin = `${__dirname}/executableToTest.js`;

const findLineWithDescription = (output, description) => {
  return output.find(item => {
    return item.includes(description);
  });
}

describe('commander pizza', () => {
  describe('without args', () => {
    it('works properly', async () => {
      const output = await executeCommand({ pathToBin });

      const outputArray = output.trim().split(EOL);

      expect(outputArray.length).toBe(2);
      expect(outputArray[0]).toBe('you ordered a pizza with:');
      expect(outputArray[1]).toBe(' - marble cheese');
    });
  });

  describe('with args', () => {
    describe('in short form', () => {
      describe('with cheese', () => {
        it('works properly', async () => {
          const output = await executeCommand({ 
            pathToBin, 
            args: ['-p', '-P', '-b', '-c', 'super'],
          });

          const outputArray = output.trim().split(EOL);

          expect(outputArray.length).toBe(5);
          expect(outputArray[0]).toBe('you ordered a pizza with:');
          expect(outputArray[1]).toBe(' - peppers');
          expect(outputArray[2]).toBe(' - pineapple');
          expect(outputArray[3]).toBe(' - bbq');
          expect(outputArray[4]).toBe(' - super cheese');
        });
      })

      describe('without cheese', () => {
        it('works properly', async () => {
          const output = await executeCommand({ 
            pathToBin, 
            args: ['-p', '-P', '-b', '-C'],
          });

          const outputArray = output.trim().split(EOL);

          expect(outputArray.length).toBe(5);
          expect(outputArray[0]).toBe('you ordered a pizza with:');
          expect(outputArray[1]).toBe(' - peppers');
          expect(outputArray[2]).toBe(' - pineapple');
          expect(outputArray[3]).toBe(' - bbq');
          expect(outputArray[4]).toBe(' - no cheese');
        });
      });
    });

    describe('in full form', () => {
      describe('with cheese', () => {
        it('works properly', async () => {
          const output = await executeCommand({ 
            pathToBin, 
            args: ['--peppers', '--pineapple', '--bbq', '--cheese', 'super'] 
          });

          const outputArray = output.trim().split(EOL);

          expect(outputArray.length).toBe(5);
          expect(outputArray[0]).toBe('you ordered a pizza with:');
          expect(outputArray[1]).toBe(' - peppers');
          expect(outputArray[2]).toBe(' - pineapple');
          expect(outputArray[3]).toBe(' - bbq');
          expect(outputArray[4]).toBe(' - super cheese');
        });
      })

      describe('without cheese', () => {
        it('works properly', async () => {
          const output = await executeCommand({ 
            pathToBin, 
            args: ['--peppers', '--pineapple', '--bbq', '--no-cheese'] 
          });

          const outputArray = output.trim().split(EOL);

          expect(outputArray.length).toBe(5);
          expect(outputArray[0]).toBe('you ordered a pizza with:');
          expect(outputArray[1]).toBe(' - peppers');
          expect(outputArray[2]).toBe(' - pineapple');
          expect(outputArray[3]).toBe(' - bbq');
          expect(outputArray[4]).toBe(' - no cheese');
        });
      });
    });
  });

  describe('with help', () => {
    it('includes correct description', async () => {
      const output = await executeCommand({ 
        pathToBin, 
        args: ['--help'],
      });

      const outputArray = output.trim().split(EOL);

      expect(findLineWithDescription(outputArray, 'An application for pizzas ordering')).toBeDefined();
      expect(findLineWithDescription(outputArray, 'Add peppers')).toBeDefined();
      expect(findLineWithDescription(outputArray, 'Add pineapple')).toBeDefined();
      expect(findLineWithDescription(outputArray, 'Add bbq sauce')).toBeDefined();
      expect(findLineWithDescription(outputArray, 'Add the specified type of cheese')).toBeDefined();
      expect(findLineWithDescription(outputArray, 'You do not want any cheese')).toBeDefined();
    });
  });

  describe('with unknown argument', () => {
    it('includes correct description', async () => {
      const [error] = await to(executeCommand({ pathToBin, args: ['--mango'] }));

      expect(error).toBe("error: unknown option '--mango'");
    });
  });
});
