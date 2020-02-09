$("#game").ready(function () {

    const GAME_TIME_MS = 30000;
    const TICK_INTERVAL_MS = 500;
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
    let isRunning = false;
    let currMole = null;
    let tickInterval = null

    START_BTN.click(startGame);
    MOLE_OBJS.click(wackCurrMole);

    function initGame() {
        hits = 0;
        total = 0;
        countdown = GAME_TIME_MS;
    }

    function startGame() {
        if(isRunning) {
            return;
        }
        
        isRunning = true;
        initGame();
        updateInfos();

        START_BTN.addClass("disabled");

        peepRandomMole();
        tickInterval = setInterval(() => tick(), TICK_INTERVAL_MS);
    }

    function peepRandomMole() {
        currMole = getRandomMole();

        total++;
        currMole.removeClass("bonked")
                .addClass("peeping");

        setTimeout(() => {
            hideCurrMole();

            if (isRunning) {
                peepRandomMole();
            }
        }, getRandomPeepTime());
    }

    function getRandomMole() {
        return MOLE_OBJS.not(currMole)
                        .eq(getRandom(0, MOLE_OBJS.length - 1));
    }

    function getRandomPeepTime() {
        return Math.min(getRandom(PEEP_TIME_MIN_MS, PEEP_TIME_MAX_MS), countdown);
    }

    function getRandom(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    function hideCurrMole() {
        currMole.removeClass("peeping");
    }

    function wackCurrMole() {
        if (!$(this).is(currMole)) {
            return;
        }

        hits++;
        $(this).removeClass("peeping")
               .addClass("bonked");
    }

    function tick() {
        countdown -= TICK_INTERVAL_MS;
        updateInfos();

        if(countdown <= 0) {
            endGame();    
        }
    }
    
    function updateInfos() {
        let timeInSec = (countdown / 1000).toFixed(2);
        let score = Math.round(hits / total * 100);

        COUNTDOWN_LBL.text(`${timeInSec} sec`);
        RATIO_LBL.text(`${hits}/${total}`);
        SCORE_LBL.text(isNaN(score) ? `-` : `${score}%`);
    }
    
    function endGame() {
        clearInterval(tickInterval);
        isRunning = false;
        START_BTN.removeClass("disabled");
    }
    
    initGame();
    updateInfos();
});
