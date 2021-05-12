var CURRENT = "";

// get element by id helper
function elt(id) {
    return document.getElementById(id)
}

function init(){
    TabController = new TabController();
    NoteController = new NoteController(TabController);
}

class TabController {
    constructor() {
        this.eltTab = elt("tab") // tab div
        this.eltAdd = elt("AddTab") // Add tab button
        this.eltAdd.addEventListener('click', () => this.addTab())
        this.eltDelete = elt("DeleteTab") // Delete tab button
        this.eltDelete.addEventListener('click', () => this.deleteTab())
        this.eltRename = elt("RenameTab") // Add tab button
        this.eltRename.addEventListener('click', () => this.renameTab())
        this.eltSelect = elt("SelectTab") // Add tab button
        this.eltSelect.addEventListener('change', () => this.selectTab())
        this.tabList = []
        this.eltNote = elt("indvNote") // note div
        this.fullData = {}
        this.loadRawData();
    }

    loadRawData(){
        const pNotes = fetch('http://localhost:8080/loadAll')
        const process = (obj) => {
            if(obj){
                this.initTabs(obj)
                this.initNotes()
                this.initSelect()
            }
        }

        pNotes.then((response) => response.json().then((v) => process(v)))
    }

    initNotes(){
        document.getElementById('indvNote').innerHTML = ""

        if (this.tabList.length > 0 ){
            this.tabList.forEach(indvNote => {
                var splitTitle = indvNote.split('.')
                const currentType = splitTitle[splitTitle.length-1]
                var note_input = document.createElement('div')
                note_input.classList.add('tabcontent')
                note_input.id = indvNote
                if(currentType == "md"){
                    note_input.innerHTML = marked(this.fullData[indvNote])
                }else{
                    var noteContent = document.createElement('p')
                    const contentValue = document.createTextNode('\n' + this.fullData[indvNote])
                    noteContent.appendChild(contentValue)
                    note_input.appendChild(noteContent)
                }

                this.eltNote.appendChild(note_input)

                }
            )

        }


    }

    initTabs(obj) {
        this.fullData = obj
        this.tabList = Object.keys(this.fullData)


        document.getElementById('tab').innerHTML = ""
        const titleList = this.tabList
        var tab_input = document.createElement('div')
        tab_input.classList.add('tab_input')
        tab_input.id = 'tab_input'
        this.eltTab.appendChild(tab_input)
        if (titleList.length > 0 ){
            titleList.forEach(title => {
                const currTab = document.createElement("button")
                currTab.classList.add("tablinks")
                currTab.addEventListener('click', function(){
                    openTab(event, title)
                })
                currTab.id = "btn" + title
                currTab.textContent = title

                tab_input.appendChild(currTab)
            })

        }
        // document.getElementById('indvNote').innerHTML = ""

    }

    initSelect(){
        elt("SelectTab").innerHTML = ""
        const titleList = this.tabList.slice()
        titleList.unshift("")
        if(titleList.length > 0 ){
            titleList.forEach(title =>{
                const currSelect = document.createElement("option")
                // currSelect.classList.add("tablinks")
                // currSelect.addEventListener('click', function(){
                //     elt()
                // })
                currSelect.text = title;
                currSelect.value = title

                elt("SelectTab").appendChild(currSelect)


            })
        }
    }

    addNewSelect(inputnewName){
        console.log("inputnewName")
        const currSelect = document.createElement("option")
        currSelect.text = inputnewName;
        currSelect.value = inputnewName
        elt("SelectTab").appendChild(currSelect)
    }

    selectTab(){
        var d = elt("SelectTab").value;
        var currBut = "btn" + d
        elt(currBut).click()
    }

    addTab(){
        let newTabName = prompt("Add new note name");
        if(newTabName.length == 0){
            alert("Must input a name")
            return
        }else if (this.tabList.includes(newTabName)){
            alert("The name already exists")
            return
        }
        else {
            this.fullData[newTabName] = ""
            this.tabList.push(newTabName)
            this.addNewNote(newTabName)
            this.addNewTab(newTabName)
            this.addNewSelect(newTabName)
        }

    }

    addNewTab(newTabName){
        var tab_input = elt('tab_input')
        const currTab = document.createElement("button")
        currTab.classList.add("tablinks")
        currTab.addEventListener('click', function(){
            openTab(event, newTabName)
        })
        currTab.id = "btn" + newTabName
        currTab.textContent = newTabName

        currTab.click()
        tab_input.appendChild(currTab)


    }

    addNewNote(newTabName) {

        var note_input = document.createElement('div')
        note_input.classList.add('tabcontent')
        note_input.id = newTabName

        var noteContent = document.createElement('p')
        const contentValue = document.createTextNode(this.fullData[newTabName])
        noteContent.appendChild(contentValue)
        note_input.appendChild(noteContent)

        this.eltNote.appendChild(note_input)

        this.newNoteJson(newTabName)

    }

    deleteTab(){
        delete this.fullData[CURRENT]
        this.tabList = Object.keys(this.fullData)
        this.initTabs(this.fullData)
        this.initSelect()
        this.deleteNoteJson(CURRENT)

    }

    renameTab(){
        // console.log("rename")
        var updateName = prompt("Rename Tab", CURRENT);
        var prev = CURRENT
        if(updateName.length == 0){
            alert("Must input a name")
            return
        }else if (this.tabList.includes(updateName)){
            alert("The name already exists")
            return
        }
        else {
            this.fullData[updateName] = this.fullData[CURRENT]
            delete this.fullData[CURRENT]
            this.tabList = Object.keys(this.fullData)
            this.initTabs(this.fullData)
            this.initNotes()
            this.initSelect()
        }

        CURRENT = updateName

        fetch(('http://localhost:8080/editTabName'), {
            method: 'POST',
            headers: {
                'Accept':'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({"prev": prev , "curr": updateName})
        })
            .then(response => response.json())
            .then((messages) => {
                console.log(messages);
            });

    }

    newNoteJson(data){
            fetch(('http://localhost:8080/newNoteJson'), {
                method: 'POST',
                headers: {
                    'Accept':'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(response => response.json())
                .then((messages) => {
                    console.log(messages);
                });
        }

    deleteNoteJson(data){
        fetch(('http://localhost:8080/deleteNoteJson'), {
            method: 'POST',
            headers: {
                'Accept':'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then((messages) => {
                console.log(messages);
            });
    }
}

class NoteController{
    constructor(TabContr){
        this.m = TabContr
        this.eltView = elt("view_btn") // Add tab button
        this.eltView.addEventListener('click', () => this.viewNote())
        this.eltEdit = elt("edit_btn") // Add tab button
        this.eltEdit.addEventListener('click', () => this.editNote())
        this.eltSave = elt("save_btn") // Add tab button
        this.eltSave.addEventListener('click', () => this.saveNote())
        this.eltImport = elt("file") // Add tab button
        this.eltImport.addEventListener('change', () => this.importFile())
        this.eltExport = elt("exportFile") // Add tab button
        this.eltExport.addEventListener('click', () => this.exportFile())
        this.currentNote = ""

    }

    viewNote(){
        this.eltView.disabled = true
        this.eltEdit.disabled = false
        this.eltSave.disabled = true

        var splitTitle = CURRENT.split('.')
        const currentType = splitTitle[splitTitle.length-1]
        var eltCurrent = elt(CURRENT)

        if(currentType == "md"){
            eltCurrent.innerHTML = marked(this.currentNote)
        }else {
            eltCurrent.innerHTML = ""
            var noteContent = document.createElement('p')
            const contentValue = document.createTextNode('\n' + this.currentNote)
            noteContent.appendChild(contentValue)
            eltCurrent.appendChild(noteContent)
        }

        this.m.eltNote.appendChild(eltCurrent)



    }

    editNote() {
        this.eltView.disabled = false
        this.eltEdit.disabled = true
        this.eltSave.disabled = false

        this.currentNote = this.m.fullData[CURRENT]

        var eltCurrent = elt(CURRENT)
        eltCurrent.innerHTML = ""



        var editContent = document.createElement('textarea')
        editContent.id = "edit_input"
        editContent.value = this.currentNote

        eltCurrent.appendChild(editContent)

    }

    loadimportData(loadTabName, loadedData){
        var note_input = document.createElement('div')
        note_input.classList.add('tabcontent')
        note_input.id = loadTabName

        var splitTitle = loadTabName.split('.')
        const currentType = splitTitle[splitTitle.length-1]

        if(currentType == "md"){
            note_input.innerHTML = marked(loadedData)
        }else {
            var noteContent = document.createElement('p')
            const contentValue = document.createTextNode('\n' + loadedData)
            noteContent.appendChild(contentValue)
            note_input.appendChild(noteContent)
        }

        this.m.eltNote.appendChild(note_input)
    }

    saveNote(){
        var curText = elt("edit_input")
        var updatedVal = curText.value
        this.m.fullData[CURRENT] = updatedVal
        this.currentNote = this.m.fullData[CURRENT]
        this.viewNote()

        fetch(('http://localhost:8080/updateNoteJson'), {
            method: 'POST',
            headers: {
                'Accept':'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({"title": CURRENT , "content": updatedVal})
        })
            .then(response => response.json())
            .then((messages) => {
                console.log(messages);
            });
        }

        importFile(){
            const importfileName = event.target.files[0].name;
            console.log(importfileName)
            fetch(('http://localhost:8080/importFile'), {
                method: 'POST',
                headers: {
                    'Accept':'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(importfileName)
            })
                .then(response => response.json())
                .then((messages) => {
                    if(messages == -1){
                        alert("Name already exists")
                    }else {
                        this.loadimportData(importfileName, messages);
                        this.m.addNewTab(importfileName);
                        this.m.addNewSelect(importfileName);
                        console.log(messages)
                    }
                });

        }

        exportFile(){
            fetch(('http://localhost:8080/exportFile'), {
                method: 'POST',
                headers: {
                    'Accept':'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({"title": CURRENT , "content": this.m.fullData[CURRENT]})
            })
                .then(response => response.json())
                .then((messages) => {
                    // console.log(messages)
                    alert("successfully exported")

                });
        }
}

function openTab(evt, tabName) {
    document.getElementById("DeleteTab").disabled=false;
    document.getElementById("edit_btn").disabled=false;
    document.getElementById("RenameTab").disabled=false;
    document.getElementById("exportFile").disabled=false;

    CURRENT = tabName;
    var i, tabcontent, tablinks;

    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}






window.addEventListener('load', init)
