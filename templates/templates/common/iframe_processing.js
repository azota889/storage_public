window.addEventListener("message", handleIframe);
window.addEventListener("click", handleClick);

var testBankIframe = document.getElementById("testbank-iframe");

var template;
if (testBankIframe != null) {
   template = testBankIframe.contentWindow;
}

if (template) {
  template.eval(`
        let height;
        const sendPostMessage = () => {
			var containerDiv = document.getElementById('container');
			if (containerDiv && height !== containerDiv.offsetHeight) {
				height = containerDiv.offsetHeight;
				window.parent.postMessage({
				frameHeight: height
				}, '*');
				console.log(height);
			}
        }

        window.onload = () => sendPostMessage();
        window.onresize = () => sendPostMessage();
      `);
}

function handleIframe(e) {
  var testBankIframe = document.getElementById("testbank-iframe");

  if (testBankIframe) {
    if (e.data.hasOwnProperty("frameHeight")) {
      testBankIframe.style.height = `${e.data.frameHeight + 30}px`;
    }
  }
}
function handleClick() {
  console.log("click event OK");
}


