

$(window).scroll(function () {
    let scrollTop = $(window).scrollTop();
    console.log(scrollTop);
    if (scrollTop >= 70) {
        $(".navbar").css({ "backgroundColor": "rgba(0, 0, 0, 0.6)" });
    } else {
        $(".navbar").css({ "backgroundColor": "transparent" });

    }

});