import { ScrollbarPlugin } from 'smooth-scrollbar';

export default class InitPositionPlugin extends ScrollbarPlugin {
  public static pluginName = 'initPosition';

  public static defaultOptions = {
    enabled: false,
    initX: -1,
    initY: -1,
  };

  public override onInit() {
    if (!this.options.enabled) {
      return;
    }
    if (this.options.initX === -1 && this.options.initY === -1) {
      const { x, y } = this.scrollbar.limit;
      this.scrollbar.scrollTo(x / 2, y / 2);
      return;
    }
    this.scrollbar.scrollTo(this.options.initX, this.options.initY);
  }
}
