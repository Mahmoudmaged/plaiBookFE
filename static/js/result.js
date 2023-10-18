
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

$(".closeInsights , .borderUP").on("click", function () {
    $(".moreInsights").show(500)
    $(".insightsResult").hide(500)
})

$(".insightController").on("click", function () {
    const showSection = $(this).attr("id")
    $(this).addClass("insightControllerActive")
    $(this).siblings().removeClass("insightControllerActive");
    $(this).parent().siblings().children().removeClass("insightControllerActive");

    $(`.${showSection}`).siblings().hide(500)
    $(`.${showSection}`).show(1000).delay(500)
})
// Communication Part
const socket = io.connect('http://' + document.domain + ':' + location.port);

let processDict = localStorage.getItem("processDict")?JSON.parse(localStorage.getItem("processDict")):null;
// send the processDict to the server 
socket.emit('start_processing', processDict);
// Advanced setting
function checkAdvanced() {
    const dict = JSON.parse(localStorage.getItem("processDict"));
    if (dict?.show_heatmap) {
        show_heatmap_images()
    } else {
        $("#heatMaps").hide()
        $(".heatMaps").hide()
    }

    if (dict?.show_zone_analysis) {
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
    socket.emit('show_ai_enhancement');
}
// accept colors
let LTCOLOR = 'red';
let RTCOLOR = 'green';



//delete thisPart
// let left_team_ratio =90;
// let right_team_ratio =10;
// document.getElementById('LTR').innerText = left_team_ratio;
// document.getElementById('RTR').innerText = right_team_ratio;
// $(".teamColor_LT").css({backgroundColor:LTCOLOR});
// $(".teamColor_RT").css({backgroundColor:RTCOLOR});
// $(".pie").css({backgroundImage:`conic-gradient(${LTCOLOR} ${left_team_ratio}%, ${RTCOLOR}  ${right_team_ratio}%)`});

function showTeamsColors(left_team_color, right_team_color) {
    LTCOLOR = left_team_color
    RTCOLOR = right_team_color
    $(".teamColor_LT , .LTCo").css({ backgroundColor: `rgba(${left_team_color[0]} , ${left_team_color[1]} , ${left_team_color[2]} , 1)` });
    $(".teamColor_RT , .RTCo").css({ backgroundColor: `rgba(${right_team_color[0]} , ${right_team_color[1]} , ${right_team_color[2]} , 1)` });
}
socket.on('getColors', function (data) {
    LTCOLOR = data.left_team_color
    RTCOLOR = data.right_team_color
    showTeamsColors(LTCOLOR, RTCOLOR)
    $(".loading").hide()
})

$(".cColors").on('click', function () {
    socket.emit('confirmColor', true)
    $(".confirmColors").hide()
    $(".showResultSection").show()

})
$(".rColors").on('click', function () {
    socket.emit('confirmColor', false)
    showTeamsColors(RTCOLOR, LTCOLOR)
    $(".confirmColors").hide()
    $(".showResultSection").show()

})


// AcquisitionRatio
// socket.on('AcquisitionRatio', function (data) {
//     document.getElementById('LTR').innerText = data.left_team_ratio;
//     document.getElementById('RTR').innerText = data.right_team_ratio;
//     $(".pie").css({ backgroundImage: `conic-gradient(${LTCOLOR} ${data.left_team_ratio}%, ${RTCOLOR}  ${data.right_team_ratio}%)` });

//     // .pie {
//     //     width: 200px;
//     //     height: 200px;
//     //     margin: auto;
//     //     background-image: conic-gradient(orange 80%, blue 20%);
//     //     border-radius: 50%;
//     // }

// })
// Display record
let videoFrames = [];
let videoMapFrames = [];
let lastFrame = 0;
let totalFramesNumber = 0
let play = true;
let frame_time = 0;
const canvas = document.getElementById('videoCanvas');
const ctx = canvas.getContext('2d');

socket.on('totalFrameNumber', function (data) {
    totalFramesNumber = data.total_frames;
    frame_time = 0;
    $(".rangeInput").attr("max" ,totalFramesNumber )
})



socket.on('new_frame', function (data) {
    //  2d map in data.bg_img
    videoFrames.push(...Object.values(data.images));
    videoMapFrames.push(data.bg_img);
    frame_time += Object.values(data.images).length;
    //progressBar
    const overPercentage = Math.floor((frame_time / totalFramesNumber) * 100).toFixed(1);

    $(".progressUp").css({ height: `${overPercentage}%` })
    $(".progressUp").text(`${overPercentage}%`);
    //check start play video
    if (videoFrames.length === 32 && play) {
        myLoop();
    }

})

const canvas22 = document.getElementById("kk")
const fps = 5;
function myLoop() {
    if (play){
        const img = new Image();
        img.onload = function () {
            canvas.width  = this.width;
            canvas.height = this.height;
            ctx.drawImage(img, 0 , 0 );
            lastFrame++;
        };
        if (lastFrame < videoFrames.length) {
            img.src = videoFrames[lastFrame]
            document.getElementById('mapImage').src = videoMapFrames[parseInt(lastFrame / 16)];//map image
            $(".rangeInput").val(lastFrame)
        }
    }
    if (lastFrame <= totalFramesNumber) {
        setTimeout(myLoop, 1000/fps)
    } else {
        play=false;
        $(".fa-pause").hide()
        $(".fa-play").show()
        lastFrame=0;
        setTimeout(myLoop, 1000/fps)
    }
}


//control Video Play
//rangeInput
$(".rangeInput").on("mousedown", function () {
    play=false;
    $(".fa-pause").hide()
    $(".fa-play").show()
})

$(".rangeInput").on("mouseup", function () {
    lastFrame= $(".rangeInput").val()-1 > 0? $(".rangeInput").val() - 1 : 0;
    play=true;
    $(".fa-play").hide()
    $(".fa-pause").show()
})

//play
$(".fa-play").on("click", function () {
       play=true;
       //change icon
       $(".fa-play").hide()
       $(".fa-pause").show()
})

//pause
$(".fa-pause").on("click", function () {
       play=false;
       //change icon
       $(".fa-play").show()
       $(".fa-pause").hide()
})

//go forward
$(".fa-forward").on( "click",function () {
    play=false;
    $(".fa-play").hide()
    $(".fa-pause").show()
    lastFrame = lastFrame+3*fps< videoFrames.length ? lastFrame+3*fps : videoFrames.length-1;
    play=true;
})

//go backward
$(".fa-backward").on( "click",function () {
    play=false;
    $(".fa-play").hide()
    $(".fa-pause").show()
    lastFrame = lastFrame-3*fps > 0 ? lastFrame - 3*fps  : 0;
    play=true;
})


// progress
let mouseX = 0;
document.addEventListener("mousemove", (event) => {
    mouseX = event.clientX;
});

// $(".progress").on("click", function () {
//     const myDiv = document.getElementById("myDivProg");
//     const leftPosition = myDiv.offsetLeft;
//     let mouseRealPotionToProgressWidthStart = mouseX - leftPosition
//     let eleWidth = parseInt($(this).css("width"))
//     let overPercentage = Math.round((mouseRealPotionToProgressWidthStart / eleWidth) * 100)
//     if (overPercentage <= 0) {
//         overPercentage = 1
//     } else if (overPercentage >= 100) {
//         overPercentage = 100
//     }
//     $(".progress-bar").css({ width: `${overPercentage}%` })
//     $(".progress-bar").text(`${overPercentage}%`)
//
//     // start array loop based on progressBar percentage
//     let startLoopIndex = Math.round(videoFrames.length * (overPercentage / 100)) - 1;
//     //start video Display
//     myLoop(startLoopIndex);
//
// })
//

// $(".progress").on("click", function () {
//
//     const overPercentage = (videoFrames.length/ totalFramesNumber)*100
//     $(".progress-bar").css({ width: `${overPercentage}%` })
//     $(".progress-bar").text(`${overPercentage}%`)
// })



// heatMaps events
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
    const text = data['text_analysis'];
    console.log({ text });
    document.getElementById('leftTeamText').innerText = text.left_team.join('');
    document.getElementById('rightTeamText').innerText = text.right_team.join('');
    document.getElementById('refererTeamText').innerText = text.referee.join('');
    document.getElementById('gapsIdentifierText').innerText = text.gabs.join('');
    document.getElementById('otherText').innerText = text.time.join('');

    document.getElementById('LTR').innerText = parseFloat(text.left_team[5]);
    document.getElementById('RTR').innerText = parseFloat(text.right_team[5]);
    $(".pie").css({ backgroundImage: `conic-gradient(${LTCOLOR} ${parseFloat(text.left_team[5])}%, ${RTCOLOR}  ${parseFloat(text.right_team[5])}%)` });

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
