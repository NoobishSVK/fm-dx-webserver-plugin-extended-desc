/*!
 * ************************************************
 * FM-DX Webserver Extended Description plugin 
 * ************************************************
 * Created by NoobishSVK
 * Join our Discord: https://discord.gg/fmdx
 * ************************************************
 *
 * This script extends the functionality of the FM-DX 
 * Webserver description system by adding a markdown description
 * and integrating it into the UI.
 *
 * You can edit your own description by using markdown.
 * Images are also supported
 * 
 * ************************************************
 */

/* SETTINGS (FEEL FREE TO EDIT THESE) */
const INFO_BUTTON_NAME = "MORE INFO";
const INFO_TITLE = 'About my server';
const INFO_CONTENT = `
Welcome to my server!  
Plugin powered by [FMDX.org](https://fmdx.org).  
I recommend changing this text. You can use Markdown language.  
  
### Heading test
Bold text example: **Wooo, I'm bold!**
#### [FMDX.org](https://fmdx.org)  
  
## Image example
![Antenna setup in Slovakia](https://i.imgur.com/TavgxGt.jpeg)  
`;

/* PLUGIN DECLARATIONS */
const eDesc = {
    openModal: ExtendedDescOpenModal,
    closeModal: ExtendedDescCloseModal,
    init: ExtendedDescInitialize,
    parseMarkdown: ExtendedDescParseMarkdown,
    modalWindow: $('.modal')
};

const extendedDescButton = $('<button>', {
    id: 'extended-desc-button',
    html: `<strong>${INFO_BUTTON_NAME}</strong>`,
    'aria-label': INFO_BUTTON_NAME.toLowerCase(),
    class: 'hide-phone bg-color-2',
    css: {
        borderRadius: '0px',
        width: '100px',
        position: 'relative',
        marginTop: '16px',
        right: '0px'
    }
});

const extendedDescCloseButton = $('<button>', {
    class: 'modal-panel-extended-desc-close',
    css: {
        width: '180px',
        height: '46px',
        position: 'absolute',
        right: '0',
        left: '0',
        margin: 'auto',
        bottom: '20px'
    },
    html: 'Close'
});

const extendedDescModal = $('<div>', {
    class: 'modal-panel-extended-desc',
    css: {
        width: '100%',
        maxWidth: '960px',
        minHeight: 'auto',
        height: '100%',
        maxHeight: '520px',
        position: 'absolute',
        bottom: '0',
        top: '0',
        left: '0',
        right: '0',
        margin: 'auto',
        textAlign: 'center',
        display: 'none',
        backgroundColor: 'var(--color-1-transparent)',
        borderRadius: '15px',
        transition: '0.3s ease-in-out opacity'
    },
    html: `<h1 style="font-size: 32px;font-weight: 300;text-transform: initial;" class="top-10">${INFO_TITLE}</h1>`
});

function ExtendedDescInitialize() {
    const extendedDescContent = $('<div class="extended-desc-content text-left" style="overflow: auto; max-height: 380px; padding: 20px; border-bottom: 1px var(--color-4) dashed"></div>');
    extendedDescModal.append(extendedDescContent);
    extendedDescContent.html(eDesc.parseMarkdown(INFO_CONTENT));
    extendedDescModal.append(extendedDescCloseButton);
    $('.modal').append(extendedDescModal);
    
    setTimeout(function() {
        const buttonWrapper = $('#button-wrapper');
        if (buttonWrapper.length) {
            extendedDescButton.css('margin-left', '5px');
            buttonWrapper.append(extendedDescButton);
        } else {
            const wrapperElement = $('.tuner-info');
            if (wrapperElement.length) {
                const buttonWrapper = $('<div>').addClass('button-wrapper');
                buttonWrapper.append(extendedDescButton);
                wrapperElement.append(buttonWrapper);
                const emptyLine = $('<br>');
                wrapperElement.append(emptyLine);
            }
        }
    }, 1000); // 1000 milliseconds = 1 second
}

/* HELPERS */
function ExtendedDescOpenModal(panel) {
    eDesc.modalWindow.show().css("opacity", 1);
    panel.show().css("opacity", 1);
}

function ExtendedDescCloseModal(panel) {
    panel.css("opacity", 0);
    setTimeout(function() {
        panel.hide();
        eDesc.modalWindow.hide();
    }, 300);
}

function ExtendedDescParseMarkdown(markdownText) {
    // Convert headings
    markdownText = markdownText.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    markdownText = markdownText.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    markdownText = markdownText.replace(/^### (.*$)/gim, '<h3 class="m-0">$1</h3>');
    markdownText = markdownText.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
    markdownText = markdownText.replace(/^##### (.*$)/gim, '<h5>$1</h5>');
    markdownText = markdownText.replace(/^###### (.*$)/gim, '<h6>$1</h6>');

    // Convert bold text
    markdownText = markdownText.replace(/\*\*(.*?)\*\*/gim, '<b>$1</b>');

    // Convert italic text
    markdownText = markdownText.replace(/\*(.*?)\*/gim, '<i>$1</i>');

    // Convert images
    markdownText = markdownText.replace(/!\[(.*?)\]\((.*?)\)/gim, "<img alt='$1' src='$2' style='max-width: 100%'");

    // Convert links
    markdownText = markdownText.replace(/\[(.*?)\]\((.*?)\)/gim, "<a href='$2' target='_blank'>$1</a>");

    // Convert line breaks
    markdownText = markdownText.replace(/  \n/gim, '<br>');

    return markdownText.trim();
}

$(document).ready(function() {
    eDesc.init();

    extendedDescButton.on('click', function() {
        eDesc.openModal(extendedDescModal);
    });
    extendedDescCloseButton.on('click', function() {
        eDesc.closeModal(extendedDescModal);
    });
    $('.modal').on('click', function(event) {
        if (event.target === this) {
            eDesc.closeModal(extendedDescModal);
        }
    });
});
