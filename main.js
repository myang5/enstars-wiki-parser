const namesLink = {
  TETORA:'Tetora_Nagumo',
  HAJIME:'Hajime_Shino',
  TOMOYA:'Tomoya_Mashiro',
  HINATA:'Hinata_Aoi',
  MIDORI:'Midori_Takamine',
  TORI:'Tori_Himemiya',
  SHINOBU:'Shinobu_Sengoku',
  MITSURU:'Mitsuru_Tenma',
  YUTA:'Yuta_Aoi',
  TSUKASA:'Tsukasa_Suou',
  SORA:'Sora_Harukawa',
  SUBARU:'Subaru_Akehoshi',
  HOKUTO:'Hokuto_Hidaka',
  MAKOTO:'Makoto_Yuuki',
  SOUMA:'Souma_Kanzaki',
  ADONIS:'Adonis_Otogari',
  NATSUME:'Natsume_Sakasaki',
  KOGA:'Koga_Oogami',
  RITSU:'Ritsu_Sakuma',
  MAO:'Mao_Isara',
  YUZURU:'Yuzuru_Fushimi',
  ARASHI:'Arashi_Narukami',
  MIKA:'Mika_Kagehira',
  EICHI:'Eichi_Tenshouin',
  KEITO:'Keito_Hasumi',
  KAORU:'Kaoru_Hakaze',
  IZUMI:'Izumi_Sena',
  CHIAKI:'Chiaki_Morisawa',
  SHU:'Shu_Itsuki',
  MADARA:'Madara_Mikejima',
  KURO:'Kuro_Kiryu',
  WATARU:'Wataru_Hibiki',
  KANATA:'Kanata_Shinkai',
  REI:'Rei_Sakuma',
  NAZUNA:'Nazuna_Nito',
  LEO:'Leo_Tsukinaga',
  TSUMUGI:'Tsumugi_Aoba',
  JIN:'Jin_Sagami',
  AKIOMI:'Akiomi_Kunugi',
  HIYORI:'Hiyori_Tomoe',
  JUN:'Jun_Sazanami',
  NAGISA:'Nagisa_Ran',
  IBARA:'Ibara_Saegusa',
  RINNE:'Rinne_Amagi',
  HIMERU:'HiMERU',
  KOHAKU:'Kohaku_Oukawa', 
  NIKI:'Niki_Shiina',
  HIIRO:'Hiiro_Amagi',
  AIRA:'Aira_Shiratori',
  MAYOI:'Mayoi_Ayase',
  TATSUMI:'Tatsumi_Kazehaya'
};

let userInput; //ckeditor autosaves input here

function setup() {
  $('#defaultOpen').click();
  BalloonEditor
    .create(document.querySelector('#inputEditor'), {
      toolbar: {
        items: [
          'bold',
          'italic',
          'link',
          '|',
          'fontBackgroundColor',
          'fontColor',
          '|',
          'undo',
          'redo'
        ]
      },
      autosave: {
        save(editor) {
          userInput = editor.getData()
          renders();
        }
      }
    })
    .then(editor => {
      window.editor1 = editor;
    })
    .catch(error => {
      console.error(error);
    });

  BalloonEditor
    .create(document.querySelector('#tlEditor'), {
      toolbar: {
        items: [
          'bold',
          'italic',
          'link',
          'numberedList',
          '|',
          'undo',
          'redo'
        ]
      }
    })
    .then(editor => {
      window.editor2 = editor;
    })
    .catch(error => {
      console.error(error);
    });

  $('.editor').attr('spellcheck', 'false');
}

function openTab(btn, tabName) {
  $('.tabcontent').hide();
  $('.tablink').removeClass("active");
  var tabId = "#" + tabName;
  $(tabId).css('display', "block");
  $(btn).addClass("active");
}

//Updating Renders tab based on dialogue input
function updateRenders() {

  const namesSet = new Set();

  //trying to use closure! wow
  return function() {
    //console.log('running renders');

    const input = userInput.split('<p>'); //get array of dialogue lines
    //get first word in each line and check if there's a colon
    const namesRaw = new Set(); //add "key" of each line if there is one
    input.forEach(function(line){
      let nameRaw = line.split(' ')[0]; //get first word in the line
      //console.log('nameRaw: ' + nameRaw);
      if(nameRaw.includes(':')){ //if there is a colon
        namesRaw.add(nameRaw.slice(0, nameRaw.indexOf(':'))); //get text up until colon
      }
    });
    
    const names = new Set() //get set of valid names
    namesRaw.forEach(function(name){
      let nameClean = name.replace(/<\w+>/g, ''); //remove opening html tags
      nameClean = nameClean.replace(/<.\w+>/g, ''); //remove ending html tags
      //console.log('nameClean: ' + nameClean);
      if (namesLink[nameClean.toUpperCase()] != undefined){ //if valid name
        nameClean = nameClean[0].toUpperCase() + nameClean.slice(1, nameClean.length); //format name ex. arashi --> Arashi
        names.add(nameClean);
      }
    });

    //if the character no longer exists in the new chapter,
    //delete character from the Renders options
    namesSet.forEach(function (name) {
      if (!names.has(name)) {
        namesSet.delete(name);
        let cls = "." + name; // row has the name as a class
        $(cls).remove();
        $(`option:contains(${name})`).remove();
      }
    });

    //add character to Renders menu if they don't exist
    names.forEach(function (name) {
      if (!namesSet.has(name)) { //keep the previously existing rows so that renders don't have to be re-entered
        namesSet.add(name);
        //make row with input box for the chara's render
        var newRow = $("<div></div>").addClass(`row ${name}`);
        var newLabel = $("<label class = 'spacer'></label>").append(makeLink(name)).attr("for", name);
        var newInput = $("<input>").attr("id", name)
        $(newRow).append(newLabel);
        $(newRow).append(newInput);
        $('#renderForms').append(newRow);
      }
    });
  }
}

const renders = updateRenders(); //closure!!

function makeLink(name) {
  const link = namesLink[name.toUpperCase()];
  const url = `http://ensemble-stars.wikia.com/wiki/${link}/Gallery#Render`;
  const a = $("<a></a>").text(name).attr("href", url).attr("target", "_blank")
  return a;
}

function convertText() {

  values = getValues(); //get user input from all the tabs

  //format wiki code with user input
  const header =
`{| class="article-table" cellspacing="1/6" cellpadding="2" border="1" align="center" width="100%"
! colspan="2" style="text-align:center;background-color:${values.writerCol}; color:${values.textCol};" |'''Writer:''' ${values.author}
|-
| colspan="2" |[[File:HEADERFILE|660px|link=|center]]
|-
! colspan="2" style="text-align:center;background-color:${values.locationCol}; color:${values.textCol};" |'''Location: ${values.location}'''
`;
  const dialogueRender =
`|-
|[[File:FILENAME|x200px|link=|center]]
|
`;
  const cgRender =
`|-
! colspan="2" style="text-align:center;" |[[File:FILENAME|center|660px]]
`;
  const heading = 
`|-
! colspan="2" style="text-align:center;background-color:${values.locationCol}; color:${values.textCol};" |'''HEADING'''
`
  const footer =
`|-
! colspan="2" style="text-align:center;background-color:${values.bottomCol};color:${values.textCol};" |'''Translation: [${values.translator}] '''
|}`;

  let input = editor1.getData();
  input = input.split('<p>'); //get array of dialogue lines
  for(let i=0; i<input.length; i++){
    input[i] = input[i].replace('</p>', '');
  }
  let output = header;
  console.log(input);

  //let currentName = "";
  // const tlExp = /\[\d\]/;
  // let tlToInput = "";
  let headerImgInsert = false;
  input.forEach(function (line) {
    if (line != "") { //ignore empty lines
      if (isFileName(line)) {
        console.log('isFileName: true');
        //ERROR: if there is no image file for the header, the first image in the dialogue becomes the header
        if (!headerImgInsert) { //if image file for the header 
          console.log('headerfile');
          output = output.replace("HEADERFILE", line.trim());
          headerImgInsert = true;
        }
        else { //if CG or scene change image file
          console.log('image file');
          let cgCode = cgRender;
          output += cgCode.replace("FILENAME", line.trim());
        }
      }
      else {
        let firstWord = line.split(" ")[0];
        if (!firstWord.includes(":")) { //if dialogue is continuing
          output += line + "\n\n";
        }
        else { 
          firstWord = firstWord.slice(0, -1); //remove colon
          if (firstWord.toUpperCase() === 'HEADING') {
            console.log('new HEADING');
            let headingCode = heading;
            output += headingCode.replace("HEADING", line.slice(line.indexOf(' ') + 1).trim());
          }
          else if (namesLink[firstWord.toUpperCase()] != undefined){ //if valid new character is speaking
            console.log('new character: ' + firstWord);
            line = line.slice(line.indexOf(":") + 1).trim(); //get chara's spoken line
            let renderCode = dialogueRender;
            let id = "#" + firstWord[0].toUpperCase() + firstWord.slice(1, firstWord.length); //create id to access chara's render file in Renders tab
            output += renderCode.replace("FILENAME", $(id).val().trim());
            output += line + "\n\n";
            // code from when every line had to start with a chara name JIC
            // var current = exp.slice(0,exp.indexOf(":"));
            // exp = exp.slice(exp.indexOf(":") + 1).trim();
            // if(current == currentName){
            //   output += exp + "\n\n";
            // }
            // else if(current != currentName){
            //   currentName = current;
            //   var renderFile = dialogueRender;
            //   var id = "#" + current[0].toUpperCase() + current.slice(1,current.length);
            //   if(tlToInput!=""){
            //     console.log(tlToInput)
            //     output += tlToInput;
            //     tlToInput = "";
            //   }
            //   output += renderFile.replace("FILENAME", $(id).val().trim());
            //   // output += dialogueRender;
            //   output += exp + "\n\n";
            // }
          }
          else {
            console.log('Formatter was unable to process this name: ' + firstWord);
          }
        }
      }
    }
  });

  output += footer;
  $('#output').val(output);
  return false;
}

//helper function for convertText
function getValues() {
  const values = {} 
  values.location = $('#location').val().trim();
  values.author = $('#author option:selected').text();
  values.translator = $('#translator').val().trim();
  values.tlLink = $('#tlLink').val().trim();
  if (values.tlLink === "") { //if TL credit is to a wiki user
    values.translator = `[User:${values.translator}|${values.translator}]`;
  }
  else { //if TL credit is to an external wiki user
    values.translator = `${values.tlLink} ${values.translator}`;
  }
  values.writerCol = $('input[name=writerCol]').val();
  values.locationCol = $("input[name=locationCol]").val();
  values.bottomCol = $('input[name=bottomCol]').val();
  values.textCol = $('input[name=textCol]').val();
  return values;
}

//helper function to check if the line is a file
function isFileName(line) {
  const extensions = ['.png', '.gif', '.jpg', '.jpeg', '.ico', '.pdf', '.svg'];
  const endLen4 = line.slice(-4);
  const endLen5 = line.slice(-5);
  if(extensions.includes(endLen4) || extensions.includes(endLen5)){
    return true;
  }
  return false;
}
