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
    if (!this.options.enabled) {
      return;
    }
    this.#isDragging = true;
    const { clientX, clientY } = e;
    this.#originX = this.scrollbar.scrollLeft + clientX;
    this.#originY = this.scrollbar.scrollTop + clientY;
  };

  #onMouseMove = (e: MouseEvent) => {
    if (!this.options.enabled) {
      return;
    }
    if (!this.#isDragging) {
      return;
    }
    const { clientX, clientY } = e;
    this.scrollbar.scrollLeft = this.#originX - clientX;
    this.scrollbar.scrollTop = this.#originY - clientY;
  };

  #onMouseUp = () => {
    if (!this.options.enabled) {
      return;
    }
    this.#isDragging = false;
  };

  public override onInit() {
    this.scrollbar.containerEl.addEventListener('mousedown', this.#onMouseDown);
    this.scrollbar.containerEl.addEventListener('mousemove', this.#onMouseMove);
    this.scrollbar.containerEl.addEventListener('mouseup', this.#onMouseUp);
    this.scrollbar.containerEl.addEventListener('mouseleave', this.#onMouseUp);
  }

  public override onDestroy() {
    this.scrollbar.containerEl.removeEventListener('mousedown', this.#onMouseDown);
    this.scrollbar.containerEl.removeEventListener('mousemove', this.#onMouseMove);
    this.scrollbar.containerEl.removeEventListener('mouseup', this.#onMouseUp);
    this.scrollbar.containerEl.removeEventListener('mouseleave', this.#onMouseUp);
  }
}
