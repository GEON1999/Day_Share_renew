"use client";

import React, { useState } from "react";
import TodoViewMode from "./todoViewMode";
import TodoEditMode from "./todoEditMode";

const TodoDetailModal = () => {
  const [editorMode, setEditorMode] = useState(false);

  return (
    <div>
      <div>
        {editorMode ? (
          <TodoEditMode setEditorMode={setEditorMode} />
        ) : (
          <TodoViewMode setEditorMode={setEditorMode} />
        )}
      </div>
    </div>
  );
};

export default TodoDetailModal;
