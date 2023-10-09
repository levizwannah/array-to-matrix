class App extends OpenScript.Component {
  render(...args) {
    let input = context("global").get("input");

    return h.div(
      { class: "container p-3" },
      h.h1("Visualize nD Arrays", { class: "text-center" }),

      h.h3("Input"),
      h.div(
        { class: "form-group mb-4" },
        h.label({ for: "input-arrays" }, "Enter your Array in JSON format"),
        h.textarea(
          {
            class: "form-control",
            id: "input-arrays",
            rows: "8",
            oninput: this.method("getInput", "${this}"),
          },
`
[
    ["a", "b", "c", "c"],
    ["e", "f", "g", "h"],
    ["i", "j", "k", "l"],
    ["m", "n", "o", "p"]
]
`
          )
      ),

      h.h2("Output"),
      h.div(
        { class: "container overflow-auto border rounded p-3" },
        h.MatrixView(input)
      ),
      ...args
    );
  }

  getInput(element) {
    let val = element?.value;
    try {
      let json = JSON.parse(val);
      context("global").input.value = json;
    } catch (e) {
      return;
    }
  }

  $_rendered() {
    this.getInput(document.querySelector("#input-arrays"));
  }
}

class MatrixView extends OpenScript.Component {
  render(input, ...args) {
    return h.Matrix(input?.value, ...args);
  }
}

class Matrix extends OpenScript.Component {
  types = {'number': true, 'boolean': true, 'string': true, 'bigint': true}
  
  render(array, ...args) {
    return h.table(this.format(array),...args);
  }

  format(input, level = 0) {
    let elem = 'td';
    let attr = {class: 'border-2 p-3'};

    if(level % 2 !== 0) elem = 'tr', attr = {class: 'border-2 mb-2'};

    if (typeof input in this.types) return h[elem](h.b(input), attr);

    return h[elem](
        h.call(() => {
          let final = [];
          for (let i = 0; i < input.length; i++) {
            final.push(this.format(input[i], level + 1));
          }
  
          return final;
        }),
        attr,
    );
  }
}
