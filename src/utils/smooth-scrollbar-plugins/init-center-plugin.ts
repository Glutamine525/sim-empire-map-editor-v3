import { ScrollbarPlugin } from 'smooth-scrollbar';

export default class InitCenterPlugin extends ScrollbarPlugin {
  public static pluginName = 'initCenter';

  public static defaultOptions = {
    enabled: false,
  };

  public override onInit() {
    if (!this.options.enabled) {
      return;
    }
    const { x, y } = this.scrollbar.limit;
    this.scrollbar.scrollTo(x / 2, y / 2);
  }
}
