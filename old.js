// function openTab(btn, tabName) {
//   $('.tabcontent').hide();
//   $('.tablink').removeClass("active");
//   var tabId = "#" + tabName;
//   $(tabId).css('display', "block");
//   $(btn).addClass("active");
// }

//resolving issue with Google Docs adding transparent span to every line
//params: editorDom - editor data converted to a DOM object
//returns the editor data as a DOM object with transparent spans removed
// function clearGDocSpan(editorDom) {
//   editorDom.querySelectorAll('span').forEach(function (span) {
//     if (span.style.backgroundColor === 'transparent') {
//       span.replaceWith(span.innerHTML);
//     }
//     //want to be able to have spans for different text colors later...
//   });
//   return editorDom;
// }

//helper function to format bold, italics, links, and TL markers
//params: line - a String
// function formatLine(line) {
//   line = line.replace(/<\/*strong>/g, "'''") //bold in wiki is like '''this'''
//   line = line.replace(/<\/*i>/g, "''") //italic in wiki is like ''this''
//   line = formatLink(line);
//   line = formatTlMarker(line);
//   return line;
// }

//helper function to format external links
// function formatLink(line) { //link is like this <a href="url">text</a> --> [url text]
//   line = line.replace(/<a href="/g, '[');
//   line = line.replace(/">/g, ' ');
//   line = line.replace(/<\/a>/g, ']');
//   return line;
// }

//Updating Renders tab based on dialogue input
//Called by autosave property of BalloonEditor
// function updateRenders(editor) {

//   const namesSet = new Set();

//   //trying to use closure! wow
//   return function () {
//     //console.log('running renders');

//     //let input = clearGDocSpan(convertToDom(editor1.getData()));
//     let input = getTextFromDom(convertToDom(editor1.getData()));
//     //get first word in each line and check if there's a colon
//     const namesRaw = new Set(); //add "key" of each line if there is one
//     input.forEach(function (line) {
//       let nameRaw = line.split(' ')[0]; //get first word in the line
//       //console.log('nameRaw: ' + nameRaw);
//       if (nameRaw.includes(':')) { //if there is a colon
//         namesRaw.add(nameRaw.slice(0, nameRaw.indexOf(':'))); //get text up until colon
//       }
//     });

//     const names = new Set() //get set of valid names
//     namesRaw.forEach(function (name) {
//       let nameClean = name.replace(/<\w+>/g, ''); //remove opening html tags
//       nameClean = nameClean.replace(/<.\w+>/g, ''); //remove ending html tags
//       //console.log('nameClean: ' + nameClean);
//       if (namesLink[nameClean.toUpperCase()] != undefined) { //if valid name
//         nameClean = nameClean[0].toUpperCase() + nameClean.slice(1, nameClean.length); //format name ex. arashi --> Arashi
//         names.add(nameClean);
//       }
//     });

//     //if the character no longer exists in the new chapter,
//     //delete character from the Renders options
//     namesSet.forEach(function (name) {
//       if (!names.has(name)) {
//         namesSet.delete(name);
//         let cls = "." + name; // row has the name as a class
//         $(cls).remove();
//         $(`option:contains(${name})`).remove();
//       }
//     });

//     //add character to Renders menu if they don't exist
//     names.forEach(function (name) {
//       if (!namesSet.has(name)) { //keep the previously existing rows so that renders don't have to be re-entered
//         namesSet.add(name);
//         //make row with input box for the chara's render
//         var newRow = $("<div></div>").addClass(`row ${name}`);
//         var newLabel = $("<label class = 'spacer'></label>").append(makeLink(name)).attr("for", name);
//         var newInput = $("<input>").attr("id", name)
//         $(newRow).append(newLabel);
//         $(newRow).append(newInput);
//         $('#renderForms').append(newRow);
//       }
//     });
//   }
// }
// const renders = updateRenders(); //closure!!

// function makeLink(name) {
//   const link = namesLink[name.toUpperCase()];
//   const url = `http://ensemble-stars.wikia.com/wiki/${link}/Gallery#Render`;
//   const a = $("<a></a>").text(name).attr("href", url).attr("target", "_blank")
//   return a;
// }