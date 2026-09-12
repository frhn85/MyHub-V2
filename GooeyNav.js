/*
 * React Bits GooeyNav - plain JS adaptation for MyHub V2.
 * Based on the official GooeyNav JS-CSS registry source.
 */
class GooeyNav {
  constructor(container, options = {}) {
    this.container = container;
    this.items = options.items || [];
    this.animationTime = options.animationTime ?? 600;
    this.particleCount = options.particleCount ?? 15;
    this.particleDistances = options.particleDistances || [90, 10];
    this.particleR = options.particleR ?? 100;
    this.timeVariance = options.timeVariance ?? 300;
    this.colors = options.colors || [1, 2, 3, 1, 2, 3, 1, 4];
    this.activeIndex = options.initialActiveIndex ?? 0;
    this.onSelect = options.onSelect || (() => {});

    this.container.classList.add('gooey-nav-container');
    this.nav = document.createElement('nav');
    this.list = document.createElement('ul');
    this.filter = document.createElement('span');
    this.text = document.createElement('span');

    this.filter.className = 'effect filter';
    this.text.className = 'effect text';
    this.nav.appendChild(this.list);
    this.container.replaceChildren(this.nav, this.filter, this.text);

    this.render();
    window.addEventListener('resize', () => this.updateActiveEffect());
  }

  noise(n = 1) { return n / 2 - Math.random() * n; }

  getXY(distance, pointIndex, totalPoints) {
    const angle = ((360 + this.noise(8)) / totalPoints) * pointIndex * (Math.PI / 180);
    return [distance * Math.cos(angle), distance * Math.sin(angle)];
  }

  createParticle(i, t, d, r) {
    const rotate = this.noise(r / 10);
    return {
      start: this.getXY(d[0], this.particleCount - i, this.particleCount),
      end: this.getXY(d[1] + this.noise(7), this.particleCount - i, this.particleCount),
      time: t,
      scale: 1 + this.noise(0.2),
      color: this.colors[Math.floor(Math.random() * this.colors.length)],
      rotate: rotate > 0 ? (rotate + r / 20) * 10 : (rotate - r / 20) * 10
    };
  }

  makeParticles() {
    const d = this.particleDistances;
    const r = this.particleR;
    const bubbleTime = this.animationTime * 2 + this.timeVariance;
    this.filter.style.setProperty('--time', `${bubbleTime}ms`);

    for (let i = 0; i < this.particleCount; i++) {
      const t = this.animationTime * 2 + this.noise(this.timeVariance * 2);
      const p = this.createParticle(i, t, d, r);
      this.filter.classList.remove('active');

      setTimeout(() => {
        const particle = document.createElement('span');
        const point = document.createElement('span');
        particle.classList.add('particle');
        particle.style.setProperty('--start-x', `${p.start[0]}px`);
        particle.style.setProperty('--start-y', `${p.start[1]}px`);
        particle.style.setProperty('--end-x', `${p.end[0]}px`);
        particle.style.setProperty('--end-y', `${p.end[1]}px`);
        particle.style.setProperty('--time', `${p.time}ms`);
        particle.style.setProperty('--scale', `${p.scale}`);
        particle.style.setProperty('--color', `var(--color-${p.color}, white)`);
        particle.style.setProperty('--rotate', `${p.rotate}deg`);
        point.classList.add('point');
        particle.appendChild(point);
        this.filter.appendChild(particle);
        requestAnimationFrame(() => this.filter.classList.add('active'));
        setTimeout(() => particle.remove(), Math.max(0, t));
      }, 30);
    }
  }

  updateActiveEffect(element = this.list.querySelectorAll('li')[this.activeIndex]) {
    if (!element) return;
    const containerRect = this.container.getBoundingClientRect();
    const pos = element.getBoundingClientRect();
    const styles = {
      left: `${pos.x - containerRect.x}px`,
      top: `${pos.y - containerRect.y}px`,
      width: `${pos.width}px`,
      height: `${pos.height}px`
    };
    Object.assign(this.filter.style, styles);
    Object.assign(this.text.style, styles);
    this.text.textContent = element.innerText;
  }

  select(index, event) {
    if (event) event.preventDefault();
    const li = this.list.querySelectorAll('li')[index];
    if (!li || this.activeIndex === index) return;

    this.activeIndex = index;
    this.list.querySelectorAll('li').forEach((item, i) => item.classList.toggle('active', i === index));
    this.updateActiveEffect(li);

    this.filter.querySelectorAll('.particle').forEach(p => p.remove());
    this.text.classList.remove('active');
    void this.text.offsetWidth;
    this.text.classList.add('active');
    this.makeParticles();
    this.onSelect(this.items[index], index, event);
  }

  render() {
    this.list.innerHTML = '';
    this.items.forEach((item, index) => {
      const li = document.createElement('li');
      li.className = index === this.activeIndex ? 'active' : '';
      li.tabIndex = -1;

      const a = document.createElement('a');
      a.href = item.href || '#';
      a.innerHTML = item.label;
      a.addEventListener('click', e => this.select(index, e));
      a.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.select(index, e);
        }
      });

      li.appendChild(a);
      this.list.appendChild(li);
    });

    requestAnimationFrame(() => {
      this.updateActiveEffect();
      this.text.classList.add('active');
    });
  }

  setActive(index) {
    if (index < 0 || index >= this.items.length) return;
    const li = this.list.querySelectorAll('li')[index];
    if (!li) return;
    this.activeIndex = index;
    this.list.querySelectorAll('li').forEach((item, i) => item.classList.toggle('active', i === index));
    this.updateActiveEffect(li);
  }
}

window.GooeyNav = GooeyNav;
