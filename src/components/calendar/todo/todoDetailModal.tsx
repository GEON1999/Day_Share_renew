"use client";

import React, { useState } from "react";
import TodoViewMode from "./todoViewMode";
import TodoEditMode from "./todoEditMode";

const TodoDetailModal = ({
  setIsCalendarDateModalOpen,
  setIsDetailOpen,
}: {
  setIsCalendarDateModalOpen: (isCalendarDateModalOpen: boolean) => void;
  setIsDetailOpen: (isOpen: boolean) => void;
}) => {
  const [editorMode, setEditorMode] = useState(false);

  return (
    <div>
      <div>
        {editorMode ? (
          <TodoEditMode
            setEditorMode={setEditorMode}
            setIsDetailOpen={setIsDetailOpen}
            setIsCalendarDateModalOpen={setIsCalendarDateModalOpen}
          />
        ) : (
          <TodoViewMode
            setEditorMode={setEditorMode}
            setIsDetailOpen={setIsDetailOpen}
            setIsCalendarDateModalOpen={setIsCalendarDateModalOpen}
          />
        )}
      </div>
    </div>
  );
};

export default TodoDetailModal;
