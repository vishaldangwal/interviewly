import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlusCircle,
  Trash2,
  Edit3,
  Save,
  X,
  ArrowDown,
  ArrowUp,
  Clock,
  FileText,
  Tag,
  Send,
} from "lucide-react";

export default function InterviewNotesApp() {
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingText, setEditingText] = useState("");
  const inputRef = useRef(null);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentTag, setCurrentTag] = useState("general");
  const [showSidebar, setShowSidebar] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  const tags = ["general", "question", "answer", "highlight", "follow-up"];
  const tagColors = {
    general: "bg-gray-700",
    question: "bg-blue-900",
    answer: "bg-green-900",
    highlight: "bg-amber-900",
    "follow-up": "bg-purple-900",
  };

  const tagTextColors = {
    general: "text-gray-300",
    question: "text-blue-300",
    answer: "text-green-300",
    highlight: "text-amber-300",
    "follow-up": "text-purple-300",
  };

  // Main clock that always works
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Timer functionality
  useEffect(() => {
    let interval;
    if (interviewStarted) {
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [interviewStarted]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const toggleTimer = () => {
    setInterviewStarted(!interviewStarted);
  };

  const resetTimer = () => {
    setElapsedTime(0);
    setInterviewStarted(false);
  };

  const addNote = () => {
    if (currentNote.trim() !== "") {
      const timestamp = new Date().toLocaleTimeString();
      setNotes([
        ...notes,
        {
          text: currentNote,
          tag: currentTag,
          time: timestamp,
          elapsedTime: formatTime(elapsedTime),
        },
      ]);
      setCurrentNote("");
      inputRef.current.focus();
    }
  };

  const deleteNote = (index) => {
    const newNotes = [...notes];
    newNotes.splice(index, 1);
    setNotes(newNotes);
  };

  const startEdit = (index) => {
    setEditingIndex(index);
    setEditingText(notes[index].text);
  };

  const saveEdit = () => {
    if (editingText.trim() !== "") {
      const newNotes = [...notes];
      newNotes[editingIndex] = {
        ...newNotes[editingIndex],
        text: editingText,
      };
      setNotes(newNotes);
    }
    setEditingIndex(null);
  };

  const cancelEdit = () => {
    setEditingIndex(null);
  };

  const moveNoteUp = (index) => {
    if (index > 0) {
      const newNotes = [...notes];
      [newNotes[index], newNotes[index - 1]] = [
        newNotes[index - 1],
        newNotes[index],
      ];
      setNotes(newNotes);
    }
  };

  const moveNoteDown = (index) => {
    if (index < notes.length - 1) {
      const newNotes = [...notes];
      [newNotes[index], newNotes[index + 1]] = [
        newNotes[index + 1],
        newNotes[index],
      ];
      setNotes(newNotes);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      addNote();
    }
  };

  const handleEditKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      saveEdit();
    } else if (e.key === "Escape") {
      cancelEdit();
    }
  };

  const changeNoteTag = (index, newTag) => {
    const newNotes = [...notes];
    newNotes[index] = {
      ...newNotes[index],
      tag: newTag,
    };
    setNotes(newNotes);
  };

  return (
    <div className="flex h-full w-full max-h-[66vh] max-w-[66vw] bg-black text-gray-200">
      {/* Sidebar */}
      <AnimatePresence>
        {showSidebar && (
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            className="w-64 min-w-64 bg-gray-900 border-r border-gray-800 flex flex-col"
          >
            <div className="p-4 border-b border-gray-800">
              <h1 className="text-xl font-bold text-gray-100 flex items-center">
                <FileText className="mr-2 text-purple-400" size={20} />
                Interview Notes
              </h1>
            </div>

            <div className="p-4 border-b border-gray-800">
              <h2 className="text-sm font-semibold text-gray-400 mb-2">
                TIMER
              </h2>
              <div className="bg-gray-950 rounded-lg p-3 mb-3">
                <div className="text-2xl font-mono text-purple-300 mb-2">
                  {formatTime(elapsedTime)}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={toggleTimer}
                    className={`flex-1 py-1 px-2 rounded text-xs font-medium ${interviewStarted ? "bg-red-900 hover:bg-red-800 text-red-100" : "bg-green-900 hover:bg-green-800 text-green-100"}`}
                  >
                    {interviewStarted ? "PAUSE" : "START"}
                  </button>
                  <button
                    onClick={resetTimer}
                    className="flex-1 py-1 px-2 bg-gray-800 hover:bg-gray-700 rounded text-xs font-medium"
                  >
                    RESET
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 border-b border-gray-800">
              <h2 className="text-sm font-semibold text-gray-400 mb-2">TAGS</h2>
              <div className="space-y-1">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setCurrentTag(tag)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center ${currentTag === tag ? `${tagColors[tag]} ${tagTextColors[tag]}` : "hover:bg-gray-800"}`}
                  >
                    <Tag size={14} className="mr-2" />
                    {tag.charAt(0).toUpperCase() + tag.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-auto p-4 text-xs text-gray-500">
              <p>Press Enter to add a new note</p>
              <p>Use tags to categorize your notes</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="bg-gray-900 p-4 border-b border-gray-800 flex justify-between items-center">
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="p-2 hover:bg-gray-800 rounded-md"
          >
            <motion.div animate={{ rotate: showSidebar ? 0 : 180 }}>
              <ArrowDown size={16} className="transform -rotate-90" />
            </motion.div>
          </button>

          <div className="flex items-center space-x-2">
            <Clock size={16} className="text-purple-400" />
            <span className="text-sm font-mono text-gray-200">
              {currentTime.toLocaleTimeString()}
            </span>
            <span className="text-gray-500 text-sm px-2">|</span>
            <div className="flex items-center text-sm">
              <div
                className={`w-2 h-2 rounded-full mr-1 ${interviewStarted ? "bg-green-500 animate-pulse" : "bg-red-500"}`}
              ></div>
              {interviewStarted ? "Recording" : "Stopped"}
            </div>
          </div>
        </div>

        {/* Notes list */}
        <div className="flex-1 overflow-y-auto p-4 min-h-0">
          <AnimatePresence>
            {notes.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 text-gray-500 bg-gray-900 rounded-lg border border-gray-800"
              >
                <Clock className="mx-auto mb-3 text-gray-600" size={30} />
                <p>No interview notes yet.</p>
                <p>Start the timer and begin taking notes!</p>
              </motion.div>
            ) : (
              notes.map((note, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="mb-3"
                >
                  {editingIndex === index ? (
                    <div className="flex flex-col bg-gray-900 rounded-lg border border-gray-700 p-3">
                      <div className="flex justify-between text-xs text-gray-500 mb-2">
                        <div className="flex items-center">
                          <Clock size={12} className="mr-1" />
                          {note.time} ({note.elapsedTime})
                        </div>
                        <div className="flex space-x-1">
                          {tags.map((tag) => (
                            <button
                              key={tag}
                              onClick={() => changeNoteTag(index, tag)}
                              className={`px-2 py-1 rounded text-xs ${note.tag === tag ? `${tagColors[tag]} ${tagTextColors[tag]}` : "bg-gray-800 hover:bg-gray-700"}`}
                            >
                              {tag.charAt(0).toUpperCase()}
                            </button>
                          ))}
                        </div>
                      </div>
                      <textarea
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        onKeyDown={handleEditKeyDown}
                        autoFocus
                        className="flex-grow p-2 bg-gray-800 text-gray-100 focus:outline-none border border-gray-700 rounded mb-2"
                        rows={3}
                      />
                      <div className="flex justify-end space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={cancelEdit}
                          className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-sm flex items-center"
                        >
                          <X size={14} className="mr-1" />
                          Cancel
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={saveEdit}
                          className="px-3 py-1 bg-purple-900 hover:bg-purple-800 rounded text-sm flex items-center"
                        >
                          <Save size={14} className="mr-1" />
                          Save
                        </motion.button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`${tagColors[note.tag]} bg-opacity-20 rounded-lg border border-gray-800 p-3 transition-all hover:border-gray-700`}
                    >
                      <div className="flex justify-between text-xs mb-1">
                        <div className="flex items-center text-gray-500">
                          <Clock size={12} className="mr-1" />
                          {note.time} ({note.elapsedTime})
                        </div>
                        <div
                          className={`px-2 py-0.5 rounded ${tagColors[note.tag]} ${tagTextColors[note.tag]} text-xs flex items-center`}
                        >
                          <Tag size={10} className="mr-1" />
                          {note.tag}
                        </div>
                      </div>
                      <div className="my-2 text-gray-100">{note.text}</div>
                      <div className="flex justify-end space-x-1">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => moveNoteUp(index)}
                          disabled={index === 0}
                          className={`p-1 rounded-full ${index === 0 ? "text-gray-700" : "text-gray-500 hover:text-gray-300 hover:bg-gray-800"}`}
                        >
                          <ArrowUp size={14} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => moveNoteDown(index)}
                          disabled={index === notes.length - 1}
                          className={`p-1 rounded-full ${index === notes.length - 1 ? "text-gray-700" : "text-gray-500 hover:text-gray-300 hover:bg-gray-800"}`}
                        >
                          <ArrowDown size={14} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => startEdit(index)}
                          className="p-1 text-blue-400 hover:text-blue-300 hover:bg-gray-800 rounded-full"
                        >
                          <Edit3 size={14} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => deleteNote(index)}
                          className="p-1 text-red-400 hover:text-red-300 hover:bg-gray-800 rounded-full"
                        >
                          <Trash2 size={14} />
                        </motion.button>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Input area */}
        <div className="p-4 border-t border-gray-800 bg-gray-900">
          <div className="flex">
            <div className="flex items-center mr-2">
              <div
                className={`w-2 h-2 mr-1 rounded-full ${interviewStarted ? "bg-green-500 animate-pulse" : "bg-red-500"}`}
              ></div>
              <span className="text-xs text-gray-500">
                {formatTime(elapsedTime)}
              </span>
            </div>
            <div
              className={`flex-grow flex rounded-lg border ${currentTag ? `border-${tagColors[currentTag].split("-")[1]}-800` : "border-gray-800"} overflow-hidden`}
            >
              <div
                className={`${tagColors[currentTag]} ${tagTextColors[currentTag]} px-2 flex items-center text-xs border-r border-gray-800`}
              >
                {currentTag.toUpperCase()}
              </div>
              <textarea
                ref={inputRef}
                value={currentNote}
                onChange={(e) => setCurrentNote(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your interview note here..."
                className="flex-grow p-3 focus:outline-none bg-gray-950 text-gray-100"
                rows={1}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={addNote}
                className="px-4 bg-purple-900 hover:bg-purple-800 text-white flex items-center"
              >
                <Send size={16} />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
