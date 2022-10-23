import { ScrollbarPlugin } from 'smooth-scrollbar';

export class DisableScrollPlugin extends ScrollbarPlugin {
  public static pluginName = 'disableScroll';

  public static defaultOptions = {
    direction: '',
  };

  public transformDelta(delta: { x: number; y: number }) {
    if (this.options.direction) {
      delta[this.options.direction as 'x' | 'y'] = 0;
    }

    return { ...delta };
  }
}
