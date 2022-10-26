import { ScrollbarPlugin } from 'smooth-scrollbar';

export default class DraggablePlugin extends ScrollbarPlugin {
  public static override pluginName = 'draggable';

  public static defaultOptions = {
    enabled: false,
  };

  #isDragging = false;
  #originX = 0;
  #originY = 0;

  #onMouseDown = (e: MouseEvent) => {
    if (e.button !== 0) {
      // 非左键点击，禁止拖拽
      return;
    }

    this.#isDragging = true;
    const { clientX, clientY } = e;
    this.#originX = this.scrollbar.scrollLeft + clientX;
    this.#originY = this.scrollbar.scrollTop + clientY;
  };

  #onMouseMove = (e: MouseEvent) => {
    if (!this.#isDragging) {
      return;
    }
    const { clientX, clientY } = e;
    this.scrollbar.scrollLeft = this.#originX - clientX;
    this.scrollbar.scrollTop = this.#originY - clientY;
  };

  #onMouseUp = () => {
    this.#isDragging = false;
  };

  #preventDefault = (e: Event) => e.preventDefault();

  public override onInit() {
    if (!this.options.enabled) {
      return;
    }
    this.scrollbar.containerEl.addEventListener('mousedown', this.#onMouseDown);
    this.scrollbar.containerEl.addEventListener('mousemove', this.#onMouseMove);
    this.scrollbar.containerEl.addEventListener('mouseup', this.#onMouseUp);
    this.scrollbar.containerEl.addEventListener('mouseleave', this.#onMouseUp);
    this.scrollbar.track.xAxis.element.addEventListener('mousedown', this.#preventDefault);
    this.scrollbar.track.yAxis.element.addEventListener('mousedown', this.#preventDefault);
  }

  public override onDestroy() {
    if (!this.options.enabled) {
      return;
    }
    this.scrollbar.containerEl.removeEventListener('mousedown', this.#onMouseDown);
    this.scrollbar.containerEl.removeEventListener('mousemove', this.#onMouseMove);
    this.scrollbar.containerEl.removeEventListener('mouseup', this.#onMouseUp);
    this.scrollbar.containerEl.removeEventListener('mouseleave', this.#onMouseUp);
    this.scrollbar.track.xAxis.element.removeEventListener('mousedown', this.#preventDefault);
    this.scrollbar.track.yAxis.element.removeEventListener('mousedown', this.#preventDefault);
  }
}
