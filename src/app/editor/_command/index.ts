export default interface Command {
  execute: () => void;
  undo: () => void;
}

export enum CommandAltType {
  Place,
  Move,
  Replace,
  Delete,
}
