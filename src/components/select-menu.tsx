"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import { CaretDown } from "@/components/icons";
import { cn } from "@/lib/utils";

const theme = {
  panel: "border-line rounded-[12px] shadow-[0_20px_56px_rgba(42,33,27,.12)]",
  option: "rounded-[8px] text-sm",
  active: "bg-band text-ink",
  selected: "bg-gold-ink text-white",
  idle: "text-ink",
  caret: "text-gold-ink size-4",
};

const PANEL_SPACE = 280;

type SelectMenuProps = {
  id: string;
  labelId: string;
  options: readonly string[];
  placeholder?: string;
  icon?: ReactNode;
  className?: string;
};

export function SelectMenu({
  id,
  labelId,
  options,
  placeholder,
  icon,
  className,
}: SelectMenuProps) {
  const items = placeholder === undefined ? options : [placeholder, ...options];
  const listId = useId();
  const [open, setOpen] = useState(false);
  const [above, setAbove] = useState(false);
  const [selected, setSelected] = useState(0);
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (open) list.current?.focus({ preventScroll: true });
  }, [open]);

  useEffect(() => {
    const box = list.current;
    const item = box?.children[active];
    if (!box || !(item instanceof HTMLElement)) return;
    if (item.offsetTop < box.scrollTop) {
      box.scrollTop = item.offsetTop;
    } else if (item.offsetTop + item.offsetHeight > box.scrollTop + box.clientHeight) {
      box.scrollTop = item.offsetTop + item.offsetHeight - box.clientHeight;
    }
  }, [open, active]);

  function show() {
    const box = trigger.current?.getBoundingClientRect();
    if (box) {
      const below = window.innerHeight - box.bottom;
      setAbove(below < PANEL_SPACE && box.top > below);
    }
    setActive(selected);
    setOpen(true);
  }

  function hide() {
    setOpen(false);
    trigger.current?.focus();
  }

  function choose(index: number) {
    setSelected(index);
    hide();
  }

  function onTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      show();
    }
  }

  function onListKeyDown(event: KeyboardEvent<HTMLUListElement>) {
    const last = items.length - 1;
    const moves: Record<string, number> = {
      ArrowDown: Math.min(active + 1, last),
      ArrowUp: Math.max(active - 1, 0),
      Home: 0,
      End: last,
      PageDown: Math.min(active + 5, last),
      PageUp: Math.max(active - 5, 0),
    };

    if (event.key in moves) {
      event.preventDefault();
      setActive(moves[event.key]);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      choose(active);
    } else if (event.key === "Escape") {
      event.preventDefault();
      hide();
    } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey) {
      const letter = event.key.toLowerCase();
      const match = items
        .map((_, offset) => (active + 1 + offset) % items.length)
        .find((index) => items[index].toLowerCase().startsWith(letter));
      if (match !== undefined) setActive(match);
    }
  }

  return (
    <div ref={root} className="relative">
      <button
        ref={trigger}
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-labelledby={`${labelId} ${id}`}
        onClick={() => (open ? hide() : show())}
        onMouseDown={(event) => open && event.preventDefault()}
        onKeyDown={onTriggerKeyDown}
        className={cn(
          "flex w-full cursor-pointer items-center text-left",
          className,
        )}
      >
        {icon}
        <span className="min-w-0 flex-1 truncate">{items[selected]}</span>
        <CaretDown
          className={cn(
            "shrink-0 transition-transform duration-200 motion-reduce:transition-none",
            theme.caret,
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <ul
          ref={list}
          id={listId}
          role="listbox"
          tabIndex={-1}
          aria-labelledby={labelId}
          aria-activedescendant={`${listId}-${active}`}
          onKeyDown={onListKeyDown}
          onBlur={(event) => {
            if (!root.current?.contains(event.relatedTarget)) setOpen(false);
          }}
          className={cn(
            "menu-scroll absolute inset-x-0 z-30 m-0 max-h-64 list-none overflow-y-auto overscroll-contain border bg-white p-1.5 outline-none",
            theme.panel,
            above ? "bottom-full mb-2" : "top-full mt-2",
          )}
        >
          {items.map((item, index) => (
            <li
              key={`${index}-${item}`}
              id={`${listId}-${index}`}
              role="option"
              aria-selected={index === selected}
              onPointerMove={() => setActive(index)}
              onClick={() => choose(index)}
              className={cn(
                "cursor-pointer px-3 py-2.5 leading-snug transition-colors motion-reduce:transition-none",
                theme.option,
                index === selected
                  ? theme.selected
                  : index === active
                    ? theme.active
                    : theme.idle,
              )}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
