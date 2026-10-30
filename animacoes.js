// Animações independentes do sistema de agendamento.
document.addEventListener("DOMContentLoaded", () => {
  const reduzirMovimento = window.matchMedia("(prefers-reduced-motion: reduce)");
  const alvos = document.querySelectorAll(
    ".about-img, .about-text, .section-head, .services article, " +
    ".gallery-item, .booking-intro, .location > div, .strip-inner"
  );

  if (!reduzirMovimento.matches && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add("reis-visible");
          observer.unobserve(entrada.target);
        }
      });
    }, { threshold: 0.06, rootMargin: "0px 0px -15px 0px" });

    alvos.forEach((alvo) => {
      alvo.classList.add("reis-reveal");
      observer.observe(alvo);
    });
  }

  if (!reduzirMovimento.matches &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    document.querySelectorAll(".services article").forEach((cartao) => {
      cartao.classList.add("reis-tilt");
      cartao.addEventListener("pointermove", (evento) => {
        const area = cartao.getBoundingClientRect();
        const x = ((evento.clientX - area.left) / area.width - 0.5) * 13;
        const y = ((evento.clientY - area.top) / area.height - 0.5) * -13;
        cartao.style.transform =
          `perspective(850px) rotateX(${y}deg) rotateY(${x}deg) translateY(-5px)`;
      });
      cartao.addEventListener("pointerleave", () => {
        cartao.style.transform = "";
      });
    });
  }
});
