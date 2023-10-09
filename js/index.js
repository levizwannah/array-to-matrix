let root = document.querySelector('#root');

req('All');
putContext('global');
context('global').input = state('[]');

h.App({
    parent: root,
    resetParent: true
});