"use client";

import React, { useState } from "react";
import TodoViewMode from "./todoViewMode";
import TodoEditMode from "./todoEditMode";

const TodoDetail = ({
  setIsDetailOpen,
}: {
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
          />
        ) : (
          <TodoViewMode
            setEditorMode={setEditorMode}
            setIsDetailOpen={setIsDetailOpen}
          />
        )}
      </div>
    </div>
  );
};

export default TodoDetail;
