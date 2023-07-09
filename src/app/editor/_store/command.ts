import { produce } from 'immer';
import { create } from 'zustand';
import Command from '../_command';

const LIMIT = 200;

interface CommandState {
  commands: Command[];
  undoCommands: Command[];
  reset: () => void;
  add: (c: Command) => void;
  undo: () => void;
  redo: () => void;
}

export const useCommand = create<CommandState>()((set, get) => ({
  commands: [],
  undoCommands: [],
  reset: () => {
    set({ commands: [], undoCommands: [] });
  },
  add: c => {
    set(
      produce<CommandState>(state => {
        state.commands.push(c);
        const l = state.commands.length;
        if (l > LIMIT) {
          state.commands.slice(l - LIMIT);
        }
        state.undoCommands = [];
      }),
    );
  },
  undo: () => {
    set(
      produce<CommandState>(state => {
        const c = state.commands.pop();
        if (!c) {
          return;
        }
        c.undo();
        state.undoCommands.push(c);
      }),
    );
  },
  redo: () => {
    set(
      produce<CommandState>(state => {
        const c = state.undoCommands.pop();
        if (!c) {
          return;
        }
        c.execute();
        state.commands.push(c);
      }),
    );
  },
}));
