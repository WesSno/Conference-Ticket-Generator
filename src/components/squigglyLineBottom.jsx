function BottomLine() {
  return (
    <div class="line-bottom">
      <picture>
        <source
          srcset="/ticket_items/images/pattern-squiggly-line-bottom-desktop.svg"
          media="(min-width: 1200px)"
        />
        <img
          src="/ticket_items/images/pattern-squiggly-line-bottom-mobile-tablet.svg"
          alt="squiggly line"
        />
      </picture>
    </div>
  );
}

export default BottomLine;
