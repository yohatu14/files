
const apiBaseUrl = "https://ai-writer-app-17fc698ce860.herokuapp.com";
const buttonsSelection = `
<div class="dropdown">
  <div class="dropbtn"><i class="fa fa-pencil-square-o fa-3x"></i></div>
  <div id="myDropdown" class="dropdown-content">
   <section id="grammatic-button"><div><svg class="fa fa-spell-check" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M272 256h91.36c43.2 0 82-32.2 84.51-75.34a79.82 79.82 0 0 0-25.26-63.07 79.81 79.81 0 0 0 9.06-44.91C427.9 30.57 389.3 0 347 0h-75a16 16 0 0 0-16 16v224a16 16 0 0 0 16 16zm40-200h40a24 24 0 0 1 0 48h-40zm0 96h56a24 24 0 0 1 0 48h-56zM155.12 22.25A32 32 0 0 0 124.64 0H99.36a32 32 0 0 0-30.48 22.25L.59 235.73A16 16 0 0 0 16 256h24.93a16 16 0 0 0 15.42-11.73L68.29 208h87.42l11.94 36.27A16 16 0 0 0 183.07 256H208a16 16 0 0 0 15.42-20.27zM89.37 144L112 75.3l22.63 68.7zm482 132.48l-45.21-45.3a15.88 15.88 0 0 0-22.59 0l-151.5 151.5-55.41-55.5a15.88 15.88 0 0 0-22.59 0l-45.3 45.3a16 16 0 0 0 0 22.59l112 112.21a15.89 15.89 0 0 0 22.6 0l208-208.21a16 16 0 0 0-.02-22.59z"/></div>Gramática/Ortografía</section> 
   <section id="transcription-button"><div><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><style>svg{fill:#000000}</style><path d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V285.7l-86.8 86.8c-10.3 10.3-17.5 23.1-21 37.2l-18.7 74.9c-2.3 9.2-1.8 18.8 1.3 27.5H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128zM549.8 235.7l14.4 14.4c15.6 15.6 15.6 40.9 0 56.6l-29.4 29.4-71-71 29.4-29.4c15.6-15.6 40.9-15.6 56.6 0zM311.9 417L441.1 287.8l71 71L382.9 487.9c-4.1 4.1-9.2 7-14.9 8.4l-60.1 15c-5.5 1.4-11.2-.2-15.2-4.2s-5.6-9.7-4.2-15.2l15-60.1c1.4-5.6 4.3-10.8 8.4-14.9z"/></svg></div>Parafrasear</section> 
   </div>
</div>
`
const modalComponentGrammar = `
  <span class="closebtn" onclick="this.parentElement.style.display='none';">&times;</span> 
  <strong>Genial!</strong> He corregido la gramatica y ortografía de tu texto.
`
const modalComponentParaph = `
  <span class="closebtn" onclick="this.parentElement.style.display='none';">&times;</span> 
  <strong>Genial!</strong> He parafraseador tu texto, y lo he reemplazado por mi sugerencia.
`
const modalComponentError = `
  <span class="closebtn" onclick="this.parentElement.style.display='none';">&times;</span> 
  <strong>Lo siento!</strong> En estos momentos no puedo realizar tu solicitud. Por favor intenta mas tarde.
`
const backButton = `
<div id="backia-button" class="backia-button"><span class="tooltiptext" >Regresar al texto anterior</span><i class="fa fa-chevron-circle-left fa-2x"></i></div>
<div id="okia-button" class="okia-button"><span class="tooltiptext">Aceptar el nuevo texto</span><i class="fa fa-check-circle-o fa-2x"></i></div>
`
const spanError = `
<span class="closebtn" onclick="this.parentElement.style.display='none';">&times;</span> 
<strong>Lo siento!</strong> No puedo realizar tu solicitud, por favor intenta seleccionando solo un parrafo.
`

var counter = 0
var textSelected, textReplaced = ""
var gettingfetch = false;
var lastSelection = null;
var pageX, pageY = null;
var inSelection = false;

async function loadFunction() {


  // Mouse up event handler function
  if (!document.querySelector(".menu")) {
    await createAiMenu()
  }
  async function handlerFunction(event) {
    console.log("window.getSelection()", window.getSelection())
    if (window.getSelection().type.includes("Range")) {
      const selection = window.getSelection();
      textSelected = window.getSelection().toString();
      console.log("textSelected", textSelected)
      if (textSelected.length > 0 && window.getSelection().anchorOffset > 0) {


        const resize_ob = new ResizeObserver(async function (entries) {
          // since we are observing only a single element, so we access the first element in entries array
          if (!inSelection) {
            inSelection = true;

            const created = await createAiMenu()
            const posX = event.clientX;
            const posY = event.clientY;

            if (created) {
              await setPosition(selection, posX, posY)
            }
          }
        }
        );

        // start observing for resize
        resize_ob.observe(document.getElementById("editor-container"));

        textSelected = window.getSelection().toString();
        const created = await createAiMenu()
        const posX = event.clientX;
        const posY = event.clientY;

        if (created) {
          await setPosition(selection, posX, posY)
        }
      }
      lastSelection = window.getSelection()
    }

    if (window.getSelection().type.includes("Caret")) {
      if (window.getSelection().toString() === "") {
        const menu = document.querySelector(".menu");
        menu.style.display = "none";
        const btn = document.querySelector(".backia-section");
        btn.style.display = "none";
      }

      var gramaticbtn = document.getElementById("grammatic-button");
      var transbtn = document.getElementById("transcription-button");
      var backbtn = document.getElementById("backia-button");
      var okbtn = document.getElementById("okia-button");

      /////GRAMMATIC
      gramaticbtn.addEventListener("click", async () => {
        if (!gettingfetch) {
          addLoader()
          const responseGrammar = await sendGrammatic(textSelected);
          if (responseGrammar) {
            const replaceResult = replaceText(textSelected, responseGrammar)
            if (replaceResult) {
              const menu = document.querySelector(".menu");
              menu.style.display = "none";
              removeLoader()
              addAlertMessage(type = "grammar");
              setTimeout(removeAlertMessage, 6000);
            }
          } else {
            const menu = document.querySelector(".menu");
            menu.style.display = "none";
            removeLoader();
            addErrorMessage();
            setTimeout(removeErrorMessage, 6000);
            document.querySelector(".ai-class-selected") && await document.querySelector(".ai-class-selected").setAttribute("class", "")
          }
        }
        //window.getSelection().toString() = ""
      });


      //PARAFRASEO
      transbtn.addEventListener("click", async () => {

        if (!gettingfetch) {
          addLoader()
          const responseParagraph = await sendTranscript(textSelected);
          if (responseParagraph) {
            const menu = document.querySelector(".menu");
            menu.style.display = "none";
            const replaceResult = replaceText(textSelected, responseParagraph)
            if (replaceResult) {
              const menu = document.querySelector(".menu");
              menu.style.display = "none";
              removeLoader();
              addAlertMessage(type = "paragraph");
              setTimeout(removeAlertMessage, 6000);
              addBackButton()
            }
          } else {
            const menu = document.querySelector(".menu");
            menu.style.display = "none";
            removeLoader();
            addErrorMessage();
            setTimeout(removeErrorMessage, 6000);
            document.querySelector(".ai-class-selected") && await document.querySelector(".ai-class-selected").setAttribute("class", "")
          }
        }
      });

      //BACK
      backbtn.addEventListener("click", async () => {
        if (!gettingfetch) {
          gettingfetch = true
          const result = await backReplaceText()
          if (result) {
            const btn = document.querySelector(".backia-section");
            btn.style.display = "none";
            document.querySelector(".ai-class-selected") && await document.querySelector(".ai-class-selected").setAttribute("class", "")
            textSelected = ""
          }
          gettingfetch = false;
        }
      });

      //OK
      okbtn.addEventListener("click", async () => {
        if (!gettingfetch) {
          gettingfetch = true;
          const btn = document.querySelector(".backia-section");
          btn.style.display = "none";
          textSelected, textReplaced = ""
          document.querySelector(".ai-class-selected") && await document.querySelector(".ai-class-selected").setAttribute("class", "")
          gettingfetch = false;
        }
      });
    }
  }
  try {
    const content = document.getElementById("editor-container");
    content.addEventListener('mouseup', handlerFunction, false);
  } catch (error) {
    console.log("not loaded")
  }

}

setTimeout(loadFunction, 3000);

// var pageX, pageY;
// var isTraslating = false;
function addAlertMessage(type) {
  const el = document.createElement('div');
  el.classList.add('completedaiaction');
  if (type === "grammar") {
    el.innerHTML = modalComponentGrammar;
  } else if (type === "paragraph") {
    el.innerHTML = modalComponentParaph;
  }
  document.body.appendChild(el);
  gettingfetch = false;
}
function removeAlertMessage() {
  const element = document.querySelector(".completedaiaction");
  element && element.remove();
}

async function addLoader() {
  const el = document.createElement('div');
  el.classList.add('loading');
  const container = document.getElementById("editor-container")
  container.appendChild(el);
}

function removeLoader() {
  const element = document.querySelector(".loading");
  element && element.remove();
}

async function addErrorMessage() {
  const el = document.createElement('div');
  el.classList.add('erroraimessage');
  el.innerHTML = modalComponentError;
  document.body.appendChild(el);
  gettingfetch = false;
}
function removeErrorMessage() {
  const element = document.querySelector(".erroraimessage");
  element.remove();
}

async function addErrorSpanMessage() {
  const el = document.createElement('div');
  el.classList.add('erroraimessagespan');
  el.innerHTML = spanError;
  document.body.appendChild(el);
  gettingfetch = false;
}

function removeErrorSpanMessage() {
  const element = document.querySelector(".erroraimessagespan");
  element.remove();
}

async function addBackButton() {
  const menu = document.querySelector(".menu");
  const btn = document.querySelector(".backia-section");
  menu.style.display = "none";
  btn.style.display = "block";
  btn.style.left = menu.style.left
  btn.style.top = menu.style.top;
}

function createAiMenu() {
  try {

    if (!document.querySelector(".menu")) {
      const container = document.getElementById("editor-container")
      const el = document.createElement('div');
      el.classList.add('menu');
      el.innerHTML = buttonsSelection;
      container.appendChild(el);
    }
    if (!document.querySelector(".backia-section")) {
      const container = document.getElementById("editor-container")
      const btn = document.createElement('div');
      btn.classList.add("backia-section");
      btn.innerHTML = backButton;
      container.appendChild(btn);
    }


    return true;

  } catch (error) {
    return false;
  }
}

async function setPosition(selection, x, y) {

  const menu = document.querySelector(".menu");
  if (selection.rangeCount) {
    document.querySelector(".ai-class-selected") && await document.querySelector(".ai-class-selected").setAttribute("class", "")
    let parent = selection.getRangeAt(0).commonAncestorContainer;
    console.log("parent1", selection.rangeCount, selection.getRangeAt(0).startContainer)
    console.log("parent2", parent.nodeType, selection.parentNode)

    if (parent.nodeType != 1) {
      parent = await parent.parentNode;

      await parent.setAttribute("id", "ai-valuselected")
      await parent.setAttribute("class", `ai-class-selected`)
      let rect = document.getElementById("ai-valuselected")?.getBoundingClientRect();
      menu.style.display = "block";
      menu.style.left = Math.round(rect.left) - 120 + "px";
      menu.style.top = y - Math.round(rect.top) + 200 + "px";
      const btn = document.querySelector(".backia-section");
      btn.style.display = "none";
      inSelection = false;
    }
  }
}

function getSelectionParentElement() {
  var parent = null,
    selection;
  if (window.getSelection().toString().length > 0) {
    selection = window.getSelection();
    if (selection.rangeCount) {
      parent = selection.getRangeAt(0).commonAncestorContainer;
      if (parent.nodeType != 1) {
        parent = parent.parentNode;
        return parent;
      }
    }
  } else {
    return null;
  }
}

async function sendGrammatic(textSelected) {
  gettingfetch = true;
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "https://ai-writer-app-17fc698ce860.herokuapp.com",
      'Access-Control-Allow-Methods': 'GET, POST, FETCH',
      "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    },
    body: JSON.stringify({ text: textSelected }),
  };

  try {
    const res = await fetch(`${apiBaseUrl}/gramatical`, requestOptions);
    const data = await res.json();
    var newText = data.response_text?.toString().split("\n").join("");
    return newText.toString();
  } catch (e) {
    return false;
  }
}
async function sendTranscript(textSelected) {
  gettingfetch = true;
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "https://ai-writer-app-17fc698ce860.herokuapp.com",
      'Access-Control-Allow-Methods': 'GET, POST, FETCH',
      "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    },
    body: JSON.stringify({ text: textSelected }),
  };

  try {
    const res = await fetch(`${apiBaseUrl}/paraphrase`, requestOptions);
    const data = await res.json();
    var newText = data.response_text?.toString().split("\n").join("");
    return newText;
  } catch (e) {
    return false;
  }
}

async function replaceText(selectedText, newText) {
  try {
    var sp2 = document.querySelector(".ai-class-selected");
    const testStr = sp2.textContent;
    textReplaced = sp2.textContent;
    if (testStr.trim().toString() === selectedText.trim().toString()) {
      sp2.textContent = newText;
    } else {
      const newStr = testStr.replace(selectedText, newText);
      sp2.textContent = newStr;
    }
    return true;
  } catch (error) {
    console.log("error", error)
    const menu = document.querySelector(".menu");
    menu.style.display = "none";
    removeLoader();
    addErrorSpanMessage();
    setTimeout(removeErrorSpanMessage, 6000);
    document.querySelector(".ai-class-selected") && await document.querySelector(".ai-class-selected").setAttribute("class", "")
    return false;
  }
}

function backReplaceText() {
  try {
    var sp2 = document.querySelector(".ai-class-selected");
    sp2.textContent = textReplaced;
    return true;
  } catch (error) {
    console.log("error", error)
    return false;
  }
}

async function doSomethingWithSelectedText() {
  var selectedText = getSelectedText();
  const selection = window.getSelection();
  var menu = document.querySelector(".menu");
  if (selectedText && selectedText != "") {
    if (selection.rangeCount) {
      createAiMenu();
      let parent = selection.getRangeAt(0).commonAncestorContainer;
      if (parent.nodeType != 1) {
        parent = await parent.parentNode;
        await parent.setAttribute("id", "mi-valor")
        let rect = document.getElementById("mi-valor")?.getBoundingClientRect();
        menu.style.display = "block";
        menu.style.left = 340 - Math.round(rect.left) + 170 + "px";
        menu.style.top = pageY - Math.round(rect.top) + 190 + "px";
        actuaSelectedText = selectedText;
      }
    }

  }
}


