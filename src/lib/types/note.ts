// A note (trade notes, newsletter content) is a single rich-text doc,
// stored as the HTML string produced by the Tiptap editor. Images live
// inline in that HTML as <img> tags instead of as separate array entries.

export type NoteContent = string;

export type NoteProps = {
  id: string;
  journal_id: string;
  blocks: NoteContent;
  onChange?: (newContent: NoteContent) => void;
};
