import { formatCategories } from '../../src/util/convertText';

describe('formatCategories', () => {
  let author;
  let names;
  let whatGame;
  let result;

  beforeEach(() => {
    author = '日日日 (Akira)';
    names = ['Arashi'];
    whatGame = 'Story';
    result = '';
  });

  test('correctly inserts author at beginning', () => {
    result = formatCategories(author, names, whatGame);
    expect(result).toEqual(expect.stringMatching(/^\[\[Category:日日日 \(Akira\)\]\]/));
  });

  test('creates the correct category label for the  indicated story', () => {
    result = formatCategories(author, names, whatGame);
    expect(result).toEqual(expect.stringMatching(/.*\[\[Category:.* - Story\]\].*/));
    whatGame = 'Story !!';
    result = formatCategories(author, names, whatGame);
    expect(result).toEqual(expect.stringMatching(/.*\[\[Category:.* - Story !!\]\].*/));
  });

  test('creates a category label for each character ', () => {
    names = ['Arashi', 'Mika', 'Shu'];
    result = formatCategories(author, names, whatGame);
    const regex = /.*\[\[Category:Arashi Narukami - Story\]\]\n\[\[Category:Mika Kagehira - Story\]\]\n\[\[Category:Shu Itsuki - Story\]\]$/;
    expect(result).toEqual(expect.stringMatching(regex));
  });
});
