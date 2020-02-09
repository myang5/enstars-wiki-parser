var namesLink = ['Tetora_Nagumo',
'Hajime_Shino',
'Tomoya_Mashiro',
'Hinata_Aoi',
'Midori_Takamine',
'Tori_Himemiya',
'Shinobu_Sengoku',
'Mitsuru_Tenma',
'Yuta_Aoi',
'Tsukasa_Suou',
'Sora_Harukawa',
'Subaru_Akehoshi',
'Hokuto_Hidaka',
'Makoto_Yuuki',
'Souma_Kanzaki',
'Adonis_Otogari',
'Natsume_Sakasaki',
'Koga_Oogami',
'Ritsu_Sakuma',
'Mao_Isara',
'Yuzuru_Fushimi',
'Arashi_Narukami',
'Mika_Kagehira',
'Eichi_Tenshouin',
'Keito_Hasumi',
'Kaoru_Hakaze',
'Izumi_Sena',
'Chiaki_Morisawa',
'Shu_Itsuki',
'Madara_Mikejima',
'Kuro_Kiryu',
'Wataru_Hibiki',
'Kanata_Shinkai',
'Rei_Sakuma',
'Nazuna_Nito',
'Leo_Tsukinaga',
'Tsumugi_Aoba',
'Jin_Sagami',
'Akiomi_Kunugi',
'Hiyori_Tomoe',
'Jun_Sazanami',
'Nagisa_Ran',
'Ibara_Saegusa'
];

var placeholder = 
`Example of dialogue format:
(Each line of dialogue is on a new line. Dialogue should indicate when a new character is speaking with their name followed by ":")

Ritsu: Yes, this is love… No matter when or where, Maa-kun and I are bonded by it.
  
Arashi: Mmhmm, I think so too~ That’s love right there.
  
I’m so jealous~ You have such a wonderful romance…`;

var placeholder1 = 
`Paste the numbered translation notes into here.
Notes should be numbered and on new lines, like so:

[1] "Day duty" (日直 - nicchoku) is a system at Japanese high schools where each student in a class rotates the duties of cleaning up the classroom, and closing all the windows and doors and such at the end of the day. I'm not sure what other countries use this system, but it's fairly common even in workplaces in Japan.
[2] High school is not compulsory education in Japan.

And in the dialogue, the placement of the note should be written like so:
Sora: Haha~♪ HiHi~♪ HuHu~♪
Hehe~♪ Done with day duty! Good work![1]`;

function setup(){
  $('#defaultOpen').click();
  $('#inputArea').attr('placeholder', placeholder);
  $('#tlArea').attr('placeholder', placeholder1);
}

function openTab(btn, tabName) {
  $('.tabcontent').hide();
  $('.tablink').removeClass("active");
  var tabId = "#" + tabName;
  $(tabId).css('display', "block");
  $(btn).addClass("active");
}

function showExLink(){
  if($('input[name=tlLocation]:checked').val()=='wiki'){
    $('input[name=tlLink]').hide();
  }
  else if($('input[name=tlLocation]:checked').val()=='external'){
    $('input[name=tlLink]').show();
  }
}

//global list of names in story
var namesSet = new Set();
//Updating Renders tab based on dialogue input
function updateRenders(){
  var input=$('#inputArea').val();
  //returns array of all words ending in colon but not preceded by a space (chara names)
  //in case there are any colons in the dialogue itself
  //originally was /\n\w+:/g but this did not catch the first name
  var res = input.match(/^(?! )\w+:/gm);
  var names= new Set(res);

  //divs that no longer exist in the new dialogue
  //deletes option from the link menu
  namesSet.forEach(function(exp){
    if(!names.has(exp)){
      namesSet.delete(exp);
      var cls = "." + exp;
      $(cls).remove();
      exp = exp[0].toUpperCase() + exp.slice(1,exp.length-1); //remove colon
      $('option:contains(' + exp + ')').remove();
    }
  });

  names.forEach(function(exp){
    //format name slightly
    exp = exp[0].toUpperCase() + exp.slice(1,exp.length-1);
    //keeps the previously existing divs so that renders don't have to be re-entered
    if(!namesSet.has(exp)){
      namesSet.add(exp);

      //make row with input box for the render labeled w/ name
      var newRow = $("<div></div>").addClass("form-group row");
      var newLabel = $("<label></label>").text(exp).addClass("col-sm-2 col-form-label").attr("for",exp);
      var newDiv = $("<div></div>").addClass("col-sm-6");
      var newInput = $("<input>").attr("id",exp).addClass("form-control");
      $(newDiv).append(newInput);
      $(newRow).append(newLabel);
      $(newRow).append(newDiv);
      $('#renderForms').append(newRow);
      //add name option to dropdown menu of render page links
      var sel = document.getElementById("linkToRenders");
      var opt = document.createElement("option");
      opt.text = exp;
      sel.add(opt);
    }
  });
}

function openLink(){
  var name = $("#linkToRenders option:selected").text();
  for(i = 0; i < namesLink.length; i++) {
    if(namesLink[i].split('_')[0] == name){
      var url = "http://ensemble-stars.wikia.com/wiki/NAME/Gallery#Renders".replace("NAME", namesLink[i]);
      window.open(url, "_blank");
      return;
    }
  }
}

function convertText(){

  var location = $('#location').val();
  var author = $('#author option:selected').text();
  var translator = $('input[name=translator]').val().trim();
  var tlLink = $('input[name=tlLink]').val().trim();

  if($('input[name=tlLocation]:checked').val()=='wiki'){
    translator = "[User:" + translator + "|" + translator + "]";
  }
  else if($('input[name=tlLocation]:checked').val()=='external'){
    translator = tlLink + " " + translator;
  }

  var writerCol = $('input[name=writerCol]').val();
  var locationCol = $("input[name=locationCol]").val();
  var bottomCol = $('input[name=bottomCol]').val();
  var textCol = $('input[name=textCol]').val();

  var tlNotes = $('#tlArea').val().trim();
  tlNotes = tlNotes.split(/\n/);
  var tlDict = {};
  tlNotes.forEach(function(exp){
    tlDict[exp.slice(0,exp.indexOf("]")+1)] = exp.trim();
  });

  var header =
`{| class="article-table" cellspacing="1/6" cellpadding="2" border="1" align="center" width="100%"
! colspan="2" style="text-align:center;background-color:${writerCol}; color:${textCol};" |'''Writer:''' ${author}"
|-
| colspan="2" |[[File:HEADERFILE|660px|link=|center]]"
|-
! colspan="2" style="text-align:center;background-color:${locationCol}; color:${textCol}; |'''Location: ${location.trim()}'''
`;
  var dialogueRender =
`|-
|[[File:FILENAME|x200px|link=|center]]
|
`;
  var footer = 
`|-
! colspan="2" style="text-align:center;background-color:${bottomCol};color:${textCol};" |'''Translation: [${translator}] '''" 
|}`;

  var output;

  var input = $('#inputArea').val().trim();
  input = input.split(/\n/);
  var currentName = "";
  var tlExp = /\[\d\]/;
  var tlToInput = "";
  output = header;
  input.forEach(function(exp){
    if(exp != ""){ //omit empty lines
      var firstWord = exp.split(" ")[0]; //check if current line has new chara speaking
      if(!firstWord.includes(":")){ //if not
        output += exp + "\n\n"; //add dialogue line to output
      }
      else{
        var character = exp.slice(0,exp.indexOf(":"));
        console.log(character);
        exp = exp.slice(exp.indexOf(":") + 1).trim();
        var renderFile = dialogueRender;
        var id = "#" + character[0].toUpperCase() + character.slice(1,character.length);
        output += renderFile.replace("FILENAME", $(id).val().trim());
        output += exp + "\n\n";
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
      var tlMarkers = exp.match(tlExp);
      //console.log(tlMarkers);
      if(tlMarkers!=null){
        var note = "\'\'" + tlDict[tlMarkers[0]] + "\'\'" + "\n\n";
        tlToInput = note;
      }
    }
  });
  if(tlToInput!=""){
    output += tlToInput;
  }
  output += footer;

  $('#outputArea').val(output);
  return false;
}
