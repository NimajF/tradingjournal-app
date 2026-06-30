export type TextBlock = {
  type: "text";
  content: string;
};

export type ImageBlock = {
  type: "image";
  url: string;
  file?: File;
  public_id?: string; // set after Cloudinary upload
  savedImageId?: string; //  row id sup trade_images and newsletter_images.
};

export type Block = TextBlock | ImageBlock;
// SIMPLIER SYNTAX
// export type Block =
//   | { type: "text"; content: string }
//   | { type: "image"; url: string };
// the blocks that make up the content of a note. For example, a note could have a text block with some text content, followed by an image block with a URL to an image, followed by another text block, etc. This allows for rich content in notes, not just plain text.

export type NoteContent = Block[]; // array of blocks that make up the content of a note. For example, a note could have a text block with some text content, followed by an image block with a URL to an image, followed by another text block, etc. This allows for rich content in notes, not just plain text.
export type NoteProps = {
  id: string;
  journal_id: string;
  blocks: NoteContent;
  onChange?: (newContent: NoteContent) => void; // optional callback that can be used to notify the parent component of changes to the note content. For example, if the note content is edited, the NoteEditor component can call onChange with the new content, allowing the parent component to save it or perform other actions as needed.
};

export type BlockEditorProps = {
  blocks: NoteContent;
  onChange: (blocks: NoteContent) => void;
  onDeleteSavedImage?: (savedId: string, publicId: string) => void;
};
