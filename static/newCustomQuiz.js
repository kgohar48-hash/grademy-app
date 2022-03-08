var string1 = '';
var arr = [];
var arr2 = [];
var arr3=[];
var dataArray = {}
var subjectData = []
var mcqsInfo = {
    "FUNG": {
      "physics": {
        "MEASUREMENT": 31,
        "Vectors and Equilibrium": 108,
        "Motion and Force": 202,
        "Work and Energy": 172,
        "Circular Motion": 225,
        "Fluid Dynamics": 93,
        "Oscillations": 112,
        "Waves": 213,
        "Physical Optics": 92,
        "Optical Instruments": 94,
        "Heat & Thermodynamic": 30,
        "Electrostatics": 274,
        " Current Electricity": 221,
        "Electromagnetism": 271,
        "Electromagnetic Induction": 238,
        "Alternating Current": 214,
        "Physics of Solid": 218,
        " Electronics": 238,
        " Dawn of Modern Physics": 274,
        "Atomic Spectra": 220,
        " Nuclear Physic": 351,
        "Motion": 47,
        "CENTER OF MASS AND LINEAR MOMENTUM": 40,
        "test": 3,
        "Heat & Thermodynamics": 185,
        "PMC MDCAT 2021": 120,
        "Measurement": 37
      },
      "chemistry": {
        "Basic Concepts": 150,
        "Experimental techniques in chemistry": 59,
        "Gases": 108,
        " Liquids and Solids": 80,
        "Atomic structure": 128,
        "Chemical Bonding": 126,
        "Thermochemistry": 69,
        "Chemical Equilibrium": 78,
        "Solutions": 87,
        "Electrochemistry": 86,
        "Reaction Kinetics": 63,
        "Periodic Classification of Elements and Periodicity ": 67,
        "S-Block Elements": 61,
        " Group IIIA & IVA Elements ": 68,
        "IV-A and VI-A Elements": 77,
        "The Halogens and The Noble Gases": 78,
        "Transition Elements": 75,
        "Fundamental Principles of Organic Chemistry": 64,
        "Aliphatic Hydrocarbons": 72,
        "Aromatic Hydrocarbons": 67,
        "Alkyl Halides ": 71,
        "Alcohols, Phenols and Ethers": 83,
        "Aldehydes and Ketones ": 75,
        "Carboxylic Acid": 94,
        "Macromolecules": 88,
        "Common Chemical Industries in Pakistan": 71,
        "Environmental Chemistry": 79,
        "postedbyacademy": 11
      },
      "english": {
        "Sentence Completion": 44,
        "Choose Correct Sentence": 90,
        "Spot The Error": 54,
        "VOCABULARY": 90,
        "Adverb": 30,
        "Article": 30,
        "First half syllabus": 30,
        "PARALLELISM, NARRATION": 28,
        "PREPOSITION": 30,
        "Test Pronoun": 30,
        "sentence completion": 8,
        "spot the error": 32,
        "synonyms": 41,
        "test": 1
      },
      "math": {
        "Number System": 37,
        "Set, Functions and Groups": 36,
        "Matrics and Determinants": 29,
        "Quadratic Equations": 30,
        " Partial Fractions": 25,
        "Sequences and Series": 30,
        "Permutation, Combination & Probability ": 39,
        " Mathematical Induction and binomial theorem ": 32,
        "Trigonometry": 35,
        "Functions and Limits": 17,
        "Differentiation": 19,
        "Integration": 11,
        "Analytic Geometry ": 39,
        " Linear Inequalities and Linear Programming": 28,
        "Conic section": 32,
        "Vectors": 25,
        "test": 2
      },
      "biology": {
        "Introduction": 250,
        "Biological Molecules": 194,
        "Enzymes": 73,
        "The Cell": 141,
        "Variety of Life": 121,
        "Kingdom Prokaryotae(Monera)": 107,
        "The Kingdom Protista": 99,
        "Fungi": 139,
        "Kingdom Plantae": 158,
        "Kingdom Animalia": 201,
        "Bioenergetics": 182,
        "Nutrition": 175,
        "Gaseous Exchange": 159,
        "Transport": 252,
        "Homeostasis": 171,
        "Support and Movements": 340,
        "Coordination and Control": 165,
        "Reproduction": 178,
        "Growth and Development": 126,
        "Chromosomes And DNA": 100,
        "Cell Cycle": 97,
        "Variation And Genetics": 292,
        "Biotechnology": 133,
        "Evolution": 86,
        "Ecosystem": 82,
        "Some Major Ecosystems": 96,
        "Man And His Environment": 210
      }
    },
    "MDCAT": {
      "physics": {
        "3": 1,
        "6": 1,
        "Electromagnetism": 1,
        "test": 1
      },
      "biology": {
        "Cell structure and function": 40
      }
    }
}

dataArray.biology =  dataExtraction(mcqsInfo.FUNG.biology || mcqsInfo.MDCAT.biology)
dataArray.math =  dataExtraction(mcqsInfo.FUNG.math)
dataArray.physics =  dataExtraction(mcqsInfo.FUNG.physics)
dataArray.chemistry =  dataExtraction(mcqsInfo.FUNG.chemistry)
dataArray.english =  dataExtraction(mcqsInfo.FUNG.english)

document.getElementById("add").addEventListener("click",()=>{
    index = document.getElementById("addons").value
    arr = []
    for(var i = 1 ; i <= index;i++){
        string1 =  '<div class="form-inline"><div class="input-group mb-3 mr-4"><div class="input-group-prepend"><label class="input-group-text">Subject</label></div><select name="subjects" class="custom-select" id="subjectname'+ i.toString() +'" required><option selected value="" >Choose...</option></select></div><div class="input-group mb-3 mr-4"><div class="input-group-prepend"><label class="input-group-text">Chapter</label></div><select name="chapters" class="custom-select" id="chaptername'+ i.toString() +'" required><option selected value="" >Choose...</option></select></div><div class="input-group mb-3"><div class="input-group-prepend"><label class="input-group-text">Number of Mcqs</label></div><select name="numberOfMcqs" class="custom-select" id="numberofmcqs'+ i.toString() +'" required><option selected value="" >Choose...</option></select></div></div>'
        arr.push(string1)
    }
    var sum = arr.reduce(function(a, b){
        return a + b;
    }, );
    document.getElementById("addon").innerHTML = sum ;
    for(var i = 1 ; i <=  index;i++){
        displayoptions1(i)
    }
    
    document.getElementById("submit").innerHTML = '<input type="submit" class="btn btn-primary">'
    
})
    
function displayoptions1(index){
    document.getElementById("subjectname"+index).addEventListener("click" , ()=>{
        document.getElementById("numberofmcqs"+index) .innerHTML = '<option selected value="" >Choose...</option>'
        document.getElementById("chaptername" +index).innerHTML = '<option selected value="" >Choose...</option>'
        if(document.getElementById("subjectname"+index).value == ""){
            if(document.getElementById("category").value == "MDCAT"){
                document.getElementById("subjectname"+index).innerHTML = '<option value="biology" >Biology</option><option value="chemistry" >Chemistry</option><option value="physics" >Physics</option><option value="english" >English</option>'
            }
            if(document.getElementById("category").value == "FUNG"){
                document.getElementById("subjectname"+index).innerHTML = '<option value="math" >Math</option><option value="chemistry" >Chemistry</option><option value="physics" >Physics</option><option value="english" >English</option>'
            }
            document.getElementById("chaptername" +index).addEventListener("click" , ()=>{
                document.getElementById("numberofmcqs"+index) .innerHTML = '<option selected value="" >Choose...</option>'
                if(document.getElementById("chaptername" +index).value == ""){
                    arr2 = [];
                    for(cn=0 ; cn < dataArray[document.getElementById("subjectname"+index).value].length; cn++){
                        chapternamehtml = '<option value="'+ dataArray[document.getElementById("subjectname"+index).value][cn].name +'">'+ dataArray[document.getElementById("subjectname"+index).value][cn].name +'</option>'
                        arr2.push(chapternamehtml)
                        if(cn == dataArray[document.getElementById("subjectname"+index).value].length -1 ){
                            var sum = arr2.reduce(function(a, b){
                                return a + b;
                            }, );
                            document.getElementById("chaptername" +index).innerHTML = sum ;
                            document.getElementById("numberofmcqs"+index) .addEventListener("click" , ()=>{
                                if(document.getElementById("numberofmcqs"+index).value == ""){
                                    arr3 = []
                                    chapterIndex = checkChapterIndex(document.getElementById("chaptername" +index).value , document.getElementById("subjectname" +index).value )
                                    numberOfMcqs = Number(dataArray[document.getElementById("subjectname"+index).value][chapterIndex].mcqs)
                                    for(nom = 5 ; nom < numberOfMcqs + 1 ; nom = nom +5){
                                        stringNOM = '<option value="'+nom+'">'+ nom +'</option>'
                                        arr3.push(stringNOM)
                                        if( numberOfMcqs - nom <= 5){
                                            var sum = arr3.reduce(function(a, b){
                                                return a + b;
                                            }, );
                                            document.getElementById("numberofmcqs"+index) .innerHTML = sum ;
                                        }
                                    }
                                }
                            })
                        }
                    } 
                }
            })
        }
    })
}

function dataExtraction(subject){
  subjectData = []
  chapterNames = Object.keys(subject)
  for(var i =0 ; chapterNames.length >= i ; i++){
    if( i == chapterNames.length){
      return subjectData;
    }else{
      subjectData.push({name : chapterNames[i] , mcqs : subject[chapterNames[i]]})
    }
  }
  
}

function checkChapterIndex(name , subject) {
    for(var i = 0 ; dataArray[subject].length > i ; i++ ){
        if(dataArray[subject][i].name == name ){
            return i
        }
    }
    
}
