
const is_debug = window.location.href.indexOf("localhost") != -1 || window.location.href.indexOf("127.0.0.1") != -1;

let base = new Vue({
    el: "#vue-main",
    data: {
        video_list: { live: [], upcoming: [], record: [] }
        , channels: []
        , charts: {}
        , detail_info: {}
        , detail_channel_info: {}
        , detail_id: ""
        , detail_sec: 0
        , state_talker: "User Count"
        , state_scuser: "User Count"
        , state: "live"
        , live_sort: "online"
        , record_sort: "start_time"
        , member_sort: "sub_count"
        , keyword: ""
    }
    , methods: {

    }, computed: {
        live_list() {
            let list = this.video_list.live;
            if (this.keyword != "") {
                list = this.video_list.live.filter((item) => {
                    return item.channel_title.indexOf(this.keyword) != -1 ||
                        item.title.indexOf(this.keyword) != -1 ||
                        item.channel_id.indexOf(this.keyword) != -1 ||
                        item.id.indexOf(this.keyword) != -1;
                })
            }

            let kk = "live_view_count";

            kk = this.live_sort == "online" ? "live_view_count" : kk;
            kk = this.live_sort == "play_time" ? "play_time" : kk;
            kk = this.live_sort == "view" ? "view_count" : kk;
            kk = this.live_sort == "like" ? "like_count" : kk;
            kk = this.live_sort == "dislike" ? "dislike_count" : kk;
            kk = this.live_sort == "fav" ? "fav_count" : kk;
            kk = this.live_sort == "chat" ? "chat_total" : kk;
            kk = this.live_sort == "sponsor" ? "new_sponsor" : kk;
            kk = this.live_sort == "superchat" ? "amount_micros" : kk;

            return list.sort((a, b) => {
                let res = 0;
                let left = 0;
                let right = 0;

                if (kk == "play_time") {
                    left = getPlayTimeNum(b[kk]);
                    right = getPlayTimeNum(a[kk]);
                } else {
                    left = b[kk];
                    right = a[kk];
                }

                res = left - right;

                return res;
            });
        },
        upcoming_list() {
            let list = this.video_list.upcoming;
            if (this.keyword != "") {
                list = this.video_list.upcoming.filter((item) => {
                    return item.channel_title.indexOf(this.keyword) != -1 ||
                        item.title.indexOf(this.keyword) != -1 ||
                        item.channel_id.indexOf(this.keyword) != -1 ||
                        item.id.indexOf(this.keyword) != -1;
                })
            }

            return list.sort((a, b) =>
                new Date(a.live_sch_time).getTime() - new Date(b.live_sch_time).getTime())
        },
        record_list() {
            let list = this.video_list.record;
            if (this.keyword != "") {
                list = this.video_list.record.filter((item) => {
                    return item.channel_title.indexOf(this.keyword) != -1 ||
                        item.title.indexOf(this.keyword) != -1 ||
                        item.channel_id.indexOf(this.keyword) != -1 ||
                        item.id.indexOf(this.keyword) != -1;
                })
            }

            let kk = "live_view_count";

            kk = this.record_sort == "start_time" ? "live_start_time" : kk;
            kk = this.record_sort == "play_time" ? "play_time" : kk;
            kk = this.record_sort == "chat" ? "chat_total" : kk;
            kk = this.record_sort == "sponsor" ? "new_sponsor" : kk;
            kk = this.record_sort == "superchat" ? "amount_micros" : kk;

            return list.sort((a, b) => {
                let res = 0;
                let left = 0;
                let right = 0;

                if (kk == "live_start_time" || kk == "play_time") {
                    if (kk == "live_start_time") {
                        left = new Date(b[kk]).getTime()
                        right = new Date(a[kk]).getTime()
                    } else {
                        left = getPlayTimeNum(b[kk]);
                        right = getPlayTimeNum(a[kk]);
                    }
                } else {
                    left = b[kk];
                    right = a[kk];
                }

                res = left - right;

                return res;
            });
        },
        channel_list() {
            let list = this.channels;
            if (this.keyword != "") {
                list = this.channels.filter((item) => {
                    return item.channel_name.indexOf(this.keyword) != -1 ||
                        item.channel_id.indexOf(this.keyword) != -1;

                })
            }

            let kk = "live_view_count";

            kk = this.member_sort == "view_count" ? "view_count" : kk;
            kk = this.member_sort == "sub_count" ? "sub_count" : kk;
            kk = this.member_sort == "video_count" ? "video_count" : kk;
            kk = this.member_sort == "total_time" ? "play_time_num" : kk;
            kk = this.member_sort == "total_message" ? "message_count" : kk;
            kk = this.member_sort == "total_new_member" ? "new_member_count" : kk;
            kk = this.member_sort == "sc_total" ? "sc_total" : kk;

            return list.sort((a, b) => {
                let res = 0;
                let left = 0;
                let right = 0;

                left = b[kk];
                right = a[kk];

                res = left - right;

                return res;
            });
        }
    }
});

const user_list = [
    "UCX7YkU9nEeaoZbkVLVajcMg" // にじさんじ
    , "UCD-miitqNY3nyukJ4Fnf4_A" // 月ノ美兎
    , "UCLO9QDxVL4bnvRRsz6K4bsQ" // 勇気ちひろ
    , "UCYKP16oMX9KKPbrNgo_Kgag" // える
    , "UCsg-YqdqQ-KFF0LNk23BY4A" // 樋口楓
    , "UC6oDys1BGgBsIC3WhG1BovQ" // 静凛
    , "UCeK9HFcRZoTrvqcUCtccMoQ" // 渋谷ハジメ
    , "UCpnvhOIJ6BN-vPkYU9ls-Eg" // 鈴谷アキ 
    , "UCvmppcdYf4HOv-tFQhHHJMA" // モイラ

    , "UCwokZsOK_uEre70XayaFnzA" // 鈴鹿詩子
    , "UCmUjjW5zF1MMOhYUwwwQv9Q" // 宇志海いちご
    , "UC_GCs6GARLxEHxy1w40d6VQ" // 家長むぎ
    , "UC48jH1ul-6HOrcSSfoR02fQ" // 夕陽リリ
    , "UCt0clH12Xk1-Ej5PXKGfdPA" // 物述有栖
    , "UCBiqkFJljoxAj10SoP2w2Cg" // 文野環
    , "UCXU7YYxy_iQd3ulXyO-zC2w" // 伏見ガク
    , "UCUzJ90o1EjqUbk2pBAy0_aw" // ギルザレンIII世
    , "UCv1fFr156jc65EMiLbaLImw" // 剣持刀也
    , "UCtpB6Bvhs1Um93ziEDACQ8g" // 森中花咲

    , "UCspv01oxUFf_MTSipURRhkA" // 叶 
    , "UCBi8YaVyZpiKWN3_Z0dCTfQ" // 赤羽葉子
    , "UCoztvTULBYd3WmStqYeoHcA" // 笹木咲
    , "UC0g1AE0DOjBYnLhkgoRWN1w" // 本間ひまわり
    , "UC9EjSJ8pvxtvPdxLOElv73w" // 魔界ノりりむ
    , "UCSFCh5NL4qXrAy9u-u2lX3g" // 葛葉
    //, "UCfM_A7lE6LkGrzx6_mOtI4g" // 雪汝
    , "UC_4tXjqecqox5Uc05ncxpxg" // 椎名唯華

    , "UC53UDnhAAYwvNO7j_2Ju1cQ" // ドーラ
    , "UCLpYMk5h1bq8_GAFVBgXhPQ" // 出雲霞
    , "UCRV9d6YCYIMUszK-83TwxVA" // 轟京子
    , "UC1zFJrfEKvCixhsjNSb1toQ" // シスター・クレア
    , "UCsFn_ueskBkMCEyzCEqAOvg" // 花畑チャイカ
    , "UCKMYISTJAQ8xTplUPHiABlA" // 社築
    , "UC6TfqY40Xt1Y0J-N18c85qQ" // 安土桃
    , "UCryOPk2GZ1meIDt53tL30Tw" // 鈴木勝
    , "UCt5-0i4AVHXaWJrL8Wql3mw" // 緑仙
    , "UC3lNFeJiTq6L3UWoz4g1e-A" // 卯月コウ

    , "UCWz0CSYCxf4MhRKPDm220AQ" // 神田笑一
    , "UCiSRx1a2k-0tOg-fs6gAolQ" // 飛鳥ひな
    , "UCtAvQ5U0aXyKwm2i4GqFgJg" // 春崎エアル
    , "UCRWOdwLRsenx2jLaiCAIU4A" // 雨森小夜
    , "UCV5ZZlLjk5MKGg3L0n0vbzw" // 鷹宮リオン
    , "UCJubINhCcFXlsBwnHp0wl_g" // 舞元啓介

    , "UCPvGypSgfDkVe7JG2KygK7A" // 竜胆尊
    , "UCjlmCrq4TP1I4xguOtJ-31w" // でびでび・でびる
    , "UCfQVs_KuXeNAlGa3fb8rlnQ" // 桜凛月
    , "UCo7TRj3cS-f_1D9ZDmuTsjw" // 町田ちま
    //    , "UCqQV8xEBWd5SVZBLlYrS_5Q" // 月見しずく
    , "UChUJbHiTVeGrSkTdBzVfNCQ" // ジョー・力一
    //    , "UCuz0vzQgC8LRdS6lVV0UkUg" // 遠北千南

    , "UCoM_XmK45j504hfUWvN06Qg" // 成瀬鳴
    , "UCbc8fwhdUNlqi-J99ISYu4A" // ベルモンド・バンデラス
    , "UCvzVB-EYuHFXHZrObB8a_Og" // 矢車りね
    , "UCTIE7LM5X15NVugV7Krp9Hw" // 夢追翔
    , "UCmeyo5pRj_6PXG-CsGUuWWg" // 黒井しば

    , "UCveZ9Ic1VtcXbsyaBgxPMvg" // 童田明治

    , "UCeShTCVgZyq2lsBW9QwIJcw" // 郡道美玲
    , "UCCVwhI5trmaSxfcze_Ovzfw" // 夢月ロア

    , "UCg63a3lk6PNeWhVvMRM_mrQ" // 小野町春香
    , "UCufQu4q65z63IgE4cfKs1BQ" // 語部紡
    , "UCHK5wkevfaGrPr7j3g56Jmw" // 瀬戸美夜子 

    , "UCwQ9Uv-m8xkE5PzRc7Bqx3Q" // 御伽原江良

    , "UCXRlIK3Cw_TJIQC5kSJJQMg" // 戌亥とこ
    , "UCHVXbQzkl3rDfsXWo8xi2qw" // アンジュ・カトリーナ
    , "UCZ1xuCK1kNmn5RzPYIZop3w" // リゼ・ヘルエスタ

    , "UCNW1Ex0r6HsWRD4LCtPwvoQ" // 三枝明那
    , "UC0WwEfE-jOM2rzjpdfhTzZA" // 愛園愛美

    , "UC_a1ZYZ8ZTXpjg9xUY9sj8w" // 鈴原るる
    , "UCHX7YpFG8rVwhsHCx34xt7w" // 雪城眞尋

    , "UCIytNcoz4pWzXfLda0DoULQ" // エクス・アルビオ
    , "UCtnO2N4kPTXmyvedjGWdx3Q" // レヴィ・エリファ

    , "UCfipDDn7wY-C-SoUChgxCQQ" // 葉山舞鈴
    , "UCUc8GZfFxtmk7ZwSO7ccQ0g" // ニュイ・ソシエール

    , "UCGYAYLDE7TZiiC8U6teciDQ" // 葉加瀬冬雪
    , "UCmovZ2th3Sqpd00F5RdeigQ" // 加賀美ハヤト
    , "UCL34fAoFim9oHLbVzMKFavQ" // 夜見れな

    , "UCb5JxV6vKlYVknoJB8TnyYg" // 黛灰
    , "UCdpUojq0KWZCN9bxXnZwz5w" // アルス・アルマル
    , "UCnRQYHTnRLSF0cLJwMnedCg" // 相羽ういは

    , "UCkIimWZ9gBJRamKF0rmPU8w" // 天宮こころ
    , "UCpNH2Zk2gw3JBjWAKSyZcQQ" // エリー・コニファー
    , "UCIG9rDtgR45VCZmYnd-4DUw" // ラトナ・プティ

    , "UC2OacIzd2UxGHRGhdHl1Rhw" // 早瀬走
    , "UC8C1LLhBhf_E2IBPLSDJXlQ" // 健屋花那
    , "UCHBhnG2G-qN0JrrWmMO2FTA" // シェリン・バーガンディ

    , "UCwrjITPwG4q71HzihV2C7Nw" // フミ
    , "UC9V3Y3_uzU5e-usObb6IE1w" // 星川サラ
    , "UCllKI7VjyANuS1RXatizfLQ" // 山神カルタ

    , "UCl1oLKcAq93p-pwKfDGhiYQ" // えま★おうがすと
    , "UCb6ObE-XGCctO3WrjRZC-cw" // ルイス・キャミー
    , "UCerkculBD7YLc_vOGrF7tKg" // 魔使マオ -matsukai mao-

    , "UC6wvdADTJ88OfIbJYIpAaDA" // 不破湊
    , "UCuvk5PilcvDECU7dDZhQiEw" // 白雪巴
    , "UC1QgXt46-GEvtNjEC1paHnw" // グウェル・オス・ガール

    , "UCfki3lMEF6SGBFiFfo9kvUA" // ましろ
    , "UC-o-E6I3IC2q8sAoAuM6Umg" // 奈羅花
    , "UCRcLAVTbmx2-iNcXSsupdNA" // 来栖夏芽

    , "UCuep1JCrMvSxOGgGhBfJuYw" // フレン・E・ルスタリオ
    , "UCwcyyxn6h9ex4sMXGtpQE_g" // メリッサ・キンレンカ
    , "UCmZ1Rbthn-6Jm_qOGjYsh5A" // イブラヒム

    , "UCXW4MqCQn-jCaxlX-nn-BYg" // 長尾景
    , "UCGw7lrT-rVZCWHfdG9Frcgg" // 弦月藤士郎
    , "UCo2N7C-Z91waaR6lF3LL_jw" // 甲斐田晴

    , "UC_82HBGtvwN1hcGeOGHzUBQ" // 空星きらめ
    , "UC69URn8iP4u8D_zUp-IJ1sg" // 金魚坂めいろ

    , "UCe_p3YEuYJb8Np0Ip9dk-FQ" // 朝日南アカネ
    , "UCL_O_HXgLJx3Auteer0n0pA" // 周央 サンゴ
    , "UCebT4Aq-3XWb5je1S1FvR_A" // 東堂コハク
    , "UCRqBKoKuX30ruKAq05pCeRQ" // 北小路ヒスイ 
    , "UCkngxfPbmGyGl_RIq4FA3MQ" // 西園チグサ
];
 
function secondsToHms(d) {
    d = Number(d);
    let h = Math.floor(d / 3600);
    let m = Math.floor(d % 3600 / 60);

    let h_str = h > 9 ? `${h}` : h > 0 ? `0${h}` : "00";
    let m_str = m > 9 ? `${m}` : m > 0 ? `0${m}` : "00";

    return `${h_str}:${m_str}`;
}

function getNumberWithCommas(n) {
    let rx = /(\d+)(\d{3})/;

    n = n != null && n > 0 ? n : 0;

    return String(n).replace(/^\d+/, function (w) {
        while (rx.test(w)) {
            w = w.replace(rx, '$1,$2');
        }
        return w;
    });
}

function getNewPlayTime(val) {
    let res = "00:00:00";
    if (val != 0) {
        let info = val.split(":");
        let hour = "";
        let min = "";
        let sec = "";

        if (info.length == 2) {
            hour = "00"
            min = parseInt(info[0], 10);
            sec = parseInt(info[1], 10);

            min = min > 9 ? min : "0" + min.toString();
            sec = sec > 9 ? sec : "0" + sec.toString();
        } else {
            hour = parseInt(info[0], 10);
            min = parseInt(info[1], 10);
            sec = parseInt(info[2], 10);

            hour = hour > 9 ? hour : "0" + hour.toString();
            min = min > 9 ? min : "0" + min.toString();
            sec = sec > 9 ? sec : "0" + sec.toString();
        }

        res = `${hour}:${min}:${sec}`;
    }

    return res;
}

function getPlayTimeNum(val) {
    let res = 0;
    let info = val.split(":");
    if (info.length == 3) {
        res = info[0] * 60 * 60 + info[1] * 60 + info[2] * 1;
    }
    if (info.length == 2) {
        res = info[0] * 60 + info[1] * 1;
    }
    return res;
}

function getPlayTimeFromSec(val) {
    let res = "00:00:00";

    let sec = parseInt(val % 60, 10);
    let min = parseInt(val / 60, 10);
    let hour = parseInt(min / 60, 10);

    min = parseInt(min % 60, 10);

    hour = hour > 9 ? hour : "0" + hour.toString();
    min = min > 9 ? min : "0" + min.toString();
    sec = sec > 9 ? sec : "0" + sec.toString();

    res = `${hour}:${min}:${sec}`;

    return res;
}

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function doLoadVideoInfo() {
    let rnd = new Date().getTime();
    let path = `./stats/video.json?rnd=${rnd}`;

    axios.get(path).then((res) => {
        if (base.video_list.live.length > 0 && base.video_list.live.length != res.data.live.length) {
            console.log(`[NOTICE] live list change. reload record.ndjson.`) ;

            doLoadRecordInfo();
        }

        base.video_list.timestamp = res.data.timestamp;
        base.video_list.live = res.data.live;
        base.video_list.upcoming = res.data.upcoming;
    })
}

function doLoadRecordInfo() {
    let yy = new Date().getFullYear();
    let mm = new Date().getMonth() + 1;
    let path = '';

    mm = mm < 10 ? `0${mm}` : mm;
    path = `./stats/records-${yy}${mm}.ndjson`;

    axios.get(path).then((res) => {
        let nd = res.data;
        let list = nd.split("\n");

        base.video_list.record = [];

        list.forEach((item) => {
            let obj = null;
            try {
                obj = JSON.parse(item);
            } catch (err) {

            }

            if (obj != null && obj.live_start_time != "0") {
                base.video_list.record.push(obj);
            }
        });
    })
}

function doLoadChannelInfo() {
    let path = `./stats/channel.ndjson`;
    axios.get(path).then((res) => {
        let nd = res.data;
        let list = nd.split("\n");

        base.channels = [];

        list.forEach((item) => {
            let obj = null;
            try {
                obj = JSON.parse(item);
            } catch (err) {

            }

            if (obj != null) {
                base.channels.push(obj);
            }
        });
    })
}

////

function onClickDetail(video_id) {

    video_id = is_debug ? "cQrcd8yVOlY" : video_id;

    let yyyy = new Date().getFullYear();
    let mm = new Date().getMonth() + 1;
    let yyyymm = '';

    mm = mm < 10 ? `0${mm}` : mm;
    yyyymm = `${yyyy}${mm}`;
    yyyymm = is_debug ? "202009" : yyyymm;

    let url_reports = `./reports/${yyyymm}/${video_id}.json`;

    axios.get(url_reports).then((info) => {
        base.detail_info = info.data;
        base.detail_id = video_id;
        base.state = 'detail';

        base.detail_info.reports.charts.online.options.onClick = onClickOnlineCanvas;

        setTimeout(() => {
            new Chart("canvas_ld", base.detail_info.reports.charts.ld);

            base.charts.talker = new Chart("canvas_talker", base.detail_info.reports.charts.talker);

            base.charts.scuser = new Chart("canvas_scuser", base.detail_info.reports.charts.scuser);

            new Chart("canvas_online", base.detail_info.reports.charts.online);

            new Chart("canvas_messages", base.detail_info.reports.charts.messages);

            new Chart("canvas_like", base.detail_info.reports.charts.like);

            new Chart("canvas_amount", base.detail_info.reports.charts.amount);

        }, 500)
    }).catch((err) => {
    });

}

function onClickChannelDetail(channel_id, channel_name) {

    channel_id = is_debug ? "UCoztvTULBYd3WmStqYeoHcA" : channel_id;

    let url_stats = `./reports/${channel_id}.json`;

    axios.get(url_stats).then((res) => {
        let info = res.data;

        base.detail_channel_info = info;

        base.detail_id = channel_id;
        base.detail_title = channel_name;
        base.state = 'channel_detail';

        setTimeout(() => {
            new Chart("canvas_channel_info", info.charts.chart_channel);

            new Chart("canvas_channel_video_time", info.charts.chart_video_time);
        }, 500)
    });
}

function onClickOnlineCanvas(a, b) {
    let play_time = "";
    try {
        play_time = b[1]._model.label;
    } catch (err) {
        //console.error(err);
    }

    if (play_time != "") {
        let play_time_num = getPlayTimeNum(play_time);
        base.detail_sec = play_time_num;
    }
}

function onClickTalker(ev) {
    if (base.state_talker == "User Count") {
        base.state_talker = "Message SUM";

        base.detail_info.reports.charts.talker.data.datasets[0].data = [
            base.detail_info.reports.totals.total_messages_user
            , base.detail_info.reports.totals.total_messages_member
            , base.detail_info.reports.totals.total_messages_marker
            , base.detail_info.reports.totals.total_messages_mm
        ];

        base.charts.talker.update();

    } else {
        base.state_talker = "User Count";
        base.detail_info.reports.charts.talker.data.datasets[0].data = [
            base.detail_info.reports.totals.total_user
            , base.detail_info.reports.totals.total_member
            , base.detail_info.reports.totals.total_marker
            , base.detail_info.reports.totals.total_mm
        ];

        base.charts.talker.update();
    }
}

function onClickSCUser(a, b) {
    if (base.state_scuser == "User Count") {
        base.state_scuser = "SuperChat SUM";

        base.detail_info.reports.charts.scuser.data.datasets[0].data = [
            base.detail_info.reports.totals.total_sc_user
            , base.detail_info.reports.totals.total_sc_member
            , base.detail_info.reports.totals.total_sc_marker
            , base.detail_info.reports.totals.total_sc_mm
        ];

        base.charts.scuser.update();

    } else {
        base.state_scuser = "User Count";
        base.detail_info.reports.charts.scuser.data.datasets[0].data = [
            base.detail_info.reports.totals.sc_user
            , base.detail_info.reports.totals.sc_member
            , base.detail_info.reports.totals.sc_marker
            , base.detail_info.reports.totals.sc_mm
        ];

        base.charts.scuser.update();
    }
}

doLoadVideoInfo();

doLoadRecordInfo();

doLoadChannelInfo();

setInterval(() => {
    let ss = new Date().getSeconds();

    if (ss == 5) {
        doLoadVideoInfo();
    }
}, 1000);