function setup(){
  $('#defaultOpen').click();

  $('#linkErrMsg').hide();

  var placeholder = "Example of dialogue format:\n(what's important is that each line of dialogue has a name followed by \":\" and is on a new line)\n\nRitsu: Yes, this is love… No matter when or where, Maa-kun and I are bonded by it.\n\nArashi: Mmhmm, I think so too~ That’s love right there.\n\nArashi: I’m so jealous~ You have such a wonderful romance…";
  $('#inputArea').attr('placeholder', placeholder);

  var placeholder1 = 'Paste the numbered translation notes (separated by line breaks) into here.';
  $('#tlArea').attr('placeholder', placeholder1);

  $('input[name=tlLink]').hide();

  console.log($('#inputArea').height());
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

//Updating Renders tab based on dialogue input
var namesSet = new Set();
function updateRenders(){
  var input=$('#inputArea').val();
  input = input.split(/\n/);
  console.log(input);
  var names = [];
  input.forEach(function(exp){
    if(exp != ""){
      names.push(exp.slice(0,exp.indexOf(":")));
    }
  });
  names = new Set(names);

  //deletes divs that no longer exist in the new dialogue
  //deletes option from the link menu
  namesSet.forEach(function(exp){
    if(!names.has(exp)){
      namesSet.delete(exp);
      var cls = "." + exp;
      $(cls).remove();
      exp = exp[0].toUpperCase() + exp.slice(1,exp.length);
      $('option:contains(' + exp + ')').remove();
    }
  });

  names.forEach(function(exp){
    //format name slightly
    exp = exp[0].toUpperCase() + exp.slice(1,exp.length);
    //keeps the previously existing divs so that renders don't have to be re-entered
    if(!namesSet.has(exp)){
      namesSet.add(exp);
      //make input box for the render labeled w/ a name
      var newDiv = $("<div></div>").addClass(exp);
      var newLabel = $("<label></label>").text(exp);
      var newInput = $("<input>").attr("id",exp);
      $(newDiv).append(newLabel);
      $(newDiv).append(newInput);
      $('#renderForms').append(newDiv);
      //add name option to dropdown menu of render page links
      var sel = document.getElementById("linkToRenders");
      var opt = document.createElement("option");
      opt.text = exp;
      sel.add(opt);
    }
  });
}

function openLink(){
  var namesList = ['Tetora_Nagumo',
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
var name = $("#linkToRenders option:selected").text();
for(i = 0; i < namesList.length; i++) {
  if(namesList[i].split('_')[0] == name){
    $('#linkErrMsg').hide();
    var url = "http://ensemble-stars.wikia.com/wiki/NAME/Gallery#Renders".replace("NAME", namesList[i]);
    window.open(url, "_blank");
    return;
  }
}
$('#linkErrMsg').show();
}

function convertText(){
  var header =
  "{| class=\"article-table\" cellspacing=\"1/6\" cellpadding=\"2\" border=\"1\" align=\"center\" width=\"100%\"" + "\n" +
  "! colspan=\"2\" style=\"text-align:center;background-color:#WRITERCOLOR; color:#TEXTCOLOR;\" |'''Writer:''' AUTHOR" + "\n" +
  "|-" + "\n" +
  "| colspan=\"2\" |[[File:HEADERFILE|660px|link=|center]]" + "\n" +
  "|-" + "\n" +
  "! colspan=\"2\" style=\"text-align:center;background-color:#LOCATIONCOLOR; color:#TEXTCOLOR;\" |'''Location: SETTING'''\n";
  var dialogueRender =
  "|-" + "\n" + "|[[File:FILENAME|x200px|link=|center]]" + "\n" + "|" + "\n";
  var footer = "|-" + "\n" +
  "! colspan=\"2\" style=\"text-align:center;background-color:#BOTTOMCOLOR;color:#TEXTCOLOR;\" |'''Translation: [TLER] '''" +
  "\n" +
  "|}";

  var location = $('input[name=location]').val();
  var author = $('select[name=author] option:selected').text();
  var translator = $('input[name=translator]').val().trim();
  var tlLink = $('input[name=tlLink]').val().trim();

  if($('input[name=tlLocation]:checked').val()=='wiki'){
    translator = "[User:" + translator + "|" + translator + "]";
  }
  else if($('input[name=tlLocation]:checked').val()=='external'){
    translator = tlLink + " " + translator;
  }

  var writerCol = $('input[name=writerCol]').val().replace(/#/g, "");
  var locationCol = $("input[name=locationCol]").val().replace(/#/g, "");
  var bottomCol = $('input[name=bottomCol]').val().replace(/#/g, "");
  var textCol = $('input[name=textCol]').val().replace(/#/g, "");

  var tlNotes = $('#tlArea').val().trim();
  tlNotes = tlNotes.split(/\n/);
  var tlDict = {};
  tlNotes.forEach(function(exp){
    tlDict[exp.slice(0,exp.indexOf("]")+1)] = exp.trim();
  });

  console.log(tlDict);

  var output;

  header = header.replace("SETTING", location.trim());
  header = header.replace("AUTHOR", author);
  footer = footer.replace("TLER", translator);
  header = header.replace("WRITERCOLOR", writerCol);
  header = header.replace("LOCATIONCOLOR", locationCol);
  footer = footer.replace("BOTTOMCOLOR", bottomCol);
  header = header.replace(/TEXTCOLOR/g, textCol);
  footer = footer.replace("TEXTCOLOR", textCol);

  var input = $('#inputArea').val().trim();
  input = input.split(/\n/);
  var currentName = "";
  var tlExp = /\[\d\]/;
  var tlToInput = "";
  output = header;
  input.forEach(function(exp){
    if(exp != ""){
      var current = exp.slice(0,exp.indexOf(":"));
      exp = exp.slice(exp.indexOf(":") + 1).trim();
      if(current == currentName){
        output += exp + "\n\n";
      }
      else if(current != currentName){
        currentName = current;
        var renderFile = dialogueRender;
        var id = "#" + current[0].toUpperCase() + current.slice(1,current.length);
        if(tlToInput!=""){
          console.log(tlToInput)
          output += tlToInput;
          tlToInput = "";
        }
        output += renderFile.replace("FILENAME", $(id).val().trim());
        // output += dialogueRender;
        output += exp + "\n\n";
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
