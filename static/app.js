$(document).ready(function () {
    // Helper: formatting timestamp
    function getTimestamp() {
        const d = new Date();
        return d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0');
    }
    // Render chat bubbles with avatar (user/model)
    function renderUserBubble(message) {
        let time = getTimestamp();
        let html = `<div class='bubble-row justify-content-end'>
            <div class="chat-bubble user mb-2">${message}<span class="message-timestamp">${time}</span></div>
            <div class="bubble-avatar user ml-2">U</div>
        </div>`;
        $('#chat-history-area').append(html);
        scrollChatToBottom();
    }
    function renderModelBubble(message) {
        let time = getTimestamp();
        let html = `<div class='bubble-row justify-content-start'>
            <div class="bubble-avatar model mr-2"><i class="fas fa-robot"></i></div>
            <div class="chat-bubble model mb-2">${message}<span class="message-timestamp">${time}</span></div>
        </div>`;
        $('#chat-history-area').append(html);
        scrollChatToBottom();
    }
    function scrollChatToBottom() {
        let a = $('#chat-history-area')[0];
        if (a && a.scrollTo) a.scrollTo({ top: a.scrollHeight, behavior: "smooth" });
        else if (a) a.scrollTop = a.scrollHeight;
    }
    // Render recommendations
    function renderProductCards(products) {
        let $pane = $('#recommendations-pane');
        $pane.empty();
        let grid = $('<div class="product-grid row mb-3"></div>');
        products.forEach(product => {
            let card = $('<div class="col-md-6 col-lg-4 p-2 product-card-item">' +
                '<div class="product-card shadow-sm rounded-lg h-100">' +
                    (product.image ? `<div class="product-image"><img src="${product.image}" alt="${product.name}" class="img-fluid rounded mb-2"></div>` : '') +
                    '<div class="px-2 pb-2">' +
                    `<div class="product-name font-weight-bold mb-1">${product.name}</div>` +
                    (product.price ? `<div class="product-price text-primary mb-1">${product.price}</div>` : '') +
                    (product.rating ? `<div class="product-rating mb-1">⭐ ${product.rating}</div>` : '') +
                    (product.description ? `<div class="product-desc small text-muted mt-1">${product.description}</div>` : '') +
                    '</div>' +
                '</div></div>');
            grid.append(card);
        });
        $pane.append(grid);
    }
    // AJAX submit handler
    $('#messageArea').on('submit', function (event) {
        event.preventDefault();
        let rawText = $('#text').val();
        if (!rawText.trim()) return;
        renderUserBubble(rawText); // Show user's own message immediately
        $('#spinner-area').show();
        $('#text').prop('disabled', true);
        $('#send').prop('disabled', true);
        $.ajax({
            url: '/get',
            type: 'POST',
            data: { msg: rawText },
        })
        .done(function (data, textStatus, jqXHR) {
            // Parse as JSON if possible
            let isJson = false;
            let responseData = data;
            if (typeof data === 'object') {
                isJson = true;
            } else if (typeof data === 'string' && data.trim().startsWith('{')) {
                try {
                    responseData = JSON.parse(data);
                    isJson = true;
                } catch (e) {
                    isJson = false;
                }
            }
            if (isJson && responseData.products) {
                renderModelBubble("Here are some product recommendations:");
                renderProductCards(responseData.products);
            } else {
                renderModelBubble(responseData);
                $('#recommendations-pane').empty();
            }
        })
        .fail(function () {
            renderModelBubble("<span style='color:#d03900;'>Sorry, there was a problem. Please try again.</span>");
        })
        .always(function () {
            $('#spinner-area').hide();
            $('#text').prop('disabled', false);
            $('#send').prop('disabled', false);
            $('#text').val('').focus();
        });
    });
    // Button active effect
    $('#send').on('mousedown', function () { $(this).addClass('active'); })
        .on('mouseup mouseleave', function () { $(this).removeClass('active'); });
    // Toggle recommendations
    $('#toggle-recs').on('click', function () {
        let pane = $('#recommendations-pane');
        pane.toggleClass('collapsed');
        $(this).toggleClass('collapsed');
        $('#chevron-icon').toggleClass('fa-chevron-down fa-chevron-up');
    });
});
