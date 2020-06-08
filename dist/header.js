function Header(props) {
  return React.createElement(
    "header",
    null,
    React.createElement(
      "h1",
      null,
      React.createElement(
        "a",
        { href: "index.html" },
        "ENSTARS STORY FORMATTER"
      )
    ),
    React.createElement(
      "div",
      { className: "horizontal" },
      React.createElement(
        "p",
        null,
        "A website to more easily upload event/gacha stories from the mobile idol game Ensemble Stars to the fandom wiki.",
        React.createElement("br", null),
        "It takes formats your story chapter into text that can be pasted directly into the \"source\" section of the page.",
        React.createElement("br", null),
        "Developed by ",
        React.createElement(
          "a",
          { target: "_blank", href: "https://twitter.com/gayandasleep" },
          "midori"
        ),
        " (last updated 6/7/20)."
      ),
      React.createElement(
        "ul",
        { id: "navbar" },
        React.createElement(
          "li",
          null,
          React.createElement(
            "a",
            { href: "./howto.html" },
            "HOW TO USE"
          )
        ),
        React.createElement(
          "li",
          null,
          React.createElement(
            "a",
            { target: "_blank", href: "https://goo.gl/forms/Xu42LLAgWKxVYV873" },
            "CONTACT"
          )
        )
      )
    )
  );
}

ReactDOM.render(React.createElement(Header, null), document.body);