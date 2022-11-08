class Sprite {
  constructor({
    position,
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
  }) {
    this.position = position;
    this.width = 50;
    this.height = 150;

    this.image = new Image();
    this.image.src = imageSrc;

    this.scale = scale;
    this.framesMax = framesMax;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 5;
    this.offset = offset;
  }

  draw() {
    c.drawImage(
      this.image,
      this.framesCurrent * (this.image.width / this.framesMax),
      0,
      this.image.width / this.framesMax,
      this.image.height,
      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      (this.image.width / this.framesMax) * this.scale,
      this.image.height * this.scale
    );
  }

  animateFrames() {
    this.framesElapsed++;

    if (this.framesElapsed % this.framesHold === 0) {
      if (this.framesCurrent < this.framesMax - 1) {
        this.framesCurrent++;
      } else {
        this.framesCurrent = 0;
      }
    }
  }

  update() {
    this.draw();
    this.animateFrames();
  }
}

class Fighter extends Sprite {
  constructor({
    position,
    velocity,
    color = "red",
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
    sprites,
    attackBox = { offset: {}, width: undefined, height: undefined },
  }) {
    super({
      position,
      imageSrc,
      scale,
      framesMax,
      offset,
    });

    this.velocity = velocity;
    this.color = color;

    this.width = 50;
    this.height = 150;
    this.lastKey;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset: attackBox.offset,
      width: attackBox.width,
      height: attackBox.height,
    };
    this.isAttacking;
    this.health = 100;

    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 5;
    this.sprites = sprites;
    this.death = false;

    for (const sprite in this.sprites) {
      sprites[sprite].image = new Image();
      sprites[sprite].image.src = sprites[sprite].imgSrc;
    }
  }

  update() {
    this.draw();
    if (!this.death) {
      this.animateFrames();
    }

    // attack boxes
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

    // draw attack box
    // c.fillRect(
    //   this.attackBox.position.x,
    //   this.attackBox.position.y,
    //   this.attackBox.width,
    //   this.attackBox.height
    // );

    this.position.y += this.velocity.y;
    this.position.x += this.velocity.x;

    // gravity function
    let movePosition = this.position.y + this.height + this.velocity.y;
    if (movePosition >= canvas.height - 96) {
      this.velocity.y = 0;
      this.position.y = 330;
    } else {
      this.velocity.y += gravity;
    }
  }

  attack() {
    this.switchSprite("attack1");
    this.isAttacking = true;
  }

  switchSprite(sprite) {
    // overriding all other animations with the attack animation
    if (
      this.image === this.sprites.attack1.image &&
      this.framesCurrent < this.sprites.attack1.framesMax - 1
    ) {
      return;
    }

    // overriding when fighter gets hit
    if (
      this.image === this.sprites.takeHit.image &&
      this.framesCurrent < this.sprites.takeHit.framesMax - 1
    ) {
      return;
    }

    // death
    if (this.image === this.sprites.death.image) {
      if (this.framesCurrent === this.sprites.death.framesMax - 1) {
        this.death = true;
      }
      return;
    }

    if (this.image !== this.sprites[sprite].image) {
      this.framesCurrent = 0;
      this.image = this.sprites[sprite].image;
      this.framesMax = this.sprites[sprite].framesMax;
    }
  }

  takeHit() {
    this.health -= 20;

    if (this.health <= 0) {
      this.switchSprite("death");
    } else {
      this.switchSprite("takeHit");
    }
  }
}
