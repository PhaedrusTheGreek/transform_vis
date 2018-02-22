class VisController {

  constructor(el, vis) {
    this.vis = vis;
    this.el = el;
    this.container = document.createElement('div');
    this.container.className = 'output-vis';
    this.el.appendChild(this.container);
  }

  render(visData, status) {
    return new Promise(resolve => {
      this.container.innerHTML = visData.html;
      if (typeof visData.after_render === "function") { visData.after_render(); }
      resolve('done rendering');
    });
  }

  destroy() {
    this.el.innerHTML = '';
  }

};

export { VisController };
