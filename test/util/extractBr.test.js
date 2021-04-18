import extractBr from '../../src/utils/extractBr';

describe('extractBr', () => {
  test('returns the same DOM object that was passed in', () => {
    document.body.innerHTML = '<p>Line 1<br><br>Line 2</p>';
    expect(extractBr(document.body)).toBe(document.body);
  });

  xtest('does not edit paragraphs with no <br>', () => {
    document.body.innerHTML = '<p>Line 1</p>';
    const paragraphs = Array.from(document.body.querySelectorAll('p'));
    expect(paragraphs.map((p) => p.innerHTML)).toEqual(['Line 1']);
  });

  xdescribe('given a DOM with multiple lines and <br> tags', () => {
    beforeEach(() => {
      document.body.innerHTML =
        '<p>Line 1<br><br>Line 2<br><br>Line 3<br><br>Line 4</p>';
      extractBr(document.body);
    });

    test('removes all <br> tags', () => {
      expect(Array.from(document.body.querySelectorAll('br')).length).toBe(0);
    });

    test('places lines into <p> tags', () => {
      const paragraphs = Array.from(document.body.querySelectorAll('p'));
      expect(paragraphs.map((p) => p.innerHTML)).toEqual([
        'Line 1',
        'Line 2',
        'Line 3',
        'Line 4',
      ]);
    });

    test('handles an arbitrary number of <br>', () => {
      document.body.innerHTML =
        '<p>Line 1<br><br><br>Line 2<br><br>Line 3<br>Line 4<br><br><br><br></p>';
      extractBr(document.body);
      const paragraphs = Array.from(document.body.querySelectorAll('p'));
      expect(paragraphs.map((p) => p.innerHTML)).toEqual([
        'Line 1',
        'Line 2',
        'Line 3',
        'Line 4',
      ]);
    });
  });
});
