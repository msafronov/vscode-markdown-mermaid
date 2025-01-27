//@ts-check
import mermaid from 'mermaid';

function init() {
    mermaid.initialize({
        startOnLoad: false,
        theme: document.body.classList.contains('vscode-dark') || document.body.classList.contains('vscode-high-contrast')
            ? 'dark'
            : 'default'
    });

    function processMermaidErrorOuts(processCallback) {
        for (const possibleMermaidErrorOut of document.getElementsByTagName('svg')) {
            const parent = possibleMermaidErrorOut.parentElement;
            if (parent && parent.id.startsWith('dmermaid')) {
                processCallback(parent);
            }
        }
    }

    // Delete existing mermaid outputs
    processMermaidErrorOuts((mermaidErrorOut) => {
        mermaidErrorOut.remove();
    });

    let i = 0;
    for (const mermaidContainer of document.getElementsByClassName('mermaid')) {
        const id = `mermaid-${Date.now()}-${i++}`;
        const source = mermaidContainer.textContent;

        const out = document.createElement('div');
        out.id = id;
        mermaidContainer.innerHTML = '';
        mermaidContainer.appendChild(out);

        try {
            mermaid.render(id, source, (out) => {
                mermaidContainer.innerHTML = out;
            });
        } catch (error) {
            const errorMessageNode = document.createElement('pre');

            errorMessageNode.innerText = error.message;

            processMermaidErrorOuts((mermaidErrorOut) => {
                mermaidErrorOut.appendChild(errorMessageNode);
            });

            // don't break standart mermaid flow
            throw error;
        }
    }
}


window.addEventListener('vscode.markdown.updateContent', init);

init();