
var minhaPecaNoJogo;
var meusObstaculos = [];
var minhaPontuacao;

function iniciarJogo() {  // largura / altura / cor
    minhaPecaNoJogo = new componente(30, 10, "grey", 10, 120);
    minhaPecaNoJogo.gravidade = 0.05;
    minhaPontuacao = new componente("30px", "Consolas", "white", 280, 40, "text");
    minhaAreaJogo.start();
} 

var minhaAreaJogo = { 
    canvas : document.createElement("canvas"),

    start : function() {
        this.canvas.width = "1400";
        this.canvas.height = "500";
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        atualizarAreaJogo();
    },

    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
} 

function componente(width, height, color, x, y, type) {   
    this.type = type;
    this.score = 0;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;    
    this.x = x;
    this.y = y;
    this.gravidade = 0;
    this.velocidadeGravidade = 0;

    this.update = function() {  
        ctx = minhaAreaJogo.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    } 

    this.newPos = function() { 
        this.velocidadeGravidade += this.gravidade;
        this.x += this.speedX;
        this.y += this.speedY + this.velocidadeGravidade;
        this.hitBottom();
    } 

    this.hitBottom = function() { 
        var rockbottom = minhaAreaJogo.canvas.height - this.height;
        if (this.y > rockbottom) {
            this.y = rockbottom;
            this.velocidadeGravidade = 0;
        }
    } 

    this.crashWith = function(otherobj) {  
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    } 

} 

function atualizarAreaJogo() {  

    var x, height, gap, minHeight, maxHeight, minGap, maxGap;
    for (i = 0; i < meusObstaculos.length; i += 1) {
        if (minhaPecaNoJogo.crashWith(meusObstaculos[i])) {
            return;
        } 
    }

    minhaAreaJogo.clear();
    minhaAreaJogo.frameNo += 1;
    if (minhaAreaJogo.frameNo == 1 || todoIntervalo(150)) {
        x = minhaAreaJogo.canvas.width;
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        minGap = 50;
        maxGap = 200;
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
        meusObstaculos.push(new componente(10, height, "green", x, 0));
        meusObstaculos.push(new componente(10, x - height - gap, "green", x, height + gap));
    } 

    for (i = 0; i < meusObstaculos.length; i += 1) {
        meusObstaculos[i].x += -1;
        meusObstaculos[i].update();
    }
    minhaPontuacao.text="PONTOS: " + minhaAreaJogo.frameNo;
    minhaPontuacao.update();
    minhaPecaNoJogo.newPos();
    minhaPecaNoJogo.update();

} 

function todoIntervalo(n) { 
    if ((minhaAreaJogo.frameNo / n) % 1 == 0) {
        return true;
    }
    return false;
} 

function subir(n) { 
    if (!minhaAreaJogo.interval) {
        minhaAreaJogo.interval = setInterval(atualizarAreaJogo, 20);
    }

    minhaPecaNoJogo.gravidade = n;
} 