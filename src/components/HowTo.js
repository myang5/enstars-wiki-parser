import React from 'react';
import color_diagram from 'Assets/color_diagram.png';
import list from 'Assets/list.png';
import newPage1 from 'Assets/createNewPage1.PNG';
import newPage2 from 'Assets/createNewPage2.PNG';
import newPage3 from 'Assets/createNewPage3.PNG';

export default function HowTo() {
  return (
    <>
      <div className="pageContent">
        <h2>TEXT GUIDELINES</h2>
        <h3>Text Tab</h3>
        <p>Copy and paste your translated chapter into the text box.</p>
        <ul>
          <li><strong>Header images and other chapter images</strong> - You can include whole-row images such as a header image or CGs by inserting the EXACT file name (ex. (Resounding Beat) Jun Sazanami CG2.png) into the dialogue on its own line. To set the header image, make the image file  name the first line in the dialogue.</li>
          <li><strong>Headings for scene changes</strong> - You can indicate scene changes by including a line that starts with "Heading: " in the dialogue. I'm still working on a way to set the color of individual headings, so for now any mid-chapter headings will take the "Location" color in the Details tab.</li>
          <li><strong>Bold and italic text</strong> - Bold and italic text should be preserved when pasted in from a Word/Google document.</li>
          <li><strong>Links</strong> - Links should also be preserved when pasted in. For now, internal wiki links are not supported so make sure every link is like an external one (i.e. with the https:// in front).</li>
        </ul>
        <p>Here's an example of a short dialogue:</p>
        <blockquote>
          The header image.png
      <br /><strong>Person A:</strong> This is a line said by Person A! Their line starts with their name followed by a colon.
      <br /><strong>Person B:</strong> This is a line said by another person!
      <br />Heading: Location: Hallway (will appear as "Location: Hallway" in story)
      <br />A screenshot of the game.jpeg
      <br /><strong>Person A:</strong> This is a third line from Person A.
    </blockquote>
        <p>When characters like Eichi have multiple lines at once, the following dialogue formats are accepted:</p>
        <blockquote>
          <strong>Person A:</strong> Line by person A
      <br />Second line by person A (line doesn't begin with name)
      <br /><strong>Person B:</strong> Line by person B
      <br />
          <br /><strong>Person A:</strong> Line by person A
      <br /><strong>Person A:</strong> Second line by person A (line begins with name)
      <br /><strong>Person B:</strong> Line by person B
    </blockquote>

        <h3>Details Tab</h3>
        <p>Fill in information about the chapter and its appearance on the wiki.</p>
        <p>The Editor field is an optional detail and will not be added if left blank. The Translator and Editor values should auto-fill based on previous input, if you allow websites to cache information</p>
        <p>Diagram of the Heading Colors options:</p>
        <img src={color_diagram} />

        <h3>Renders Tab</h3>
        <p>The renders tab should automatically display which characters are in the dialogue, with a text box next to each name. Fill in the file names of the renders that should be used for each character. (ex. Tsukasa Suou School Dialogue Render.png)</p>
        <p>For now, if you want to use more than one render per character in one chapter, you have to format each section of the chapter with different renders separately. INSERT EXAMPLE</p>

        <h3 id='tlNotesSection'>TL Notes Tab</h3>
        <p>In the Text tab, you can mark the place the translation note refers to with a marker like this:</p>
        <blockquote>
          Izumi: I don’t know if they’re Eden or oden[1] or what, but we can’t let them have their way in our territory.
    </blockquote>
        <p>You can have markers in the middle or end of the line, or even multiple markers in one line if needed.</p>
        <p>In the TL Notes tab, here's an example of how the notes should be formatted:</p>
        <blockquote>
          <ol>
            <li>Place translator notes in a numbered list like this.</li>
            <li>Make sure the numbers correspond to each marker!</li>
          </ol>
        </blockquote>
        <ul>
          <li>The formatter identifies TL notes by looking for numbers at the beginning of a paragraph.</li>
          <li><strong>The TL notes can also be in an actual ordered list, which is preferable.</strong> You can use the editor to format the list:</li>
          <img src={list} />
        </ul>

        <h2>CREATING A NEW PAGE ON THE WIKI</h2>
        <ol>
          <li>Copy the text that shows up on the right-hand box (can be done with Ctrl+A/Cmd+A)</li>
          <li>Go to the cover page of the story and edit the URL to have the name
        of the chapter. <br />For example, https://www.ensemble-stars.wikia.com/wiki/Checkmate/CHAPTER TITLE</li>
          <li>
            Choose to create a new page.<br />
            <img src={newPage1} />
          </li>
          <li>
            Instead of the visual editor, switch to the source editor.<br />
            <img src={newPage2} />
          </li>
          <li>
            Paste in the formatted text, and publish the page.<br />
            <img src={newPage3} />
          </li>
          <li>NOTE: As of now you must manually upload the header image of the
          chapter in the visual editor unless you upload the header image to
        the wiki before creating the new chapter page.</li>
        </ol>
      </div>
      <footer></footer>
    </>
  )
}