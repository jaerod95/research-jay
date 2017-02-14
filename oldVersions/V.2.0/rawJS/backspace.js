var backspace = (function() {
    function logBackspace(e) {
        console.log('backspace ran');
        console.log(e);
    }
    return {logBackspace};
})();