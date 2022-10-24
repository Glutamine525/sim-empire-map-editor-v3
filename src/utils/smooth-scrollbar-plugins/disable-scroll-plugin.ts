import { ScrollbarPlugin } from 'smooth-scrollbar';

export default class DisableScrollPlugin extends ScrollbarPlugin {
  public static pluginName = 'disableScroll';

  public static defaultOptions = {
    direction: '',
  };

  public override onUpdate() {
    if (this.options.direction === 'x') {
      this.scrollbar.track.xAxis.element.remove();
    } else if (this.options.direction === 'y') {
      this.scrollbar.track.yAxis.element.remove();
    }
  }

  public transformDelta(delta: { x: number; y: number }) {
    if (this.options.direction) {
      delta[this.options.direction as 'x' | 'y'] = 0;
    }
    return { ...delta };
  }
}
