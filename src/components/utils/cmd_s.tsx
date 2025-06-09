import { CmdOrOption, KeyboardShortcut } from "../ui/keyboard-shortcut";

export const Cmd_S = () => {
  return (
    <div className="pointer-events-none absolute right-2.5 top-2.5 inline-flex h-5 select-none items-center gap-1">
      <KeyboardShortcut eventKey="cmd">
        <CmdOrOption />
      </KeyboardShortcut>
      <KeyboardShortcut eventKey="s">S</KeyboardShortcut>
    </div>
  );
};
