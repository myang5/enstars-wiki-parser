import convertText from '../../src/util/convertText';

/*
How formatter converts text (a rough summary)
Types of lines:
 Filename (for images) - formatter checks if file extension like .png exists in line
 (since this probably wouldn't show up in a dialogue line)
 Dialogue line (no label) - formatter checks if first word has no colon.
 Formatter assumes label-less lines that aren't filenames are dialogue lines
 Heading: label
 Name: label
Formatter identifies labels by checking if first word has a colon character (str.split(' '))
Formatter assumes the label is only one word long
Formatter assumes all the other words are part of the line/heading

need to account for text styling and how it might interfere with parsing
code has to handle partial line styling and whole line styling
TLers may paste code from their dreamwidth accounts where they bold/italicize names/headings
case 1: no styling, <p> only contains text
case 3: styling on non-label lines
case 3a: styling on filenames ex. <p><strong>filename</strong></p>
case 3b: styling in dialogue lines (probably intentional) ex. <p><strong>dialogue line</strong></p>
case 3c: partial styling on dialogue lines ex. <p>dialogue <strong>line</strong></p>
case 4: styling on label lines
case 4a: styling on labels ex. <p><strong>Ritsu:</strong> dialogue line</p>
case 4b: styling on informational headings <p><strong>Location: Hallway</strong</p>
case 4c: other partial styling variations

What styling should be kept?
Only styling on the dialogue lines (excluding labels)
How to detect dialogue line styling vs. other styling?
Evaluate <p>.innerText and then decide from there
*/

describe('convertText', () => {
  let inputData;
  let tlNotesData;
  let names;
  let details;
  let colors;

  beforeEach(() => {
    inputData =
      '<p>HEADER.PNG</p><p>Arashi: hello</p><p>Ritsu: hello</p><p>some cg.png</p><p>Arashi: hello again</p>';
    tlNotesData =
      '<p>If this is your first time using the formatter, please check the <a href="./howto.html#tlNotesSection">Text Guidelines</a> for how to add translation notes.</p>';
    names = ['Arashi', 'Ritsu'];
    details = {
      location: 'Hallway',
      author: '日日日 (Akira)',
      translator: 'Mike',
      tlLink: '',
      editor: 'Jay',
      edLink: '',
      whatGame: 'Story !!',
    };
    colors = { writer: '#FFFFFF', location: '#FFFFFF', bottom: '#FFFFFF', text: '#FFFFFF' };
  });

  test('still works', () => {
    const expected = `
    {| class="article-table" cellspacing="1/6" cellpadding="2" border="1" align="center" width="100%"
! colspan="2" style="text-align:center;background-color:#FFFFFF; color:#FFFFFF;" |'''Writer:''' 日日日 (Akira)
|-
| colspan="2" |[[File:HEADER.PNG|660px|link=|center]]
|-
! colspan="2" style="text-align:center;background-color:#FFFFFF; color:#FFFFFF;" |'''Location: Hallway'''
|-
|[[File:arashi.png|x200px|link=|center]]
|
hello

|-
|[[File:ritsu.png|x200px|link=|center]]
|
hello

|-
! colspan="2" style="text-align:center;" |[[File:some cg.png|center|link=|660px]]
|-
|[[File:arashi.png|x200px|link=|center]]
|
hello again

|-
! colspan="2" style="text-align:center;background-color:#FFFFFF;color:#FFFFFF;" |'''Translation: [[User:mike|mike]] '''
|-
! colspan="2" style="text-align:center;background-color:#FFFFFF;color:#FFFFFF;" |'''Proofreading: [[User:jay|jay]] '''
|}
[[Category:日日日 (Akira)]]
[[Category:Arashi Narukami - Story !!]]
[[Category:Ritsu Sakuma - Story !!]]
`;
    const output = convertText(inputData, tlNotesData, names, details, colors);
    expect(output).toEqual(expected);
  });
});
