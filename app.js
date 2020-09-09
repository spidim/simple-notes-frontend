const defaultNoteColor = 'lightgrey'; // New notes take this colour by default

const supportedColors = ['lightgrey', 'yellow', 'orange', 'gray', 'lightgreen',
                        'lightblue']; // Add as many as you like here

var notes = []; // A dummy note store. Should be replaced by a DB store

var currIndex = 0; // current index of notes

initDemoNotes(); // Fill the store with the demo notes
loadDemoNotes(); // Load the demo notes in the frontend

function increaseIndex(newIndex=null) //AUTO-INCREMENT index emulation
{
    if (newIndex!==null)
    {
        currIndex = newIndex;
    }
    else {
        currIndex++;
    }
    return currIndex;
}


/**
    Fills the demo store with a set of notes
*/
function initDemoNotes()
{
    notes = [{
        id: 0,
        text: 'This is a long note created for demonstration. \
                Original colour is light gray. You can try to scroll \
                this note up and down to see the rest of the content. \
                Lorem ipsum dolor sit amet,\
                 consectetur adipiscing elit, sed do eiusmod tempor \
                 incididunt ut labore et dolore magna aliqua. Ut \
                 enim ad minim veniam, quis nostrud exercitation \
                 ullamco laboris nisi ut aliquip ex ea commodo consequat. \
                 Duis aute irure dolor in reprehenderit in voluptate velit \
                 esse cillum dolore eu fugiat nulla pariatur. Excepteur sint \
                 occaecat cupidatat non proident, sunt in culpa qui officia \
                 deserunt mollit anim id est laborum',
        color: 'lightgray'
    },
    {
        id: 1,
        text: 'This is another sample note. Original colour is orange',
        color: 'orange'
    },
    {
        id: 2,
        text: 'This is a sample note created for demonstration. Original colour yellow',
        color: 'yellow'
    }];
    increaseIndex(4);
}

/**
    Emulated REST Create note call to the dummy store
*/
function addNoteInStore(note)
{
    notes.push(note);
    console.log("Store updated: New store",notes);
}

/**
    Emulated REST Read note call to the dummy store
*/
function getNoteFromStore(id)
{
    let note = notes.find(item => item.id === id);
    return note;
}

/**
    Emulated REST Update note call to the dummy store
*/
function editNoteInStore(note)
{
    let index = notes.findIndex(item => item.id === note.id);
    if (index>=0 && index<notes.length)
    {
        notes[index] = note;
        console.log("Store updated: New store",notes);
    }
    else
    {
        console.log("Cannot find note with id ",note.id)
    }
}

/**
    Emulated REST Delete note call to the dummy store
*/
function removeNoteFromStore(id)
{
    let index = notes.findIndex(item => item.id === id);
    if (index>=0 && index<notes.length)
    {
        notes.splice(index,1);
        console.log("Store updated: New store",notes);
    }
    else
    {
        console.log("Cannot find note with id ",id)
    }
}

/******************************************************************************
    Creates the mini toolbar for each note
    @noteElement: The note element in the DOM.
    @id: The id of the note in the store
*******************************************************************************/
function createToolbar(noteElement,id)
{
    let toolbarDiv = document.createElement('div');
    toolbarDiv.className = 'toolbar';
    let toolbarRemoveDiv = document.createElement('div');
    toolbarRemoveDiv.className = 'toolbarRemoveDiv';
    toolbarRemoveDiv.onclick = (toolbarDiv) => deleteNote(noteElement,id);
    toolbarRemoveDiv.innerHTML = '<span class="glyphicon glyphicon-remove"></span>';
    toolbarDiv.appendChild(toolbarRemoveDiv);
    let toolbarColorDiv = document.createElement('div');
    toolbarColorDiv.className = 'toolbarColorGroup';

    for (let i = 0 ; i<supportedColors.length; i++)
    {
        let color = supportedColors[i];
        let toolbarColorItem = document.createElement('div');
        toolbarColorItem.className = 'toolbarColorItem';
        toolbarColorItem.style.backgroundColor = color;
        toolbarColorItem.addEventListener('click', function() {
            changeNoteColor(noteElement,color);
            let tempNote = getNoteFromStore(id);
            tempNote.color = color;
            editNoteInStore(tempNote);
        });

        toolbarColorDiv.appendChild(toolbarColorItem);
    }
    toolbarDiv.appendChild(toolbarColorDiv);
    return toolbarDiv;
}

/**
    Load the initial demonstration notes
*/
function loadDemoNotes()
{
    notes.forEach(note => {
            addNewNote('end',note);
        });
}


/*************************************************************************
    Adds a note in the DOM. Create a new or add the given one
    @position: can be either 'first' or 'last', the position in the array
    @note: the note object to add or null for new
***************************************************************************/
function addNewNote(position='first',note=null)
{
    let noteIsNew = false;
    if (note===null)
    {
        note = {};
        note.id = increaseIndex();
        note.text = 'Add your note here!';
        note.color = defaultNoteColor;
        noteIsNew = true;
        addNoteInStore(note);
    }
    notesContainer = document.getElementById('notes_container');
    let newNoteDiv = document.createElement('div');
    let newNoteToolbar = createToolbar(newNoteDiv,note.id);
    newNoteDiv.className = 'notebox';
    newNoteDiv.onmouseover = (newNoteDiv) => showToolbar(newNoteToolbar);
    newNoteDiv.onmouseout = (newNoteDiv) => hideToolbar(newNoteToolbar);
    let newNoteText = document.createElement('div');
    newNoteText.contentEditable = true;
    newNoteText.className = 'notetext';
    newNoteText.addEventListener('focus', function(){
        resetText(newNoteText);
    });

    newNoteText.addEventListener('focusout', function(){
        let tempNote = getNoteFromStore(note.id);
        note.text = newNoteText.innerHTML;
        editNoteInStore(tempNote);
    });

    newNoteDiv.style.backgroundColor = note.color;
    newNoteText.innerHTML = note.text;
    newNoteText.setAttribute("data-isnew", noteIsNew);
    newNoteText.setAttribute("data-index", note.id);
    newNoteDiv.appendChild(newNoteToolbar);
    newNoteDiv.appendChild(newNoteText);

    if (position==='last')
    {
        notesContainer.appendChild(newNoteDiv);
    }
    else {
        notesContainer.insertBefore(newNoteDiv,notesContainer.childNodes[0]);
    }
}

function showToolbar(toolbar)
{
    toolbar.style.visibility = 'visible';
}

function hideToolbar(toolbar)
{
    toolbar.style.visibility = 'hidden';
}

/**
    Delete a note element from store and from DOM
*/
function deleteNote(note,id)
{
    removeNoteFromStore(id);
    note.remove();
}

/**
    Reset text of a new element to remove initial tip
*/
function resetText(notetext)
{
    if (notetext.getAttribute("data-isnew") === "true")
    {
        notetext.innerHTML = "";
        notetext.setAttribute("data-isnew", "false");
    }
}

function changeNoteColor(noteElement,color)
{
    noteElement.style.backgroundColor = color;
}
