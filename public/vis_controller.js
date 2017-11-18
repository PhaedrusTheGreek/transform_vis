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
      this.container.innerHTML = visData;
      resolve('done rendering');
    });
  }

  destroy() {
    this.el.innerHTML = '';
  }

};

export { VisController };
