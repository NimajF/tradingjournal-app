"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  Extension,
  ReactRenderer,
  type Editor,
  type Range,
} from "@tiptap/react"; // @tiptap/react re-exports @tiptap/core (not a direct dep under pnpm)
import Suggestion, {
  type SuggestionKeyDownProps,
  type SuggestionProps,
} from "@tiptap/suggestion";
import {
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Minus,
  ImagePlus,
  type LucideIcon,
} from "lucide-react";

type SlashItem = {
  title: string;
  hint: string;
  keywords: string[]; // extra search terms: "h2", "title", "ul"...
  Icon: LucideIcon;
  run: (editor: Editor, range: Range) => void;
};

type SlashOptions = {
  // Image upload lives in RichTextEditor (pending-upload flow), so the
  // extension only asks it to open the file picker.
  onPickImage: () => void;
};

// Same labels/levels as the bubble menu (Heading = h2, Subheading = h3) so
// both entry points produce the same result.
const buildItems = ({ onPickImage }: SlashOptions): SlashItem[] => [
  {
    title: "Heading",
    hint: "Large section title",
    keywords: ["h2", "title", "header"],
    Icon: Heading2,
    run: (editor, range) =>
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode("heading", { level: 2 })
        .run(),
  },
  {
    title: "Subheading",
    hint: "Smaller section title",
    keywords: ["h3", "subtitle"],
    Icon: Heading3,
    run: (editor, range) =>
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode("heading", { level: 3 })
        .run(),
  },
  {
    title: "Bulleted list",
    hint: "Simple list of points",
    keywords: ["ul", "bullet", "unordered"],
    Icon: List,
    run: (editor, range) =>
      editor.chain().focus().deleteRange(range).toggleBulletList().run(),
  },
  {
    title: "Numbered list",
    hint: "Ordered steps",
    keywords: ["ol", "ordered", "steps"],
    Icon: ListOrdered,
    run: (editor, range) =>
      editor.chain().focus().deleteRange(range).toggleOrderedList().run(),
  },
  {
    title: "Quote",
    hint: "Highlight a passage",
    keywords: ["blockquote", "cite"],
    Icon: Quote,
    run: (editor, range) =>
      editor.chain().focus().deleteRange(range).toggleBlockquote().run(),
  },
  {
    title: "Divider",
    hint: "Horizontal line",
    keywords: ["hr", "line", "separator", "rule"],
    Icon: Minus,
    run: (editor, range) =>
      editor.chain().focus().deleteRange(range).setHorizontalRule().run(),
  },
  {
    title: "Image",
    hint: "Upload from your device",
    keywords: ["img", "picture", "photo"],
    Icon: ImagePlus,
    run: (editor, range) => {
      editor.chain().focus().deleteRange(range).run();
      onPickImage();
    },
  },
];

type MenuHandle = { onKeyDown: (event: KeyboardEvent) => boolean };
type MenuProps = SuggestionProps<SlashItem, SlashItem>;

const SlashMenu = forwardRef<MenuHandle, MenuProps>(function SlashMenu(
  { items, command },
  ref,
) {
  const [selected, setSelected] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  // New query → new list → start from the top.
  useEffect(() => setSelected(0), [items]);

  // Keep the keyboard-selected row visible inside the scrollable list.
  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${selected}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [selected]);

  useImperativeHandle(
    ref,
    () => ({
      onKeyDown: (event) => {
        if (items.length === 0) return false;
        if (event.key === "ArrowDown") {
          setSelected((i) => (i + 1) % items.length);
          return true;
        }
        if (event.key === "ArrowUp") {
          setSelected((i) => (i - 1 + items.length) % items.length);
          return true;
        }
        if (event.key === "Enter" || event.key === "Tab") {
          command(items[selected]);
          return true;
        }
        return false;
      },
    }),
    [items, selected, command],
  );

  return (
    <div
      ref={listRef}
      role="listbox"
      aria-label="Insert block"
      className="panel bg-surface border border-border rounded-xl p-1 elevated-lg w-60 max-h-72 overflow-y-auto"
    >
      {items.length === 0 ? (
        <p className="px-2.5 py-2 text-xs text-subtle-fg">No results</p>
      ) : (
        items.map((item, index) => (
          <button
            key={item.title}
            type="button"
            role="option"
            aria-selected={index === selected}
            data-index={index}
            // mousedown + preventDefault keeps focus (and the selection) in
            // the editor, same pattern as the bubble menu buttons.
            onMouseDown={(e) => {
              e.preventDefault();
              command(item);
            }}
            onMouseMove={() => setSelected(index)}
            className={`flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition-colors ${
              index === selected ? "bg-surface-alt" : ""
            }`}
          >
            <item.Icon size={15} className="shrink-0 text-subtle-fg" />
            <span className="min-w-0">
              <span className="block text-sm text-foreground">
                {item.title}
              </span>
              <span className="block text-xs text-subtle-fg">{item.hint}</span>
            </span>
          </button>
        ))
      )}
    </div>
  );
});

export const SlashCommand = Extension.create<SlashOptions>({
  name: "slashCommand",

  addOptions() {
    return { onPickImage: () => {} };
  },

  addProseMirrorPlugins() {
    const all = buildItems(this.options);

    return [
      Suggestion<SlashItem, SlashItem>({
        editor: this.editor,
        char: "/",
        // Only open on an empty-ish line start or after a space, so typing
        // URLs / dates ("and/or", "12/05") never triggers the menu.
        allowedPrefixes: [" "],
        // Inside code (or a heading you're editing) the menu would be noise.
        allow: ({ state, range }) => {
          const $from = state.doc.resolve(range.from);
          return $from.parent.type.name !== "codeBlock";
        },
        items: ({ query }) => {
          const q = query.trim().toLowerCase();
          if (!q) return all;
          return all.filter(
            (item) =>
              item.title.toLowerCase().includes(q) ||
              item.keywords.some((k) => k.startsWith(q)),
          );
        },
        command: ({ editor, range, props }) => props.run(editor, range),
        render: () => {
          let component: ReactRenderer<MenuHandle, MenuProps> | null = null;
          let unmount: (() => void) | undefined;

          return {
            onStart: (props) => {
              component = new ReactRenderer(SlashMenu, {
                props,
                editor: props.editor,
                className: "z-[60]",
              });
              unmount = props.mount(component.element);
            },
            onUpdate: (props) => component?.updateProps(props),
            onKeyDown: ({ event }: SuggestionKeyDownProps) => {
              if (event.key === "Escape") return false; // plugin closes the menu
              return component?.ref?.onKeyDown(event) ?? false;
            },
            onExit: () => {
              unmount?.();
              component?.destroy();
              component = null;
            },
          };
        },
      }),
    ];
  },
});
