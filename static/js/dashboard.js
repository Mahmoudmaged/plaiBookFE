
let uploadedVideoPath = null;
const { path } = localStorage.getItem("processDict") ? JSON.parse(localStorage.getItem("processDict")) : { path: null }
uploadedVideoPath = path ? path : null;

localStorage.removeItem("processDict")

function sideAlert(message) {
    $(".sideAlert").text(message)
    $(".sideAlert").css({ "right": "0%" })
    setTimeout(() => {
        $(".sideAlert").css({ "right": "-200%" })
    }, 5000);
}
$(window).scroll(function () {
    let scrollTop = $(window).scrollTop();
    if (scrollTop >= 70) {
        $(".navbar").css({ "backgroundColor": "rgba(0, 0, 0, 0.6)" });
    } else {
        $(".navbar").css({ "backgroundColor": "transparent" });

    }

});
//setupColors
const CSS_COLOR_NAMES = {
    AliceBlue: '#F0F8FF',
    AntiqueWhite: '#FAEBD7',
    Aqua: '#00FFFF',
    Aquamarine: '#7FFFD4',
    Azure: '#F0FFFF',
    Beige: '#F5F5DC',
    Bisque: '#FFE4C4',
    Black: '#000000',
    BlanchedAlmond: '#FFEBCD',
    Blue: '#0000FF',
    BlueViolet: '#8A2BE2',
    Brown: '#A52A2A',
    BurlyWood: '#DEB887',
    CadetBlue: '#5F9EA0',
    Chartreuse: '#7FFF00',
    Chocolate: '#D2691E',
    Coral: '#FF7F50',
    CornflowerBlue: '#6495ED',
    Cornsilk: '#FFF8DC',
    Crimson: '#DC143C',
    Cyan: '#00FFFF',
    DarkBlue: '#00008B',
    DarkCyan: '#008B8B',
    DarkGoldenRod: '#B8860B',
    DarkGray: '#A9A9A9',
    DarkGrey: '#A9A9A9',
    DarkGreen: '#006400',
    DarkKhaki: '#BDB76B',
    DarkMagenta: '#8B008B',
    DarkOliveGreen: '#556B2F',
    DarkOrange: '#FF8C00',
    DarkOrchid: '#9932CC',
    DarkRed: '#8B0000',
    DarkSalmon: '#E9967A',
    DarkSeaGreen: '#8FBC8F',
    DarkSlateBlue: '#483D8B',
    DarkSlateGray: '#2F4F4F',
    DarkSlateGrey: '#2F4F4F',
    DarkTurquoise: '#00CED1',
    DarkViolet: '#9400D3',
    DeepPink: '#FF1493',
    DeepSkyBlue: '#00BFFF',
    DimGray: '#696969',
    DimGrey: '#696969',
    DodgerBlue: '#1E90FF',
    FireBrick: '#B22222',
    FloralWhite: '#FFFAF0',
    ForestGreen: '#228B22',
    Fuchsia: '#FF00FF',
    Gainsboro: '#DCDCDC',
    GhostWhite: '#F8F8FF',
    Gold: '#FFD700',
    GoldenRod: '#DAA520',
    Gray: '#808080',
    Grey: '#808080',
    Green: '#008000',
    GreenYellow: '#ADFF2F',
    HoneyDew: '#F0FFF0',
    HotPink: '#FF69B4',
    IndianRed: '#CD5C5C',
    Indigo: '#4B0082',
    Ivory: '#FFFFF0',
    Khaki: '#F0E68C',
    Lavender: '#E6E6FA',
    LavenderBlush: '#FFF0F5',
    LawnGreen: '#7CFC00',
    LemonChiffon: '#FFFACD',
    LightBlue: '#ADD8E6',
    LightCoral: '#F08080',
    LightCyan: '#E0FFFF',
    LightGoldenRodYellow: '#FAFAD2',
    LightGray: '#D3D3D3',
    LightGrey: '#D3D3D3',
    LightGreen: '#90EE90',
    LightPink: '#FFB6C1',
    LightSalmon: '#FFA07A',
    LightSeaGreen: '#20B2AA',
    LightSkyBlue: '#87CEFA',
    LightSlateGray: '#778899',
    LightSlateGrey: '#778899',
    LightSteelBlue: '#B0C4DE',
    LightYellow: '#FFFFE0',
    Lime: '#00FF00',
    LimeGreen: '#32CD32',
    Linen: '#FAF0E6',
    Magenta: '#FF00FF',
    Maroon: '#800000',
    MediumAquaMarine: '#66CDAA',
    MediumBlue: '#0000CD',
    MediumOrchid: '#BA55D3',
    MediumPurple: '#9370DB',
    MediumSeaGreen: '#3CB371',
    MediumSlateBlue: '#7B68EE',
    MediumSpringGreen: '#00FA9A',
    MediumTurquoise: '#48D1CC',
    MediumVioletRed: '#C71585',
    MidnightBlue: '#191970',
    MintCream: '#F5FFFA',
    MistyRose: '#FFE4E1',
    Moccasin: '#FFE4B5',
    NavajoWhite: '#FFDEAD',
    Navy: '#000080',
    OldLace: '#FDF5E6',
    Olive: '#808000',
    OliveDrab: '#6B8E23',
    Orange: '#FFA500',
    OrangeRed: '#FF4500',
    Orchid: '#DA70D6',
    PaleGoldenRod: '#EEE8AA',
    PaleGreen: '#98FB98',
    PaleTurquoise: '#AFEEEE',
    PaleVioletRed: '#DB7093',
    PapayaWhip: '#FFEFD5',
    PeachPuff: '#FFDAB9',
    Peru: '#CD853F',
    Pink: '#FFC0CB',
    Plum: '#DDA0DD',
    PowderBlue: '#B0E0E6',
    Purple: '#800080',
    RebeccaPurple: '#663399',
    Red: '#FF0000',
    RosyBrown: '#BC8F8F',
    RoyalBlue: '#4169E1',
    SaddleBrown: '#8B4513',
    Salmon: '#FA8072',
    SandyBrown: '#F4A460',
    SeaGreen: '#2E8B57',
    SeaShell: '#FFF5EE',
    Sienna: '#A0522D',
    Silver: '#C0C0C0',
    SkyBlue: '#87CEEB',
    SlateBlue: '#6A5ACD',
    SlateGray: '#708090',
    SlateGrey: '#708090',
    Snow: '#FFFAFA',
    SpringGreen: '#00FF7F',
    SteelBlue: '#4682B4',
    Tan: '#D2B48C',
    Teal: '#008080',
    Thistle: '#D8BFD8',
    Tomato: '#FF6347',
    Turquoise: '#40E0D0',
    Violet: '#EE82EE',
    Wheat: '#F5DEB3',
    White: '#FFFFFF',
    WhiteSmoke: '#F5F5F5',
    Yellow: '#FFFF00',
    YellowGreen: '#9ACD32',
};

let cartoonaOne = ``
const colorsList = ["Dark Blue",
    "Dark Red",
    "Light Blue",
    "blue",
    "green",
    "red",
    "white",
    "yellow", "black"]
for (const color of colorsList) {
    cartoonaOne += ` <label><input class="selectedColor" type="checkbox" value="${color}"> ${color}</label>`;
    $(".colorsOpt").html(cartoonaOne)
}

//handel add teams colors
let lt = []
let rt = []
let referer = []
$(document).ready(function () {
    $(".showColors").on("click", function () {
        $(this).siblings(".colorsOpt").slideToggle()
        $(this).toggleClass("showColorsBorder").delay(2000)

        $(this).parent().parent().siblings().children().children(".colorsOpt").slideUp()

        $(this).parent().parent().siblings().children().children(".showColors ").addClass("showColorsBorder").delay(2000)

    })

    $(".selectedColor").on("click", function () {
        const teamName = $(this).parent().parent().siblings(".showColors").attr("id")
        if ($(this).is(":checked")) {
            $(this).parent().parent().siblings(".showColors").css("maxHeight", "80px")
            let loopArr = lt;
            if (teamName == 'lt') {
                lt.push($(this).val())
                loopArr = lt;
            } else if (teamName == 'rt') {
                rt.push($(this).val())
                loopArr = rt;
            } else if (teamName == 'referer') {
                referer.push($(this).val())
                loopArr = referer;
            }
            let cartoona = ``
            for (const color of loopArr) {
                cartoona += `
                <div class="col-4 mt-1  p-2">
                    <div class="colorShow">
                        <p class=""> ${color.length > 5 ? color.slice(0, 5) + "..." : color}</p>
                    </div>
                </div>
                `
            }
            $(`#${teamName}`).html(cartoona);
        } else {
            let loopArr = lt;
            if (teamName == 'lt') {
                lt = lt.filter(ele => {
                    return ele != $(this).val();
                })
                loopArr = lt;
            } else if (teamName == 'rt') {
                rt = rt.filter(ele => {
                    return ele != $(this).val();
                })
                loopArr = rt;
            } else if (teamName == 'referer') {
                referer = referer.filter(ele => {
                    return ele != $(this).val();
                })
                loopArr = referer;
            }
            let cartoona = ``

            for (const color of loopArr) {
                cartoona += `
                <div class="col-4 mt-1  p-2">
                    <div class="colorShow">
                        <p class=""> ${color.length > 5 ? color.slice(0, 5) + "..." : color}</p>
                    </div>
                </div>
                ` }
            if (!loopArr.length) {
                cartoona = `Select your colors`
            }
            $(`#${teamName}`).html(cartoona);
        }
    })
});
//End

// Setup timer
$('.minus').click(function () {
    var $input = $(this).parent().find('input');
    var count = parseInt($input.val()) - 1;
    count = count < 1 ? 0 : count;
    $input.val(count);
    $input.change();
    return false;
});
$('.plus').click(function () {
    var $input = $(this).parent().find('input');
    $input.val(parseInt($input.val()) + 1);
    $input.change();
    return false;
});
//connect socket
const socket = io.connect('http://' + document.domain + ':' + location.port);

// BrowseVideo
$(".BrowseVideo").on("click", function () {
    $(".mainSection_select , .mainSection_upload_video_link  , .mainSection_email").hide(300)
    $(".mainSection_upload_video").delay(300).show(200)
})
// YoutubeLinkBtn
$(".YoutubeLinkBtn").on("click", function () {
    $(".mainSection_select , .mainSection_upload_video  , .mainSection_email").hide(300)
    $(".mainSection_upload_video_link").delay(300).show(200)
})
// backSelect
$(".backSelect").on("click", function () {
    $(".mainSection_upload_video , .mainSection_upload_video_link  , .mainSection_email").hide(300)
    $(".mainSection_select").delay(300).show(200)
})

// backEmailSelect
$(".backEmailSelect").on("click", function () {
    if ($('#YoutubeURLVal').val()) {
        $(".mainSection_select , .mainSection_upload_video   , .mainSection_email").hide(300)
        $(" .mainSection_upload_video_link").delay(300).show(200)
    } else if (uploadedVideoPath) {
        $(".mainSection_select ,.mainSection_upload_video_link  , .mainSection_email").hide(300)
        $(".mainSection_upload_video   ").delay(300).show(200)
    } else {
        $(".mainSection_upload_video , .mainSection_upload_video_link  , .mainSection_email").hide(300)
        $(".mainSection_select ").delay(300).show(200)
    }
})
// uploadRecord
$(".uploadRecord").on("click", function () {
    uploadVideo()

})
// confirmYoutubeLink
$(".confirmYoutubeLink").on("click", function () {
    if (!$('#YoutubeURLVal').val()) {
        sideAlert("Please enter your youtube link.")
    } else {
        // $(".mainSection_select , .mainSection_upload_video  ,.mainSection_upload_video_link ").hide(300)
        // $(".mainSection_email").delay(300).show(200)
        $(window).scrollTop($(".sectionTwo").offset().top)

    }

})
// sendEmail
$(".sendEmail").on("click", function () {
    if (!$('#selectEmailVal').val()) {
        $(".loading").hide()
        sideAlert("Please enter  your email.")
    } else {
        $(window).scrollTop($(".sectionTwo").offset().top)
    }
})
// startProcessing
$(".startProcessingBtn").on("click", function () {
    startProcessing()
})


function uploadVideo() {
    $(".loading").show()
    const videoFile = document.getElementById('fileVideo').files[0];
    if (videoFile) {
        const formData = new FormData();
        formData.append('video', videoFile);
        fetch('/upload', {
            method: 'POST',
            body: formData
        }).then(response => response.json()).then(data => {
            uploadedVideoPath = data.path;
            $(".loading").hide()
            // $(".mainSection_select , .mainSection_upload_video  ,.mainSection_upload_video_link ").hide(300)
            // $(".mainSection_email").delay(300).show(200)
            $(window).scrollTop($(".sectionTwo").offset().top)

        });
    } else {
        $(".loading").hide()
        sideAlert("Please upload your video")
    }
}
function startProcessing() {
    $(".loading").show()

    if (!$('#selectEmailVal').val()) {
        $(".loading").hide()
        sideAlert("Please enter  your email.")
    } else if (!uploadedVideoPath && !$('#YoutubeURLVal').val()) {
        $(".loading").hide()
        sideAlert("Please upload your video or put YouTube link.")
        $(window).scrollTop($(".mainSection").offset().top)

    }
    else {
        const dict = {
            path: uploadedVideoPath,
            youtube_url: $('#YoutubeURLVal').val(),
            email: $('#selectEmailVal').val(),
            start_time_hour: $('#start_time_hour').val(),
            start_time_min: $('#start_time_min').val(),
            start_time_sec: $('#start_time_sec').val(),
            analysis_time_hour: $('#analysis_time_hour').val(),
            analysis_time_min: $('#analysis_time_min').val(),
            analysis_time_sec: $('#analysis_time_sec').val(),
            show_heatmap: $("#heatMapsInput").is(":checked") ? $("#heatMapsInput").val() : null,
            show_zone_analysis: $("#zoneAnalysisInput").is(":checked") ? $("#zoneAnalysisInput").val() : null,
            show_speed_analysis: $("#speedAnalysisInput").is(":checked") ? $("#speedAnalysisInput").val() : null,
            show_text_analysis: true,
            // show_text_analysis: $("#textAnalysisInput").is(":checked") ? $("#textAnalysisInput").val() : null,
            show_distance: $("#showDistanceInput").is(":checked") ? $("#showDistanceInput").val() : null,
        }
        localStorage.setItem("processDict", JSON.stringify(dict))
        // socket.emit('start_processing', dict);
        $(".loading").hide()
        window.location.href = '/result';
    }

}



//upload record
// $(".uploadBtn").on("click", function () {
//     uploadVideo()
// })
// function uploadVideo() {
//     $(".loading").show()
//     const videoFile = document.getElementById('fileVideo').files[0];
//     if (!$('.emailAddress').val()) {
//         $(".loading").hide()
//         sideAlert("Please enter  your email.")
//     } else if (videoFile) {
//         const formData = new FormData();
//         formData.append('video', videoFile);
//         fetch('/upload', {
//             method: 'POST',
//             body: formData
//         }).then(response => response.json()).then(data => {
//             uploadedVideoPath = data.path;
//             $(".loading").hide()
//             $(window).scrollTop($(".sectionTwo").offset().top)
//         });
//     } else if ($(".YoutubeURL").val()) {
//         $(".loading").hide()
//         $(window).scrollTop($(".sectionTwo").offset().top)
//     } else {
//         $(".loading").hide()
//         sideAlert("Please upload your video or put YouTube link.")

//     }
// }
//start analysis.

//upload record



// function startProcessing() {
//     $(".loading").show()

//     if (!$('.emailAddress').val()) {
//         $(".loading").hide()
//         sideAlert("Please enter  your email.")
//     } else if (!uploadedVideoPath && !$(".YoutubeURL").val()) {
//         $(".loading").hide()
//         sideAlert("Please upload your video or put YouTube link.")
//     }
//     // Stop Select Colors
//     // else if (!lt.length || !rt.length || !referer.length) {
//     //     $(".loading").hide()
//     //     sideAlert("Please select teams colors")
//     // }


//     else {
//         const dict = {
//             path: uploadedVideoPath,
//             youtube_url: $(".YoutubeURL").val(),
//             email: $('.emailAddress').val(),
//             start_time_hour: $('#start_time_hour').val(),
//             start_time_min: $('#start_time_min').val(),
//             start_time_sec: $('#start_time_sec').val(),
//             analysis_time_hour: $('#analysis_time_hour').val(),
//             analysis_time_min: $('#analysis_time_min').val(),
//             analysis_time_sec: $('#analysis_time_sec').val(),
//             // Stop Select Colors
//             // left_team_color: lt,
//             // right_team_color: rt,
//             // ref_color: referer,
//             show_heatmap: $("#heatMapsInput").is(":checked") ? $("#heatMapsInput").val() : null,
//             show_zone_analysis: $("#zoneAnalysisInput").is(":checked") ? $("#zoneAnalysisInput").val() : null,
//             show_speed_analysis: $("#speedAnalysisInput").is(":checked") ? $("#speedAnalysisInput").val() : null,
//             show_text_analysis: $("#textAnalysisInput").is(":checked") ? $("#textAnalysisInput").val() : null,
//             show_distance: $("#showDistanceInput").is(":checked") ? $("#showDistanceInput").val() : null,
//         }
//         localStorage.setItem("processDict", JSON.stringify(dict))
//         socket.emit('start_processing', dict);
//         $(".loading").hide()
//         window.location.href = '/result';
//     }

// }
