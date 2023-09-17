
$(window).scroll(function () {
    let scrollTop = $(window).scrollTop();
    if (scrollTop >= 70) {
        $(".navbar").css({ "backgroundColor": "rgba(0, 0, 0, 0.6)" });
    } else {
        $(".navbar").css({ "backgroundColor": "transparent" });
    }

});
$(".moreInsights").on("click", function () {
    $(".moreInsights").hide(500)
    $(".insightsResult").show(500)
})

$(".closeInsights").on("click", function () {
    $(".moreInsights").show(500)
    $(".insightsResult").hide(500)
})


$(".insightController").on("click", function () {
    const showSection = $(this).attr("id")
    $(this).addClass("insightControllerActive")
    $(this).siblings().removeClass("insightControllerActive");
    $(`.${showSection}`).siblings().hide(500)
    $(`.${showSection}`).show(1000).delay(500)
})
// Communication Part
const socket = io.connect('http://' + document.domain + ':' + location.port);
// Advanced setting
function checkAdvanced() {
    const dict = JSON.parse(localStorage.getItem("processDict"));
    if (dict?.show_heatmap) {
        console.log("heat");
        show_heatmap_images()
    } else {
        $("#heatMaps").hide()
        $(".heatMaps").hide()
    }

    if (dict?.show_zone_analysis) {
        console.log("zone");
        show_zone_analysis_images()
    } else {
        $("#zone").hide()
    }

    if (dict?.show_speed_analysis) {
        show_speed_images()
    } else {
        $("#speed").hide()
    }

    if (dict?.show_text_analysis) {
        show_text_analysis()
    } else {
        $("#text").hide()
    }
}

checkAdvanced();

function show_heatmap_images() {
    socket.emit('show_heatmap_images', { show_heatmap: true });
}
function show_zone_analysis_images() {
    socket.emit('show_zone_analysis', { show_zone_analysis: true });
}
function show_speed_images() {
    socket.emit('show_speed_images', { show_speed_analysis: true });
}
function show_text_analysis() {
    socket.emit('show_text_analysis', { show_text_analysis: true });
}

function show_ai_enhancement() {
    socket.emit('show_ai_enhancement',);
}



// Display record
let videoFrames = [];
let lastFrame = 0;
const canvas = document.getElementById('videoCanvas');
const ctx = canvas.getContext('2d');
socket.on('new_frame', function (data) {
            const img = new Image();
            // append the recieved image (data)to the array videoFrames

            // for (let i = 0; i < 16; i++) {
            //     videoFrames.push(data.image[`image${i}`]);
            // }
            videoFrames.push(data.image);
            // check if the length of the array is divisable by 16 frames
            // if so, start displaying the frames in the canvas else do nothing
            if (videoFrames.length % 16 === 0) {
                function myLoop() {
                    setTimeout(function () {
                        img.onload = function () {
                            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                        };
                        img.src = videoFrames[lastFrame];
                        lastFrame++;
                        if (lastFrame < videoFrames.length) {
                            myLoop();
                        }
                    }, 200)
                }
                myLoop();
            }
        });



// heatmaps events
socket.on('left_team_heatmap', function (data) {
    document.getElementById('ltHeatMap').src = data.image;
});
socket.on('right_team_heatmap', function (data) {
    document.getElementById('rtHeatMap').src = data.image;
});
socket.on('ref_heatmap', function (data) {
    document.getElementById('reftHeatMap').src = data.image;
});


// zone analysis events
socket.on('left_team_zone_analysis', function (data) {
    document.getElementById('ltZone').src = data.image;
});
socket.on('right_team_zone_analysis', function (data) {
    document.getElementById('rtZone').src = data.image;
});
socket.on('ref_analysis', function (data) {
    document.getElementById('refZone').src = data.image;
});

// speed events
socket.on('left_team_speed_heatmap', function (data) {
    document.getElementById('lFTSpeedHeatmap').src = data.image;
});
socket.on('right_team_speed_heatmap', function (data) {
    document.getElementById('rFTSpeedHeatmap').src = data.image;
});
socket.on('left_team_players_speed', function (data) {
    document.getElementById('ltPlayersSpeed').src = data.image;
});
socket.on('right_team_players_speed', function (data) {
    document.getElementById('rtPlayersSpeed').src = data.image;
});

// text_analysis
socket.on('text_analysis', function (data) {
    // print data to the console
    console.log(data);
    const text = data['text_analysis'];
    document.getElementById('leftTeamText').innerText = text.left_team.join('');
    document.getElementById('rightTeamText').innerText = text.right_team.join('');
    document.getElementById('refererTeamText').innerText = text.referee.join('');
    document.getElementById('gapsIdentifierText').innerText = text.gabs.join('');
    document.getElementById('otherText').innerText = text.time.join('');
});


// ai_enhancement
$("#ai").on("click", function () {
    show_ai_enhancement()
})
socket.on('gpt_text', function (data) {
    document.getElementById('aiEnhancementText').innerText = data.gpt_text;
});


//highlight_status
socket.on('highlight_status', function (data) {
    if (data.text.length) {
        $("#highlight_status").show()
        document.getElementById('highlight_status').innerText = data.text;
    } else {
        $("#highlight_status").hide()
    }
});



socket.on('variant_image_response', function (data) { //  what is the use of this function !!!????
    document.getElementById('variantImage').src = data.image;
});
