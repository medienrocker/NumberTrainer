function copyToClipboard() {
    const codeBlock = document.getElementById('nt_codeBlock');
    const range = document.createRange();
    range.selectNode(codeBlock);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();

    // Change Copy to Copied temporarily
    const copyButton = document.querySelector('.nt_copy-button');
    copyButton.innerHTML = '&#10004; Copied!';
    setTimeout(() => copyButton.innerHTML = '&#128203; Copy code', 4000);
}