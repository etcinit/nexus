"use strict";

var editorLauncher = function () {
    // Hook up ACE editor to all textareas with data-editor attribute
    $('textarea[data-editor]').each(function () {
        var textarea = $(this);
        var filenameInput = $('[name="name"]');

        //var mode = textarea.data('editor');
        var modelist = ace.require('ace/ext/modelist'),
            filename,
            mode,
            updateMode;

        updateMode = function () {
            filename = filenameInput.val();
            mode = modelist.getModeForPath(filename).mode;
            editor.getSession().setMode(mode);
        };

        filenameInput.change(function () {
            updateMode();
        });

        ace.require("ace/ext/language_tools");
        console.log(mode);

        var editDiv = $('<div>', {
            position: 'absolute',
            width: textarea.width(),
            height: textarea.height(),
            'class': textarea.attr('class')
        }).insertBefore(textarea);

        //textarea.css('visibility', 'hidden');
        textarea.hide();

        var editor = ace.edit(editDiv[0]);
        editor.renderer.setShowGutter(false);
        editor.getSession().setValue(textarea.val());
        updateMode();
        editor.setTheme("ace/theme/solarized_dark");

        editor.setOptions({
            enableBasicAutocompletion: true,
            enableSnippets: true,
            enableLiveAutocompletion: true
        });

        // copy back to textarea on form submit...
        textarea.closest('form').submit(function () {
            textarea.val(editor.getSession().getValue());
        });

    });
};

// Add routes
crossroads.addRoute('/files/{id}/edit', function (id) {
    editorLauncher();
});

crossroads.addRoute('/files/new', function (id) {
    editorLauncher();
});

// Execute the router
crossroads.parse(document.location.pathname + document.location.search);