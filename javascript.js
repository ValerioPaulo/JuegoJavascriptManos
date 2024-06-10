class Nivel1 extends Phaser.Scene {
    constructor() {
        super({ key: 'Nivel1' });
    }

    preload() {
        this.load.image('fondo', 'img/fondo.jpg');
        this.load.spritesheet('bola', 'img/bola.png', {
            frameWidth: 100,
            frameHeight: 100
        });
        this.load.image('mano1', 'img/mano1.png');
        this.load.image('mano2', 'img/mano2.png');
        this.load.image('leftbtn', 'img/flecha.png');
        this.load.audio('collision', 'img/collision.wav'); // Cargar el sonido de colisión
        this.load.audio('grito', 'img/anime_moan.wav'); // Cargar el sonido de anime moan
    }

    create() {
        this.input.addPointer();
        this.input.addPointer();
        this.input.addPointer();

        this.add.sprite(480, 320, 'fondo');
        this.bola = this.physics.add.sprite(480, 320, 'bola');

        this.anims.create({
            key: 'brillar',
            frames: this.anims.generateFrameNumbers('bola', {
                start: 0,
                end: 3
            }),
            frameRate: 10,
            repeat: -1
        });
        this.bola.play('brillar');

        this.bola.setBounce(1);
        this.mano1 = this.physics.add.sprite(70, 320, 'mano1');
        this.mano1.body.immovable = true;
        this.bola.setBounce(10);
        this.mano1.setSize(60, 250);
        this.physics.add.collider(this.bola, this.mano1, this.reproducirSonidoColision, null, this);
        this.mano1.setCollideWorldBounds(true);

        this.mano2 = this.physics.add.sprite(882, 320, 'mano2');
        this.mano2.body.immovable = true;
        this.mano2.setBounce(10);
        this.mano2.setSize(60, 250);
        this.physics.add.collider(this.bola, this.mano2, this.reproducirSonidoColision, null, this);
        this.mano2.setCollideWorldBounds(true);

        const velocidad = 500;

        let anguloInicial = Math.random() * Math.PI / 2 + Math.PI / 4;
        const derechaOIzq = Math.floor(Math.random() * 2);
        if (derechaOIzq === 1) anguloInicial = anguloInicial + Math.PI;

        const vx = Math.sin(anguloInicial) * velocidad;
        const vy = Math.cos(anguloInicial) * velocidad;

        this.bola.setBounce(1);
        this.bola.setCollideWorldBounds(true);
        this.physics.world.setBoundsCollision(false, false, true, true);

        this.bola.body.velocity.x = vx;
        this.bola.body.velocity.y = vy;
        this.cursors = this.input.keyboard.createCursorKeys();

        this.controlesVisuales({
            x: 50,
            y: 50
        }, {
            x: 50,
            y: 590
        }, this.mano1);

        this.controlesVisuales({
            x: 910,
            y: 50
        }, {
            x: 910,
            y: 590
        }, this.mano2);

        this.alguienGano = false;

        this.pintarMarcador();
    }

    update() {
        this.bola.rotation += 0.1;

        if (this.bola.x < 0 && this.alguienGano === false) {
            this.alguienGano = true;
            this.marcadorMano2.text = parseInt(this.marcadorMano2.text) + 1;
            this.reproducirSonidoGrito(); // Reproducir sonido
            this.verificarMarcador();
        } else if (this.bola.x > 960 && this.alguienGano === false) {
            this.alguienGano = true;
            this.marcadorMano1.text = parseInt(this.marcadorMano1.text) + 1;
            this.reproducirSonidoGrito(); // Reproducir sonido
            this.verificarMarcador();
        }

        if (this.cursors.up.isDown || this.mano1.getData('direccionVertical') === 1) {
            this.mano1.y = this.mano1.y - 5;
        } else if (this.cursors.down.isDown || this.mano1.getData('direccionVertical') === -1) {
            this.mano1.y = this.mano1.y + 5;
        }

        if (this.cursors.up.isDown || this.mano2.getData('direccionVertical') === 1) {
            this.mano2.y = this.mano2.y - 5;
        } else if (this.cursors.down.isDown || this.mano2.getData('direccionVertical') === -1) {
            this.mano2.y = this.mano2.y + 5;
        }
    }

    pintarMarcador() {
        this.marcadorMano1 = this.add.text(440, 75, '0', {
            fontFamily: 'font1',
            fontSize: 80,
            color: '#ffffff',
            align: 'right'
        }).setOrigin(1, 0);

        this.marcadorMano2 = this.add.text(520, 75, '0', {
            fontFamily: 'font1',
            fontSize: 80,
            color: '#ffffff'
        });
    }

    colocarPelota() {
        const velocidad = 500;

        let anguloInicial = Math.random() * (Math.PI / 4 * 3 - Math.PI / 4) + Math.PI / 4;
        const derechaOIzq = Math.floor(Math.random() * 2);
        if (derechaOIzq === 1) anguloInicial = anguloInicial + Math.PI;

        const vx = Math.sin(anguloInicial) * velocidad;
        const vy = Math.cos(anguloInicial) * velocidad;

        this.bola = this.physics.add.sprite(480, 320, 'bola');
        this.bola.play('brillar');

        this.bola.setBounce(1);
        this.physics.world.enable(this.bola);
        this.bola.setCollideWorldBounds(true);
        this.physics.world.setBoundsCollision(false, false, true, true);

        this.bola.body.velocity.x = vx;
        this.bola.body.velocity.y = vy;

        this.physics.add.collider(this.bola, this.mano1, this.reproducirSonidoColision, null, this);
        this.physics.add.collider(this.bola, this.mano2, this.reproducirSonidoColision, null, this);
        this.alguienGano = false;
    }

    controlesVisuales(btn1, btn2, player) {
        player.setData('direccionVertical', 0);

        const upbtn = this.add.sprite(btn1.x, btn1.y, 'leftbtn').setInteractive();
        const downbtn = this.add.sprite(btn2.x, btn2.y, 'leftbtn').setInteractive();
        downbtn.flipY = true;

        downbtn.on('pointerdown', () => {
            player.setData('direccionVertical', -1);
        });

        upbtn.on('pointerdown', () => {
            player.setData('direccionVertical', 1);
        });

        downbtn.on('pointerup', () => {
            player.setData('direccionVertical', 0);
        });

        upbtn.on('pointerup', () => {
            player.setData('direccionVertical', 0);
        });
    }

    verificarMarcador() {
        if (parseInt(this.marcadorMano1.text) >= 2 || parseInt(this.marcadorMano2.text) >= 2) {
            this.scene.start('Nivel2');
        } else {
            this.colocarPelota();
            this.alguienGano = false;
        }
    }

    reproducirSonidoColision() {
        this.sound.play('collision');
    }

    reproducirSonidoGrito() {
        this.sound.play('grito');
    }
}


//###############################################################################################################

class Nivel2 extends Phaser.Scene {
    constructor() {
        super({ key: 'Nivel2' });
    }

    preload() {
        this.load.image('fondo_nivel2', 'img/oshinoko.jpg');
        this.load.spritesheet('bola', 'img/bola.png', {
            frameWidth: 100,
            frameHeight: 100
        });
        //bola 2
        this.load.spritesheet('bola2', 'img/bola.png', {
            frameWidth: 100,
            frameHeight: 100
        });
        //bola 3
        this.load.spritesheet('bola3', 'img/bola.png', {
            frameWidth: 100,
            frameHeight: 100
        });
        //bola 4
        this.load.spritesheet('bola4', 'img/bola.png', {
            frameWidth: 100,
            frameHeight: 100
        });
        //bola 5
        this.load.spritesheet('bola5', 'img/bola.png', {
            frameWidth: 100,
            frameHeight: 100
        });

        this.load.image('mano1', 'img/mano1.png');
        this.load.image('mano2', 'img/mano2.png');
        this.load.image('leftbtn', 'img/flecha.png');
        this.load.audio('collision', 'img/collision.wav'); // Cargar el sonido de colisión
        this.load.audio('grito', 'img/anime_moan.wav'); // Cargar el sonido de anime moan
    }

    create() {
        this.input.addPointer();
        this.input.addPointer();
        this.input.addPointer();

        this.add.sprite(480, 320, 'fondo_nivel2');
        this.bola = this.physics.add.sprite(480, 320, 'bola');
        this.bola2 = this.physics.add.sprite(600, 120, 'bola2');
        this.bola3 = this.physics.add.sprite(420, 420, 'bola3');
        this.bola4 = this.physics.add.sprite(360, 520, 'bola4');
        this.bola5 = this.physics.add.sprite(180, 650, 'bola5');

        this.anims.create({
            key: 'brillar',
            frames: this.anims.generateFrameNumbers('bola', {
                start: 0,
                end: 3
            }),
            frameRate: 60,
            repeat: -1
        });

        //bola 2
        this.anims.create({
            key: 'brillar',
            frames: this.anims.generateFrameNumbers('bola2', {
                start: 0,
                end: 3
            }),
            frameRate: 60,
            repeat: -1
        });
        //bola 3
        this.anims.create({
            key: 'brillar',
            frames: this.anims.generateFrameNumbers('bola3', {
                start: 0,
                end: 3
            }),
            frameRate: 60,
            repeat: -1
        });
        //bola 4
        this.anims.create({
            key: 'brillar',
            frames: this.anims.generateFrameNumbers('bola4', {
                start: 0,
                end: 3
            }),
            frameRate: 60,
            repeat: -1
        });
        //bola 5
        this.anims.create({
            key: 'brillar',
            frames: this.anims.generateFrameNumbers('bola5', {
                start: 0,
                end: 3
            }),
            frameRate: 60,
            repeat: -1
        });


        this.bola.play('brillar');
        this.bola2.play('brillar');
        this.bola3.play('brillar');
        this.bola4.play('brillar');
        this.bola5.play('brillar');

        this.bola.setBounce(1);
        this.bola2.setBounce(1);
        this.bola3.setBounce(1);
        this.bola4.setBounce(1);
        this.bola5.setBounce(1);
        this.mano1 = this.physics.add.sprite(70, 320, 'mano1');
        this.mano1.body.immovable = true;
        this.bola.setBounce(10);
        this.bola2.setBounce(10);
        this.bola3.setBounce(10);
        this.bola4.setBounce(10);
        this.bola5.setBounce(10);
        this.mano1.setSize(60, 250);
        this.physics.add.collider(this.bola, this.mano1, this.reproducirSonidoColision, null, this);
        this.physics.add.collider(this.bola2, this.mano1, this.reproducirSonidoColision, null, this);
        this.physics.add.collider(this.bola3, this.mano1, this.reproducirSonidoColision, null, this);
        this.physics.add.collider(this.bola4, this.mano1, this.reproducirSonidoColision, null, this);
        this.physics.add.collider(this.bola5, this.mano1, this.reproducirSonidoColision, null, this);
        this.mano1.setCollideWorldBounds(true);

        this.mano2 = this.physics.add.sprite(882, 320, 'mano2');
        this.mano2.body.immovable = true;
        this.mano2.setBounce(10);
        this.mano2.setSize(60, 250);
        this.physics.add.collider(this.bola, this.mano2, this.reproducirSonidoColision, null, this);
        this.physics.add.collider(this.bola2, this.mano2, this.reproducirSonidoColision, null, this);
        this.physics.add.collider(this.bola3, this.mano2, this.reproducirSonidoColision, null, this);
        this.physics.add.collider(this.bola4, this.mano2, this.reproducirSonidoColision, null, this);
        this.physics.add.collider(this.bola5, this.mano2, this.reproducirSonidoColision, null, this);
        this.mano2.setCollideWorldBounds(true);

        const velocidad = 600;

        let anguloInicial = Math.random() * Math.PI / 2 + Math.PI / 4;
        const derechaOIzq = Math.floor(Math.random() * 2);
        if (derechaOIzq === 1) anguloInicial = anguloInicial + Math.PI;

        const vx = Math.sin(anguloInicial) * velocidad;
        const vy = Math.cos(anguloInicial) * velocidad;

        this.bola.setBounce(1);
        this.bola2.setBounce(1);
        this.bola3.setBounce(1);
        this.bola4.setBounce(1);
        this.bola5.setBounce(1);
        this.bola.setCollideWorldBounds(true);
        this.bola2.setCollideWorldBounds(true);
        this.bola3.setCollideWorldBounds(true);
        this.bola4.setCollideWorldBounds(true);
        this.bola5.setCollideWorldBounds(true);
        
        this.physics.world.setBoundsCollision(false, false, true, true);

        this.bola.body.velocity.x = vx;
        this.bola2.body.velocity.x = vx;
        this.bola3.body.velocity.x = vx;
        this.bola4.body.velocity.x = vx;
        this.bola5.body.velocity.x = vx;
        this.bola.body.velocity.y = vy;
        this.bola2.body.velocity.y = vy;
        this.bola3.body.velocity.y = vy;
        this.bola4.body.velocity.y = vy;
        this.bola5.body.velocity.y = vy;        
        this.cursors = this.input.keyboard.createCursorKeys();

        this.controlesVisuales({
            x: 50,
            y: 50
        }, {
            x: 50,
            y: 590
        }, this.mano1);

        this.controlesVisuales({
            x: 910,
            y: 50
        }, {
            x: 910,
            y: 590
        }, this.mano2);

        this.alguienGano = false;

        this.pintarMarcador();
    }

    update() {
        this.bola.rotation += 0.2;
        this.bola2.rotation += 0.2;
        this.bola3.rotation += 0.2;
        this.bola4.rotation += 0.2;
        this.bola5.rotation += 0.2;


        if (this.bola.x < 0 && this.alguienGano === false) {
            this.alguienGano = true;
            this.marcadorMano2.text = parseInt(this.marcadorMano2.text) + 1;
            this.reproducirSonidoGrito(); // Reproducir sonido
            this.colocarPelota();
        } else if (this.bola.x > 960 && this.alguienGano === false) {
            this.alguienGano = true;
            this.marcadorMano1.text = parseInt(this.marcadorMano1.text) + 1;
            this.reproducirSonidoGrito(); // Reproducir sonido
            this.colocarPelota();
        }


        //bola 2        
        if (this.bola2.x < 0 && this.alguienGano === false) {
            this.alguienGano = true;
            this.marcadorMano2.text = parseInt(this.marcadorMano2.text) + 1;
            this.reproducirSonidoGrito(); // Reproducir sonido
            this.colocarPelota();
        } else if (this.bola2.x > 960 && this.alguienGano === false) {
            this.alguienGano = true;
            this.marcadorMano1.text = parseInt(this.marcadorMano1.text) + 1;
            this.reproducirSonidoGrito(); // Reproducir sonido
            this.colocarPelota();
        }

        //bola 3        
        if (this.bola3.x < 0 && this.alguienGano === false) {
            this.alguienGano = true;
            this.marcadorMano2.text = parseInt(this.marcadorMano2.text) + 1;
            this.reproducirSonidoGrito(); // Reproducir sonido
            this.colocarPelota();
        } else if (this.bola3.x > 960 && this.alguienGano === false) {
            this.alguienGano = true;
            this.marcadorMano1.text = parseInt(this.marcadorMano1.text) + 1;
            this.reproducirSonidoGrito(); // Reproducir sonido
            this.colocarPelota();
        }

        //bola 4        
        if (this.bola4.x < 0 && this.alguienGano === false) {
            this.alguienGano = true;
            this.marcadorMano2.text = parseInt(this.marcadorMano2.text) + 1;
            this.reproducirSonidoGrito(); // Reproducir sonido
            this.colocarPelota();
        } else if (this.bola4.x > 960 && this.alguienGano === false) {
            this.alguienGano = true;
            this.marcadorMano1.text = parseInt(this.marcadorMano1.text) + 1;
            this.reproducirSonidoGrito(); // Reproducir sonido
            this.colocarPelota();
        }


        //bola 25       
        if (this.bola5.x < 0 && this.alguienGano === false) {
            this.alguienGano = true;
            this.marcadorMano2.text = parseInt(this.marcadorMano2.text) + 1;
            this.reproducirSonidoGrito(); // Reproducir sonido
            this.colocarPelota();
        } else if (this.bola5.x > 960 && this.alguienGano === false) {
            this.alguienGano = true;
            this.marcadorMano1.text = parseInt(this.marcadorMano1.text) + 1;
            this.reproducirSonidoGrito(); // Reproducir sonido
            this.colocarPelota();
        }





        if (this.cursors.up.isDown || this.mano1.getData('direccionVertical') === 1) {
            this.mano1.y = this.mano1.y - 7;
        } else if (this.cursors.down.isDown || this.mano1.getData('direccionVertical') === -1) {
            this.mano1.y = this.mano1.y + 7;
        }

        if (this.cursors.up.isDown || this.mano2.getData('direccionVertical') === 1) {
            this.mano2.y = this.mano2.y - 7;
        } else if (this.cursors.down.isDown || this.mano2.getData('direccionVertical') === -1) {
            this.mano2.y = this.mano2.y + 7;
        }
    }

    pintarMarcador() {
        this.marcadorMano1 = this.add.text(440, 75, '0', {
            fontFamily: 'font1',
            fontSize: 80,
            color: '#ffffff',
            align: 'right'
        }).setOrigin(1, 0);

        this.marcadorMano2 = this.add.text(520, 75, '0', {
            fontFamily: 'font1',
            fontSize: 80,
            color: '#ffffff'
        });
    }

    colocarPelota() {
        const velocidad = 1600;

        let anguloInicial = Math.random() * (Math.PI / 4 * 3 - Math.PI / 4) + Math.PI / 4;
        const derechaOIzq = Math.floor(Math.random() * 2);
        if (derechaOIzq === 1) anguloInicial = anguloInicial + Math.PI;

        const vx = Math.sin(anguloInicial) * velocidad;
        const vy = Math.cos(anguloInicial) * velocidad;

        this.bola = this.physics.add.sprite(100, 100, 'bola');
        this.bola2 = this.physics.add.sprite(120, 120, 'bola');
        this.bola3 = this.physics.add.sprite(140, 140, 'bola');
        this.bola4 = this.physics.add.sprite(160, 160, 'bola');
        this.bola5 = this.physics.add.sprite(180, 180, 'bola');
        this.bola.play('brillar');
        this.bola2.play('brillar');
        this.bola3.play('brillar');
        this.bola4.play('brillar');
        this.bola5.play('brillar');

        this.bola.setBounce(1);
        this.bola2.setBounce(1);
        this.bola3.setBounce(1);
        this.bola4.setBounce(1);
        this.bola5.setBounce(1);
        this.physics.world.enable(this.bola);
        this.physics.world.enable(this.bola2);
        this.physics.world.enable(this.bola3);
        this.physics.world.enable(this.bola4);
        this.physics.world.enable(this.bola5);
        this.bola.setCollideWorldBounds(true);
        this.bola2.setCollideWorldBounds(true);
        this.bola3.setCollideWorldBounds(true);
        this.bola4.setCollideWorldBounds(true);
        this.bola5.setCollideWorldBounds(true);
        this.physics.world.setBoundsCollision(false, false, true, true);

        this.bola.body.velocity.x = vx;
        this.bola2.body.velocity.x = vx;
        this.bola3.body.velocity.x = vx;
        this.bola4.body.velocity.x = vx;
        this.bola5.body.velocity.x = vx;
        this.bola.body.velocity.y = vy;
        this.bola2.body.velocity.y = vy;
        this.bola3.body.velocity.y = vy;
        this.bola4.body.velocity.y = vy;
        this.bola5.body.velocity.y = vy;
        

        this.physics.add.collider(this.bola, this.mano1, this.reproducirSonidoColision, null, this);
        this.physics.add.collider(this.bola2, this.mano1, this.reproducirSonidoColision, null, this);
        this.physics.add.collider(this.bola3, this.mano1, this.reproducirSonidoColision, null, this);
        this.physics.add.collider(this.bola4, this.mano1, this.reproducirSonidoColision, null, this);
        this.physics.add.collider(this.bola5, this.mano1, this.reproducirSonidoColision, null, this);
        this.physics.add.collider(this.bola, this.mano2, this.reproducirSonidoColision, null, this);
        this.physics.add.collider(this.bola2, this.mano2, this.reproducirSonidoColision, null, this);
        this.physics.add.collider(this.bola3, this.mano2, this.reproducirSonidoColision, null, this);
        this.physics.add.collider(this.bola4, this.mano2, this.reproducirSonidoColision, null, this);
        this.physics.add.collider(this.bola5, this.mano2, this.reproducirSonidoColision, null, this);
        this.alguienGano = false;
    }

    controlesVisuales(btn1, btn2, player) {
        player.setData('direccionVertical', 0);

        const upbtn = this.add.sprite(btn1.x, btn1.y, 'leftbtn').setInteractive();
        const downbtn = this.add.sprite(btn2.x, btn2.y, 'leftbtn').setInteractive();
        downbtn.flipY = true;

        downbtn.on('pointerdown', () => {
            player.setData('direccionVertical', -1);
        });

        upbtn.on('pointerdown', () => {
            player.setData('direccionVertical', 1);
        });

        downbtn.on('pointerup', () => {
            player.setData('direccionVertical', 0);
        });

        upbtn.on('pointerup', () => {
            player.setData('direccionVertical', 0);
        });
    }

    reproducirSonidoColision() {
        this.sound.play('collision');
    }

    reproducirSonidoGrito() {
        this.sound.play('grito');
    }
}

const config = {
    type: Phaser.AUTO,
    width: 960,
    height: 640,
    scene: [Nivel1, Nivel2],
    physics: {
        default: 'arcade',
    },
};

new Phaser.Game(config);
