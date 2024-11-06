import { IconBold, IconRedo, IconUndo } from "@/icons";
import ImageCropForEditor from "./ImageCropForEditor";

const Toolbar = ({ editor }: any) => {
  return (
    <div className="flex space-x-4">
      <button
        type="button"
        onClick={() => {
          editor?.chain().focus().toggleBold().run();
        }}
      >
        <IconBold className="w-6 h-6" />
      </button>
      <button
        type="button"
        onClick={() => {
          editor?.chain().focus().undo().run();
        }}
      >
        <IconUndo className="w-6 h-6" />
      </button>
      <button
        type="button"
        onClick={() => {
          editor?.chain().focus().redo().run();
        }}
      >
        <IconRedo className="w-6 h-6" />
      </button>
      <ImageCropForEditor editor={editor} />
    </div>
  );
};

export default Toolbar;
