import json
from copy import deepcopy

class NoteJson:

    def __init__(self, fname, port):
        self._fname = fname
        self.fullNote = self._read()
        self.titleKeys = list(self.fullNote.keys())

    def _read(self):
        with open(self._fname, 'rt') as fp:
            js = json.load(fp)
        return js['noteData'][0]


    def _write(self):
        js = {"noteData": [self.fullNote]}
        with open(self._fname, 'wt') as fp:
            json.dump(js, fp)

    def addNewNote(self, newTitle):
        self.fullNote[newTitle] = ""
        self._write()
        return newTitle

    def deleteNote(self,inputTitle):
        del self.fullNote[inputTitle]
        self._write()
        return inputTitle


    def loadAll(self):
        return self.fullNote

    def updateSelectedNote(self, selected,content):
        self.fullNote[selected] = content
        if(selected not in self.titleKeys):
            self.titleKeys.append(selected)
        self._write()
        return content

    def editTabName(self,prev, curr):
        self.fullNote[curr] = self.fullNote[prev]
        del self.fullNote[prev]
        self._write()
        return curr







