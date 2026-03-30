class Player
{
  static New(scene)
  {
    // Create flying dragon animation
    scene.anims.create({
      key: 'flying',
      frames: scene.anims.generateFrameNumbers('player', { start: 0, end: 35 }),
      frameRate: 12,
      repeat: -1
    });

    const start_pos = { x: scene.game.config.width / 2, y: scene.game.config.height / 2 };
    const player = scene.physics.add.sprite(start_pos.x, start_pos.y, 'player');
    player.setScale(0.4);
    player.body.setSize(145, 129);
    player.play('flying');
    player.setDepth(1);

    //scene.physics.add.collider
      //(player, scene.game.ctx.bombs, () => Player.Collide_Bomb(scene), null, scene);
    if (scene.game.ctx.pigs)
    {
      scene.physics.add.overlap
        (player, scene.game.ctx.pigs, 
          (player, pig) => Player.Overlap_Pig(scene, player, pig), null, scene);
    }

    player.Update = Player.Update.bind(player);

    return player;
  }

  static Update(scene, delta)
  {
    this.angle += scene.game.ctx.input.Get_Delta_Angle(delta);
    const speed = scene.game.ctx.input.Get_Speed(delta);

    const direction = this.rotation - Math.PI / 2;
    scene.physics.velocityFromRotation(direction, speed, this.body.velocity);

    scene.physics.world.wrap(this, scene.game.config.width / 2);
  }

  static Overlap_Pig (scene, player, pig)
  {
    pig.disableBody(true, true);

    //  Add and update the score
    scene.game.ctx.score += 10;
    scene.game.ctx.scoreText.setText('Score: ' + scene.game.ctx.score);

    if (scene.game.ctx.pigs.countActive(true) === 0)
    {
      //  A new batch of stars to collect
      scene.game.ctx.pigs.children.iterate(function (child) {
        child.enableBody(true, child.x, 0, true, true);
      });

      const x = (player.x < 400) ? Phaser.Math.Between(400, 800) : 
        Phaser.Math.Between(0, 400);

      /*const bomb = scene.game.ctx.bombs.create(x, 16, 'bomb');
      bomb.setBounce(1);
      bomb.setCollideWorldBounds(true);
      bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
      bomb.allowGravity = false;*/
    }
  }

  static Collide_Bomb (scene, player, bomb)
  {
    scene.physics.pause();

    //player.setTint(0xff0000);
    //player.anims.play('turn');

    scene.game.ctx.gameOver = true;
  }
}

export default Player;