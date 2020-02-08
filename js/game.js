$(document).ready(function () {

    const GAME_TIME_MS = 30000;
    const INFOS_UPDATE_INTERVAL_MS = 500;
    const PEEP_TIME_MIN_MS = 750;
    const PEEP_TIME_MAX_MS = 1500;

    const MOLE_OBJS = $(".mole");
    const START_BTN = $("#start");
    const COUNTDOWN_LBL = $("#countdown");
    const RATIO_LBL = $("#ratio");
    const SCORE_LBL = $("#score");

    let hits = 0;
    let total = 0;
    let countdown = GAME_TIME_MS;

    let currMole = null;
    let prevMole = null;

    START_BTN.click(startGame);
    MOLE_OBJS.click(wackMole);

    function initGame() {
        hits = 0;
        total = 0;
        countdown = GAME_TIME_MS;
    }

    function startGame() {
        initGame();
        updateInfos();

        setTimeout(() => peepRandomMole(), getRandomPeepTime());
        setTimeout(() => tick(), INFOS_UPDATE_INTERVAL_MS);
    }

    function peepRandomMole() {
        nextRandomMole();

        total++;
        currMole.removeClass("bonked")
                .addClass("peeping");

        peepTimer = setTimeout(() => {
            currMole.removeClass("peeping");

            if (countdown > 0) peepRandomMole();
        }, getRandomPeepTime());
    }

    function nextRandomMole() {
        do {
            currMole = getRandomMole();
        } while (currMole.is(prevMole));
        prevMole = currMole;
    }

    function getRandom(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    function getRandomMole() {
        return MOLE_OBJS.eq(getRandom(0, MOLE_OBJS.length));
    }

    function getRandomPeepTime() {
        return getRandom(PEEP_TIME_MIN_MS, PEEP_TIME_MAX_MS);
    }

    function wackMole() {
        if (!$(this).is(currMole)) {
            return;
        }

        hits++;
        $(this).removeClass("peeping")
               .addClass("bonked");
    }

    function tick() {
        countdown -= INFOS_UPDATE_INTERVAL_MS;
        updateInfos();

        setTimeout(() => {
            if (countdown > 0) tick();
        }, INFOS_UPDATE_INTERVAL_MS);
    }

    function updateInfos() {
        COUNTDOWN_LBL.text(`${(countdown / 1000).toFixed(2)} sec`);
        RATIO_LBL.text(`${hits}/${total}`);
        SCORE_LBL.text((total == 0) ? `-` : `${Math.round(hits / total * 100)}%`);
    }

    initGame();
    updateInfos();
});
