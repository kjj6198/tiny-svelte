window.fragment = document.body;

function text(text) {
  return document.createTextNode(text);
}
function append(node, target) {
  target.appendChild(node);
}

const component = create_fragment();
component.create();
component.mount();

instance();
